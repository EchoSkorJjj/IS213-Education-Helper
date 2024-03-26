import grpc
import pb.contents_pb2 as contents_pb2
import pb.contents_pb2_grpc as contents_pb2_grpc

class ContentsClient:
    _instance = None
    _channel = None
    MAX_MESSAGE_LENGTH = -1

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(ContentsClient, cls).__new__(cls)
        return cls._instance

    def __init__(self, server_address=None) -> None:     
        if self._channel is None and server_address is None:
            raise ValueError('Server address not set!')
        
        if self._channel is None:
            self._channel = grpc.insecure_channel(
                server_address,
                options=[
                    ('grpc.max_send_message_length', self.MAX_MESSAGE_LENGTH),
                    ('grpc.max_receive_message_length', self.MAX_MESSAGE_LENGTH)
                ]
            )

    def get_contents_stub(self):
        if self._channel is None:
            raise ValueError('Channel not set')

        return contents_pb2_grpc.ContentStub(self._channel)
