# server.py
import grpc
from concurrent import futures
import asyncio
from file_processor_service import FileProcessorServicer
import file_processor_pb2_grpc

async def serve():
    """
    Asynchronously start the gRPC server and listen for requests.
    """
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10))
    file_processor_pb2_grpc.add_FileProcessorServicer_to_server(FileProcessorServicer(), server)
    
    # Listen on port 50053
    server.add_insecure_port('[::]:50053')
    await server.start()
    print("Server started, listening on port 50053.")
    await server.wait_for_termination()

if __name__ == '__main__':
    asyncio.run(serve())
