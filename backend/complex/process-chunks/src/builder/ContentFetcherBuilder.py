import os
from dotenv import load_dotenv
import logging
from main import ContentFetcher  # Make sure to import your ContentFetcher class

class ContentFetcherBuilder:
    def __init__(self):
        self._content_fetcher = ContentFetcher()
        self.load_env()

    def load_env(self):
        load_dotenv()
        self._content_fetcher.RABBITMQ_SERVER = os.getenv("RABBITMQ_SERVER", "rabbitmq")
        self._content_fetcher.RABBITMQ_USERNAME = os.getenv("RABBITMQ_USERNAME", "user")
        self._content_fetcher.RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD", "password")
        self._content_fetcher.QUEUE_NAME_1 = "my_queue_1"
        # self._content_fetcher.QUEUE_NAME_2 = "my_queue_2"
        self._content_fetcher.OPENAI_API_KEYS = os.getenv("OPENAI_API_KEYS").split(",")
        self._content_fetcher.CONTENT_SERVICE_ADDRESS = os.getenv('CONTENT_SERVICE_ADDRESS', 'localhost:50051')
        return self

    def setup_logging(self, level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"):
        logging.basicConfig(level=level, format=format)
        return self

    def with_model(self, model):
        self._content_fetcher.model = model
        return self

    def build(self):
        # Here you can add any final validation or setup steps before returning the object
        self._content_fetcher.initialize_rabbitmq()
        self._content_fetcher.initialize_grpc()
        self._content_fetcher.initialize_api_key_cycle()

        return self._content_fetcher
 