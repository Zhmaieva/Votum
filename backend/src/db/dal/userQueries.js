const {pool} = require("./pool");

async function followUser(userFollowerId, userFollowId) {
    const query = `
    INSERT INTO user_follows (user_follower_id, user_follow_id)
    VALUES ($1, $2)
    ON CONFLICT (user_follower_id, user_follow_id) DO NOTHING;
  `;

    try {
        const res = await pool.query(query, [userFollowerId, userFollowId]);
        console.log('Follow inserted (or already exists)', res.rowCount);
    } catch (err) {
        console.error('Error inserting follow:', err);
    }
}

async function unfollowUser(userFollowerId, userFollowId) {
    const query = `
    DELETE FROM user_follows 
    WHERE user_follower_id = $1 AND user_follow_id = $2;
  `;

    try {
        const res = await pool.query(query, [userFollowerId, userFollowId]);
        if (res.rowCount > 0) {
            console.log('Unfollowed successfully');
        } else {
            console.log('No follow relationship found');
        }
    } catch (err) {
        console.error('Error unfollowing user:', err);
    }
}

async function getFollowers(userId) {
    const query = `
    SELECT
      u.id as "userId",
      u.username AS "username",
      up.image,
      up.followers_number AS "followersNumber",
      up.bio
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    JOIN user_follows uf ON uf.user_follower_id = u.id
    WHERE uf.user_follow_id = $1;
  `;

    try {
        const res = await pool.query(query, [userId]);
        return res.rows || []; // Returns an array of followers
    } catch (err) {
        console.error('Error fetching followers:', err);
        return [];
    }
}

async function getFollows(userId) {
    const query = `
    SELECT
      u.id as "userId",
      u.username AS "username",
      up.image,
      up.followers_number AS "followersNumber",
      up.bio,
      true as "isFollowing"
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    JOIN user_follows uf ON uf.user_follow_id = u.id
    WHERE uf.user_follower_id = $1;
  `;

    try {
        const res = await pool.query(query, [userId]);
        return res.rows || []; // Returns an array of followers
    } catch (err) {
        console.error('Error fetching followers:', err);
        return [];
    }
}


async function getUser(userId) {
    const query = `
    SELECT
      u.id as "userId",
      u.username AS "username",
      u.email,
      up.image,
      up.followers_number AS "followersNumber",
      up.bio
    FROM users u
    JOIN user_profiles up ON u.id = up.user_id
    WHERE u.id = $1;
  `;

    try {
        const res = await pool.query(query, [userId]);
        return res.rows[0] || null; // Return user object or null if not found
    } catch (err) {
        console.error('Error fetching user:', err);
        return null;
    }
}

/**
 * Get or update activation code for a given email.
 * @param {string} email - The email address.
 * @returns {Promise<string>} - The activation code.
 */
async function getActivationCode(email) {
    try {
        const query = `
            WITH user_exists AS (
                SELECT '-1' AS code, false AS "canSend"
                FROM users
                WHERE email = LOWER($1)
                LIMIT 1
            ),
                 existing_record AS (
                     SELECT
                         code,
                         CASE
                             WHEN sent_on <= (NOW() AT TIME ZONE 'UTC') - INTERVAL '1 minute' THEN true
                             ELSE false
                             END AS "canSend",
                         email
                     FROM activation_codes
                     WHERE email = LOWER($1)
                       AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '15 minutes'
                 ),
                 update_sent_on AS (
                     UPDATE activation_codes
                         SET sent_on = (NOW() AT TIME ZONE 'UTC')
                         FROM existing_record
                         WHERE LOWER(activation_codes.email) = LOWER(existing_record.email)
                             AND existing_record."canSend" = true
                         RETURNING activation_codes.code, true AS "canSend"
                 ),
                 updated AS (
                     UPDATE activation_codes
                         SET created_at = (NOW() AT TIME ZONE 'UTC'),
                             code = LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'),
                             attempts_made = 0,
                             sent_on = (NOW() AT TIME ZONE 'UTC')
                         WHERE email = LOWER($1)
                             AND created_at <= (NOW() AT TIME ZONE 'UTC') - INTERVAL '15 minutes'
                         RETURNING code, true AS "canSend"
                 ),
                 inserted AS (
                     INSERT INTO activation_codes (email, created_at, code, sent_on)
                         SELECT LOWER($1), (NOW() AT TIME ZONE 'UTC'), LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'), (NOW() AT TIME ZONE 'UTC')
                         WHERE NOT EXISTS (SELECT 1 FROM activation_codes WHERE email = LOWER($1))
                           AND NOT EXISTS (SELECT 1 FROM users WHERE email = LOWER($1))
                         RETURNING code, true AS "canSend"
                 )
            SELECT code, "canSend" FROM user_exists
            UNION ALL
            SELECT code, "canSend" FROM update_sent_on
            UNION ALL
            SELECT code, "canSend" FROM updated
            UNION ALL
            SELECT code, "canSend" FROM inserted;
        `;

        const result = await pool.query(query, [email]);

        if (result.rows.length > 0) {
            return result.rows[0];
        } else {
            throw new Error('Failed to retrieve activation code');
        }
    } catch (error) {
        console.error('Error fetching activation code:', error);
        throw error;
    }
}

async function checkActivationCode(email, code) {
    try {
        const query = `
            WITH matched_email AS (
                SELECT * FROM activation_codes
                WHERE email = LOWER($1)
                  AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '15 minutes'
            ),
             updated_attempts AS (
                 UPDATE activation_codes
                     SET attempts_made = attempts_made + 1
                     WHERE email = LOWER($1)
                         AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '15 minutes'
                         AND code <> $2
                     RETURNING attempts_made
             ),
             expired_code AS (
                 SELECT 1 AS expired FROM activation_codes
                 WHERE email = LOWER($1)
                   AND code = $2
                   AND created_at < (NOW() AT TIME ZONE 'UTC') - INTERVAL '15 minutes'
             )
            SELECT
                CASE
                    WHEN NOT EXISTS (SELECT 1 FROM activation_codes WHERE email = LOWER($1)) THEN 0
                    WHEN (SELECT attempts_made FROM updated_attempts LIMIT 1) > 3 THEN -1
                    WHEN (SELECT COUNT(*) FROM expired_code) > 0 THEN 2
                    WHEN (SELECT attempts_made FROM matched_email) > 3 THEN -1
                    WHEN (SELECT COUNT(*) FROM matched_email WHERE code = $2) > 0 THEN 1
                    ELSE 0
                    END AS result;

        `;

        const result = await pool.query(query, [email, code]);

        // Get the result of the query
        if (result.rows.length > 0) {
            return result.rows[0].result;
        } else {
            throw new Error('Unexpected result from the database');
        }
    } catch (error) {
        console.error('Error checking activation code:', error);
        throw error;
    }
}

/**
 * Check username availability, insert user if necessary, and create a user profile.
 * @param {string} username - The desired username.
 * @param {string} email - The user's email.
 * @param {string} passwordHash - The hashed password.
 * @returns {Promise<{ code: number, user_id: string | null }>}
 */
async function checkAndInsertUserWithProfile(username, email, passwordHash) {
    try {
        await pool.query('BEGIN');

        const query = `
            WITH existing_user AS (
                SELECT id FROM users 
                WHERE username = $1 
                AND email = $2
            ),
            inserted_user AS (
                INSERT INTO users (username, email, password_hash) 
                SELECT $1, $2, $3
                WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = $1 OR email = $2)
                RETURNING id
            ),
            profile_insert AS (
                INSERT INTO user_profiles (user_id) 
                SELECT id FROM inserted_user
                RETURNING user_id
            )
            SELECT 
                CASE 
                    WHEN EXISTS (SELECT 1 FROM existing_user) THEN 1
                    WHEN EXISTS (SELECT 1 FROM inserted_user) THEN 1
                    ELSE -1
                END AS code,
                COALESCE((SELECT id FROM existing_user), (SELECT id FROM inserted_user)) AS user_id;
        `;

        const result = await pool.query(query, [username.toLowerCase(), email.toLowerCase(), passwordHash]);

        await pool.query('COMMIT');

        return result.rows[0]; // { code: 1 or -1, user_id: UUID or null }
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error checking username and inserting user with profile:", error);
        throw error;
    }
}

/**
 * Checks if there is a user in DB with matching credentials,
 * optionally excluding a specific user by ID.
 *
 * @param {string} usernameOrEmail
 * @param {string} [userId] - Optional user ID to exclude from the query
 * @returns {Promise<{id, password}>}
 */
async function getUserByLogin(usernameOrEmail, userId) {
    try {
        const baseQuery = `
            SELECT id, password_hash as password 
            FROM users 
            WHERE (username = $1 OR email = $1)
        `;

        const values = [usernameOrEmail.toLowerCase()];

        // If userId is provided, exclude it from the results
        let query = baseQuery;
        if (userId) {
            query += ` AND id != $2`;
            values.push(userId);
        }

        const existingUsers = await pool.query(query, values);
        return existingUsers?.rows[0];
    } catch (error) {
        console.error('Error checking credentials:', error);
        throw error;
    }
}


async function updateProfileImage(imageUrl, userId) {
    await pool.query(
        `UPDATE user_profiles SET image = $1 WHERE user_id = $2`,
        [imageUrl, userId],
    );
}

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollows,
    getUser,
    getActivationCode,
    checkActivationCode,
    checkAndInsertUserWithProfile,
    getUserByLogin,
    updateProfileImage
}