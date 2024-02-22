CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    filename VARCHAR(255),
    note_id VARCHAR(255),
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);