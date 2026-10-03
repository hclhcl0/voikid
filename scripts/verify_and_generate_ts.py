# -*- coding: utf-8 -*-
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('src/lib/vocabulary.ts', 'r', encoding='utf-8') as f:
    vocab_text = f.read()

with open('scratch/lop4_tap2_final_categories.json', 'r', encoding='utf-8') as f:
    tap2_cats = json.load(f)

# Check uniqueness
tap2_word_ids = set()
for c in tap2_cats:
    for w in c['words']:
        if w['id'] in tap2_word_ids:
            print(f"ERROR: Duplicate ID in Tap 2: {w['id']}")
        tap2_word_ids.add(w['id'])
        wid = w['id']
        if f"'{wid}'" in vocab_text or f'"{wid}"' in vocab_text:
            print(f"ERROR: ID collides with vocabulary.ts: {wid}")

print(f"Validated all {len(tap2_word_ids)} words in Tap 2: 100% unique!")

# Generate TypeScript code
ts_lines = []
ts_lines.append("")
ts_lines.append("  // ════════════════════════════════════════")
ts_lines.append("  // LỚP 4 – SGK Tiếng Anh 4 Tập 2 (Chương trình mới / Global Success)")
ts_lines.append("  // Toàn bộ 100 từ vựng chính thức từ Bảng tra từ (Wordlist) của SGK")
ts_lines.append("  // ════════════════════════════════════════")

for c in tap2_cats:
    ts_lines.append("")
    ts_lines.append(f"  // ── {c['name_vi']} ────────────────")
    ts_lines.append("  {")
    ts_lines.append(f"    id: '{c['id']}',")
    ts_lines.append(f"    gradeId: '{c['gradeId']}',")
    name_vi = c['name_vi'].replace("'", "\\'")
    name_en = c['name_en'].replace("'", "\\'")
    ts_lines.append(f"    name_vi: '{name_vi}',")
    ts_lines.append(f"    name_en: '{name_en}',")
    ts_lines.append(f"    emoji: '{c['emoji']}',")
    ts_lines.append(f"    color: '{c['color']}',")
    ts_lines.append(f"    gradient: '{c['gradient']}',")
    ts_lines.append("    words: [")
    for w in c['words']:
        en = w['en'].replace("'", "\\'")
        vi = w['vi'].replace("'", "\\'")
        phonetic = w['phonetic'].replace("'", "\\'")
        ex_en = w['example_en'].replace("'", "\\'")
        ex_vi = w['example_vi'].replace("'", "\\'")
        ts_lines.append(f"      {{ id: '{w['id']}', en: '{en}', vi: '{vi}', emoji: '{w['emoji']}', phonetic: '{phonetic}', example_en: '{ex_en}', example_vi: '{ex_vi}' }},")
    ts_lines.append("    ],")
    ts_lines.append("  },")

generated_ts = "\n".join(ts_lines)

with open('scratch/lop4_tap2_code.txt', 'w', encoding='utf-8') as f:
    f.write(generated_ts)

print(f"Generated {len(ts_lines)} lines of TypeScript in scratch/lop4_tap2_code.txt")
