import grpc

import pb.view_notes_pb2 as view_notes_pb2
import pb.view_notes_pb2_grpc as view_notes_pb2_grpc
import pb.contents_pb2 as contents_pb2
import pb.notes_pb2 as notes_pb2
import pb.user_storage_pb2 as user_storage_pb2

import src.utils.error_utils as error_utils
import src.utils.grpc_utils as grpc_utils
import src.clients.notes_client as notes_client
import src.clients.contents_client as contents_client
import src.clients.user_storage_client as user_storage_client

class ViewNotesServicer(view_notes_pb2_grpc.ViewNotesServicer):
    def ViewOneNote(self, request, context):
        response = view_notes_pb2.NoteAndContent()
        try:
            note_id = request.note_id
            notes_stub = notes_client.NotesClient().get_notes_stub()
            contents_stub = contents_client.ContentsClient().get_contents_stub()

            note_request = notes_pb2.RetrieveNoteRequest()
            note_request.fileId = note_id
            note_response = notes_stub.RetrieveNote(note_request)

            content_request = contents_pb2.GetSavedContentsRequest()
            content_request.note_id = note_id
            content_request.content_type.extend([contents_pb2.ContentType.FLASHCARD, contents_pb2.ContentType.MCQ])
            content_response = contents_stub.GetSavedContents(content_request)

            retrieved_note = grpc_utils.note_to_b64_note(note_response.note)

            associated_contents = view_notes_pb2.AssociatedContents()
            associated_contents.flashcards.extend(content_response.flashcards)
            associated_contents.mcqs.extend(content_response.mcqs)

            response.note.CopyFrom(retrieved_note)
            response.associated_contents.CopyFrom(associated_contents)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving note',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def ViewAllNotes(self, request, context):
        response = view_notes_pb2.ViewAllNotesResponse()
        try:
            limit, offset, page = request.limit, request.offset, request.page
            notes_stub = notes_client.NotesClient().get_notes_stub()

            notes_request = notes_pb2.RetrieveMultipleNotesRequest()
            notes_request.limit = limit
            notes_request.offset = offset
            notes_request.page = page

            notes_response = notes_stub.RetrieveMultipleNotes(notes_request)
            note_previews = notes_response.notes
            response.next_page = notes_response.nextPage
            response.count = len(note_previews)

            for note_preview in note_previews:
                response.notes.append(note_preview)
            
            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving notes',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )
    
    def ViewNotesByUserId(self, request, context):
        response = view_notes_pb2.ViewAllNotesResponse()
        try:
            limit, offset, page, user_id, notesTitle = request.limit, request.offset, request.page, request.user_id, request.notesTitle
            notes_stub = notes_client.NotesClient().get_notes_stub()
            notes_request = notes_pb2.RetrieveMultipleNotesByUserIdRequest()
            notes_request.userId = user_id
            notes_request.limit = limit
            notes_request.offset = offset
            notes_request.page = page
            notes_request.userId = user_id
            notes_request.notesTitle = notesTitle

            notes_response = notes_stub.RetrieveMultipleNotesByUserId(notes_request)
            
            response.notes.extend(notes_response.notes)
            response.count = notes_response.count

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving notes',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )
        
    def ViewSavedNotesByUserId(self, request, context):
        response = view_notes_pb2.ViewAllNotesResponse()
        try:
            limit, offset, page, user_id, notesTitle = request.limit, request.offset, request.page, request.user_id, request.notesTitle
            user_storage_stub = user_storage_client.UserStorageClient().get_user_storage_stub()
            notes_stub = notes_client.NotesClient().get_notes_stub()
            
            saved_notes_request = user_storage_pb2.GetSavedNotesRequest()
            saved_notes_request.user_id = user_id

            saved_notes_response = user_storage_stub.GetSavedNotes(saved_notes_request)
            saved_notes_ids = saved_notes_response.saved_notes_ids

            notes_request = notes_pb2.RetrieveMultipleSavedNotesRequest()
            notes_request.limit = limit
            notes_request.offset = offset
            notes_request.page = page
            notes_request.notesTitle = notesTitle
            notes_request.saved_notes_ids.extend(saved_notes_ids)
            
            notes_response = notes_stub.RetrieveMultipleSavedNotes(notes_request)
            
            response.notes.extend(notes_response.notes)
            response.count = notes_response.count

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving notes',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )
    
    def ViewSavedNotes(self, request, context):
        response = view_notes_pb2.ViewSavedNotesResponse()
        try:
            user_id = request.user_id
            user_storage_stub = user_storage_client.UserStorageClient().get_user_storage_stub()
            notes_stub = notes_client.NotesClient().get_notes_stub()

            saved_notes_request = user_storage_pb2.GetSavedNotesRequest()
            saved_notes_request.user_id = user_id

            saved_notes_response = user_storage_stub.GetSavedNotes(saved_notes_request)
            saved_notes_ids = saved_notes_response.saved_notes_ids

            for note_id in saved_notes_ids:
                retrieve_note_request = notes_pb2.RetrieveNoteMetadataRequest()
                retrieve_note_request.fileId = note_id

                retrieve_note_response = notes_stub.RetrieveNoteMetadata(retrieve_note_request)
                response.notes.append(retrieve_note_response.noteMetadata)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving saved notes',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def ViewNotesByTopicAndName(self, request, context):
        response = view_notes_pb2.ViewNotesByTopicAndNameResponse()
        try:
            topic = request.topic
            notesTitle = request.notesTitle
            page = request.page
            limit = request.limit
            offset = request.offset
            
            notes_stub = notes_client.NotesClient().get_notes_stub()
            
            notes_by_topic_and_name_request = notes_pb2.ViewNotesByTopicAndNameRequest()
            notes_by_topic_and_name_request.topic = topic
            notes_by_topic_and_name_request.notesTitle = notesTitle
            notes_by_topic_and_name_request.page = page
            notes_by_topic_and_name_request.limit = limit
            notes_by_topic_and_name_request.offset = offset
            
            notes_by_topic_and_name_response = notes_stub.ViewNotesByTopicAndName(notes_by_topic_and_name_request)
            
            response.notes.extend(notes_by_topic_and_name_response.notes)
            response.count = notes_by_topic_and_name_response.count
            
            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving notes by topic and name',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def CanViewNote(self, request, context):
        response = view_notes_pb2.CanViewNoteResponse()
        try:
            note_id = request.note_id
            user_id = request.user_id
            
            notes_stub = notes_client.NotesClient().get_notes_stub()
            note_metadata_request = notes_pb2.RetrieveNoteMetadataRequest()
            note_metadata_request.fileId = note_id
            note_metadata_response = notes_stub.RetrieveNoteMetadata(note_metadata_request)
            response.can_view = note_metadata_response.noteMetadata.userId == user_id

            return response

        except Exception as e:
            error_utils.handle_error(
                context,
                'Error checking if user can view note',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )
