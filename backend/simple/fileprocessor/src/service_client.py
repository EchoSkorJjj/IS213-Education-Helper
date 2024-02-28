import asyncio
import uuid
import grpc
import file_processor_pb2
import file_processor_pb2_grpc

async def process_file_stub(user_id, file, filename, file_id):
    async with grpc.aio.insecure_channel('localhost:50053') as channel:
        stub = file_processor_pb2_grpc.FileProcessorStub(channel)
        request = file_processor_pb2.FileUploadRequest(
            userId=user_id,
            file=file,  # Use the correct parameter name based on your proto file definition
            filename=filename,
            fileId=str(file_id)  # Ensure file_id is a string
        )
        response = await stub.ProcessFile(request)
        return response

async def main():
    # Read the PDF file as bytes
    with open("example.pdf", "rb") as pdf_file:
        input_pdf_bytes = pdf_file.read()
    user_id = str(uuid.uuid4())
    filename = "example.pdf"
    file_id = uuid.uuid4()  # This will be converted to a string in the request
    print(type(input_pdf_bytes))

    # Correct the function call with proper argument names
    response = await process_file_stub(user_id=user_id, file=input_pdf_bytes, filename=filename, file_id=file_id)
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
