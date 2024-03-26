export interface FlashcardType {
  id: string;
  note_id: string;
  question: string;
  answer: string;
}

export interface MultipleChoiceQuestionOption {
  option: string;
  is_correct: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  note_id: string;
  question: string;
  options: MultipleChoiceQuestionOption[];
  multiple_answers: boolean;
}

export interface ContentType {
  flashcards: FlashcardType[];
  mcqs: MultipleChoiceQuestion[];
}

export interface Note {
  user_id: string;
  file_id: string;
  file_content: string;
  title: string;
  topic: string;
  file_name: string;
}

export interface GetContentResponse {
  note: Note;
  associated_contents: ContentType;
}
