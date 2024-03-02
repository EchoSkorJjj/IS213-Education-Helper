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