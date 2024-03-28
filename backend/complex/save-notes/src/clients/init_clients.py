import os

import src.utils.grpc_utils as grpc_utils
import src.clients.users_client as users_client
import src.clients.notes_client as notes_client

def init_clients():
    contents_address = grpc_utils.get_grpc_client_address(os.getenv('USER_STORAGE_SERVICE_HOST'), os.getenv('USER_STORAGE_SERVICE_PORT'))
    notes_address = grpc_utils.get_grpc_client_address(os.getenv('NOTES_SERVICE_HOST'), os.getenv('NOTES_SERVICE_PORT'))

    users_client.UsersClient(contents_address)
    notes_client.NotesClient(notes_address)