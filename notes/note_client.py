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
    with grpc.insecure_channel('localhost:50052') as channel:
        stub = notes_pb2_grpc.NoteServiceStub(channel)

        # Example usage: upload a PDF note
        user_id = '123'
        filename = 'example_note.pdf'  # Change to your PDF file name
        with open(filename, 'rb') as pdf_file:  # Open the PDF file in binary mode
            file_content = pdf_file.read()  # Read the entire PDF file content
        upload_response = upload_note(stub, user_id, filename, file_content)
        print(f"Uploaded Note ID: {upload_response.noteId}")

        # Example usage: retrieve a note
        # Note: You need to implement this part on the server side for it to work
        note_id = upload_response.noteId
        retrieve_response = retrieve_note(stub, note_id)
        # print(f"Retrieved Note Content: {retrieve_response.fileContent}")

if __name__ == '__main__':
    run()
