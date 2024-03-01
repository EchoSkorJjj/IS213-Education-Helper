import pb.contents_pb2_grpc as contents_pb2_grpc

class ContentServicer(contents_pb2_grpc.ContentServicer):
    def GetContent(self, request, context):
        pass

    def CreateFlashcard(self, request, context):
        pass

    def CreateMultipleChoiceQuestion(self, request, context):
        pass

    def DeleteContent(self, request, context):
        pass

    def UpdateFlashcard(self, request, context):
        pass

    def UpdateMultipleChoiceQuestion(self, request, context):
        pass