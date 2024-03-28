import grpc
from content_pb2 import CreateTemporaryFlashcardRequest, CreateTemporaryMultipleChoiceQuestionRequest, MultipleChoiceQuestionOption
import content_pb2_grpc

class ContentServiceProxy:
    def __init__(self, address):
        self.grpc_channel = grpc.insecure_channel(address)
        self.stub = content_pb2_grpc.ContentStub(self.grpc_channel)

    def send_content(self, content_request):
        # Determine content type and make appropriate gRPC call
        if isinstance(content_request, CreateTemporaryFlashcardRequest):
            return self.stub.CreateTemporaryFlashcard(content_request)
        elif isinstance(content_request, CreateTemporaryMultipleChoiceQuestionRequest):
            return self.stub.CreateTemporaryMultipleChoiceQuestion(content_request)
        else:
            raise ValueError("Unsupported content type")
