import pb.contents_pb2 as contents_pb2
import pb.contents_pb2_grpc as contents_pb2_grpc
from src.connection.database import Database
class ContentServicer(contents_pb2_grpc.ContentServicer):
    def GetContent(self, request, context):
        note_id = request.note_id
        content_types = set(request.content_type)
        db = Database()

        contents = db.get_contents_by_note_id(note_id, content_types)

        response = contents_pb2_grpc.GetContentResponse()
        for content in contents:
            if content.content_type == contents_pb2.ContentType.FLASHCARD:
                response.flashcards.append(content)
            elif content.content_type == contents_pb2.ContentType.MCQ:
                response.mcqs.append(content)
            else:
                raise ValueError(f"Unknown content type: {content.content_type}")        


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