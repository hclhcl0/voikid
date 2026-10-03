import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
words = json.load(open('d:/engl/vocakids/scratch/extracted_sgk4_words.json', encoding='utf-8'))
print(f"Total words: {len(words)}")
for i, w in enumerate(words):
    print(f"{i+1}. {w.get('en')} -> {w.get('vi')} ({w.get('phonetic')})")
