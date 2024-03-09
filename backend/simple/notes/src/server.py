import os
from concurrent import futures
import grpc
from dotenv import load_dotenv
from services.note_service import NoteServiceServicer
from utils.logger import get_logger
import notes_pb2_grpc
from config.settings import get_config

load_dotenv()
config = get_config()

logger = get_logger(__name__)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    notes_pb2_grpc.add_NoteServiceServicer_to_server(NoteServiceServicer(), server)
    
    port = config.PORT
    server.add_insecure_port(f'[::]:{port}')
    logger.info(f'Server starting on port {port}')
    
    try:
        server.start()
        server.wait_for_termination()
    except KeyboardInterrupt:
        logger.info('Server shutdown requested')
        server.stop(0)
    except Exception as e:
        logger.error(f'Unexpected error: {e}', exc_info=True)

if __name__ == '__main__':
    serve()
