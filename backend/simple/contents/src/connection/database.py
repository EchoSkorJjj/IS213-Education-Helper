from typing import Type, List, Set
import logging
import os

from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider

import pb.contents_pb2 as contents_pb2
import src.utils.db as db_utils

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

        session = cluster.connect(os.getenv('DB_KEYSPACE'))
        logging.debug(f"Database connected at {self._host}:{self._port}")

        self._session = session
    
    def get_content_by_content_id(self, table: str, content_id: str) -> contents_pb2.Flashcard | contents_pb2.MultipleChoiceQuestion | None:
        if not self._session:
            raise ValueError('Not connected')

        statement = self._session.prepare(f'SELECT {table} FROM ? WHERE id=?')
        rows = self._session.execute(statement, [content_id])

        content = rows.one()
        if not content:
            return None
        
        return db_utils.db_content_to_grpc_object(content)
    
    def get_contents_by_note_id(self, note_id: str, content_types: Set[contents_pb2.ContentType]) -> List[contents_pb2.Flashcard | contents_pb2.MultipleChoiceQuestion]:
        if not self._session:
            raise ValueError('Not connected')
        
        statement = self._session.prepare('SELECT * FROM contents_to_note WHERE note_id=?')
        rows = self._session.execute(statement, [note_id])

        associated_contents = []
        for row in rows:
            if row.content_type not in content_types:
                continue

            table = 'flashcard' if row.content_type == contents_pb2.ContentType.FLASHCARD else 'mcq'
            content = self.get_content_by_content_id(table, row.content_id)
            associated_contents.append(db_utils.db_content_to_grpc_object(content))
        
        return associated_contents


    
    
