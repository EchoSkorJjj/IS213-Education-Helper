import json
from abc import ABC, abstractmethod

class PromptConstructionStrategy(ABC):
    @abstractmethod
    def construct_prompt(self, message_from_queue1, messages_from_queue2):
        pass

class FlashcardPromptStrategy(PromptConstructionStrategy):
    def construct_prompt(self, message_from_queue1, messages_from_queue2):
        message_data = json.loads(message_from_queue1)
        additional_context = ", ".join(messages_from_queue2)
        prompt = f"""Generate twenty flashcards that highlight essential information on the subject, drawn from clear and relevant portions of the text. Focus on diverse concepts, definitions, and findings, ensuring each flashcard:

Provides a detailed answer, aiming for undergraduate-level depth where applicable.
Exclude any obfuscated or nonsensical text, and select content from various sections to cover the topic comprehensively. Aim for minimal token use in your response without sacrificing content quality unless the topic is straightforward.

Format your responses as json:

{{
    "question": "What is the significance of [specific concept] in [subject]?",
    "answer": "The significance lies in..."
}},
...

{additional_context}"""
        return prompt


class MCQPromptStrategy(PromptConstructionStrategy):
    def construct_prompt(self, message_from_queue1, messages_from_queue2):
        message_data = json.loads(message_from_queue1)
        additional_context = ", ".join(messages_from_queue2)
        prompt = f"""Generate twenty MCQs that highlight essential information on the subject, drawn from clear and relevant portions of the text. Focus on diverse concepts, definitions, and findings, ensuring each MCQ:

Provides a detailed answer, aiming for undergraduate-level depth where applicable.
Exclude any obfuscated or nonsensical text, and select content from various sections to cover the topic comprehensively. Aim for minimal token use in your response without sacrificing content quality unless the topic is straightforward.

Format your responses as json:

{{
"question": "What is the capital of France?",
"options": [
    {{
    "option": "Paris",
    "is_correct": true
    }},
    ...
],
"multiple_answers": false
}}

{additional_context}"""
        return prompt