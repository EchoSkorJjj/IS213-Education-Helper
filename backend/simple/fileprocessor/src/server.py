import logging
import grpc.aio
from concurrent import futures
import asyncio
from file_processor_service import FileProcessorServicer
from health_service import HealthServicer
import file_processor_pb2_grpc
import health_pb2_grpc

def setup_logging():
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

async def serve():
    setup_logging()
    # Create a gRPC server with no limit on message size
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10),options=[
        ('grpc.max_send_message_length', -1),
        ('grpc.max_receive_message_length', -1),
    ])
    file_processor_pb2_grpc.add_FileProcessorServicer_to_server(FileProcessorServicer(), server)
    health_pb2_grpc.add_HealthServicer_to_server(HealthServicer(), server)

    listen_addr = '[::]:50053'
    server.add_insecure_port(listen_addr)
    logging.info(f"Server starting on {listen_addr}")
    await server.start()
    await server.wait_for_termination()

if __name__ == '__main__':
    asyncio.run(serve())
