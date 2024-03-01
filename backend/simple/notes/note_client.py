import grpc
import uuid
import notes_pb2
import notes_pb2_grpc

def upload_note(stub, userId, noteId, file_content):
    # Create a request message
    request = notes_pb2.UploadNoteRequest(userId=userId, noteId=noteId, fileContent=file_content)
    # Make the call to the server
    response = stub.UploadNote(request)
    return response

def retrieve_note(stub, userId, noteId):
    # Create a request message
    request = notes_pb2.RetrieveNoteRequest(userId=userId, noteId=noteId)
    # Make the call to the server
    response = stub.RetrieveNote(request)
    return response

def run():
    with grpc.insecure_channel('localhost:50052') as channel:
        stub = notes_pb2_grpc.NoteServiceStub(channel)

        # Example usage: upload a PDF note
        userId = '123'
        noteId = str(uuid.uuid4())
        filename = 'example_note.pdf'  # Change to your PDF file name
        with open(filename, 'rb') as pdf_file:  # Open the PDF file in binary mode
            file_content = pdf_file.read()  # Read the entire PDF file content
        upload_response = upload_note(stub, userId, noteId, file_content)
        print(f"Uploaded Note ID: {upload_response.noteId}")

        # Example usage: retrieve a note
        retrieve_response = retrieve_note(stub, userId, noteId)
        
        # Save the retrieved note content as a file
        output_filename = f"retrieved_{filename}"  # Modify as needed
        with open(output_filename, 'wb') as output_file:
            output_file.write(retrieve_response.fileContent)
        print(f"Retrieved Note Content saved as {output_filename}")
if __name__ == '__main__':
    run()
