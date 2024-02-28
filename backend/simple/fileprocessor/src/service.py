# server.py
import logging
import grpc
from concurrent import futures
import asyncio
from file_processor_service import FileProcessorServicer
import file_processor_pb2_grpc
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

async def serve():
    """
    Asynchronously start the gRPC server and listen for requests.
    """
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    file_processor_pb2_grpc.add_FileProcessorServicer_to_server(FileProcessorServicer(), server)
    
    # Listen on port 50053
    server.add_insecure_port('[::]:50053')
    await server.start()
    logging.info("Server started, listening on port 50053 without TLS security.")
    await server.wait_for_termination()

if __name__ == '__main__':
    asyncio.run(serve())
