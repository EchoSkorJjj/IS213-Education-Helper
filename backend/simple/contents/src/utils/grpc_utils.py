import uuid
import logging
import os

import pb.contents_pb2 as contents_pb2

def db_content_to_grpc_object(content) -> contents_pb2.Flashcard | contents_pb2.MultipleChoiceQuestion:
    if content.type not in contents_pb2.ContentType.values_by_name:
        raise ValueError(f"Unknown content type: {content.type}")
    
    if content.type == contents_pb2.ContentType.FLASHCARD:
        return contents_pb2.Flashcard(
            id=content.id,
            type=content.type,
            question=content.question,
            answer=content.answer,
            created_at=content.created_at,
            updated_at=content.updated_at
        )
    
    return contents_pb2.MultipleChoiceQuestion(
        id=content.id,
        type=content.type,
        question=content.question,
        options=content.options,
        answer=content.answer,
        created_at=content.created_at,
        updated_at=content.updated_at
    )

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
