import grpc
from concurrent import futures

import pb.save_notes_pb2 as save_notes_pb2
import pb.save_notes_pb2_grpc as save_notes_pb2_grpc
import pb.user_storage_pb2 as user_storage_pb2
import pb.user_storage_pb2_grpc as user_storage_pb2_grpc
import pb.notes_pb2 as notes_pb2
import pb.notes_pb2_grpc as notes_pb2_grpc

import src.utils.error_utils as error_utils

# Assuming you have a database or some form of storage for the notes
import src.clients.notes_client as notes_storage
import src.clients.users_client as users_storage

class SaveNotesServicer(save_notes_pb2_grpc.SaveNotesServicer):
    def SaveNotes(self, request, context):
        try:
            user_id = request.user_id
            file_ids = request.file_ids  
            notes_stub = notes_storage.NotesClient().get_notes_stub()  
            users_stub = users_storage.UsersClient().get_user_storage_stub()  
            
            all_notes_exist = True
            for file_id in file_ids:
                note_request = notes_pb2.RetrieveNoteMetadataRequest()
                note_request.fileId = file_id
                note_response = notes_stub.RetrieveNoteMetadata(note_request)
                if not note_response.noteMetadata:
                    all_notes_exist = False
                    break
            
            if all_notes_exist:
                user_request = user_storage_pb2.SaveNoteRequest()
                user_request.user_id = user_id
                user_request.notes_ids.extend(file_ids) 
                user_response = users_stub.SaveNote(user_request)
                if user_response.success:
                    return save_notes_pb2.SaveNotesResponse(saved_file_ids=file_ids, success=True)
                else:
                    return save_notes_pb2.SaveNotesResponse(success=False)
            else:
                return save_notes_pb2.SaveNotesResponse(success=False)
        except Exception as e:
            error_utils.handle_error(context, 'Error saving note', grpc.StatusCode.INTERNAL, e)
            return save_notes_pb2.SaveNoteResponse(success=False)


    def DeleteSavedNote(self, request, context):
        try:
            user_id = request.user_id
            note_id = request.file_id  # Note the change to file_id
            users_stub = users_storage.UsersClient().get_user_storage_stub()  

            # Directly calling delete without checking if the note exists
            user_request = user_storage_pb2.DeleteSavedNoteRequest()
            user_request.user_id = user_id
            user_request.note_id = note_id
            user_response = users_stub.DeleteSavedNote(user_request)

            return save_notes_pb2.DeleteSavedNoteResponse(success=user_response.success)
        except Exception as e:
            error_utils.handle_error(context, 'Error deleting note', grpc.StatusCode.INTERNAL, e)
            return save_notes_pb2.DeleteNoteResponse(success=False)


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    save_notes_pb2_grpc.add_SaveNotesServicer_to_server(SaveNotesServicer(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
