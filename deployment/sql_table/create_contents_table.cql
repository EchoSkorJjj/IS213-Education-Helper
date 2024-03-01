CREATE KEYSPACE IF NOT EXISTS contents_keyspace WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
USE contents_keyspace;

CREATE TYPE IF NOT EXISTS mcq_option (
    option text,
    is_correct boolean
);

CREATE TABLE IF NOT EXISTS contents (
    id UUID PRIMARY KEY,
    content_type text,
    question text,
    answer text,
    options list<frozen<mcq_option>>,
    multiple_answers boolean
);