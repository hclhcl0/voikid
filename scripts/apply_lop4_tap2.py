# -*- coding: utf-8 -*-
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/vocabulary.ts', 'r', encoding='utf-8') as f:
    orig = f.read()

with open('scratch/lop4_tap2_code.txt', 'r', encoding='utf-8') as f:
    tap2_code = f.read()

marker = "  // ════════════════════════════════════════\n  // LỚP 5"

if marker not in orig:
    print("ERROR: Marker not found in src/lib/vocabulary.ts!")
    sys.exit(1)

parts = orig.split(marker)
updated = parts[0].rstrip() + "\n" + tap2_code + "\n\n" + marker + parts[1]

with open('src/lib/vocabulary.ts', 'w', encoding='utf-8') as f:
    f.write(updated)

print("Successfully injected Lớp 4 Tập 2 categories into src/lib/vocabulary.ts!")
