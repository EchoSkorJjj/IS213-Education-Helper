from typing import Type
import logging
import os

from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

class Database:
    _host: str = None
    _port: int = None
    _session: 'Session' = None

    def __new__(cls: Type['Database']) -> 'Database':
        if not hasattr(cls, 'instance'):
            logging.debug("No instance of 'Database' found, creating a new one")
            cls.instance = super(Database, cls).__new__(cls)

        return cls.instance
    
    def set_host(self, host: str) -> None:
        self._host = host
    
    def set_port(self, port: int) -> None:
        self._port = port
    
    def connect(self) -> None:
        if not self._host:
            raise ValueError('Host not set')
        if not self._port:
            raise ValueError('Port not set')
        
        auth_provider = PlainTextAuthProvider(username=os.getenv('DB_USERNAME'), password=os.getenv('DB_PASSWORD'))
        cluster = Cluster([self._host], port=self._port, auth_provider=auth_provider)

        logging.info("Connecting to keyspace " + os.getenv('DB_KEYSPACE'))
        session = cluster.connect(os.getenv('DB_KEYSPACE'))
        logging.info(f"Connected to {self._host}:{self._port}")

        self._session = session

