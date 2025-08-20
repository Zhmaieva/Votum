# Train
node nb.js train data/data.jsonl models/model.json
node tfidf_lr.js train data/data.jsonl models/model_lr.json --epochs 6 --lr 0.5 --vocab 40000

python3 train_classifier.py --mode train --data data/data.jsonl --model models/model.pth --test-size 0.2

# Predict
node nb.js predict models/model.json "AI beats human benchmark in language tasks" --topk 2
node tfidf_lr.js predict models/model_lr.json "We planned a picnic with neighbors next week in the park"


# Add a single example
node nb.js add models/model.json tech "TypeScript 5.7 released with new features"

# Evaluate on a test set
node nb.js eval models/model.json data/data.jsonl
node tfidf_lr.js eval models/model_lr.json data/data.jsonl

python3 train_classifier.py --mode predict --data data/data.jsonl --model model/model.pth --text "do you like sushi?"

# Continue training with more data later
node nb.js retrain models/model.json data/more_data.jsonl
