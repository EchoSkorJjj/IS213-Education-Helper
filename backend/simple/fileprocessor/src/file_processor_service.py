from google.protobuf import any_pb2
import file_processor_pb2
import file_processor_pb2_grpc
from ocr_processing import process_pdf_file
import grpc
import uuid
from google.protobuf.timestamp_pb2 import Timestamp
from datetime import datetime

class FileProcessorServicer(file_processor_pb2_grpc.FileProcessorServicer):
    def ProcessFile(self, request, context):
        file_id = request.fileId
        filename = request.filename
        input_pdf_bytes = request.file
        
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
            response_wrapper.metadata.request_id = str(uuid.uuid4()) #todo fix and discuss
            response_wrapper.metadata.timestamp.FromDatetime(datetime.now())
            response_wrapper.payload.Pack(response_payload)
            
            return response_wrapper
        except Exception as e:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(e))
            return file_processor_pb2.ServiceResponseWrapper()  # Return an empty wrapper in case of error
