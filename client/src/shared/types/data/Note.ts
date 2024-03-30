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

export interface NotePreview {
  userId: string;
  fileId: string;
  fileName: string;
  title: string;
  topic: string;
  sizeInBytes: number;
  numPages: number;
  generateType: string;
}

export interface GetContentResponse {
  note: Note;
  associated_contents: ContentType;
}

export interface FlashcardTypeWrapper {
  flashcard: FlashcardType;
}

export interface MultipleChoiceQuestionTypeWrapper {
  mcq: MultipleChoiceQuestion;
}

export interface GetTemporaryContentsResponse {
  contents: FlashcardTypeWrapper[] | MultipleChoiceQuestionTypeWrapper[];
}

export interface UpdateTemporaryContentsResponse {
  success: boolean;
  updated_content: {
    content: string;
    flashcard?: FlashcardType;
    mcq?: MultipleChoiceQuestion;
  };
}

export interface DeleteTemporaryContentsResponse {
  success: boolean;
  deleted_content: {
    content: string;
    flashcard?: FlashcardType;
    mcq?: MultipleChoiceQuestion;
  };
}

export interface DeleteAllTemporaryContentsResponse {
  success: boolean;
  deleted_contents: {
    content: string;
    flashcard?: FlashcardType;
    mcq?: MultipleChoiceQuestion;
  }[];
}

export interface CreateTemporaryContentResponse {
  success: boolean;
  created_content: {
    content: string;
    flashcard?: FlashcardType;
    mcq?: MultipleChoiceQuestion;
  };
}

export interface SaveNotesResponse {
  success: boolean;
  saved_files_ids: string[];
}

export interface CreatedNotesResponse {
  count: number;
  next_page: number;
  notes_and_contents: GetContentResponse[];
}

export interface Topic {
  value: string;
  label: string;
}