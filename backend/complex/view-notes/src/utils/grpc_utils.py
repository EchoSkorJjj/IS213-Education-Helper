import base64

import pb.view_notes_pb2 as view_notes_pb2

def get_grpc_client_address(service_name, service_port):
    return f"{service_name}:{service_port}"

def kong_request_id_critically_missing(metadata, environment, method):
    return 'kong-request-id' not in metadata and environment != 'development' and method != '/grpc.health.v1.Health/Check'

def note_to_b64_note(note):
    return view_notes_pb2.B64Note(
        user_id=note.userId,
        file_id=note.fileId,
        file_content=base64.b64encode(note.fileContent).decode('utf-8'),
        file_name=note.fileName,
        title=note.title,
        topic=note.topic
    )
