CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
    first_subscribed TIMESTAMP NOT NULL,
    subscribed_until TIMESTAMP NOT NULL,
    cancelled_at TIMESTAMP,
    status VARCHAR(255) NOT NULL
);