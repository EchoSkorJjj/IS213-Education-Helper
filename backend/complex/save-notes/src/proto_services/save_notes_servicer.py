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
    def SaveNote(self, request, context):
        try:
            user_id = request.user_id
            note_ids = request.notes_ids  
            notes_stub = notes_storage.get_notes_stub()
            users_stub = users_storage.get_users_storage_stub()
            
            # check if note exists
            for note_id in note_ids:
                note_request = notes_pb2.RetrieveNoteRequest()
                note_request.fileId = note_id
                note_response = notes_stub.RetrieveNoteMetaData(note_request)
                if note_response.success == True:
                    user_request = user_storage_pb2.SaveNotesRequest()
                    user_request.user_id = user_id
                    user_request.note_ids.extend(note_ids)
                    user_response = users_stub.SaveNotes(user_request)
                    return save_notes_pb2.SaveNoteResponse(success=user_response.success)
        except Exception as e:
            error_utils.handle_error(context, 'Error saving note', grpc.StatusCode.INTERNAL, e)
            return save_notes_pb2.SaveNoteResponse(success=False)


    def DeleteSavedNote(self, request, context):
        try:
            user_id = request.user_id
            note_ids = request.notes_ids  
            notes_stub = notes_storage.get_notes_stub()
            users_stub = users_storage.get_users_storage_stub()
            
            # check if note exists
            for note_id in note_ids:
                note_request = notes_pb2.RetrieveNoteRequest()
                note_request.fileId = note_id
                note_response = notes_stub.RetrieveNoteMetaData(note_request)
                if note_response.success == True:
                    user_request = user_storage_pb2.DeleteNotesRequest()
                    user_request.user_id = user_id
                    user_request.note_ids.extend(note_ids)
                    user_response = users_stub.DeleteNotes(user_request)
                    return save_notes_pb2.DeleteNoteResponse(success=user_response.success)
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
