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

ALTER TABLE user_profiles ADD COLUMN bio TEXT DEFAULT 'your bio here';

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

-- Sat Apr 26 1:20 PM
CREATE TABLE user_polls (
    user_id UUID NOT NULL,
    poll_id UUID NOT NULL,
    feed_score BIGINT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_user_polls_user_score
    ON user_polls (user_id, feed_score DESC);

CREATE INDEX idx_user_polls_poll_updated
    ON user_polls (poll_id, updated_at DESC);

CREATE TABLE events_queue (
    entity_id UUID NOT NULL,
    event_name TEXT NOT NULL,
    event_date TIMESTAMPTZ NOT NULL,

    CONSTRAINT events_queue_pkey PRIMARY KEY (entity_id, event_name)
);

CREATE OR REPLACE FUNCTION decrement_likes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.poll_id;

    -- 2. Insert event into events_queue
    INSERT INTO events_queue (entity_id, event_name, event_date)
    SELECT OLD.poll_id, 'poll_index_update', NOW() AT TIME ZONE 'UTC'
    WHERE NOT EXISTS (
        SELECT 1 FROM events_queue
        WHERE entity_id = OLD.poll_id AND event_name = 'poll_index_update'
    );

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

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

CREATE TABLE poll_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE poll_views
    ADD CONSTRAINT unique_poll_views_poll_user UNIQUE (poll_id, user_id);

ALTER TABLE polls
    ADD COLUMN views_count INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_poll_views_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET views_count = views_count + 1
    WHERE id = NEW.poll_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_views
    AFTER INSERT ON poll_views
    FOR EACH ROW
EXECUTE FUNCTION increment_poll_views_count();

CREATE OR REPLACE FUNCTION increment_likes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET likes_count = likes_count + 1
    WHERE id = NEW.poll_id;

    INSERT INTO poll_views (poll_id, user_id)
    VALUES (NEW.poll_id, NEW.user_id)
    ON CONFLICT DO NOTHING;

    -- 2. Insert event into events_queue
    INSERT INTO events_queue (entity_id, event_name, event_date)
    SELECT NEW.poll_id, 'poll_index_update', NOW() AT TIME ZONE 'UTC'
    WHERE NOT EXISTS (
        SELECT 1 FROM events_queue
        WHERE entity_id = NEW.poll_id AND event_name = 'poll_index_update'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_poll_votes_count()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE polls
    SET votes_count = votes_count + 1
    WHERE id = (
        SELECT poll_id FROM poll_answer_options WHERE id = NEW.option_id
    );

    INSERT INTO poll_views (poll_id, user_id)
    VALUES (NEW.poll_id, NEW.user_id)
    ON CONFLICT DO NOTHING;

    -- 2. Insert event into events_queue
    INSERT INTO events_queue (entity_id, event_name, event_date)
    SELECT NEW.poll_id, 'poll_index_update', NOW() AT TIME ZONE 'UTC'
    WHERE NOT EXISTS (
        SELECT 1 FROM events_queue
        WHERE entity_id = NEW.poll_id AND event_name = 'poll_index_update'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

UPDATE poll_answer_options pao
SET votes_count = 0;

UPDATE poll_answer_options pao
SET votes_count = COALESCE(sub.vote_count, 0)
FROM (
         SELECT
             option_id,
             COUNT(*) AS vote_count
         FROM poll_votes
         GROUP BY option_id
     ) AS sub
WHERE pao.id = pao.id -- Always true to touch all rows
  AND (sub.option_id = pao.id);


UPDATE polls p
SET votes_count = sub.total_votes
FROM (
         SELECT pao.poll_id, SUM(pao.votes_count) AS total_votes
         FROM poll_answer_options pao
         GROUP BY pao.poll_id
     ) AS sub
WHERE p.id = sub.poll_id;

INSERT INTO poll_views (poll_id, user_id)
SELECT combined.poll_id, combined.user_id
FROM (
         SELECT user_id, poll_id FROM poll_votes
         UNION
         SELECT user_id, poll_id FROM poll_likes
     ) AS combined
ON CONFLICT (poll_id, user_id) DO NOTHING;

ALTER TABLE polls
    ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX idx_polls_id_is_deleted ON polls(id, is_deleted);

CREATE UNIQUE INDEX idx_user_polls_user_poll ON user_polls(user_id, poll_id);

ALTER TABLE events_queue
    ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC');


ALTER TABLE polls
    ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE
        USING created_at AT TIME ZONE 'UTC';

ALTER TABLE polls
    ALTER COLUMN ends_in TYPE timestamp WITHOUT TIME ZONE
        USING ends_in AT TIME ZONE 'UTC';

UPDATE polls
SET created_at = (created_at AT TIME ZONE 'UTC')
WHERE created_at IS NOT NULL;

-- Users table
ALTER TABLE users
    ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE
        USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'UTC');

-- Activation Codes table
ALTER TABLE activation_codes
    ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE
        USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'UTC'),
    ALTER COLUMN sent_on TYPE timestamp WITHOUT TIME ZONE
        USING sent_on AT TIME ZONE 'UTC',
    ALTER COLUMN sent_on SET DEFAULT (NOW() AT TIME ZONE 'UTC');

-- Polls table
ALTER TABLE polls
    ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE
        USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN ends_in TYPE timestamp WITHOUT TIME ZONE
        USING ends_in AT TIME ZONE 'UTC';

-- Poll Votes table
ALTER TABLE poll_votes
    ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE
        USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'UTC');

ALTER TABLE user_polls
    ALTER COLUMN updated_at TYPE timestamp WITHOUT TIME ZONE
        USING updated_at AT TIME ZONE 'UTC',
    ALTER COLUMN updated_at SET DEFAULT (NOW() AT TIME ZONE 'UTC');

-- Set default to current UTC time
ALTER TABLE polls
    ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'UTC');

ALTER TABLE events_queue
    ALTER COLUMN event_date TYPE timestamp WITHOUT TIME ZONE
        USING event_date AT TIME ZONE 'UTC',
    ALTER COLUMN event_date SET DEFAULT (NOW() AT TIME ZONE 'UTC');

ALTER TABLE events_queue
    ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE
        USING created_at AT TIME ZONE 'UTC',
    ALTER COLUMN created_at SET DEFAULT (NOW() AT TIME ZONE 'UTC');

ALTER TABLE polls
    ADD COLUMN indexed_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC');

CREATE INDEX idx_polls_ends_in ON polls (ends_in DESC);
CREATE INDEX idx_polls_indexed_at ON polls (indexed_at DESC);

ALTER TABLE events_queue
    DROP CONSTRAINT events_queue_pkey;

DROP INDEX IF EXISTS events_queue_pkey;

CREATE INDEX idx_events_queue_created_at ON events_queue (created_at ASC);

DROP table user_polls;

CREATE INDEX idx_events_queue_entity_event
    ON events_queue (entity_id, event_name);

ALTER TABLE poll_views
    DROP CONSTRAINT IF EXISTS poll_views_pkey;
DROP INDEX IF EXISTS poll_views_pkey;

-- ALTER TABLE poll_likes
--     DROP CONSTRAINT IF EXISTS fk_poll;
ALTER TABLE poll_likes
    DROP CONSTRAINT IF EXISTS fk_user;

ALTER TABLE poll_views
    DROP CONSTRAINT IF EXISTS poll_views_user_id_fkey;

ALTER TABLE poll_votes
    DROP CONSTRAINT IF EXISTS poll_votes_poll_id_fkey;

ALTER TABLE poll_votes
    DROP CONSTRAINT IF EXISTS poll_votes_user_id_fkey;

ALTER TABLE polls
    ADD COLUMN feed_score BIGINT NOT NULL DEFAULT 0;


--Thu May 15 1:38 PM

DROP TRIGGER IF EXISTS trigger_increment_views ON poll_views;

DROP FUNCTION increment_poll_views_count;

ALTER TABLE polls DROP COLUMN views_count;

ALTER TABLE polls DROP COLUMN feed_score;

ALTER TABLE polls DROP COLUMN indexed_at;

ALTER TABLE polls
ADD COLUMN likes_per_vote REAL DEFAULT 0;

CREATE INDEX idx_polls_likes_per_vote on polls (likes_per_vote DESC);
-- Fri May 16 16:52
ALTER TABLE user_profiles
    ALTER COLUMN image SET DEFAULT 'https://storage.beampie.com/vote/profiles/497f7ffb-01f9-4d24-86ee-e7cc4b046f09___7e288897-3f74-4d87-97f0-b8066fb6b4b6.png';



DROP TRIGGER IF EXISTS trigger_decrement_likes_count ON poll_likes;
DROP TRIGGER IF EXISTS trigger_increment_likes_count ON poll_likes;
DROP FUNCTION increment_likes_count;
DROP FUNCTION decrement_likes_count;
ALTER TABLE polls DROP COLUMN likes_count;

CREATE INDEX idx_polls_votes_count on polls (votes_count DESC);
DROP TRIGGER IF EXISTS trigger_increment_poll_votes_count ON poll_votes;
DROP FUNCTION increment_poll_votes_count;

CREATE TABLE Categories (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO Categories (Name) VALUES
    ('Social life'),
    ('Health'),
    ('Entertainment'),
    ('Food'),
    ('Lifestyle'),
    ('Fashion'),
    ('Tech'),
    ('Opinions'),
    ('Media'),
    ('Games');

CREATE TABLE user_categories (
    category_id INTEGER REFERENCES Categories(Id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_chosen BOOLEAN NOT NULL DEFAULT FALSE,
    score REAL DEFAULT 0,

    PRIMARY KEY (category_id, user_id)
);

CREATE OR REPLACE FUNCTION insert_user_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_categories (user_id, category_id)
  SELECT NEW.id, c.Id
  FROM Categories c;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_insert_user_categories
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_user_categories();

INSERT INTO user_categories (user_id, category_id)
SELECT u.id, c.id
FROM users u
    CROSS JOIN Categories c
ON CONFLICT DO NOTHING;

CREATE INDEX idx_user_categories_user_id on user_categories (user_id);

ALTER TABLE events_queue ADD COLUMN metadata TEXT;

ALTER TABLE polls
    ADD COLUMN category_id INTEGER NOT NULL DEFAULT 1 REFERENCES Categories(Id);

CREATE OR REPLACE FUNCTION insert_user_category_update_event()
    RETURNS TRIGGER AS $$
DECLARE
    _poll_id UUID;
    _user_id UUID;
    _category_id INTEGER;
BEGIN
    -- Use NEW if available, else OLD
    _poll_id := COALESCE(NEW.poll_id, OLD.poll_id);
    _user_id := COALESCE(NEW.user_id, OLD.user_id);

    -- Get category_id from poll
    SELECT category_id INTO _category_id
    FROM polls
    WHERE id = _poll_id;

    -- Only insert if this event doesn't already exist
    IF NOT EXISTS (
        SELECT 1 FROM events_queue
        WHERE entity_id = _user_id
          AND event_name = 'user_category_update'
          AND metadata = _category_id::TEXT
    ) THEN
        INSERT INTO events_queue (entity_id, event_name, event_date, metadata, created_at)
        VALUES (
                   _user_id,
                   'user_category_update',
                   NOW() AT TIME ZONE 'UTC',
                   _category_id::TEXT,
                   NOW() AT TIME ZONE 'UTC'
               );
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_category_update_like
    AFTER INSERT OR DELETE ON poll_likes
    FOR EACH ROW
EXECUTE FUNCTION insert_user_category_update_event();

CREATE TRIGGER trigger_user_category_update_vote
    AFTER INSERT ON poll_votes
    FOR EACH ROW
EXECUTE FUNCTION insert_user_category_update_event();

CREATE TRIGGER trigger_user_category_update_view
    AFTER INSERT ON poll_views
    FOR EACH ROW
EXECUTE FUNCTION insert_user_category_update_event();

CREATE TABLE poll_shares (
    user_id UUID NOT NULL,            -- ID of the user who shared the poll
    poll_id UUID NOT NULL,            -- ID of the poll that was liked
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),  -- Timestamp when the shared

-- Foreign keys to reference users and polls
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_poll FOREIGN KEY (poll_id) REFERENCES polls(id) ON DELETE CASCADE,

-- Unique constraint to ensure each (user_id, poll_id) pair is unique
    CONSTRAINT unique_user_poll_share UNIQUE (user_id, poll_id)
);

ALTER TABLE user_categories
    ALTER COLUMN score SET DEFAULT 0.5;

CREATE OR REPLACE FUNCTION increment_views_count()
    RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO poll_views (poll_id, user_id)
    VALUES (NEW.poll_id, NEW.user_id)
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_increment_likes_views_count
    AFTER INSERT ON poll_likes
    FOR EACH ROW EXECUTE FUNCTION increment_views_count();

CREATE TRIGGER trigger_increment_votes_views_count
    AFTER INSERT ON poll_votes
    FOR EACH ROW EXECUTE FUNCTION increment_views_count();

ALTER TABLE polls
    ADD COLUMN duration_type INTEGER DEFAULT 1;

UPDATE polls
SET duration_type = CASE
    WHEN ends_in - created_at <= INTERVAL '2 hours' THEN 1     -- close to 1h
    WHEN ends_in - created_at <= INTERVAL '2 days' THEN 2      -- close to 1d
    WHEN ends_in - created_at <= INTERVAL '8 days' THEN 3      -- close to 1w
    ELSE 4                                                     -- anything longer
END;

CREATE OR REPLACE FUNCTION set_duration_type()
RETURNS TRIGGER AS $$
BEGIN
  NEW.duration_type := CASE
    WHEN NEW.ends_in - NEW.created_at <= INTERVAL '2 hours' THEN 1
    WHEN NEW.ends_in - NEW.created_at <= INTERVAL '2 days' THEN 2
    WHEN NEW.ends_in - NEW.created_at <= INTERVAL '8 days' THEN 3
    ELSE 4
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_duration_type
    BEFORE INSERT ON polls
    FOR EACH ROW
EXECUTE FUNCTION set_duration_type();

DROP INDEX idx_polls_ends_in;
CREATE INDEX idx_polls_ends_in ON polls (ends_in ASC);
CREATE INDEX idx_polls_ends_in_desc ON polls (ends_in DESC);
CREATE INDEX idx_polls_created_at ON polls (created_at);

DROP TRIGGER trigger_increment_votes_count ON poll_votes;

CREATE TRIGGER trigger_increment_votes_count
    AFTER INSERT ON poll_votes
    FOR EACH ROW EXECUTE FUNCTION increment_votes_count();

UPDATE user_categories SET score = 0.5 WHERE score = 0;

-- Thu Jun 5 2025 11:46 AM
ALTER TABLE users
ADD COLUMN push_token TEXT;

ALTER TABLE users
    ADD COLUMN timezone_offset INTEGER DEFAULT 0;

CREATE TABLE notifications (
    id UUID NOT NUll PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    state INTEGER DEFAULT 0, -- 0: created, 1: sent, 2: no_push_token, 3: unknown_error
    notification_tag INTEGER DEFAULT 0, -- 0: new_follows
    message_title TEXT,
    message_body TEXT,
    message_data TEXT,
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'),
    processed_at TIMESTAMP,
    is_viewed BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,

-- Foreign keys to reference users and polls
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE user_follows
ADD COLUMN created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC');


-- Sun Jul 6 2:25 PM
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

-- Sat Jul 19 1:34 PM
ALTER TABLE user_profiles
ALTER COLUMN image SET DEFAULT 'https://s3.us-east-1.amazonaws.com/storage.beampie.com/vote/default_avatar.PNG';

-- Web Jul 23 10:14 AM
/**
  Inquiry type:
  0 - public launch invite
  1 - beta testing invite
 */
CREATE TABLE user_inquiries (
    email varchar(255) NOT NULL PRIMARY KEY,
    inquiry_type INT NOT NULL
);

-- Thu Jul 24 2:26 PM
-- Step 1: Drop current PK (on email)
ALTER TABLE user_inquiries DROP CONSTRAINT user_inquiries_pkey;

-- Step 2: Add new composite PK (on email + inquiry_type)
ALTER TABLE user_inquiries ADD PRIMARY KEY (email, inquiry_type);

--Tue Aug 5 3:01 PM
CREATE TABLE user_logs (
    user_id     uuid,
    log         varchar,
    created_at  TIMESTAMPTZ default (now() AT TIME ZONE 'UTC')
);

ALTER TABLE users ADD COLUMN
    is_debug boolean default false;


--Thu Aug 7 1:12 PM
ALTER TABLE users ADD COLUMN
    is_new_followers_notification_enabled boolean default true;

--Sun Aug 10 10:35 PM
ALTER TABLE user_profiles ADD COLUMN
    birth_date varchar NULL;

ALTER TABLE user_profiles ADD COLUMN
    gender INTEGER NULL;