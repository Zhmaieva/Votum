#!/usr/bin/env node
/* TF-IDF + One-vs-Rest Logistic Regression (no deps)
 * Usage:
 *   node tfidf_lr.js train train.jsonl model.json [--epochs 6] [--lr 0.5] [--vocab 30000]
 *   node tfidf_lr.js predict model.json "your text here" [--topk 3]
 *   node tfidf_lr.js eval model.json test.jsonl
 */

const fs = require('fs');

// -------- Config defaults --------
const DEF = { EPOCHS: 6, LR: 0.5, L2: 1e-6, VOCAB: 30000, MIN_DF: 2, USE_BIGRAMS: true };

// -------- IO --------
function readJSONMaybeJSONL(path) {
    const raw = fs.readFileSync(path, 'utf8').trim();
    try { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr; } catch {}
    return raw.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
}
function saveJSON(path, obj){ fs.writeFileSync(path, JSON.stringify(obj), 'utf8'); console.error(`saved: ${path}`); }
function loadJSON(path){ return JSON.parse(fs.readFileSync(path,'utf8')); }

// -------- Text utils --------
const STOP = new Set(["the","a","an","and","or","but","of","to","in","on","at","for","from","with","by","as","is","are","was","were","be","been","being","that","this","it","its","into","about","after","over","under","than","then","so","if","we","you","they","he","she","i","me","my","our","your","their"]);
function tokens(text){
    const arr = (text||"").toLowerCase().normalize('NFC').split(/[^\p{L}\p{N}]+/u).filter(t => t && t.length<=40);
    const uni = arr.filter(t => !STOP.has(t));
    if (!DEF.USE_BIGRAMS) return uni;
    const bi = [];
    for (let i=0;i<uni.length-1;i++) bi.push(uni[i]+"_"+uni[i+1]);
    return uni.concat(bi);
}

// -------- Build vocab + IDF --------
function buildVocabAndIdf(dataset, maxVocab=DEF.VOCAB, minDf=DEF.MIN_DF){
    const df = new Map(); let nDocs = 0;
    for (const r of dataset){ if (!r?.text) continue; nDocs++;
        const set = new Set(tokens(r.text));
        for (const t of set){ df.set(t, (df.get(t)||0)+1); }
    }
    // Filter by minDf, sort by df desc (common first) but cap size
    const entries = [...df.entries()].filter(([,d]) => d>=minDf).sort((a,b)=>b[1]-a[1]).slice(0,maxVocab);
    const vocab = new Map(entries.map(([tok],i)=>[tok,i]));
    const idf = new Float32Array(vocab.size);
    for (const [tok,i] of vocab) {
        const dfi = df.get(tok)||1;
        idf[i] = Math.log((nDocs + 1) / (dfi + 1)) + 1; // smooth IDF
    }
    return { vocab, idf, nDocs };
}

// -------- Vectorize (TF-IDF, L2 norm) --------
function vecTfidf(text, vocab, idf){
    const idx = new Map();
    for (const t of tokens(text)){
        const i = vocab.get(t); if (i===undefined) continue;
        idx.set(i, (idx.get(i)||0) + 1);
    }
    if (idx.size===0) return { idxs: [], vals: [] };
    // logTF
    const idxs = []; const vals = [];
    for (const [i, tf] of idx){
        idxs.push(i); vals.push( (1 + Math.log(tf)) * idf[i] );
    }
    // L2 normalize
    let norm = Math.sqrt(vals.reduce((s,v)=>s+v*v,0)) || 1;
    for (let k=0;k<vals.length;k++) vals[k] /= norm;
    return { idxs, vals };
}

// -------- Labels <-> ids --------
function labelMap(dataset){
    const set = new Set();
    for (const r of dataset) if (typeof r?.label==='string') set.add(r.label);
    const labels = [...set].sort();
    const map = new Map(labels.map((l,i)=>[l,i]));
    return { labels, map };
}

// -------- Logistic Regression (SGD), one-vs-rest --------
function trainOVR(dataset, vocab, idf, labels, opts){
    const D = vocab.size, K = labels.length;
    const epochs = opts.epochs ?? DEF.EPOCHS;
    const lr = opts.lr ?? DEF.LR;
    const l2 = opts.l2 ?? DEF.L2;

    // weights: K x D (Float32), bias: K
    const W = Array.from({length: K}, () => new Float32Array(D));
    const b = new Float32Array(K);

    // pre-vectorize to speed up epochs
    const X = []; const y = [];
    for (const r of dataset){
        if (!r?.text || !labels.includes(r.label)) continue;
        X.push(vecTfidf(r.text, vocab, idf));
        y.push(labels.indexOf(r.label));
    }

    function dotRow(k, x){ // k-th classifier score
        const w = W[k]; let s = b[k];
        for (let t=0;t<x.idxs.length;t++) s += w[x.idxs[t]] * x.vals[t];
        return s;
    }
    function axpyRow(k, x, g){ // w += g * x
        const w = W[k];
        for (let t=0;t<x.idxs.length;t++) w[x.idxs[t]] += g * x.vals[t];
    }
    function l2DecayRow(k, eta){
        const w = W[k];
        for (let j=0;j<w.length;j++) w[j] *= (1 - eta*l2);
        b[k] *= (1 - eta*l2);
    }

    for (let ep=0; ep<epochs; ep++){
        let loss=0;
        for (let i=0;i<X.length;i++){
            const x = X[i]; const yi = y[i];
            for (let k=0;k<K;k++){
                // Binary logistic for class k vs rest
                const yk = (k===yi)? 1: 0;
                const s = dotRow(k, x);
                const p = 1 / (1 + Math.exp(-s));
                const g = (yk - p); // gradient on score
                // L2 decay then update
                l2DecayRow(k, lr);
                axpyRow(k, x, lr * g);
                b[k] += lr * g;
                // loss (log loss)
                loss += -( yk ? Math.log(p+1e-12) : Math.log(1-p+1e-12) );
            }
        }
        if ((ep+1)%1===0) console.error(`epoch ${ep+1}/${epochs} — avg loss ${(loss/(X.length*K)).toFixed(4)}`);
    }
    return { W: W.map(row=>Array.from(row)), b: Array.from(b) };
}

// -------- Predict --------
function predictProba(model, text){
    const { vocabObj, idf, labels, W, b } = model;
    const vocab = new Map(Object.entries(vocabObj).map(([t,i])=>[t, i|0]));
    const x = vecTfidf(text, vocab, Float32Array.from(idf));
    const K = labels.length;
    const scores = new Float32Array(K);
    for (let k=0;k<K;k++){
        let s = b[k];
        const w = W[k];
        for (let t=0;t<x.idxs.length;t++) s += w[x.idxs[t]] * x.vals[t];
        scores[k] = s;
    }
    // softmax
    const m = Math.max(...scores);
    let sum = 0; for (let k=0;k<K;k++){ scores[k] = Math.exp(scores[k]-m); sum += scores[k]; }
    const probs = []; for (let k=0;k<K;k++) probs.push(scores[k]/(sum||1));
    return probs.map((p,k)=>({label: labels[k], prob: p})).sort((a,b)=>b.prob-a.prob);
}

// -------- Eval --------
function evaluate(model, data){
    let ok=0, tot=0;
    for (const r of data){
        if (!r?.text || !r?.label) continue;
        const pred = predictProba(model, r.text)[0];
        if (pred?.label === r.label) ok++;
        tot++;
    }
    return { accuracy: tot? ok/tot : 0, total: tot, correct: ok };
}

// -------- CLI --------
function help(){
    console.log(`TF-IDF + Logistic Regression (no deps)
USAGE
  node tfidf_lr.js train <data.json|jsonl> <outModel.json> [--epochs 6] [--lr 0.5] [--vocab 30000]
  node tfidf_lr.js predict <model.json> <text...> [--topk 3]
  node tfidf_lr.js eval <model.json> <data.json|jsonl>
`);}

(function main(){
    const argv = process.argv.slice(2);
    const cmd = argv[0];
    try{
        if (cmd === 'train'){
            const dataPath = argv[1], outPath = argv[2];
            if (!dataPath || !outPath) return help();
            const epochsIdx = argv.indexOf('--epochs'); const lrIdx = argv.indexOf('--lr'); const vocabIdx = argv.indexOf('--vocab');
            const opts = {
                epochs: epochsIdx>-1 ? parseInt(argv[epochsIdx+1],10) : DEF.EPOCHS,
                lr: lrIdx>-1 ? parseFloat(argv[lrIdx+1]) : DEF.LR,
                vocab: vocabIdx>-1 ? parseInt(argv[vocabIdx+1],10) : DEF.VOCAB,
            };
            const data = readJSONMaybeJSONL(dataPath);
            const { labels } = labelMap(data);
            const { vocab, idf, nDocs } = buildVocabAndIdf(data, opts.vocab, DEF.MIN_DF);
            console.error(`labels=${labels.length}, docs=${nDocs}, vocab=${vocab.size}`);
            const trained = trainOVR(data, vocab, idf, labels, opts);
            // Save model
            const vocabObj = {}; for (const [t,i] of vocab) vocabObj[t]=i;
            const model = { __schema:'tfidf_lr.v1', labels, vocabObj, idf: Array.from(idf), W: trained.W, b: trained.b, cfg: { USE_BIGRAMS: DEF.USE_BIGRAMS, MIN_DF: DEF.MIN_DF } };
            saveJSON(outPath, model);
        } else if (cmd === 'predict'){
            const modelPath = argv[1]; if (!modelPath) return help();
            const topkIdx = argv.indexOf('--topk'); let topk = 3; if (topkIdx>-1) topk = parseInt(argv[topkIdx+1],10)||3;
            const text = argv.slice(2).filter(x=>!x.startsWith('--')).join(' '); if (!text) return help();
            const model = loadJSON(modelPath);
            const res = predictProba(model, text).slice(0, topk);
            console.log(JSON.stringify({ text, predictions: res }, null, 2));
        } else if (cmd === 'eval'){
            const modelPath = argv[1], dataPath = argv[2]; if (!modelPath || !dataPath) return help();
            const model = loadJSON(modelPath);
            const data = readJSONMaybeJSONL(dataPath);
            const out = evaluate(model, data);
            console.log(JSON.stringify(out, null, 2));
        } else help();
    } catch(err){
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
