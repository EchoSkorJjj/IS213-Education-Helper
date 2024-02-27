import asyncio
import grpc
import file_processor_pb2
import file_processor_pb2_grpc

async def process_file_stub(pdf_bytes, filename, file_id):
    async with grpc.aio.insecure_channel('localhost:50051') as channel:
        stub = file_processor_pb2_grpc.FileProcessorStub(channel)
        request = file_processor_pb2.FileUploadRequest(
            file=pdf_bytes,
            filename=filename,
            fileId=file_id
        )
        response = await stub.ProcessFile(request)
        return response

async def main():
    input_pdf_bytes = b'<PDF_BYTES_HERE>'  # Replace <PDF_BYTES_HERE> with actual PDF bytes
    filename = "example.pdf"
    file_id = "12345678-abcd-1234-abcd-1234567890ab"

    response = await process_file_stub(input_pdf_bytes, filename, file_id)
    print(response)

if __name__ == "__main__":
    asyncio.run(main())
