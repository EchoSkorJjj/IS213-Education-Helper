import os
from concurrent import futures
import grpc
from dotenv import load_dotenv
from services.note_service import NoteServiceServicer
from utils.logger import get_logger
import notes_pb2_grpc
from config.settings import get_config
import asyncio


load_dotenv()
config = get_config()

logger = get_logger(__name__)

async def serve():
    server = grpc.aio.server(futures.ThreadPoolExecutor(max_workers=10), options=[
        ('grpc.max_send_message_length', -1),
        ('grpc.max_receive_message_length', -1),
    ])
  
    notes_pb2_grpc.add_NoteServiceServicer_to_server(NoteServiceServicer(), server)
    
    port = config.PORT
    server.add_insecure_port(f'[::]:{port}')
    logger.info(f'Server starting on port {port}')
    
    try:
        await server.start()
        await server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info('Server shutdown requested')
        await server.stop(0)
    except Exception as e:
        logger.error(f'Unexpected error: {e}', exc_info=True)

if __name__ == '__main__':
    asyncio.run(serve())
