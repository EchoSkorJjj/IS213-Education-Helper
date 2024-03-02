from typing import Type
import os

from src.server.grpc_server import GrpcServer
from src.connection.database import Database
from src.connection.cache import Cache

class Server:
    _grpc_server_instance: 'GrpcServer' = None
    _instance: 'Server' = None

    def __new__(cls: Type['Server']) -> 'Server':
        if not hasattr(cls, 'instance'):
            cls.instance = super(Server, cls).__new__(cls)
        return cls.instance
    
    def _initialise(self) -> None:
        self._grpc_server_instance = GrpcServer()

        max_workers = int(os.getenv('GRPC_MAX_WORKERS', '10'))
        port = int(os.getenv('GRPC_PORT', '50051'))
        self._grpc_server_instance.set_max_workers(max_workers)
        self._grpc_server_instance.set_port(port)

        self._initialise_dependencies()
    
    def _initialise_dependencies(self) -> None:
        database: Database = Database()
        database.set_host(os.getenv('DB_HOST', 'localhost'))
        database.set_port(int(os.getenv('DB_PORT', '9042')))
        database.connect()

        cache: Cache = Cache()
        cache.set_host(os.getenv('CACHE_HOST', 'localhost'))
        cache.set_port(int(os.getenv('CACHE_PORT', '6379')))
        cache.connect()

    def start(self) -> None:
        self._initialise()
        self._grpc_server_instance.start()