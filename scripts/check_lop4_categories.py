import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/vocabulary.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match categories
cat_matches = re.findall(r"id:\s*'([^']+)',\s*gradeId:\s*'lop4',\s*name_vi:\s*'([^']+)'", content)
print(f"Total Lop 4 categories found: {len(cat_matches)}")
for cid, cvi in cat_matches:
    print(f" - [{cid}] {cvi}")

# Count total l4_ words
word_matches = re.findall(r"id:\s*'(l4_[^']+)'", content)
print(f"\nTotal l4_ words found: {len(word_matches)} words")
