import grpc
import logging
import file_processor_pb2_grpc
import file_processor_pb2
from ocr_processing import process_pdf_file
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv
from google.protobuf.timestamp_pb2 import Timestamp

load_dotenv()

class FileProcessorServicer(file_processor_pb2_grpc.FileProcessorServicer):
    def __init__(self):
        self.environment_mode = os.getenv('ENVIRONMENT_MODE', 'development')
        self.setup_logging()

    def setup_logging(self):
        if self.environment_mode.lower() == 'production':
            logging_level = logging.INFO
        else:
            logging_level = logging.DEBUG
        logging.basicConfig(level=logging_level, format='%(asctime)s - %(levelname)s - %(message)s')

    def ProcessFile(self, request, context):
        file_id = str(uuid.uuid4()) if not request.fileId else request.fileId
        logging.info(f"Processing file with ID: {file_id}")
        
        kong_request_id = self.extract_kong_request_id(request, context)
        if self.environment_mode.lower() == 'production' and not kong_request_id:
            return self.abort_request(context, "Missing required 'kong-request-id' in metadata for production mode.")

        try:
            texts, metadata = process_pdf_file(request.file, request.filename)
            return self.create_response(file_id, texts, metadata, kong_request_id)
        except Exception as e:
            logging.error(f"Error processing file {file_id}: {str(e)}", exc_info=True)
            return self.abort_request(context, "Internal server error occurred.")

    def extract_kong_request_id(self, request, context):
        metadata = dict(context.invocation_metadata())
        return metadata.get('kong-request-id')

    def create_response(self, file_id, texts, metadata, kong_request_id):
        pages = [file_processor_pb2.Page(pageId=p["pageId"], content=p["content"]) for p in texts]
        file_metadata = file_processor_pb2.FileMetadata(**metadata)
        response_payload = file_processor_pb2.FileProcessResponse(fileId=file_id, metadata=file_metadata, pages=pages)
        
        response_wrapper = file_processor_pb2.ServiceResponseWrapper()
        response_wrapper.metadata.request_id = kong_request_id or str(uuid.uuid4())
        
        timestamp = Timestamp()
        timestamp.FromDatetime(datetime.now())
        response_wrapper.metadata.timestamp.CopyFrom(timestamp)
        
        response_wrapper.payload.Pack(response_payload)
        return response_wrapper

    def abort_request(self, context, message):
        context.abort(grpc.StatusCode.INTERNAL, message)
