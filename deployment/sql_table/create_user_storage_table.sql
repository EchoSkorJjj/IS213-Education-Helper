CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE user_storage_table (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(50) DEFAULT 'User',
    profile_pic VARCHAR(255) DEFAULT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)