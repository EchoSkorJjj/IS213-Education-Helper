CREATE KEYSPACE IF NOT EXISTS contents_keyspace WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
USE contents_keyspace;

CREATE TYPE IF NOT EXISTS mcq_option (
    option text,
    is_correct boolean
);

CREATE TABLE IF NOT EXISTS mcq (
    id UUID PRIMARY KEY,
    question text,
    options list<frozen<mcq_option>>,
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