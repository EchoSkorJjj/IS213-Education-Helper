import asyncio
import grpc
import logging
import file_processor_pb2
import file_processor_pb2_grpc
import uuid

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

async def process_file_test(user_id, file_path, filename, file_id, channel_options):
    try:
        with open(file_path, 'rb') as file:
            file_content = file.read()
    except FileNotFoundError:
        logging.error(f"File {file_path} not found.")
        return False

    # Establish gRPC channel and process file
    async with grpc.aio.insecure_channel('localhost:50053', options=channel_options) as channel:
        stub = file_processor_pb2_grpc.FileProcessorStub(channel)
        request = file_processor_pb2.FileUploadRequest(userId=user_id, file=file_content, filename=filename, fileId=str(file_id))
        try:
            response_wrapper = await stub.ProcessFile(request)
            logging.info(f"Successfully processed {filename}.")
            return True  # Indicate success
        except grpc.aio.AioRpcError as e:
            logging.error(f"Failure processing {filename}: {e.details()}")
            return False  # Indicate failure

async def file_type_test(channel_options):
    test_files = [
        ("file1.pdf", "Valid PDF"),
        ("file2.pdf", "Valid PDF with complex layout"),
        ("file3.pdf", "Valid PDF with non english char"),
        ("file4.pdf", "Valid PDF with complex layout and non english char"),
        ("file5.jpg", "JPG image file"),
        ("file6.png", "No resolution metadata PNG image file"),
        ("file7.exe", "Unsupported executable file"),
        ("file8.zip", "Unsupported archive file"),
        ("file9_corrupt.pdf", "Corrupt PDF file"),
        ("file10_malicious.pdf", "PDF with potential security threat"),
    ]
    user_id = str(uuid.uuid4())

    for file_path, description in test_files:
        file_id = uuid.uuid4()
        success = await process_file_test(user_id, file_path, file_path, file_id, channel_options)
        if success:
            logging.info(f"Test passed for {description}")
        else:
            logging.error(f"Test failed for {description}")

async def main():
    channel_options = [
        ('grpc.keepalive_time_ms', 30000),
        ('grpc.keepalive_timeout_ms', 10000),
        ('grpc.keepalive_permit_without_calls', True),
        ('grpc.http2.min_time_between_pings_ms', 30000),
        ('grpc.http2.min_ping_interval_without_data_ms', 5000),
    ]
    await file_type_test(channel_options)

if __name__ == "__main__":
    asyncio.run(main())
