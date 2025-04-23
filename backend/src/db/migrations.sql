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

--Sat Apr 12 13:00
CREATE TABLE poll_votes (
    user_id UUID NOT NULL,
    poll_id UUID NOT NULL,
    option_id UUID NOT NULL REFERENCES poll_answer_options(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    PRIMARY KEY (user_id, poll_id),

    FOREIGN KEY (poll_id) REFERENCES polls(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE poll_answer_options
    ADD COLUMN votes_count INTEGER DEFAULT 0 NOT NULL;

CREATE OR REPLACE FUNCTION increment_votes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE poll_answer_options
    SET votes_count = votes_count + 1
    WHERE id = NEW.option_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_votes_count
    AFTER INSERT ON poll_votes
    FOR EACH ROW EXECUTE FUNCTION increment_votes_count();

--Sat Apr 12 11:10 PM
ALTER TABLE polls
    DROP COLUMN votes_number;

--Mon Apr 14 9:42 PM

DELETE FROM user_follows;
UPDATE user_profiles SET followers_number = 0;
UPDATE user_profiles SET following_number = 0;

CREATE OR REPLACE FUNCTION increment_followers_follows_count()
    RETURNS TRIGGER AS $$
BEGIN
        UPDATE user_profiles
        SET followers_number = followers_number + 1
        WHERE user_id = NEW.user_follow_id;

        UPDATE user_profiles
        SET following_number = following_number + 1
        WHERE user_id = NEW.user_follower_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_followers_follows_count
    AFTER INSERT ON user_follows
    FOR EACH ROW EXECUTE FUNCTION increment_followers_follows_count();

CREATE OR REPLACE FUNCTION decrement_followers_follows_count()
    RETURNS TRIGGER AS $$
BEGIN
    -- Decrease followers count for the user being unfollowed
    UPDATE user_profiles
    SET followers_number = GREATEST(0, followers_number - 1)
    WHERE user_id = OLD.user_follow_id;

    -- Decrease following count for the user who unfollowed
    UPDATE user_profiles
    SET following_number = GREATEST(0, following_number - 1)
    WHERE user_id = OLD.user_follower_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_followers_follows_count
    AFTER DELETE ON user_follows
    FOR EACH ROW EXECUTE FUNCTION decrement_followers_follows_count();

-- Sat Apr 19 12:20 PM
ALTER TABLE polls
    ADD COLUMN readable_id VARCHAR(32) NOT NULL DEFAULT '';

CREATE INDEX idx_polls_readable_id ON polls(readable_id);

UPDATE polls
SET readable_id = sub.readable_id
FROM (
         SELECT id,
                string_agg(
                        (ARRAY[
                            chr(trunc(48 + random() * 10)::int), -- 0–9
                            chr(trunc(65 + random() * 26)::int), -- A–Z
                            chr(trunc(97 + random() * 26)::int)  -- a–z
                            ])[floor(random() * 3 + 1)::int],
                        ''
                ) AS readable_id
         FROM polls,
              generate_series(1, 8) AS g(n)  -- generate 8 characters per poll
         WHERE readable_id = ''
         GROUP BY id
     ) AS sub
WHERE polls.id = sub.id;

--Tue Apr 22 3:32 PM
ALTER TABLE polls
ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_likes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET likes_count = likes_count + 1
    WHERE id = NEW.poll_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_likes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.poll_id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_likes_count
    AFTER INSERT ON poll_likes
    FOR EACH ROW EXECUTE FUNCTION increment_likes_count();

CREATE TRIGGER trigger_decrement_likes_count
    AFTER DELETE ON poll_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_likes_count();


UPDATE polls
SET likes_count = sub.like_count
FROM (
         SELECT poll_id, COUNT(*) AS like_count
         FROM poll_likes
         GROUP BY poll_id
     ) AS sub
WHERE polls.id = sub.poll_id;

ALTER TABLE polls
    ADD COLUMN IF NOT EXISTS votes_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_poll_votes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET votes_count = votes_count + 1
    WHERE id = (
        SELECT poll_id FROM poll_answer_options WHERE id = NEW.option_id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_poll_votes_count
    AFTER INSERT ON poll_votes
    FOR EACH ROW EXECUTE FUNCTION increment_poll_votes_count();

UPDATE polls p
SET votes_count = sub.total_votes
FROM (
         SELECT pao.poll_id, SUM(pao.votes_count) AS total_votes
         FROM poll_answer_options pao
         GROUP BY pao.poll_id
     ) AS sub
WHERE p.id = sub.poll_id;
