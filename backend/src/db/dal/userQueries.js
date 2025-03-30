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
      u.username AS "userName",
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
      u.username AS "userName",
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
      u.username AS "userName",
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

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollows,
    getUser,
}