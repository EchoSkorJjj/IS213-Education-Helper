import uuid
import logging
import json

import utils.flashcard_utils as flashcard_utils
import utils.mcq_utils as mcq_utils
import utils.grpc_utils as grpc_utils

from sqlalchemy import create_engine, String, Column, Integer, ARRAY, insert, TypeDecorator, JSON
from sqlalchemy.types import UserDefinedType
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID

base = declarative_base()

class MCQ(base):
    __tablename__ = 'mcq'
    id = Column(UUID(as_uuid=True), primary_key=True)
    question = Column(String)
    options = Column(JSON)
    multiple_answers = Column(Integer)

class Flashcard(base):
    __tablename__ = 'flashcard'
    id = Column(UUID(as_uuid=True), primary_key=True)
    question = Column(String)
    answer = Column(String)

class ContentsToNote(base):
    __tablename__ = 'contents_to_note'
    note_id = Column(UUID(as_uuid=True), primary_key=True)
    content_id = Column(UUID(as_uuid=True), primary_key=True)
    content_type = Column(String)

class Database:
    _engine = None
    _session = None

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            logging.debug("No instance of 'Database' found, creating a new one")
            cls.instance = super(Database, cls).__new__(cls)
        return cls.instance
    
    def set_user(self, user):
        self._user = user
    
    def set_password(self, password):
        self._password = password

    def set_database(self, database):
        self._database = database
    
    def set_host(self, host):
        self._host = host
    
    def set_port(self, port):
        self._port = port
    
    def connect(self):
        if not self._user or not self._password or not self._database or not self._host or not self._port:
            raise ValueError("User, password, database, host, and port must be set before connecting")
        
        conn_string = f"postgresql://{self._user}:{self._password}@{self._host}:{self._port}/{self._database}"
        self._engine = create_engine(conn_string)
        Session = sessionmaker(bind=self._engine)
        self._session = Session()
    
    def ready(self):
        if not self._session:
            raise ValueError("Session not initialized")
    
    def batch_create_contents(self, contents, content_type):
        self.ready()

        if len(contents) == 0:
            return
        
        flashcard_content_type_name = flashcard_utils.get_flashcard_content_type_name()
        mcq_content_type_name = mcq_utils.get_mcq_content_type_name()
        if content_type == flashcard_content_type_name:
            for content in contents:
                content_id = uuid.UUID(content['id'])
                note_id = uuid.UUID(content['note_id'])
                self._session.execute(
                    insert(Flashcard).values(id=content_id, answer=content['answer'], question=content['question'])
                )
                self._session.execute(
                    insert(ContentsToNote).values(note_id=note_id, content_id=content_id, content_type=content_type)
                )

        elif content_type == mcq_content_type_name:
            for content in contents:
                content_id = uuid.UUID(content['id'])
                note_id = uuid.UUID(content['note_id'])
                options = [{'option': option['option'], 'is_correct': option['is_correct']} for option in content['options']]
                options_json = json.dumps(options)
                self._session.execute(
                    insert(MCQ).values(id=content_id, question=content['question'], options=options_json, multiple_answers=content['multiple_answers'])
                )
                self._session.execute(
                    insert(ContentsToNote).values(note_id=note_id, content_id=content_id, content_type=content_type)
                )

        self._session.commit()

    def get_contents_by_note_id(self, note_id, content_types):
        self.ready()

        note_id = uuid.UUID(note_id)
        rows = self._session.query(ContentsToNote).filter(ContentsToNote.note_id == note_id).all()

        flashcard_content_type_name = flashcard_utils.get_flashcard_content_type_name()
        mcq_content_type_name = mcq_utils.get_mcq_content_type_name()
        associated_contents = {content_type: [] for content_type in content_types}
        for row in rows:
            if row.content_type in content_types:
                if row.content_type == flashcard_content_type_name:
                    contents = self._session.query(Flashcard).filter(Flashcard.id == row.content_id).all()

                elif row.content_type == mcq_content_type_name:
                    contents = self._session.query(MCQ).filter(MCQ.id == row.content_id).all()
                    for content in contents:
                        if isinstance(content.options, str):
                            content.options = json.loads(content.options)

                for content in contents:
                    converted_content = grpc_utils.db_content_to_grpc_object(note_id, row.content_type, content)
                    associated_contents[row.content_type].append(converted_content)

        return associated_contents
