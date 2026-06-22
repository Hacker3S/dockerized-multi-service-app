-- Runs automatically on first container startup (mounted into /docker-entrypoint-initdb.d)

CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO items (name)
VALUES ('Sample Item 1'), ('Sample Item 2'), ('Sample Item 3')
ON CONFLICT DO NOTHING;
