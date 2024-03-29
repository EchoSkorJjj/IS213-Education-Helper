import uuid

from utils.logger import get_logger

from sqlalchemy import create_engine, String, Column, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import UUID

logger = get_logger(__name__)
base = declarative_base()

class Notes(base):
    __tablename__ = 'notes'
    id = Column(UUID(as_uuid=True), primary_key=True)
    user_id = Column(String)
    file_name = Column(String)
    size_in_bytes = Column(Integer)
    num_pages = Column(Integer)
    title = Column(String)
    topic = Column(String)
    generate_type = Column(String)

class Database:
    _engine = None
    _session = None

    def __new__(cls):
        if not hasattr(cls, 'instance'):
            logger.debug("No instance of 'Database' found, creating a new one")
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
        
        conn_string = f"postgresql:///?user={self._user}&password={self._password}&dbname={self._database}&host={self._host}&port={self._port}"
        self._engine = create_engine(conn_string)
        factory = sessionmaker(bind=self._engine)
        self._session = factory()
    
    def ready(self):
        if not self._session:
            raise ValueError("Session not initialized")
    
    def get_notes(self, limit, offset, user_id=None):
        self.ready()

        query = self._session.query(Notes)
        if user_id:
            query = query.filter(Notes.user_id == user_id)
        
        return query.limit(limit).offset(offset).all()

    def get_note(self, id):
        self.ready()
        
        return self._session.query(Notes).filter(Notes.id == uuid.UUID(id, version=4)).first()
    
    def insert_note(self, note):
        self.ready()

        note["id"] = uuid.UUID(note["id"])

        self._session.add(Notes(**note))
        self._session.commit()
    
    def update_note(self, note):
        self.ready()

        note["id"] = uuid.UUID(note["id"], version=4)

        self._session.query(Notes).filter(Notes.id == note["id"]).update(note)
        self._session.commit()
    
    def delete_note(self, note):
        self.ready()

        self._session.query(Notes).filter(Notes.id == uuid.UUID(note["id"], version=4)).delete()
        self._session.commit()


    def get_note_metadata(self, note_id):
        self.ready()
        columns = [Notes.id, Notes.user_id, Notes.file_name, Notes.size_in_bytes, Notes.num_pages, Notes.title, Notes.topic, Notes.generate_type]
        result = self._session.query(*columns).filter(Notes.id == uuid.UUID(note_id, version=4)).first()

        if result:
            metadata = {
                "id": str(result.id),  
                "user_id": result.user_id,
                "file_name": result.file_name,
                "size_in_bytes": result.size_in_bytes,
                "num_pages": result.num_pages,
                "title": result.title,
                "topic": result.topic,
                "generate_type": result.generate_type,
            }
            return metadata

        return None