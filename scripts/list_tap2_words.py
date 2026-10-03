import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('scratch/extracted_sgk4_tap2_words.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

print(f"Total words: {len(words)}")
for i in range(10):
    w = words[i]
    print(f"{i+1:3d}. {w['en']:<30} | {w.get('phonetic', ''):<25} | {w.get('vi', '')}")
