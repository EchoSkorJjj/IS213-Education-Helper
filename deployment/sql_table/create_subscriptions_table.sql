CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    subscribed_until TIMESTAMP
);