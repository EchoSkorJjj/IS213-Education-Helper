import grpc
import pika
import os
import json
import logging
from itertools import cycle
from dotenv import load_dotenv
from openai import OpenAI
import tiktoken
# Ensure these imports point to the correct location in your project structure
from content_pb2 import CreateTemporaryFlashcardRequest, CreateTemporaryMultipleChoiceQuestionRequest, MultipleChoiceQuestionOption
from content_pb2_grpc import ContentStub
from factories.prompt_strategy_factory import PromptStrategyFactory
from strategies.ContentSendingStrategy import FlashcardStrategy, MCQStrategy
from proxies.ContentServiceProxy import ContentServiceProxy

class ContentFetcher:
    def __init__(self):
        # Initial properties are set to None or appropriate defaults.
        # The actual values will be set by the ContentFetcherBuilder.
        self.RABBITMQ_SERVER = None
        self.RABBITMQ_USERNAME = None
        self.RABBITMQ_PASSWORD = None
        self.QUEUE_NAME_1 = None
        self.QUEUE_NAME_2 = None
        self.OPENAI_API_KEYS = None
        self.CONTENT_SERVICE_ADDRESS = None
        self.api_key_cycle = cycle([])
        self.model = None
        self.connection = None
        self.channel = None
        self.grpc_channel = None
        self.grpc_stub = None

    def initialize_api_key_cycle(self):
        if not self.OPENAI_API_KEYS:
            raise ValueError("No OpenAI API keys found. Please check your environment variables.")
        self.api_key_cycle = cycle(self.OPENAI_API_KEYS)

    def initialize_rabbitmq(self):
        """Initializes the RabbitMQ connection and channels."""
        credentials = pika.PlainCredentials(self.RABBITMQ_USERNAME, self.RABBITMQ_PASSWORD)
        connection_parameters = pika.ConnectionParameters(host=self.RABBITMQ_SERVER, credentials=credentials)
        self.connection = pika.BlockingConnection(connection_parameters)
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue=self.QUEUE_NAME_1, durable=True)
        self.channel.queue_declare(queue=self.QUEUE_NAME_2, durable=True)

    def initialize_grpc(self):
        """Initializes the gRPC channel and stub for content service communication."""
        self.grpc_channel = grpc.insecure_channel(self.CONTENT_SERVICE_ADDRESS)
        self.grpc_stub = ContentStub(self.grpc_channel)

    def count_tokens_with_tiktoken(self, text):
        """Counts the number of tokens in the given text using TikToken for the specified model."""
        encoding = tiktoken.encoding_for_model(self.model)
        num_tokens = len(encoding.encode(text))
        return num_tokens

    def construct_prompt(self, message_from_queue1, messages_from_queue2):
        """Constructs the prompt for OpenAI based on the message type and content."""
        message_data = json.loads(message_from_queue1)
        logging.info(f"Message data: {message_data}")
        generate_type = message_data.get("metadata", {}).get("generateType", "")
        note_id = message_data.get("metadata", {}).get("fileId", "")
        strategy = PromptStrategyFactory.get_strategy(generate_type)
        return strategy.construct_prompt(message_from_queue1, messages_from_queue2),generate_type,note_id

    def match_messages_and_call_api(self, ch, method, properties, body):
        """Processes messages from queue1, matches them with messages from queue2, and calls the OpenAI API."""
        message_from_queue1 = body.decode()
        messages_from_queue2 = []
        for method_frame, properties, body in self.channel.consume(queue=self.QUEUE_NAME_2, auto_ack=True, inactivity_timeout=1):
            if method_frame:
                messages_from_queue2.append(body.decode())
            else:
                break

        prompt,generate_type,note_id = self.construct_prompt(message_from_queue1, messages_from_queue2)
        token_count = self.count_tokens_with_tiktoken(prompt)
        logging.info(f"Estimated token count for prompt: {token_count}")

        client = OpenAI(api_key=next(self.api_key_cycle))
        logging.info(f"Key used: {client.api_key}")
        response = None
        try:
            response = client.chat.completions.create(model=self.model, messages=[{"role": "system", "content": prompt}])
            logging.info(f"OpenAI Response: {response.choices[0].message.content}")
        except Exception as e:
            logging.error(f"Error during OpenAI API call or response handling: {str(e)}")

        try:
            formatted_response = "[" + response.choices[0].message.content.replace("}\n{", "},\n{") + "]"
            self.send_content(formatted_response, generate_type,note_id)
        except Exception as e:
            logging.error(f"Error during content sending: {str(e)}")


    def start_consuming(self):
        """Starts consuming messages from RabbitMQ and processing them."""
        self.channel.basic_consume(queue=self.QUEUE_NAME_1, on_message_callback=self.match_messages_and_call_api, auto_ack=True)
        logging.info("Waiting for messages. To exit press CTRL+C")
        self.channel.start_consuming()
    def send_content(self, message, generate_type,note_id):
        # Parse the JSON array string into a Python list
        try:
            message_data = json.loads(message)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to decode JSON: {str(e)}")
            return
        
        if generate_type == "flashcard":
            strategy = FlashcardStrategy()
        elif generate_type == "mcq":
            strategy = MCQStrategy()
        else:
            raise ValueError("Unsupported content type")
        
        logging.info(f"Content type: {generate_type}")
        logging.info(f"Strategy: {strategy}")
        
        content_service_proxy = ContentServiceProxy(self.CONTENT_SERVICE_ADDRESS)
        
        # Assuming each item in message_data is a dict that represents a flashcard or MCQ
        for item in message_data:
            content_request = strategy.construct_request(json.dumps(item),note_id)  # Convert each item back to JSON string if necessary
            response = content_service_proxy.send_content(content_request)
            logging.info(f"gRPC Response: {response}")

if __name__ == "__main__":
    # Assuming the existence of ContentFetcherBuilder in your project
    from builder.ContentFetcherBuilder import ContentFetcherBuilder
    content_fetcher_builder = ContentFetcherBuilder()
    content_fetcher = (content_fetcher_builder
                       .setup_logging()
                       .with_model("gpt-3.5-turbo-16k")
                       .build())
    content_fetcher.start_consuming()
