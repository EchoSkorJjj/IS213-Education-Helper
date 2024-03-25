from typing import Type, List, Set
import logging
import os
import uuid

import pb.contents_pb2 as contents_pb2
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
from cassandra.query import BatchStatement, dict_factory

import src.utils.grpc_utils as grpc_utils
import src.utils.db_utils as db_utils
import src.utils.flashcard_utils as flashcard_utils
import src.utils.mcq_utils as mcq_utils

class Database:
    _host: str = None
    _port: int = None
    _keyspace: str = None
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
    
    def set_keyspace(self, keyspace: str) -> None:
        self._keyspace = keyspace

    def connect(self) -> None:
        if not self._host:
            raise ValueError('Host not set')
        if not self._port:
            raise ValueError('Port not set')
        
        auth_provider = PlainTextAuthProvider(username=os.getenv('DB_USERNAME'), password=os.getenv('DB_PASSWORD'))
        cluster = Cluster([self._host], port=self._port, auth_provider=auth_provider)
        session = cluster.connect(self._keyspace)
        logging.debug(f"Database connected at {self._host}:{self._port}")

        cluster.register_user_type(self._keyspace, 'mcq_option', dict)
        session.row_factory = dict_factory
        self._session = session

    def batch_create_contents(self, contents: List[object], type: str) -> None:
        if not self._session:
            raise ValueError('Not connected')
        
        if len(contents) == 0:
            return

        batch = BatchStatement()
        flashcard_content_type_name = flashcard_utils.get_flashcard_content_type_name()
        mcq_content_type_name = mcq_utils.get_mcq_content_type_name()
        if type == flashcard_content_type_name:
            for content in contents:
                content_id = uuid.UUID(content['id'])
                note_id = uuid.UUID(content['note_id'])
                statement = db_utils.prepare_insert_flashcard_statement(self._session, self._keyspace)
                association_statement = db_utils.prepare_insert_contents_to_note_statement(self._session, self._keyspace)
                batch.add(statement, [content_id, content['answer'], content['question']])
                batch.add(association_statement, [note_id, content_id, flashcard_content_type_name])
        
        elif type == mcq_content_type_name:
            for content in contents:
                content_id = uuid.UUID(content['id'])
                note_id = uuid.UUID(content['note_id'])
                options = [(option['option'], option['is_correct']) for option in content['options']]
                logging.info(options)
                statement = db_utils.prepare_insert_mcq_statement(self._session, self._keyspace)
                association_statement = db_utils.prepare_insert_contents_to_note_statement(self._session, self._keyspace)
                batch.add(statement, [content_id, content['question'], options, content['multiple_answers']])
                batch.add(association_statement, [note_id, content_id, mcq_content_type_name])        

        self._session.execute(batch)
    
    def get_content_by_content_id(self, note_id: uuid.UUID, table: str, content_id: uuid.UUID) -> contents_pb2.Flashcard | contents_pb2.MultipleChoiceQuestion | None:
        if not self._session:
            raise ValueError('Not connected')

        statement = db_utils.prepare_select_content_by_id_statement(self._session, self._keyspace, table)
        rows = self._session.execute(statement, [content_id])

        content = rows.one()
        if not content:
            return None
        
        return grpc_utils.db_content_to_grpc_object(note_id, table, content)
    
    def get_contents_by_note_id(self, note_id: str, content_types: Set[contents_pb2.ContentType]):
        if not self._session:
            raise ValueError('Not connected')
        
        statement = db_utils.prepare_select_all_contents_by_note_id_statement(self._session, self._keyspace)
        rows = self._session.execute(statement, [uuid.UUID(note_id)])

        associated_contents = {key: [] for key in content_types}
        for row in rows:
            if row['content_type'] not in content_types:
                continue

            content = self.get_content_by_content_id(note_id, row['content_type'], row['content_id'])
            associated_contents[row['content_type']].append(content)
        
        return associated_contents
