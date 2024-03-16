import uuid
import logging
import os

import pb.contents_pb2 as contents_pb2

import src.utils.flashcard_utils as flashcard_utils
import src.utils.mcq_utils as mcq_utils

def grpc_value_in_enum(enum_wrapper, value) -> bool:
    try:
        enum_wrapper.Value(value)
        return True
    except ValueError:
        return False

def db_content_to_grpc_object(note_id, content_type, content) -> contents_pb2.Flashcard | contents_pb2.MultipleChoiceQuestion:
    if not grpc_value_in_enum(contents_pb2.ContentType, content_type):
        raise ValueError(f"Invalid content type: {content.content_type}")
    
    if content_type == flashcard_utils.get_flashcard_content_type_name():
        return flashcard_utils.object_to_grpc_flashcard({'note_id': note_id, **content})
    
    return mcq_utils.object_to_grpc_mcq({'note_id': note_id, **content})

def create_response_metadata(context):
    metadata = dict(context.invocation_metadata())
    kong_id = metadata.get('kong-request-id', None)

    if kong_id is None:
        if os.getenv('ENVIRONMENT_MODE') != 'development':
            logging.error("Error creating response metadata: Kong ID not found in non-development mode")
            raise PermissionError("Kong ID not found in non-development mode")

        kong_id = str(uuid.uuid4())

    response_metadata = contents_pb2.ResponseMetadata()
    response_metadata.request_id = kong_id
    response_metadata.timestamp.GetCurrentTime()

    return response_metadata

def grpc_content_type_to_strrep(content_types) -> str:
    content_types_set = set()
    for value in content_types:
        content_types_set.add(contents_pb2.ContentType.Name(value))
    
    return content_types_set
