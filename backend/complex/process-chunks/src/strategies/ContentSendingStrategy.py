from abc import ABC, abstractmethod
import json
from content_pb2 import CreateTemporaryFlashcardRequest, CreateTemporaryMultipleChoiceQuestionRequest, MultipleChoiceQuestionOption


class ContentSendingStrategy(ABC):
    @abstractmethod
    def construct_request(self, message):
        pass

class FlashcardStrategy(ContentSendingStrategy):
    def construct_request(self, message, note_id):
        # Construct CreateTemporaryFlashcardRequest from message
        data = json.loads(message)
        return CreateTemporaryFlashcardRequest(
            note_id=note_id,
            question=data['question'],
            answer=data['answer']
        )

class MCQStrategy(ContentSendingStrategy):
    def construct_request(self, message,note_id):
        # Construct CreateTemporaryMultipleChoiceQuestionRequest from message
        data = json.loads(message)
        options = [MultipleChoiceQuestionOption(option=o['option'], is_correct=o['is_correct']) for o in data['options']]
        return CreateTemporaryMultipleChoiceQuestionRequest(
            note_id=note_id,
            question=data['question'],
            options=options
        )
