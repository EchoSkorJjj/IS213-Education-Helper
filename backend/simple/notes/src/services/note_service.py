import grpc
import notes_pb2, notes_pb2_grpc
from utils.s3utils import upload_to_s3, retrieve_from_s3, retrieve_multiple_from_s3
from utils.logger import get_logger

logger = get_logger(__name__)

class NoteServiceServicer(notes_pb2_grpc.NoteServiceServicer):
    def UploadNote(self, request, context):
        try:
            upload_to_s3(request.userId, request.fileId, request.fileContent)
            logger.info(f"Note {request.fileId} uploaded for user {request.userId}")
            return notes_pb2.UploadNoteResponse(fileId=request.fileId)
        except Exception as e:
            logger.error(f'Error uploading note: {e}', exc_info=True)
            context.set_details(f'Error uploading note: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.UploadNoteResponse()

    def RetrieveNote(self, request, context):
        try:
            file_content = retrieve_from_s3(request.userId, request.fileId)
            logger.info(f"Note {request.fileId} retrieved for user {request.userId}")
            return notes_pb2.RetrieveNoteResponse(userId=request.userId, fileId=request.fileId, fileContent=file_content)
        except Exception as e:
            logger.error(f'Error retrieving note: {e}', exc_info=True)
            context.set_details(f'Error retrieving note: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.RetrieveNoteResponse()
    
    def RetrieveMultipleNotes(self, request, context):
        try:
            limit, offset, page = request.limit, request.offset, request.page
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0: # offset takes precedence over page
                offset = (page - 1) * limit
            elif page == 0:
                page = offset // max(1, limit) + 1
            
            file_contents = retrieve_multiple_from_s3(limit=limit, offset=offset)
            logger.info(f"Retrieved {len(file_contents)} notes")

            response = notes_pb2.RetrieveMultipleNotesResponse()
            for file_content in file_contents:
                response.notes.append(notes_pb2.Note(
                    userId=file_content['user_id'],
                    fileId=file_content['file_id'],
                    fileContent=file_content['file_content']
                ))
            
            response.count = len(file_contents)
            response.nextPage = page + 1
            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple notes: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple notes: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleNotesResponse()
    
    def RetrieveMultipleNotesByUserId(self, request, context):
        try:
            limit, offset, page, user_id = request.limit, request.offset, request.page, request.userId
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0: # offset takes precedence over page
                offset = (page - 1) * limit
            elif page == 0:
                page = offset // max(1, limit) + 1
            
            file_contents = retrieve_multiple_from_s3(limit=limit, offset=offset, user_id=user_id)
            logger.info(f"Retrieved {len(file_contents)} notes for user {user_id}")

            response = notes_pb2.RetrieveMultipleNotesResponse()
            for file_content in file_contents:
                response.notes.append(notes_pb2.Note(
                    userId=file_content['user_id'],
                    fileId=file_content['file_id'],
                    fileContent=file_content['file_content']
                ))
            
            response.count = len(file_contents)
            response.nextPage = page + 1
            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple notes by user ID: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple notes by user ID: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleNotesResponse()