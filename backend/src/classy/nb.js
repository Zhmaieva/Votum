#!/usr/bin/env node
/**
 * Naive Bayes Text Classifier — single-file console app
 * Usage examples at bottom (or run: node nb.js --help)
 *
 * Dataset format: JSONL (one JSON per line) OR a JSON array.
 *   {"label":"sports","text":"The team won the match"}
 *   {"label":"tech","text":"New JavaScript release"}
 */

const fs = require('fs');

const ALPHA = 1;        // Laplace smoothing
const MAX_TOKENS = 50000; // safety cap for vocabulary size

// --------- tiny helpers ----------
function readJSONMaybeJSONL(path) {
    const raw = fs.readFileSync(path, 'utf8').trim();
    if (!raw) return [];
    // Try JSON first
    try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
    } catch (_) {}
    // Fallback: JSONL
    return raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
}

function writeJSON(path, obj) {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2), 'utf8');
    console.error(`saved: ${path}`);
}

function loadModel(path) {
    const m = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (!m.__schema || m.__schema !== 'nb.v1') throw new Error('Unsupported model file');
    return m;
}

function tokenize(text) {
    // Lowercase + split on non-letters/numbers, keep unicode letters/digits
    const tokens = (text || '')
        .toLowerCase()
        .normalize('NFC')
        .split(/[^\\p{L}\\p{N}]+/u)
        .filter(t => t && t.length <= 40);
    return tokens;
}

// --------- model ops ----------
function emptyModel() {
    return {
        __schema: 'nb.v1',
        totalDocs: 0,
        classes: {},       // class -> { docCount, tokenCount, tokenFreq: {token: count} }
        vocab: {},         // token -> true
        vocabSize: 0
    };
}

function ensureClass(m, label) {
    if (!m.classes[label]) m.classes[label] = { docCount: 0, tokenCount: 0, tokenFreq: {} };
    return m.classes[label];
}

function addExample(m, label, text) {
    const c = ensureClass(m, label);
    const tokens = tokenize(text);
    c.docCount += 1;
    m.totalDocs += 1;

    for (const tok of tokens) {
        c.tokenFreq[tok] = (c.tokenFreq[tok] || 0) + 1;
        c.tokenCount += 1;
        if (!m.vocab[tok]) {
            if (m.vocabSize >= MAX_TOKENS) continue; // soft cap
            m.vocab[tok] = true;
            m.vocabSize += 1;
        }
    }
}

function trainFromDataset(m, dataset) {
    let added = 0;
    for (const row of dataset) {
        if (!row || typeof row.label !== 'string' || typeof row.text !== 'string') continue;
        addExample(m, row.label, row.text);
        added++;
    }
    return added;
}

function classScores(m, text) {
    const tokens = tokenize(text);
    const scores = [];
    for (const [label, c] of Object.entries(m.classes)) {
        // log prior
        let logp = Math.log(Math.max(1, c.docCount)) - Math.log(Math.max(1, m.totalDocs));
        // likelihood
        const denom = c.tokenCount + ALPHA * m.vocabSize;
        for (const tok of tokens) {
            const cnt = c.tokenFreq[tok] || 0;
            const num = cnt + ALPHA;
            logp += Math.log(num) - Math.log(denom);
        }
        scores.push({ label, logp });
    }
    // sort desc by logp
    scores.sort((a, b) => b.logp - a.logp);
    return scores;
}

function predict(m, text, topk = 3) {
    const scores = classScores(m, text).slice(0, topk);
    // Convert to relative probabilities via softmax on log-scores
    const max = scores.length ? scores[0].logp : 0;
    const exps = scores.map(s => Math.exp(s.logp - max));
    const sum = exps.reduce((a, b) => a + b, 0) || 1;
    return scores.map((s, i) => ({ label: s.label, prob: exps[i] / sum }));
}

function evaluate(m, dataset) {
    let ok = 0, total = 0;
    for (const row of dataset) {
        if (!row || typeof row.label !== 'string' || typeof row.text !== 'string') continue;
        const pred = predict(m, row.text, 1)[0];
        if (pred && pred.label === row.label) ok++;
        total++;
    }
    const acc = total ? ok / total : 0;
    return { accuracy: acc, ok, total };
}

// --------- CLI ----------
function help() {
    console.log(`
Naive Bayes Text Classifier (local, no deps)

USAGE
  # Train new model from dataset
  node nb.js train <dataset.json|jsonl> <outModel.json>

  # Continue training an existing model with more data
  node nb.js retrain <model.json> <dataset.json|jsonl>

  # Add a single labeled sample
  node nb.js add <model.json> <label> <text...>

  # Predict top classes for given text
  node nb.js predict <model.json> <text...> [--topk 3]

  # Evaluate model on a labeled dataset
  node nb.js eval <model.json> <dataset.json|jsonl>

DATASET FORMAT
  Either JSON array or JSONL with objects containing { "label": "...", "text": "..." }

EXAMPLES
  node nb.js train data.jsonl model.json
  node nb.js predict model.json "Breaking: new iPhone uses faster chips"
  node nb.js add model.json tech "TypeScript 5.7 adds new features"
  node nb.js eval model.json test.jsonl
`);
}

(async function main() {
    const [cmd, ...args] = process.argv.slice(2);
    try {
        switch (cmd) {
            case 'train': {
                const [dataPath, outModel] = args;
                if (!dataPath || !outModel) return help();
                const ds = readJSONMaybeJSONL(dataPath);
                const model = emptyModel();
                const added = trainFromDataset(model, ds);
                console.error(`trained on ${added} samples, classes: ${Object.keys(model.classes).length}, vocab: ${model.vocabSize}`);
                writeJSON(outModel, model);
                break;
            }
            case 'retrain': {
                const [modelPath, dataPath] = args;
                if (!modelPath || !dataPath) return help();
                const model = loadModel(modelPath);
                const ds = readJSONMaybeJSONL(dataPath);
                const beforeDocs = model.totalDocs;
                const added = trainFromDataset(model, ds);
                console.error(`added ${added} samples (docs ${beforeDocs} -> ${model.totalDocs}), vocab: ${model.vocabSize}`);
                writeJSON(modelPath, model);
                break;
            }
            case 'add': {
                const [modelPath, label, ...textParts] = args;
                if (!modelPath || !label || textParts.length === 0) return help();
                const text = textParts.join(' ');
                const model = loadModel(modelPath);
                addExample(model, label, text);
                console.error(`added 1 sample to "${label}". totalDocs=${model.totalDocs}`);
                writeJSON(modelPath, model);
                break;
            }
            case 'predict': {
                const topkIdx = args.indexOf('--topk');
                let topk = 3;
                if (topkIdx !== -1) {
                    topk = parseInt(args[topkIdx + 1], 10) || 3;
                    args.splice(topkIdx, 2);
                }
                const [modelPath, ...textParts] = args;
                if (!modelPath || textParts.length === 0) return help();
                const text = textParts.join(' ');
                const model = loadModel(modelPath);
                const preds = predict(model, text, topk);
                console.log(JSON.stringify({ text, predictions: preds }, null, 2));
                break;
            }
            case 'eval': {
                const [modelPath, dataPath] = args;
                if (!modelPath || !dataPath) return help();
                const model = loadModel(modelPath);
                const ds = readJSONMaybeJSONL(dataPath);
                const res = evaluate(model, ds);
                console.log(JSON.stringify(res, null, 2));
                break;
            }
            case '--help':
            case '-h':
            default:
                help();
        }
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
