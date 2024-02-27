CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    subscribed_until TIMESTAMP
);