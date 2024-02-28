import asyncio
import uuid
import grpc
import file_processor_pb2
import file_processor_pb2_grpc
from google.protobuf import any_pb2

async def process_file_stub(user_id, file, filename, file_id):
    async with grpc.aio.insecure_channel('localhost:50053') as channel:
        stub = file_processor_pb2_grpc.FileProcessorStub(channel)
        request = file_processor_pb2.FileUploadRequest(
            userId=user_id,
            file=file,
            filename=filename,
            fileId=str(file_id)
        )
        response_wrapper = await stub.ProcessFile(request)
        
        # Unpack the response payload
        response_payload = file_processor_pb2.FileProcessResponse()
        if response_wrapper.payload.Is(response_payload.DESCRIPTOR):
            response_wrapper.payload.Unpack(response_payload)
            return response_payload
        else:
            return None  # Or handle error appropriately

async def main():
    with open("example.pdf", "rb") as pdf_file:
        input_pdf_bytes = pdf_file.read()
    user_id = str(uuid.uuid4())
    filename = "example.pdf"
    file_id = uuid.uuid4()
    
    response = await process_file_stub(user_id=user_id, file=input_pdf_bytes, filename=filename, file_id=file_id)
    if response:
        print("Successfully processed the file.")
        print(response)
    else:
        print("Failed to process the file.")

if __name__ == "__main__":
    asyncio.run(main())
