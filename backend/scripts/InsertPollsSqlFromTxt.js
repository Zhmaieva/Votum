/**
 * parse_votum_txt_to_sql.js
 *
 * Usage:
 *   node InsertPollsSqlFromTxt.js "Votum dataset.txt" scheduled_polls_insert.sql
 *
 * What it does:
 * - Parses your dataset .txt
 * - Ignores category/section headers
 * - Extracts: poll_text + options (votes ignored)
 * - Produces SQL:
 *     INSERT INTO scheduled_polls (poll_text, options) VALUES
 *       (...),
 *       (...);
 *
 * Assumptions about txt format (common patterns supported):
 * - Each poll block contains:
 *     Question line
 *     Option lines (2-4 usually), optionally with vote counts like "Yes — 123" or "Yes (123)"
 * - Blocks separated by blank lines
 * - Category headers are lines that end with ":" or are ALL CAPS or start with "#"
 *
 * If your file format differs, tweak isHeaderLine() and extractOptionText().
 */

const fs = require("fs");
const path = require("path");

const inputPath = process.argv[2];
const outputPath = process.argv[3] || "scheduled_polls_insert.sql";

if (!inputPath) {
    console.error(
        'Missing input file.\n\nExample:\n  node parse_votum_txt_to_sql.js "Votum dataset.txt" scheduled_polls_insert.sql'
    );
    process.exit(1);
}

function isBlank(line) {
    return !String(line || "").trim();
}

function looksAllCaps(s) {
    const t = String(s || "").trim();
    if (!t) return false;
    const letters = t.replace(/[^A-Za-z]/g, "");
    if (!letters) return false;
    return letters === letters.toUpperCase();
}

function isHeaderLine(line) {
    const t = String(line || "").trim();
    if (!t) return false;

    if (t.startsWith("#")) return true;
    if (t.endsWith(":")) return true;
    if (looksAllCaps(t) && t.length <= 80) return true;

    // short single/two word section labels
    const short = t.length <= 32;
    const hasQuestionMark = t.includes("?");
    const hasBulletOrSep = /[-–—|•]/.test(t);
    if (short && !hasQuestionMark && !hasBulletOrSep && !/\d/.test(t)) {
        const words = t.split(/\s+/).filter(Boolean);
        if (words.length <= 3) return true;
    }

    return false;
}

function normalizeText(s) {
    return String(s || "")
        .replace(/\uFEFF/g, "") // BOM
        .replace(/\u2019/g, "'") // smart apostrophe
        .replace(/\u2013|\u2014/g, "–") // normalize dashes to en dash
        .trim();
}

function escapeSqlString(s) {
    return String(s).replace(/\\/g, "\\\\").replace(/'/g, "''");
}

/**
 * Strong vote-stripper.
 * Removes:
 * - " – 2,077 votes" / " - 2077 vote" / " — 2 077 голосів"
 * - "(2,077 votes)" / "[2077 votes]"
 * - trailing ": 2077" or " 2077"
 */
function stripVoteTail(input) {
    let t = normalizeText(input);

    // remove leading bullets
    t = t.replace(/^[-*•\u2022]+\s*/, "");

    // 1) Remove bracketed vote counts at end: "(2,077 votes)" / "[2077 votes]"
    t = t.replace(
        /\s*[\(\[]\s*\d[\d\s,.\u00A0]*\s*(?:votes?|vote|голос(?:ів|и)?|голоса)\s*[\)\]]\s*$/i,
        ""
    );

    // 2) Remove dashed/colon vote tails: " – 2,077 votes", " - 1432 голосів", ": 2077 votes"
    t = t.replace(
        /\s*(?:[-–—:])\s*\d[\d\s,.\u00A0]*\s*(?:votes?|vote|голос(?:ів|и)?|голоса)\s*$/i,
        ""
    );

    // 3) Remove just " – 2,077" when it clearly looks like a count (end only)
    t = t.replace(/\s*(?:[-–—:])\s*\d[\d\s,.\u00A0]*\s*$/i, "");

    // 4) Remove trailing " 2,077 votes" without dash (rare)
    t = t.replace(
        /\s+\d[\d\s,.\u00A0]*\s*(?:votes?|vote|голос(?:ів|и)?|голоса)\s*$/i,
        ""
    );

    // Final trim
    return t.trim();
}

function parseBlocks(text) {
    const lines = text.split(/\r?\n/);
    const blocks = [];
    let current = [];

    for (const raw of lines) {
        const line = normalizeText(raw);

        if (isBlank(line)) {
            if (current.length) {
                blocks.push(current);
                current = [];
            }
            continue;
        }

        if (isHeaderLine(line)) {
            if (current.length) {
                blocks.push(current);
                current = [];
            }
            continue;
        }

        current.push(line);
    }

    if (current.length) blocks.push(current);
    return blocks;
}

function blockToPoll(blockLines) {
    if (!blockLines || blockLines.length < 2) return null;

    const question = normalizeText(blockLines[0]);

    // skip titles longer than 50 characters
    if (question.length > 50) return null;

    const options = blockLines
        .slice(1)
        .map(stripVoteTail)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    if (!question || options.length < 2) return null;

    return { question, options };
}

function buildSql(polls) {
    const rows = polls.map((p) => {
        const pollText = escapeSqlString(p.question);
        const optionsJson = JSON.stringify(p.options); // JSON array
        return `('${pollText}', '${escapeSqlString(optionsJson)}'::jsonb)`;
    });

    // Multi-row inserts in chunks for faster execution
    const CHUNK = 400;
    const statements = [];

    for (let i = 0; i < rows.length; i += CHUNK) {
        const slice = rows.slice(i, i + CHUNK);
        statements.push(
            `INSERT INTO scheduled_polls (poll_text, options) VALUES\n` +
            slice.map((r) => `  ${r}`).join(",\n") +
            ";\n"
        );
    }

    return (
        "-- Auto-generated from Votum dataset txt\n" +
        "-- Guarantees: vote counts stripped from options\n" +
        "-- Target table: scheduled_polls(poll_text, options)\n" +
        `-- Total polls: ${polls.length}\n\n` +
        statements.join("\n")
    );
}

/**
 * Extra safety: assert no option contains "vote"/"votes"/"голос" + digits.
 * If it does, the script FAILS and prints examples.
 */
function assertNoVotes(polls) {
    const bad = [];
    const votePattern = /\b(?:votes?|vote|голос(?:ів|и)?|голоса)\b/i;
    const digitPattern = /\d/;

    for (const p of polls) {
        for (const opt of p.options) {
            if (votePattern.test(opt) && digitPattern.test(opt)) {
                bad.push({ q: p.question, opt });
                if (bad.length >= 20) break;
            }
        }
        if (bad.length >= 20) break;
    }

    if (bad.length) {
        console.error("❌ Vote text detected in options after stripping. Examples:");
        for (const b of bad) {
            console.error(`Q: ${b.q}\n  Option: ${b.opt}\n`);
        }
        process.exit(3);
    }
}

// ---- main ----
const inputText = fs.readFileSync(inputPath, "utf8");
const blocks = parseBlocks(inputText);

const polls = [];
for (const b of blocks) {
    const poll = blockToPoll(b);
    if (poll) polls.push(poll);
}

if (!polls.length) {
    console.error(
        "No polls parsed. Your txt format might differ.\n" +
        "Tip: paste 20 lines here and I’ll adapt the parser."
    );
    process.exit(2);
}

assertNoVotes(polls);

const sql = buildSql(polls);
fs.writeFileSync(outputPath, sql, "utf8");

console.log(
    `✅ Parsed ${polls.length} polls.\n` +
    `✅ Wrote SQL to: ${path.resolve(outputPath)}\n\n` +
    `Run it with:\n  psql -d poll_app -f "${outputPath}"`
);