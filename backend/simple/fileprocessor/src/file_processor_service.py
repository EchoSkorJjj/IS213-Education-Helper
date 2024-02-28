# file_processor_service.py
import grpc
import logging
import file_processor_pb2_grpc
import file_processor_pb2
from ocr_processing import process_pdf_file
from datetime import datetime
import uuid
import os

class FileProcessorServicer(file_processor_pb2_grpc.FileProcessorServicer):
    def ProcessFile(self, request, context):
        file_id = request.fileId
        filename = request.filename
        input_pdf_bytes = request.file
        environment_mode = os.getenv('ENVIRONMENT_MODE', 'development')  # Default to development if not set
        
        # Check for kong-request-id in metadata if the mode is production
        request_metadata = None
        if environment_mode.lower() == 'production':
            if 'kong-request-id' not in request.metadata or not request.metadata['kong-request-id']:
                context.abort(
                    code=grpc.StatusCode.INVALID_ARGUMENT,
                    details="Missing required 'kong-request-id' in metadata for production mode.",
                )
            request_metadata = request.metadata
        
        try:
            texts, metadata = process_pdf_file(input_pdf_bytes, filename)
            pages = [file_processor_pb2.Page(pageId=p["pageId"], content=p["content"]) for p in texts]
            file_metadata = file_processor_pb2.FileMetadata(title=metadata["title"],
                                                            pageCount=metadata["pageCount"],
                                                            filesize=metadata["filesize"],
                                                            locale=metadata["locale"])
            response_payload = file_processor_pb2.FileProcessResponse(fileId=file_id, metadata=file_metadata, pages=pages)
            
            # Wrap the response payload in ServiceResponseWrapper
            response_wrapper = file_processor_pb2.ServiceResponseWrapper()
            kong_request_id = request.metadata.get('kong-request-id') if request_metadata else  str(uuid.uuid4())
            response_wrapper.metadata.request_id = kong_request_id
            response_wrapper.metadata.timestamp.FromDatetime(datetime.now())
            response_wrapper.payload.Pack(response_payload)
            
            return response_wrapper
        except Exception as e:
            logging.error(f"Error processing file {file_id}: {str(e)}", exc_info=True)
            
            # Use standard gRPC status codes and metadata for error handling
            context.abort(
                code=grpc.StatusCode.INTERNAL,
                details="Internal server error occurred.",
                metadata=(('error-details', str(e)),)  # Include the exception message in error-details
            )
