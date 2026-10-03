import json
from collections import Counter

with open('scratch/extracted_sgk4_tap2_words.json', 'r', encoding='utf-8') as f:
    words = json.load(f)

print(f"Total words in json: {len(words)}")

units = Counter(w.get('unit') for w in words)
print("Units distribution:", sorted(units.items(), key=lambda x: str(x[0])))

print("\nAll words by Unit:")
by_unit = {}
for w in words:
    u = w.get('unit')
    by_unit.setdefault(u, []).append(w)

import sys
sys.stdout.reconfigure(encoding='utf-8')

for w in words[:20]:
    print(f"  {w.get('en')} {w.get('phonetic')} ({w.get('word_class')}) - {w.get('vi')} [Unit: {w.get('unit')}]")
