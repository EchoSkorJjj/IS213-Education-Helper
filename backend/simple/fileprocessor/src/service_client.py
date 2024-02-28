# client.py
import asyncio
import grpc
import logging
import file_processor_pb2
import file_processor_pb2_grpc
from google.protobuf import any_pb2
from google.protobuf.timestamp_pb2 import Timestamp
import uuid

# Configure client-side logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

async def process_file_stub(user_id, file, filename, file_id):
    async with grpc.aio.insecure_channel('localhost:50053') as channel:
        stub = file_processor_pb2_grpc.FileProcessorStub(channel)
        request = file_processor_pb2.FileUploadRequest(userId=user_id, file=file, filename=filename, fileId=str(file_id))
        try:
            response_wrapper = await stub.ProcessFile(request)
            response_payload = None
            if response_wrapper.payload.Is(file_processor_pb2.FileProcessResponse.DESCRIPTOR):
                response_payload = file_processor_pb2.FileProcessResponse()
                response_payload.ParseFromString(response_wrapper.payload.value)
            else:
                logging.error("Unexpected payload type.")
            return response_wrapper, response_payload
        except grpc.aio.AioRpcError as e:
            logging.error(f"GRPC Error: {e.code()} - {e.details()}", exc_info=True)
            print(f"Failed to process file: {e.details()}")
            return None, None

async def main():
    with open("example.pdf", "rb") as pdf_file:
        input_pdf_bytes = pdf_file.read()
    user_id = str(uuid.uuid4())
    filename = "example.pdf"
    file_id = uuid.uuid4()
    
    response,payload = await process_file_stub(user_id=user_id, file=input_pdf_bytes, filename=filename, file_id=file_id)
    if response:
        print("Successfully processed the file.")
        print(response.metadata)
        print(payload)
    else:
        print("Error occurred during file processing.")

if __name__ == "__main__":
    asyncio.run(main())
