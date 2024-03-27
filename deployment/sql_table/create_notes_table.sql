CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    size_in_bytes INT NOT NULL,
    num_pages INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    topic VARCHAR(255) NOT NULL
);

INSERT INTO notes (user_id, file_name, size_in_bytes, num_pages, title, topic)
VALUES 
('536217b2-17c7-4e84-880a-4cba12a4eabd', 'note1.pdf', 1024, 3, 'Note 1', 'Topic 1'),
('536217b2-17c7-4e84-880a-4cba12a4eabd', 'note2.pdf', 2048, 5, 'Note 2', 'Topic 2'),
('536217b2-17c7-4e84-880a-4cba12a4eabd', 'note3.pdf', 4096, 10, 'Note 3', 'Topic 3');
