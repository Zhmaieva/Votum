const { pool } = require('./pool'); // Assuming you have your db connection setup

async function increaseDemoVotesCount() {
    const sql = `
        DO $$
        DECLARE
            demo_user_id UUID := '281d5a04-f29e-4f9c-b0cc-323bb9f02308';
            rec RECORD;
            opt_id UUID;
            vote_inc INTEGER;
        BEGIN
            FOR rec IN
                SELECT DISTINCT p.id AS poll_id
                FROM polls p
                LEFT JOIN poll_votes pv ON pv.poll_id = p.id AND pv.user_id = demo_user_id
                WHERE p.created_by = demo_user_id OR pv.user_id IS NOT NULL
            LOOP
                SELECT id INTO opt_id
                FROM poll_answer_options
                WHERE poll_id = rec.poll_id
                ORDER BY random()
                LIMIT 1;
        
                IF opt_id IS NOT NULL THEN
                    vote_inc := floor(1 + random() * 10)::int;
        
                    UPDATE poll_answer_options
                    SET votes_count = votes_count + vote_inc
                    WHERE id = opt_id;
        
                    UPDATE polls
                    SET votes_count = votes_count + vote_inc
                    WHERE id = rec.poll_id;
                END IF;
            END LOOP;
        END $$;

        `;

    await pool.query(sql);
}

module.exports = {
    increaseDemoVotesCount
}