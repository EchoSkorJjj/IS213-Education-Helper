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
                'topic': note.topic,
                'generate_type': note.generateType
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
            if not note:
                raise ValueError(f'Note with ID {file_id} not found')

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
            response.count = len(notes)
            response.nextPage = page + 1

            for note in notes:
                note_preview = notes_pb2.NotePreview(
                    userId=note.user_id,
                    fileId=str(note.id),
                    fileName=note.file_name,
                    title=note.title,
                    topic=note.topic,
                    sizeInBytes=note.size_in_bytes,
                    numPages=note.num_pages,
                    generateType=note.generate_type
                )

                response.notes.append(note_preview)

            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple notes: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple notes: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleNotesResponse()
    
    def RetrieveMultipleNotesByUserId(self, request, context):
        try:
            db = Database()
            limit, offset, page, user_id, notesTitle = request.limit, request.offset, request.page, request.userId, request.notesTitle
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0:
                offset = (page - 1) * limit
            
            notes, total_count = db.get_notes(limit, offset, notesTitle, user_id)
            response = notes_pb2.RetrieveMultipleNotesByUserIdResponse()
            
            response.count = total_count

            for note in notes:
                note_preview = notes_pb2.NotePreview(
                    userId=note.user_id,
                    fileId=str(note.id),
                    fileName=note.file_name,
                    title=note.title,
                    topic=note.topic,
                    sizeInBytes=note.size_in_bytes,
                    numPages=note.num_pages,
                    generateType=note.generate_type
                )

                response.notes.append(note_preview)
            
            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple notes by user ID: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple notes by user ID: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleNotesByUserIdResponse()
        
    def RetrieveNoteMetadata(self, request, context):
        """
        Retrieves metadata for a specific note identified by fileId.
        """
        try:
            db = Database()
            file_id = request.fileId
            note_metadata = db.get_note_metadata(file_id)
            if not note_metadata:
                raise ValueError(f'Note with ID {file_id} not found')
            
            # Since note_metadata is a dictionary, we directly access its values to create a NotePreview message
            note_preview = notes_pb2.NotePreview(
                userId=note_metadata['user_id'],
                fileId=note_metadata['id'],
                fileName=note_metadata['file_name'],
                title=note_metadata['title'],
                topic=note_metadata['topic'],
                sizeInBytes=note_metadata['size_in_bytes'],
                numPages=note_metadata['num_pages'],
                generateType=note_metadata['generate_type']
            )
            
            # Returning a single note's metadata as a response
            return notes_pb2.RetrieveNoteMetadataResponse(noteMetadata=note_preview)

        except Exception as e:
            logger.error(f'Error retrieving note metadata: {e}', exc_info=True)
            context.set_details(f'Error retrieving note metadata: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            # Return an empty response indicating failure
            return notes_pb2.RetrieveNoteResponse()
    
    def UpdateNote(self, request, context):
        try:
            db = Database()
            note_preview = request.notePreview
            note = db.get_note(note_preview.fileId)
            if not note:
                raise ValueError(f'Note with ID {note_preview.fileId} not found')
            
            note_to_update = {
                'id': note_preview.fileId, # Assume file itself cannot change
                'user_id': note.user_id,
                'file_name': note_preview.fileName if note_preview.fileName else note.file_name,
                'size_in_bytes': note.size_in_bytes, # Assume file itself cannot change
                'num_pages': note.num_pages, # Assume file itself cannot change
                'title': note_preview.title if note_preview.title else note.title,
                'topic': note_preview.topic if note_preview.topic else note.topic,
                'generate_type': note.generate_type
            }

            db.update_note(note_to_update)
            return notes_pb2.UpdateNoteResponse(success=True)

        except Exception as e:
            logger.error(f'Error updating note: {e}', exc_info=True)
            context.set_details(f'Error updating note: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.UpdateNoteResponse()
        
    def ViewNotesByTopicAndName(self, request, context):
        response = notes_pb2.ViewNotesByTopicAndNameResponse()
        try:
            topic, notesTitle, page, limit, offset = request.topic, request.notesTitle, request.page, request.limit, request.offset
                        
            db = Database()
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0:
                offset = (page - 1) * limit
            
            notes, total_count = db.get_notes_by_topic_and_name(topic, notesTitle, limit, offset)
            response = notes_pb2.ViewNotesByTopicAndNameResponse()
            
            response.count = total_count

            for note in notes:
                note_preview = notes_pb2.NotePreview(
                    userId=note.user_id,
                    fileId=str(note.id),
                    fileName=note.file_name,
                    title=note.title,
                    topic=note.topic,
                    sizeInBytes=note.size_in_bytes,
                    numPages=note.num_pages,
                    generateType=note.generate_type
                )

                response.notes.append(note_preview)
            
            return response
        except Exception as e:
            logger.error(f'Error viewing notes by topic and name: {e}', exc_info=True)
            context.set_details(f'Error viewing notes by topic and name: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return response
        
    def RetrieveMultipleSavedNotes(self, request, context):
        try:
            db = Database()
            limit, offset, page, notesTitle, saved_notes_ids = request.limit, request.offset, request.page, request.notesTitle, request.saved_notes_ids
            if offset == 0 and page == 0:
                raise ValueError('Offset and page cannot be 0 at the same time')
            if offset == 0:
                offset = (page - 1) * limit

            notes, count = db.get_saved_notes(limit, offset, notesTitle, saved_notes_ids)

            response = notes_pb2.RetrieveMultipleSavedNotesResponse()
            response.count = count

            for note in notes:
                note_preview = notes_pb2.NotePreview(
                    userId=note.user_id,
                    fileId=str(note.id),
                    fileName=note.file_name,
                    title=note.title,
                    topic=note.topic,
                    sizeInBytes=note.size_in_bytes,
                    numPages=note.num_pages,
                    generateType=note.generate_type
                )

                response.notes.append(note_preview)

            return response
        except Exception as e:
            logger.error(f'Error retrieving multiple saved notes: {e}', exc_info=True)
            context.set_details(f'Error retrieving multiple saved notes: {e}')
            context.set_code(grpc.StatusCode.INVALID_ARGUMENT)
            return notes_pb2.RetrieveMultipleSavedNotesResponse()
