from strategies.prompt_construction_strategy import FlashcardPromptStrategy, MCQPromptStrategy

class PromptStrategyFactory:
    @staticmethod
    def get_strategy(generate_type):
        if generate_type == "flashcard":
            return FlashcardPromptStrategy()
        elif generate_type == "mcq":
            return MCQPromptStrategy()
        else:
            raise ValueError("Unsupported generate type")
