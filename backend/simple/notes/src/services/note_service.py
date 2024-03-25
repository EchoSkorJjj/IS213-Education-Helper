import grpc
import notes_pb2, notes_pb2_grpc
from connection.database import Database
from utils.file_utils import upload_to_s3, retrieve_from_s3, get_file_metadata
from utils.grpc_utils import note_model_to_message
from utils.logger import get_logger

logger = get_logger(__name__)

class NoteServiceServicer(notes_pb2_grpc.NoteServiceServicer):
    def UploadNote(self, request, context):
        try:
            db = Database()
            note = request.note
            content_length_in_bytes, num_pages = get_file_metadata(note.fileContent)
            upload_to_s3(note.userId, note.fileId, note.fileContent)

            note_to_create = {
                'id': note.fileId,
                'user_id': note.userId,
                'file_name': note.fileName,
                'size_in_bytes': content_length_in_bytes,
                'num_pages': num_pages,
                'title': note.title,
                'topic': note.topic
            }

            db.insert_note(note_to_create)
            return notes_pb2.UploadNoteResponse(fileId=note.fileId)

        except Exception as e:
            logger.error(f'Error uploading note: {e}', exc_info=True)
            context.set_details(f'Error uploading note: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.UploadNoteResponse()
    
    def RetrieveNote(self, request, context):
        try:
            db = Database()
            file_id = request.fileId
            note = db.get_note(file_id)

            file_content = retrieve_from_s3(note.user_id, file_id)
            note_message = note_model_to_message(note)
            note_message.fileContent = file_content
            return notes_pb2.RetrieveNoteResponse(
                note=note_message
            )

        except Exception as e:
            logger.error(f'Error retrieving note: {e}', exc_info=True)
            context.set_details(f'Error retrieving note: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveNoteResponse()
    
    def RetrieveMultipleNotes(self, request, context):
        try:
            db = Database()
            limit, offset, page = request.limit, request.offset, request.page
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0:
                offset = (page - 1) * limit

            notes = db.get_notes(limit, offset)

            response = notes_pb2.RetrieveMultipleNotesResponse()
            for note in notes:
                response.notes.append(notes_pb2.NotePreview(
                    userId=note.user_id,
                    fileId=note.id,
                    sizeInBytes=note.size_in_bytes,
                    numPages=note.num_pages,
                    fileName=note.file_name,
                    title=note.title,
                    topic=note.topic
                ))
            
            response.count = len(notes)
            response.nextPage = page + 1
            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple notes: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple notes: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleNotesResponse()
    
    def RetrieveMultipleNotesByUserId(self, request, context):
        try:
            db = Database()
            limit, offset, page, user_id = request.limit, request.offset, request.page, request.userId
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0:
                offset = (page - 1) * limit
            
            notes = db.get_notes(limit, offset, user_id)
            response = notes_pb2.RetrieveMultipleNotesByUserIdResponse()
            for note in notes:
                response.notes.append(notes_pb2.NotePreview(
                    userId=note.user_id,
                    fileId=note.id,
                    sizeInBytes=note.size_in_bytes,
                    numPages=note.num_pages,
                    fileName=note.file_name,
                    title=note.title,
                    topic=note.topic
                ))
            
            response.count = len(notes)
            response.nextPage = page + 1
            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple notes by user ID: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple notes by user ID: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleNotesByUserIdResponse()

            # file_contents = retrieve_multiple_from_s3(limit=limit, offset=offset)
            # logger.info(f"Retrieved {len(file_contents)} notes")

        #     response = notes_pb2.RetrieveMultipleNotesResponse()
        #     for file_content in file_contents:
        #         response.notes.append(notes_pb2.NotePreview(
        #             userId=file_content['user_id'],
        #             fileId=file_content['file_id'],
        #             sizeInBytes=file_content['size_in_bytes'],
        #             numPages=file_content['num_pages'],
        #             fileName=file_content['file_name']
        #         ))
            
        #     response.count = len(file_contents)
        #     response.nextPage = page + 1
        #     return response
        # except Exception as e:
        #     logger.error(f'Error retrieving multiple notes: {e}', exc_info=True)
        #     context.set_details(f'Error retrieving multiple notes: {e}')
        #     context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
        #     return notes_pb2.RetrieveMultipleNotesResponse()

    # def UploadNote(self, request, context):
    #     try:
    #         upload_to_s3(request.userId, request.fileId, request.fileContent, request.fileName)
    #         logger.info(f"Note {request.fileId} uploaded for user {request.userId}")
    #         return notes_pb2.UploadNoteResponse(fileId=request.fileId)
    #     except Exception as e:
    #         logger.error(f'Error uploading note: {e}', exc_info=True)
    #         context.set_details(f'Error uploading note: {e}')
    #         context.set_code(grpc.StatusCode.INTERNAL)
    #         return notes_pb2.UploadNoteResponse()

    # def RetrieveNote(self, request, context):
    #     try:
    #         file_content = retrieve_from_s3(request.userId, request.fileId)
    #         logger.info(f"Note {request.fileId} retrieved for user {request.userId}")
    #         return notes_pb2.RetrieveNoteResponse(
    #             userId=request.userId,
    #             fileId=request.fileId,
    #             fileContent=file_content["file_content"],
    #             fileName=file_content["file_name"]
    #         )

    #     except Exception as e:
    #         logger.error(f'Error retrieving note: {e}', exc_info=True)
    #         context.set_details(f'Error retrieving note: {e}')
    #         context.set_code(grpc.StatusCode.INTERNAL)
    #         return notes_pb2.RetrieveNoteResponse()
    
    # def RetrieveMultipleNotes(self, request, context):
    #     try:
    #         limit, offset, page = request.limit, request.offset, request.page
    #         if offset == 0 and page == 0:
    #             raise ValueError('Offset and page cannot be 0 at the same time')
    #         if offset == 0: # offset takes precedence over page
    #             offset = (page - 1) * limit
    #         elif page == 0:
    #             page = offset // max(1, limit) + 1
            
    #         file_contents = retrieve_multiple_from_s3(limit=limit, offset=offset)
    #         logger.info(f"Retrieved {len(file_contents)} notes")

    #         response = notes_pb2.RetrieveMultipleNotesResponse()
    #         for file_content in file_contents:
    #             response.notes.append(notes_pb2.NotePreview(
    #                 userId=file_content['user_id'],
    #                 fileId=file_content['file_id'],
    #                 sizeInBytes=file_content['size_in_bytes'],
    #                 numPages=file_content['num_pages'],
    #                 fileName=file_content['file_name']
    #             ))
            
    #         response.count = len(file_contents)
    #         response.nextPage = page + 1
    #         return response
    #     except Exception as e:
    #         logger.error(f'Error retrieving multiple notes: {e}', exc_info=True)
    #         context.set_details(f'Error retrieving multiple notes: {e}')
    #         context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
    #         return notes_pb2.RetrieveMultipleNotesResponse()
    
    # def RetrieveMultipleNotesByUserId(self, request, context):
    #     try:
    #         limit, offset, page, user_id = request.limit, request.offset, request.page, request.userId
    #         if offset == 0 and page == 0:
    #             raise ValueError('Offset and page cannot be 0 at the same time')
    #         if offset == 0: # offset takes precedence over page
    #             offset = (page - 1) * limit
    #         elif page == 0:
    #             page = offset // max(1, limit) + 1
            
    #         file_contents = retrieve_multiple_from_s3(limit=limit, offset=offset, user_id=user_id)
    #         logger.info(f"Retrieved {len(file_contents)} notes for user {user_id}")

    #         response = notes_pb2.RetrieveMultipleNotesResponse()
    #         for file_content in file_contents:
    #             response.notes.append(notes_pb2.NotePreview(
    #                 userId=file_content['user_id'],
    #                 fileId=file_content['file_id'],
    #                 sizeInBytes=file_content['size_in_bytes'],
    #                 numPages=file_content['num_pages'],
    #                 fileName=file_content['file_name']
    #             ))
            
    #         response.count = len(file_contents)
    #         response.nextPage = page + 1
    #         return response
    #     except Exception as e:
    #         logger.error(f'Error retrieving multiple notes by user ID: {e}', exc_info=True)
    #         context.set_details(f'Error retrieving multiple notes by user ID: {e}')
    #         context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
    #         return notes_pb2.RetrieveMultipleNotesResponse()