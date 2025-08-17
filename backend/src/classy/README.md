# Train
node nb.js train data/data.jsonl models/model.json

# Predict
node nb.js predict models/model.json "AI beats human benchmark in language tasks" --topk 2

# Add a single example
node nb.js add models/model.json tech "TypeScript 5.7 released with new features"

# Evaluate on a test set
node nb.js eval models/model.json data/data.jsonl

# Continue training with more data later
node nb.js retrain models/model.json data/more_data.jsonl