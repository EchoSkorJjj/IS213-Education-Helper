import base64
import pb.view_notes_pb2 as view_notes_pb2

def get_grpc_client_address(service_name, service_port):
    return f"{service_name}:{service_port}"

def note_to_b64_note(note):
    return view_notes_pb2.B64Note(
        user_id=note.userId,
        file_id=note.fileId,
        file_content=base64.b64encode(note.fileContent).decode('utf-8')
    )