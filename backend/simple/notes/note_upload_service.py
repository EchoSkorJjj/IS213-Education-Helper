import os
import uuid
import grpc
import boto3
import mysql.connector
from mysql.connector import Error
import notes_pb2
import notes_pb2_grpc
from concurrent import futures
from dotenv import load_dotenv

# Directly specify your AWS credentials (Not recommended for production use)
# s3_client = boto3.client(
#     's3',
#     aws_access_key_id='',
#     aws_secret_access_key=''
# )
load_dotenv()

s3_client = boto3.client('s3')
bucket_name = 'eduhelper-s3notes-bucket'

# Database connection
try:
    db_conn = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database="my_notes_app"
    )
    db_cursor = db_conn.cursor()

    print("Successfully connected to the database")
except Error as e:
    print(f"Error connecting to MySQL database: {e}")

class NoteServiceServicer(notes_pb2_grpc.NoteServiceServicer):
    def UploadNote(self, request, context):
        # Generate a unique note ID
        note_id = str(uuid.uuid4())
        
        # Upload file to S3
        s3_object_key = f"{note_id}/{request.filename}"
        try:
            s3_client.put_object(Bucket=bucket_name, Key=s3_object_key, Body=request.fileContent)
        except Exception as e:
            context.set_details(f'Error uploading note to S3: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.UploadNoteResponse()

        # Save note metadata in the database
        try:
            db_cursor.execute(
                "INSERT INTO notes (user_id, filename, note_id) VALUES (%s, %s, %s)",
                (request.userId, request.filename, note_id)
            )
            db_conn.commit()
        except Exception as e:
            context.set_details(f'Error saving note metadata to the database: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.UploadNoteResponse()

        # Return the note ID
        return notes_pb2.UploadNoteResponse(noteId=note_id)

    def RetrieveNote(self, request, context):
        # Retrieve note metadata from the database
        try:
            db_cursor.execute(
                "SELECT user_id, filename FROM notes WHERE note_id = %s",
                (request.noteId,)
            )
            note_metadata = db_cursor.fetchone()
            if note_metadata:
                user_id, filename = note_metadata
            else:
                context.set_details('Note not found.')
                context.set_code(grpc.StatusCode.NOT_FOUND)
                return notes_pb2.RetrieveNoteResponse()
        except Exception as e:
            context.set_details(f'Error querying note metadata from the database: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.RetrieveNoteResponse()

        # Retrieve note content from S3
        s3_object_key = f"{request.noteId}/{filename}"
        try:
            s3_response = s3_client.get_object(Bucket=bucket_name, Key=s3_object_key)
            file_content = s3_response['Body'].read()
        except Exception as e:
            context.set_details(f'Error retrieving note from S3: {e}')
            context.set_code(grpc.StatusCode.INTERNAL)
            return notes_pb2.RetrieveNoteResponse()

        # Return the retrieved note content
        return notes_pb2.RetrieveNoteResponse(userId=user_id, filename=filename, fileContent=file_content)


# Function to add the servicer to the gRPC server
def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    notes_pb2_grpc.add_NoteServiceServicer_to_server(NoteServiceServicer(), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    serve()
