import grpc
import notes_pb2
import notes_pb2_grpc

def upload_note(stub, user_id, filename, file_content):
    # Create a request message
    request = notes_pb2.UploadNoteRequest(userId=user_id, filename=filename, fileContent=file_content)
    # Make the call to the server
    response = stub.UploadNote(request)
    return response

def retrieve_note(stub, note_id):
    # Create a request message
    request = notes_pb2.RetrieveNoteRequest(noteId=note_id)
    # Make the call to the server
    response = stub.RetrieveNote(request)
    return response

def run():
    # Update with the appropriate server address and port
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = notes_pb2_grpc.NoteServiceStub(channel)

        # Example usage: upload a note
        user_id = '123'
        filename = 'example_note.txt'
        file_content = b'This is the content of the note.'
        try:
            upload_response = upload_note(stub, user_id, filename, file_content)
            print(f"Uploaded Note ID: {upload_response.noteId}")

            # Assuming the UploadNote is successful and returns a valid noteId
            if upload_response.noteId:
                # Example usage: retrieve a note
                # Note: Ensure the RetrieveNote method is implemented on the server
                note_id = upload_response.noteId
                try:
                    retrieve_response = retrieve_note(stub, note_id)
                    # Adjust according to the actual fields returned by your RetrieveNote method
                    print(f"Retrieved Note Content: {retrieve_response.fileContent}")
                except grpc.RpcError as e:
                    print(f"Failed to retrieve note: {e.details()}")
            else:
                print("UploadNote did not return a valid noteId.")
        except grpc.RpcError as e:
            print(f"Failed to upload note: {e.details()}")

if __name__ == '__main__':
    run()
