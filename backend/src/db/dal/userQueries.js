const {pool} = require("./pool");
const {deleteImage} = require("../../aws/s3");
const {EVENT_NAMES} = require("../../constants");

async function followUser(userFollowerId, userFollowId) {
    const query = `
        INSERT INTO user_follows (user_follower_id, user_follow_id)
        VALUES ($1, $2)
        ON CONFLICT (user_follower_id, user_follow_id) DO NOTHING;
  `;

    try {
        await pool.query(query, [userFollowerId, userFollowId]);
        console.log('Follow inserted (or already exists)');
    } catch (err) {
        console.error('Error inserting follow:', err);
    }
}

async function unfollowUser(userFollowerId, userFollowId) {
    const query = `
        DELETE FROM user_follows
        WHERE user_follower_id = $1 AND user_follow_id = $2
        RETURNING 1
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
            GREATEST(up.followers_number, 0) AS "followersNumber",
            up.bio,
            CASE
                WHEN uf2.user_follow_id IS NOT NULL THEN TRUE
                ELSE FALSE
                END AS "isFollowing"
        FROM users u
                 JOIN user_profiles up ON u.id = up.user_id
                 JOIN user_follows uf ON uf.user_follower_id = u.id
                 LEFT JOIN user_follows uf2
                           ON uf2.user_follower_id = $1::uuid AND uf2.user_follow_id = u.id
        WHERE uf.user_follow_id = $1::uuid;
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
    WHERE uf.user_follower_id = $1::uuid;
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
            GREATEST(up.followers_number, 0) AS "followersNumber",
            GREATEST(up.following_number, 0) AS "followingNumber",
            COUNT(p.id)::integer as "pollsNumber",
            COALESCE(SUM(p.votes_count), 0)::integer as "totalVotesNumber",
            up.bio,
            uc."onboardingComplete"
        FROM users u
                 JOIN user_profiles up ON u.id = up.user_id
                 LEFT JOIN polls p ON p.created_by = u.id AND p.is_deleted = false
                 LEFT JOIN LATERAL (
            SELECT CASE
                       WHEN COUNT(*) > 0 THEN true
                       ELSE false
                       END AS "onboardingComplete"
            FROM user_categories
            WHERE user_id = u.id AND is_chosen = true
            ) uc ON true
        WHERE u.id = $1::uuid
        GROUP BY u.id, u.username, u.email, up.image, up.followers_number, up.following_number, up.bio, uc."onboardingComplete";
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
                       AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '10 minutes'
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
                             AND created_at <= (NOW() AT TIME ZONE 'UTC') - INTERVAL '1 minute'
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
            return { canSend: false, code: 1 };
        }
    } catch (error) {
        console.error('Error fetching activation code:', error);
        throw error;
    }
}

/**
 * Get or update verification code for a given email.
 * @param {string} email - The email address.
 * @returns {Promise<string>} - The activation code.
 */
async function getVerificationCode(email) {
    try {
        const query = `
            WITH 
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
                       AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '10 minutes'
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
                             AND created_at <= (NOW() AT TIME ZONE 'UTC') - INTERVAL '1 minute'
                         RETURNING code, true AS "canSend"
                 ),
                 inserted AS (
                     INSERT INTO activation_codes (email, created_at, code, sent_on)
                         SELECT LOWER($1), (NOW() AT TIME ZONE 'UTC'), LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0'), (NOW() AT TIME ZONE 'UTC')
                         WHERE NOT EXISTS (SELECT 1 FROM activation_codes WHERE email = LOWER($1))
                           AND EXISTS (SELECT 1 FROM users WHERE email = LOWER($1))
                         RETURNING code, true AS "canSend"
                 )
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
            return { canSend: false, code: 1 };
        }
    } catch (error) {
        console.error('Error fetching activation code:', error);
        throw error;
    }
}

async function checkActivationCode(email, code) {
    try {
        const query = `
            WITH matched_code AS (
                DELETE FROM activation_codes
                WHERE email = LOWER($1)
                      AND code = $2
                      AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '10 minutes'
                      RETURNING 1
            ),
             updated_attempts AS (
                 UPDATE activation_codes
                     SET attempts_made = attempts_made + 1
                     WHERE email = LOWER($1)
                         AND created_at >= (NOW() AT TIME ZONE 'UTC') - INTERVAL '10 minutes'
                         AND code <> $2
                     RETURNING attempts_made
             ),
             expired_code AS (
                 SELECT 1 AS expired FROM activation_codes
                 WHERE email = LOWER($1)
                   AND code = $2
                   AND created_at < (NOW() AT TIME ZONE 'UTC') - INTERVAL '10 minutes'
             )
            SELECT
                CASE
                    WHEN NOT EXISTS (SELECT 1 FROM activation_codes WHERE email = LOWER($1)) THEN 0
                    WHEN (SELECT attempts_made FROM updated_attempts LIMIT 1) > 3 THEN -1
                    WHEN (SELECT COUNT(*) FROM expired_code) > 0 THEN 2
                    WHEN (SELECT COUNT(*) FROM matched_code) > 0 THEN 1
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
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

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

        const result = await client.query(query, [username.toLowerCase(), email.toLowerCase(), passwordHash]);

        await client.query('COMMIT');

        return result.rows[0]; // { code: 1 or -1, user_id: UUID or null }
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error("Error checking username and inserting user with profile:", error);
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Changes user's password
 * @param email
 * @param passwordHash
 * @returns {Promise<any>}
 */
async function changePassword(email, passwordHash) {
    console.log('email', email);
    console.log('passwordHash', passwordHash);

    const query = `
        UPDATE users
        SET password_hash = $2
        WHERE email = $1
        RETURNING id, username;
    `;

    const result = await pool.query(query, [email.toLowerCase(), passwordHash]);
    if (result.rows.length > 0) {
        return { id: result.rows[0].id, username: result.rows[0].username };
    }
    throw new Error('No such user in the database');
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

/**
 * Update profile image
 * @param imageUrl
 * @param userId
 * @returns {Promise<string>}
 */
async function updateProfileImage(imageUrl, userId) {
    const result = await pool.query(
        `WITH updated AS (
            SELECT image FROM user_profiles WHERE user_id = $1
        )
         UPDATE user_profiles
         SET image = $2
         WHERE user_id = $1
         RETURNING (SELECT image FROM updated) AS previous_image`,
        [userId, imageUrl]
    );

    return result.rows[0]?.previous_image;
}

/**
 * Update push token
 * @param pushToken
 * @param timezoneOffset
 * @param userId
 */
async function updatePushToken(pushToken, timezoneOffset, userId) {
    await pool.query(
        `UPDATE users
         SET push_token = $2,
             timezone_offset = $3
         WHERE id = $1;
        `,
        [userId, pushToken, timezoneOffset]
    );
}


/**
 * Update profile categories interests
 * @param categoryIds - array of selected category IDs
 * @param userId - user ID
 * @returns {Promise<string>}
 */
async function setCategories(categoryIds, userId) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Mark all categories as not chosen
        await client.query(
            `UPDATE user_categories
             SET is_chosen = false
             WHERE user_id = $1`,
            [userId]
        );

        // 2. Mark only selected categoryIds as chosen
        if (categoryIds.length > 0) {
            await client.query(
                `UPDATE user_categories
                 SET is_chosen = true
                 WHERE user_id = $1 AND category_id = ANY($2)`,
                [userId, categoryIds]
            );
        }

        await client.query('COMMIT');
        return 'Categories updated';
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error updating categories:', err);
        throw err;
    } finally {
        client.release();
    }
}



/**
 * Delete user and associated data from the database
 * @param userId
 * @returns {Promise<void>}
 */
async function deleteUser(userId) {
    const client = await pool.connect();

    try {
        const imageResul = await client.query(`
            SELECT image FROM user_profiles WHERE user_id = $1
        `, [userId]);
        const userImageUrl = imageResul.rows[0].image;

        const deleteImageRequest = deleteImage(userImageUrl);

        await client.query('BEGIN');

        await client.query(
            `DELETE FROM user_follows WHERE user_follower_id = $1 OR user_follow_id = $1`,
            [userId]
        );

        await client.query(
            `DELETE FROM polls WHERE created_by = $1`,
            [userId]
        );

        await client.query(
            `DELETE FROM user_profiles WHERE user_id = $1`,
            [userId]
        );

        await client.query(
            `DELETE FROM users WHERE id = $1 RETURNING id`,
            [userId]
        );

        const deleteImageResult = await deleteImageRequest;

        if (deleteImageResult)
            await client.query('COMMIT');
        else
            throw "Image deletion failed";
    } catch (error) {
        console.error('Error deleting user:', error);
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

/**
 * Updates affinity score for given user IDs / category ID map
 * @param userCategoryPair
 * @returns {Promise<void>}
 */
async function recalculateCategoryScore({ userCategoryPair }) {
    const formattedValues = userCategoryPair
        .map(([uid, cid]) => `('${uid}'::uuid, ${cid})`)
        .join(',\n');

    const query = `
    WITH input(user_id, category_id) AS (
        VALUES
        ${formattedValues}
      ),
    interaction_counts AS (
      SELECT
        i.user_id,
        i.category_id,
    
        COUNT(DISTINCT v.poll_id) FILTER (
          WHERE p.category_id = i.category_id
            AND v.poll_id IS NOT NULL
            AND v.poll_id NOT IN (
                SELECT poll_id FROM poll_votes WHERE user_id = i.user_id
            )
            AND v.poll_id NOT IN (
                SELECT poll_id FROM poll_likes WHERE user_id = i.user_id
            )
        ) AS skips,
    
        COUNT(DISTINCT pv.poll_id) FILTER (
          WHERE p.category_id = i.category_id
        ) AS votes,
    
        COUNT(DISTINCT pl.poll_id) FILTER (
          WHERE p.category_id = i.category_id
            AND EXISTS (
                SELECT 1 FROM poll_votes vv WHERE vv.poll_id = pl.poll_id AND vv.user_id = pl.user_id
            )
        ) AS likes
    
      FROM input i
      JOIN users u ON u.id = i.user_id
      JOIN Categories c ON c.id = i.category_id
      LEFT JOIN polls p ON p.category_id = c.id
      LEFT JOIN poll_views v ON v.user_id = i.user_id AND v.poll_id = p.id
      LEFT JOIN poll_votes pv ON pv.user_id = i.user_id AND pv.poll_id = p.id
      LEFT JOIN poll_likes pl ON pl.user_id = i.user_id AND pl.poll_id = p.id
      GROUP BY i.user_id, i.category_id
    ),
     scored AS (
         SELECT
             user_id,
             category_id,
             likes,
             votes,
             skips,
             CASE
                 WHEN (likes + votes + skips) > 0 THEN
                     GREATEST(0.01, LEAST(1,
                                          0.5 + (
                                              (2 * likes + 1 * votes - 2 * skips)::float
                                                  / (20 + likes + votes + skips)
                                              )
                                    ))
                 ELSE 0.5
                 END AS score
         FROM interaction_counts
     )
    UPDATE user_categories uc
    SET score = s.score
    FROM scored s
    WHERE uc.user_id = s.user_id AND uc.category_id = s.category_id;
    `

    await pool.query(query);
}

async function addInquiry({email, inquiryType}) {
    try {
        await pool.query(`
        INSERT INTO user_inquiries (email, inquiry_type)
        VALUES ($1,$2)
        ON CONFLICT DO NOTHING; 
    `, [email, inquiryType]);
    } catch (e) {
        console.error(e);
        throw e;
    }
}

module.exports = {
    addInquiry,
    checkActivationCode,
    checkAndInsertUserWithProfile,
    changePassword,
    deleteUser,
    followUser,
    getActivationCode,
    getFollowers,
    getFollows,
    getUser,
    getUserByLogin,
    getVerificationCode,
    recalculateCategoryScore,
    setCategories,
    unfollowUser,
    updateProfileImage,
    updatePushToken,
}