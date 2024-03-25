import pb.contents_pb2 as contents_pb2

import src.utils.error_utils as error_utils

def get_flashcard_key(note_id: str) -> str:
    return f"{note_id}:flashcards"

def flashcard_has_missing_fields(flashcard: dict) -> bool:
    return any([not flashcard[field] for field in flashcard])

def construct_flashcard(req) -> object:
    try:
        flashcard_obj = {
            'question': req.question,
            'answer': req.answer
        }

        return flashcard_obj
    except AttributeError as e:
        raise e

def object_to_grpc_flashcard(obj):
    flashcard = contents_pb2.Flashcard()

    try:
        flashcard.id = str(obj['id'])
        flashcard.note_id = str(obj['note_id'])
        flashcard.question = obj['question']
        flashcard.answer = obj['answer']
        
        return flashcard
    except KeyError as e:
        raise error_utils.construct_key_error(e)

def get_flashcard_content_type_name():
    return contents_pb2.ContentType.Name(contents_pb2.ContentType.FLASHCARD)

def get_flashcard_content_type_number():
    return contents_pb2.ContentType.FLASHCARD