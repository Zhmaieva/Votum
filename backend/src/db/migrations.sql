CREATE DATABASE poll_app;

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_profiles (
   user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
   followers_number INT DEFAULT 0,
   image TEXT DEFAULT 'https://example.com/default-avatar.jpg'
);

CREATE TABLE polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_by UUID REFERENCES users(id),
    question VARCHAR(50) NOT NULL,
    votes_number INT DEFAULT 0,
    ends_in TIMESTAMPTZ NOT NULL
);

CREATE TABLE poll_answer_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES polls(id),
    text VARCHAR(50) NOT NULL
);

ALTER TABLE user_profiles ADD COLUMN bio TEXT DEFAULT 'Find me on other social media';

CREATE TABLE poll_likes (
    user_id UUID NOT NULL,            -- ID of the user who liked the poll
    poll_id UUID NOT NULL,            -- ID of the poll that was liked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp when the like was created

-- Foreign keys to reference users and polls
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_poll FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,

-- Unique constraint to ensure each (user_id, poll_id) pair is unique
    CONSTRAINT unique_user_poll UNIQUE (user_id, poll_id)
);

CREATE TABLE user_follows(
    user_follower_id UUID NOT NULL,
    user_follow_id UUID NOT NULL,

    CONSTRAINT fk_user_follower FOREIGN KEY (user_follower_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_follow FOREIGN KEY (user_follow_id) REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT unique_user_follows UNIQUE (user_follower_id, user_follow_id)
);

CREATE TABLE activation_codes(
    email VARCHAR NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    code VARCHAR NOT NULL
);

ALTER TABLE activation_codes
    ADD COLUMN attempts_made INT DEFAULT 0;

ALTER TABLE activation_codes
    ADD CONSTRAINT unique_activation_code_email UNIQUE (email);

--Tue Apr 8 12:00
ALTER TABLE activation_codes
    ADD COLUMN sent_on TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC');

ALTER TABLE polls
    ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false;

--Wed Apr 9 22:00
ALTER TABLE user_profiles
    ADD COLUMN following_number INT DEFAULT 0;

--Thu Apr 10 14:00
ALTER TABLE poll_answer_options
    DROP CONSTRAINT poll_answer_options_poll_id_fkey;

ALTER TABLE poll_answer_options
    ADD CONSTRAINT poll_answer_options_poll_id_fkey
        FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE;

ALTER TABLE poll_answer_options
    ADD COLUMN option_order INT NOT NULL DEFAULT 0;

/*
 INSERT INTO polls (created_by, question, votes_number, ends_in) VALUES
-- Favorite color
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'What is your favorite color?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),

-- Favorite city
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'Which city would you love to visit?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),

-- Best ice cream flavor
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'What is the best ice cream flavor?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),

-- What to eat now
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'What should I eat now?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),

-- Random topics
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'Cats or dogs?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'Which superhero is the best?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'Best way to start the day?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days')),
((SELECT id FROM users ORDER BY RANDOM() LIMIT 1), 'Tea or Coffee?', FLOOR(RANDOM() * 1000000), NOW() + INTERVAL '3 days' + (RANDOM() * INTERVAL '27 days'))
RETURNING id;

 INSERT INTO poll_answer_options (poll_id, text) VALUES
-- Favorite color
((SELECT id FROM polls WHERE question = 'What is your favorite color?' LIMIT 1), 'Red'),
((SELECT id FROM polls WHERE question = 'What is your favorite color?' LIMIT 1), 'Blue'),
((SELECT id FROM polls WHERE question = 'What is your favorite color?' LIMIT 1), 'Green'),
((SELECT id FROM polls WHERE question = 'What is your favorite color?' LIMIT 1), 'Black'),

-- Favorite city
((SELECT id FROM polls WHERE question = 'Which city would you love to visit?' LIMIT 1), 'Paris'),
((SELECT id FROM polls WHERE question = 'Which city would you love to visit?' LIMIT 1), 'Tokyo'),
((SELECT id FROM polls WHERE question = 'Which city would you love to visit?' LIMIT 1), 'New York'),
((SELECT id FROM polls WHERE question = 'Which city would you love to visit?' LIMIT 1), 'Rome'),

-- Best ice cream flavor
((SELECT id FROM polls WHERE question = 'What is the best ice cream flavor?' LIMIT 1), 'Chocolate'),
((SELECT id FROM polls WHERE question = 'What is the best ice cream flavor?' LIMIT 1), 'Vanilla'),
((SELECT id FROM polls WHERE question = 'What is the best ice cream flavor?' LIMIT 1), 'Strawberry'),
((SELECT id FROM polls WHERE question = 'What is the best ice cream flavor?' LIMIT 1), 'Mango'),

-- What to eat now
((SELECT id FROM polls WHERE question = 'What should I eat now?' LIMIT 1), 'Pizza'),
((SELECT id FROM polls WHERE question = 'What should I eat now?' LIMIT 1), 'Burger'),
((SELECT id FROM polls WHERE question = 'What should I eat now?' LIMIT 1), 'Pasta'),
((SELECT id FROM polls WHERE question = 'What should I eat now?' LIMIT 1), 'Sushi'),

-- Random topics
((SELECT id FROM polls WHERE question = 'Cats or dogs?' LIMIT 1), 'Cats'),
((SELECT id FROM polls WHERE question = 'Cats or dogs?' LIMIT 1), 'Dogs'),

((SELECT id FROM polls WHERE question = 'Which superhero is the best?' LIMIT 1), 'Superman'),
((SELECT id FROM polls WHERE question = 'Which superhero is the best?' LIMIT 1), 'Batman'),
((SELECT id FROM polls WHERE question = 'Which superhero is the best?' LIMIT 1), 'Spider-Man'),

((SELECT id FROM polls WHERE question = 'Best way to start the day?' LIMIT 1), 'Coffee'),
((SELECT id FROM polls WHERE question = 'Best way to start the day?' LIMIT 1), 'Exercise'),
((SELECT id FROM polls WHERE question = 'Best way to start the day?' LIMIT 1), 'Breakfast'),

((SELECT id FROM polls WHERE question = 'Tea or Coffee?' LIMIT 1), 'Tea'),
((SELECT id FROM polls WHERE question = 'Tea or Coffee?' LIMIT 1), 'Coffee');
 */

SELECT * FROM user_profiles