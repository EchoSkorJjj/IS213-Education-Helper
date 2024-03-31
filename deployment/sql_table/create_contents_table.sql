CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS mcq (
    id UUID PRIMARY KEY,
    question text,
    options jsonb,
    multiple_answers boolean
);

CREATE TABLE IF NOT EXISTS flashcard (
    id UUID PRIMARY KEY,
    question text,
    answer text
);

CREATE TABLE IF NOT EXISTS contents_to_note (
    note_id UUID,
    content_id UUID,
    content_type text,

    PRIMARY KEY (note_id, content_id)
);