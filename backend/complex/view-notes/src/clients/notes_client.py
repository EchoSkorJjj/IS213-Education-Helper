import grpc
import pb.notes_pb2 as notes_pb2
import pb.notes_pb2_grpc as notes_pb2_grpc

class NotesClient:
    _instance = None
    _channel = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(NotesClient, cls).__new__(cls)
        return cls._instance
    
    def __init__(self, server_address=None) -> None:
        if self._channel is None and server_address is None:
            raise ValueError('Server address not set!')

        if self._channel is None:
            self._channel = grpc.insecure_channel(server_address)
    
    def get_notes_stub(self):
        if self._channel is None:
            raise ValueError('Channel not set')

        return notes_pb2_grpc.NoteServiceStub(self._channel)
