import os
import uuid
import grpc
import boto3
import notes_pb2
import notes_pb2_grpc
from concurrent import futures
from dotenv import load_dotenv

load_dotenv()

s3_client = boto3.client('s3')
bucket_name = 'eduhelper-s3notes-bucket'

class NoteServiceServicer(notes_pb2_grpc.NoteServiceServicer):
    def UploadNote(self, request, context):
        
        # Upload file to S3
        s3_object_key = f"{request.userId}/{request.noteId}"
        try:
            s3_client.put_object(Bucket=bucket_name, Key=s3_object_key, Body=request.fileContent)
        except Exception as e:
            context.set_details(f'Error uploading note to S3: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.UploadNoteResponse()

        # Return the note ID
        return notes_pb2.UploadNoteResponse(noteId=request.noteId)

    def RetrieveNote(self, request, context):
        # Retrieve note content from S3
        s3_object_key = f"{request.userId}/{request.noteId}"
        try:
            s3_response = s3_client.get_object(Bucket=bucket_name, Key=s3_object_key)
            file_content = s3_response['Body'].read()
        except Exception as e:
            context.set_details(f'Error retrieving note from S3: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.RetrieveNoteResponse()

        # Return the retrieved note content
        return notes_pb2.RetrieveNoteResponse(userId=request.userId, fileContent=file_content)


# Function to add the servicer to the gRPC server
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    notes_pb2_grpc.add_NoteServiceServicer_to_server(NoteServiceServicer(), server)
    server.add_insecure_port('[::]:'+os.getenv('PORT', '50052'))
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
