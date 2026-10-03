import re

vocab_path = 'd:/engl/vocakids/src/lib/vocabulary.ts'
with open(vocab_path, 'r', encoding='utf-8') as fp:
    content = fp.read()

with open('d:/engl/vocakids/scratch/lop4_code.ts', 'r', encoding='utf-8') as fp:
    new_lop4_code = fp.read()

# Pattern matching from "// LỚP 4" down to "// LỚP 5"
start_marker = "  // ════════════════════════════════════════\n  // LỚP 4 – SGK Tiếng Anh 4 Global Success"
end_marker = "  // ════════════════════════════════════════\n  // LỚP 5"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx == -1 or end_idx == -1:
    print(f"Error: Markers not found! start_idx={start_idx}, end_idx={end_idx}")
    exit(1)

new_content = content[:start_idx] + new_lop4_code + "\n" + content[end_idx:]

with open(vocab_path, 'w', encoding='utf-8') as fp:
    fp.write(new_content)

print(f"Successfully replaced Lớp 4 vocabulary in {vocab_path}!")
