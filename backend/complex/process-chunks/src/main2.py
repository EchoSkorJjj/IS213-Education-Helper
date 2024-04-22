import grpc
import pika
import json
import utils
import logging
from itertools import cycle
from openai import OpenAI
from content_pb2_grpc import ContentStub
from strategies.ContentSendingStrategy import FlashcardStrategy, MCQStrategy
from proxies.ContentServiceProxy import ContentServiceProxy

class ContentFetcher:
    def __init__(self):
        self.RABBITMQ_SERVER = None
        self.RABBITMQ_USERNAME = None
        self.RABBITMQ_PASSWORD = None
        self.QUEUE_NAME_1 = None
        self.QUEUE_NAME_2 = None
        self.OPENAI_API_KEYS = None
        self.CONTENT_SERVICE_ADDRESS = None
        self.model = None
        self.connection = None
        self.channel = None
        self.grpc_channel = None
        self.grpc_stub = None
        self.max_tokens = 16384
        self.api_key = None  # Single API key for continuous context

    def initialize_rabbitmq(self):
        credentials = pika.PlainCredentials(self.RABBITMQ_USERNAME, self.RABBITMQ_PASSWORD)
        connection_parameters = pika.ConnectionParameters(host=self.RABBITMQ_SERVER, credentials=credentials)
        self.connection = pika.BlockingConnection(connection_parameters)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.QUEUE_NAME_1, durable=True)
        self.channel.queue_declare(queue=self.QUEUE_NAME_2, durable=True)

    def match_messages_and_call_api(self, ch, method, properties, body):
        message_from_queue1 = body.decode()
        messages_from_queue2 = []
        for method_frame, properties, body in self.channel.consume(queue=self.QUEUE_NAME_2, auto_ack=True, inactivity_timeout=1):
            if method_frame:
                messages_from_queue2.append(body.decode())
            else:
                break

        prompt, generate_type, note_id = self.construct_prompt(message_from_queue1, messages_from_queue2)
        responses = self.generate_content_in_batches(prompt, 3, generate_type, note_id)  # Example: 3 iterations for 15 items
        self.send_content(responses, generate_type, note_id)

    def generate_content_in_batches(self, initial_prompt, num_batches, generate_type, note_id):
        current_responses = []
        prompt = initial_prompt
        client = OpenAI(api_key=self.api_key)  # Reuse the same API key for all batches

        for _ in range(num_batches):
            response = client.chat.completions.create(model=self.model, messages=[{"role": "system", "content": prompt}])
            batch_responses = utils.extract_and_validate_json_objects(response.choices[0].message.content)
            current_responses.extend(json.loads(batch_responses))

            prompt = "Generate 5 more"  # Modify the prompt for the next batch

        return current_responses

    def send_content(self, messages, generate_type, note_id):
        if generate_type == "flashcard":
            strategy = FlashcardStrategy()
        elif generate_type == "mcq":
            strategy = MCQStrategy()
        else:
            raise ValueError("Unsupported content type")

        content_service_proxy = ContentServiceProxy(self.CONTENT_SERVICE_ADDRESS)
        content_request = strategy.construct_request(json.dumps(messages), note_id)
        response = content_service_proxy.send_content(content_request)
        logging.info(f"gRPC Response: {response}")

    def start_consuming(self):
        self.channel.basic_consume(queue=self.QUEUE_NAME_1, on_message_callback=self.match_messages_and_call_api, auto_ack=True)
        logging.info("Waiting for messages. To exit press CTRL+C")
        self.channel.start_consuming()

if __name__ == "__main__":
    content_fetcher = ContentFetcher()
    content_fetcher.start_consuming()
