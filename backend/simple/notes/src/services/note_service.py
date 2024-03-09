import grpc
import notes_pb2, notes_pb2_grpc
from utils.s3utils import upload_to_s3, retrieve_from_s3
from utils.logger import get_logger

logger = get_logger(__name__)

class NoteServiceServicer(notes_pb2_grpc.NoteServiceServicer):
    def UploadNote(self, request, context):
        try:
            upload_to_s3(request.userId, request.noteId, request.fileContent)
            logger.info(f"Note {request.noteId} uploaded for user {request.userId}")
            return notes_pb2.UploadNoteResponse(noteId=request.noteId)
        except Exception as e:
            logger.error(f'Error uploading note: {e}', exc_info=True)
            context.set_details(f'Error uploading note: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.UploadNoteResponse()

    def RetrieveNote(self, request, context):
        try:
            file_content = retrieve_from_s3(request.userId, request.noteId)
            logger.info(f"Note {request.noteId} retrieved for user {request.userId}")
            return notes_pb2.RetrieveNoteResponse(userId=request.userId, fileContent=file_content)
        except Exception as e:
            logger.error(f'Error retrieving note: {e}', exc_info=True)
            context.set_details(f'Error retrieving note: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.RetrieveNoteResponse()
