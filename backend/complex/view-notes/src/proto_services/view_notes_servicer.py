import grpc

import pb.view_notes_pb2 as view_notes_pb2
import pb.view_notes_pb2_grpc as view_notes_pb2_grpc
import pb.contents_pb2 as contents_pb2
import pb.notes_pb2 as notes_pb2

import src.utils.error_utils as error_utils
import src.clients.notes_client as notes_client
import src.clients.contents_client as contents_client

class ViewNotesServicer(view_notes_pb2_grpc.ViewNotesServicer):
    def ViewOneNote(self, request, context):
        response = view_notes_pb2.ViewOneNoteResponse()
        try:
            note_id = request.note_id
            notes_stub = notes_client.NotesClient().get_notes_stub()
            contents_stub = contents_client.ContentsClient().get_contents_stub()

            note_request = notes_pb2.RetrieveNoteRequest()
            note_request.noteId = note_id
            note_response = notes_stub.RetrieveNote(note_request)

            content_request = contents_pb2.GetSavedContentsRequest()
            content_request.note_id = note_id
            content_request.content_type.extend([contents_pb2.ContentType.FLASHCARD, contents_pb2.ContentType.MCQ])
            content_response = contents_stub.GetSavedContents(content_request)

            retrieved_note = view_notes_pb2.Note()
            retrieved_note.user_id = note_response.userId
            retrieved_note.filename = note_response.filename
            retrieved_note.file_content = note_response.fileContent

            response.note.CopyFrom(retrieved_note)
            response.associated_contents.flashcards.extend(content_response.flashcards)
            response.associated_contents.mcqs.extend(content_response.mcqs)

            return response
        except Exception as e:
            error_utils.handle_error(
                context,
                'Error retrieving note',
                grpc.StatusCode.INVALID_ARGUMENT,
                e
            )

    def ViewAllNotes(self, request, context):
        return grpc.StatusCode.UNIMPLEMENTED