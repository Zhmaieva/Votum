import json
import numpy as np
from collections import Counter
import re
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import argparse
from sklearn.model_selection import train_test_split
from fastapi import FastAPI, HTTPException
from fastapi.responses import PlainTextResponse
import uvicorn

# Config
DATA_PATH = 'data/data.jsonl'
MODEL_PATH = 'models/model.pth'
EPOCHS = 20
LR = 0.01
HIDDEN_SIZE = 128
VOCAB_SIZE = 30000
MIN_DF = 2
USE_BIGRAMS = True
TEST_SIZE = 0.2
BATCH_SIZE = 32
API_PORT = 3033
STOP = set(["the","a","an","and","or","but","of","to","in","on","at","for","from","with","by","as","is","are","was","were","be","been","being","that","this","it","its","into","about","after","over","under","than","then","so","if","we","you","they","he","she","i","me","my","our","your","their"])

# Tokenization
def tokens(text):
    text = text.lower().strip()
    toks = re.split(r'\W+', text)
    toks = [t for t in toks if t and t not in STOP]
    if USE_BIGRAMS:
        bi = [toks[i] + '_' + toks[i+1] for i in range(len(toks)-1) if len(toks) > 1]
        toks += bi
    return toks

# Load data from JSONL
def load_data(path):
    data = []
    try:
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    d = json.loads(line)
                    if 'label' in d and 'text' in d:
                        data.append(d)
                except json.JSONDecodeError:
                    continue
    except FileNotFoundError:
        raise FileNotFoundError(f"Dataset file {path} not found")
    return data

# Remove duplicates based on text
def remove_duplicates(data):
    unique_data = []
    seen = set()
    for r in data:
        if r['text'] not in seen:
            seen.add(r['text'])
            unique_data.append(r)
    return unique_data

# Build label map
def get_labels(data):
    labels = sorted(set(r['label'] for r in data))
    label_map = {l: i for i, l in enumerate(labels)}
    return labels, label_map

# Build vocab and IDF
def build_vocab_idf(data):
    df = Counter()
    for r in data:
        toks = tokens(r['text'])
        for t in set(toks):
            df[t] += 1
    vocab_list = [t for t, c in df.most_common(VOCAB_SIZE) if c >= MIN_DF]
    vocab = {t: i for i, t in enumerate(vocab_list)}
    n_docs = len(data)
    idf = np.array([np.log((n_docs + 1) / (df[t] + 1)) + 1 for t in vocab_list])
    return vocab, idf

# TF-IDF vectorization
def tfidf_vectorize(text, vocab, idf):
    count = Counter(tokens(text))
    vec = np.zeros(len(vocab))
    for t, tf in count.items():
        if t in vocab:
            i = vocab[t]
            vec[i] = (1 + np.log(tf)) * idf[i]
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec

# Custom Dataset
class TextDataset(Dataset):
    def __init__(self, features, labels):
        self.features = features
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return torch.tensor(self.features[idx], dtype=torch.float32), torch.tensor(self.labels[idx], dtype=torch.long)

# MLP Model
class Classifier(nn.Module):
    def __init__(self, input_size, hidden_size, num_classes):
        super(Classifier, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(hidden_size, num_classes)

    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

# Train function
def train(model, loader, criterion, optimizer, epochs):
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for batch_x, batch_y in loader:
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f'Epoch {epoch+1}/{epochs}, Loss: {total_loss / len(loader):.4f}')

# Evaluate function
def evaluate(model, features, true_labels, labels):
    model.eval()
    with torch.no_grad():
        inputs = torch.tensor(features, dtype=torch.float32)
        outputs = model(inputs)
        pred_labels = outputs.argmax(dim=1).numpy()
    accuracy = np.mean(pred_labels == true_labels)
    return accuracy

# Predict function (fixed to avoid tensor creation warning)
def predict(model, text, vocab, idf, labels):
    model.eval()
    with torch.no_grad():
        vec = tfidf_vectorize(text, vocab, idf)
        input_tensor = torch.from_numpy(vec).float().unsqueeze(0)  # Convert directly and add batch dimension
        output = model(input_tensor)
        probs = torch.softmax(output, dim=1).numpy()[0]
        top_idx = np.argmax(probs)
        return labels[top_idx], sorted([(labels[i], probs[i]) for i in range(len(labels))], key=lambda x: x[1], reverse=True)

# API setup
app = FastAPI(title="Text Classification API")

@app.on_event("startup")
def load_model_and_data():
    global model, vocab, idf, labels
    data = load_data(DATA_PATH)
    data = remove_duplicates(data)
    if not data:
        raise RuntimeError("No valid data loaded from dataset")
    labels, _ = get_labels(data)
    if not labels:
        raise RuntimeError("No labels found in dataset")
    vocab, idf = build_vocab_idf(data)
    input_size = len(vocab)
    num_classes = len(labels)
    model = Classifier(input_size, HIDDEN_SIZE, num_classes)
    try:
        model.load_state_dict(torch.load(MODEL_PATH))
        print(f"Loaded model from {MODEL_PATH}")
    except FileNotFoundError:
        raise RuntimeError(f"Model file {MODEL_PATH} not found. Please train the model first.")

@app.get("/classify", response_class=PlainTextResponse)
async def classify(q: str):
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    top_category = predict(model, q, vocab, idf, labels)[0]
    return top_category

# Main
def main():
    parser = argparse.ArgumentParser(description='Text classification with PyTorch')
    parser.add_argument('--predict', help='Text to classify in predict mode')
    parser.add_argument('--api', action='store_true', help='Run as API server on port 3033')
    args = parser.parse_args()

    if args.api:
        # Run API server
        uvicorn.run(app, host="0.0.0.0", port=API_PORT)
    else:
        # Console mode
        data = load_data(DATA_PATH)
        data = remove_duplicates(data)
        print(f'Loaded {len(data)} unique examples.')
        labels, label_map = get_labels(data)
        print(f'Classes: {labels}')
        vocab, idf = build_vocab_idf(data)
        features = np.array([tfidf_vectorize(r['text'], vocab, idf) for r in data])
        target = np.array([label_map[r['label']] for r in data])
        input_size = features.shape[1]
        num_classes = len(labels)
        model = Classifier(input_size, HIDDEN_SIZE, num_classes)

        if args.predict:
            # Predict mode
            try:
                model.load_state_dict(torch.load(MODEL_PATH))
                print(f'Loaded model from {MODEL_PATH}')
            except FileNotFoundError:
                print(f'Error: Model file {MODEL_PATH} not found. Please train the model first.')
                return
            top_category, probs = predict(model, args.predict, vocab, idf, labels)
            print(f'Prediction for "{args.predict}":')
            print(f'Top category: {top_category}')
            for label, prob in probs:
                print(f'{label}: {prob:.4f}')
        else:
            # Train mode
            X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=TEST_SIZE, random_state=42)
            dataset = TextDataset(X_train, y_train)
            loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)
            criterion = nn.CrossEntropyLoss()
            optimizer = optim.Adam(model.parameters(), lr=LR)
            train(model, loader, criterion, optimizer, EPOCHS)
            train_acc = evaluate(model, X_train, y_train, labels)
            test_acc = evaluate(model, X_test, y_test, labels)
            print(f'Train Accuracy: {train_acc:.4f}')
            print(f'Test Accuracy: {test_acc:.4f}')
            torch.save(model.state_dict(), MODEL_PATH)
            print(f'Model saved to {MODEL_PATH}')

if __name__ == "__main__":
    main()