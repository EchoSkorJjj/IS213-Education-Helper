from typing import Type
from concurrent import futures
import logging
import grpc

import pb.contents_pb2_grpc as contents_pb2_grpc

from src.interceptors.logging import LoggingInterceptor
import src.proto_services.content_servicer as content_servicer

class GrpcServer:
    _server: 'GrpcServer' = None
    _max_workers: int = None
    _port: int = None

    def __new__(cls: Type['GrpcServer']) -> 'GrpcServer':
        if not hasattr(cls, 'instance'):
            logging.debug("No instance of 'GrpcServer' found, creating a new one")
            cls.instance = super(GrpcServer, cls).__new__(cls)

        return cls.instance
    
    def set_max_workers(self, max_workers: int) -> None:
        logging.debug(f"Max workers set to {max_workers}")
        self._max_workers = max_workers
    
    def set_port(self, port: int) -> None:
        logging.debug(f"Port set to {port}")
        self._port = port
    
    def start(self) -> None:
        if not self._port:
            raise ValueError('Port not set')
        if not self._max_workers:
            raise ValueError('Max workers not set')
        
        self._server = grpc.server(
            futures.ThreadPoolExecutor(max_workers=self._max_workers),
            interceptors=[LoggingInterceptor()]
        )
        logging.debug("Server started with {self._max_workers} workers...")
        
        contents_pb2_grpc.add_ContentServicer_to_server(content_servicer.ContentServicer(), self._server)
        logging.debug("ContentServicer added...")
        
        self._server.add_insecure_port(f'[::]:{self._port}')
        logging.debug(f"Insecure port on [::]:{self._port} added...")
        
        self._server.start()
        logging.info(f"Server started on port {self._port} with {self._max_workers} workers.")

        self._server.wait_for_termination()
