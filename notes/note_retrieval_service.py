from concurrent import futures
import grpc
import notes_pb2
import notes_pb2_grpc
import boto3

class NoteRetrievalServiceServicer(notes_pb2_grpc.NoteRetrievalServiceServicer):
    def RetrieveNote(self, request, context):
        # Example logic for retrieving note metadata from a database
        # This is a placeholder; actual database interaction would depend on your database setup
        note_metadata = {
            'userId': 'exampleUserId',
            'filename': 'exampleFilename',
            'noteId': request.noteId
        }

        # Fetch the note content from AWS S3
        s3_client = boto3.client('s3')
        s3_bucket_name = 'your-bucket-name'
        s3_object_key = f"{request.noteId}/{note_metadata['filename']}"
        
        try:
            s3_response = s3_client.get_object(Bucket=s3_bucket_name, Key=s3_object_key)
            file_content = s3_response['Body'].read()
        except Exception as e:
            context.set_details(f'Error retrieving note from S3: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.RetrieveNoteResponse()

        # Construct the response with the note content and metadata
        return notes_pb2.RetrieveNoteResponse(
            userId=note_metadata['userId'],
            filename=note_metadata['filename'],
            fileContent=file_content
        )

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    notes_pb2_grpc.add_NoteRetrievalServiceServicer_to_server(NoteRetrievalServiceServicer(), server)
    server.add_insecure_port('[::]:50052')  # Use a different port if running on the same machine as the upload service
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
