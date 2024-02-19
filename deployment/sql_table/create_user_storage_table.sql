CREATE TABLE user_storage_table (
    user_id UUID PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(50),
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)