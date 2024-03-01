from typing import Type
from concurrent import futures

import grpc
import logging

import pb.contents_pb2_grpc as contents_pb2_grpc
import src.proto_services.content_servicer as content_servicer

class GrpcServer:
    _server: 'GrpcServer' = None
    _max_workers: int = None
    _port: int = None

    def __new__(cls: Type['GrpcServer']) -> 'GrpcServer':
        if not hasattr(cls, 'instance'):
            cls.instance = super(GrpcServer, cls).__new__(cls)

        return cls.instance
    
    def set_max_workers(self: 'GrpcServer', max_workers: int) -> None:
        self._max_workers = max_workers
    
    def set_port(self: 'GrpcServer', port: int) -> None:
        self._port = port
    
    def start(self) -> None:
        if not self._port:
            raise ValueError('Port not set')
        if not self._max_workers:
            raise ValueError('Max workers not set')
        
        self._server = grpc.server(futures.ThreadPoolExecutor(max_workers=self._max_workers))
        contents_pb2_grpc.add_ContentServicer_to_server(content_servicer.ContentServicer(), self._server)
        self._server.add_insecure_port(f'[::]:{self._port}')
        logging.info("mum gay")
        self._server.start()
        self._server.wait_for_termination()
