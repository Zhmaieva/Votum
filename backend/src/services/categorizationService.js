// categorizationService.js — FULL DROP-IN (old local classifier + new OpenAI classifier)
//
// Requirements:
// - Node 18+ (global fetch available)
// - OPENAI_API_KEY env var set (only needed for categorizePollsOpenAI)
// - categories table contains row with name = 'Other' (fallback)
//
// Usage:
// - keep your current scheduler calling categorizePolls() (localhost classifier)
// - or switch to categorizePollsOpenAI() for OpenAI-based categorization

const { pool } = require("../db/dal/pool");
const OpenAI = require("openai");

const CATEGORIES = {
    SOCIAL_LIFE: 1,
    HEALTH: 2,
    ENTERTAINMENT: 3,
    FOOD: 4,
    LIFESTYLE: 5,
    FASHION: 6,
    TECH: 7,
    OPINIONS: 8,
    MEDIA: 9,
    GAMES: 10,
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "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",
});

async function assignOtherCategory(pollId) {
    const updateQuery = `
        UPDATE polls SET 
            category_id = (SELECT id FROM categories WHERE name = 'Other' LIMIT 1),
            status = 0 -- ready for feed
        WHERE id = $1
    `;
    await pool.query(updateQuery, [pollId]);
}

// -------------------- OLD METHOD (localhost:3033/classify) --------------------
async function categorizePolls() {
    const getPollQuery = `
        SELECT id, question FROM polls
        WHERE status = 1
        ORDER BY created_at ASC
        LIMIT 1;
    `;

    const pollsQuery = await pool.query(getPollQuery);
    if (pollsQuery.rows?.length === 0 ?? true)
        return;

    const {id, question} = pollsQuery.rows[0];

    try {
        const url = `http://localhost:3033/classify?q=${encodeURIComponent(question)}`;

        const res = await fetch(url, {
            headers: { Accept: "application/json, text/plain;q=0.9, */*;q=0.8" },
        });

        const raw = await res.text();

        const category = CATEGORIES[raw.toUpperCase()];

        const updateQuery = `
            UPDATE polls SET
                             category_id = $1,
                             status = 0 -- ready for feed
            WHERE id = $2
        `;

        await pool.query(updateQuery, [category, id]);

        console.log('assigned ' + raw + ' category to poll ' + id);
    } catch (e) {
        console.log(e + 'assigning default category to poll ' + id);

        const updateQuery = `
            UPDATE polls SET 
                category_id = (SELECT id FROM categories WHERE name = 'Other'),
                status = 0 -- ready for feed
            WHERE id = $1
        `;

        await pool.query(updateQuery, [id]);
    }

}

// -------------------- NEW METHOD (OpenAI) --------------------
async function classifyPollQuestionOpenAI(question) {
    const q = String(question || "").trim().slice(0, 300);

    const systemPrompt = `
You categorize poll questions.

Return ONLY JSON.

Schema:
{
  "category": "SOCIAL_LIFE" | "HEALTH" | "ENTERTAINMENT" | "FOOD" | "LIFESTYLE" | "FASHION" | "TECH" | "OPINIONS" | "MEDIA" | "GAMES"
}

Rules:
- Choose exactly ONE best category.
- Use ONLY the categories listed above.
- Return the category in ALL CAPS.
`.trim();

    const userPrompt = `
POLL_QUESTION:
${q}
`.trim();

    const resp = await openai.responses.create({
        model: "gpt-4.1-mini",
        temperature: 0.1,
        text: { format: { type: "json_object" } },
        input: [
            { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
            { role: "user", content: [{ type: "input_text", text: userPrompt }] },
        ],
    });

    const txt = resp.output_text || "{}";
    const parsed = JSON.parse(txt);

    return String(parsed.category || "").trim().toUpperCase();
}

async function categorizePollsOpenAI() {
    const getPollQuery = `
        SELECT id, question FROM polls
        WHERE status = 1
        ORDER BY created_at ASC
        LIMIT 1;
    `;

    const pollsQuery = await pool.query(getPollQuery);
    if (!pollsQuery.rows?.length) return;

    const { id, question } = pollsQuery.rows[0];

    try {
        const categoryKey = await classifyPollQuestionOpenAI(question);
        const categoryId = CATEGORIES[categoryKey];

        if (!categoryId) {
            await assignOtherCategory(id);
            console.log(`assigned Other category to poll ${id} (invalid OpenAI result: "${categoryKey}")`);
            return;
        }

        const updateQuery = `
            UPDATE polls SET 
                category_id = $1,
                status = 0 -- ready for feed
            WHERE id = $2
        `;

        await pool.query(updateQuery, [categoryId, id]);

        console.log(`assigned ${categoryKey} category to poll ${id}`);
    } catch (e) {
        console.log(String(e) + " assigning default category to poll " + id);
        await assignOtherCategory(id);
    }
}

module.exports = {
    categorizePolls,
    categorizePollsOpenAI,
};