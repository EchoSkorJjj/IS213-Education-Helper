import os
import logging

import dotenv

from src.server.server import Server

def main():
    server: 'Server' = Server()
    server.start()

if __name__ == '__main__':
    dotenv.load_dotenv()
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    main()