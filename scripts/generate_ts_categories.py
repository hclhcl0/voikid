import json

cats = json.load(open('d:/engl/vocakids/scratch/lop4_final_categories.json', encoding='utf-8'))

lines = []
lines.append("  // ════════════════════════════════════════")
lines.append("  // LỚP 4 – SGK Tiếng Anh 4 Tập 1 (Chương trình mới / Global Success)")
lines.append("  // Toàn bộ 89 từ vựng chính thức từ Bảng tra từ (Wordlist) của SGK")
lines.append("  // ════════════════════════════════════════\n")

for c in cats:
    lines.append(f"  // ── {c['name_vi']} ────────────────")
    lines.append("  {")
    lines.append(f"    id: '{c['id']}',")
    lines.append(f"    gradeId: '{c['gradeId']}',")
    lines.append(f"    name_vi: '{c['name_vi']}',")
    lines.append(f"    name_en: '{c['name_en']}',")
    lines.append(f"    emoji: '{c['emoji']}',")
    lines.append(f"    color: '{c['color']}',")
    lines.append(f"    gradient: '{c['gradient']}',")
    lines.append("    words: [")
    for w in c['words']:
        en_escaped = w['en'].replace("'", "\\'")
        vi_escaped = w['vi'].replace("'", "\\'")
        ph_escaped = w['phonetic'].replace("'", "\\'")
        ex_en_esc = w['example_en'].replace("'", "\\'")
        ex_vi_esc = w['example_vi'].replace("'", "\\'")
        lines.append(f"      {{ id: '{w['id']}', en: '{en_escaped}', vi: '{vi_escaped}', emoji: '{w['emoji']}', phonetic: '{ph_escaped}', example_en: '{ex_en_esc}', example_vi: '{ex_vi_esc}' }},")
    lines.append("    ],")
    lines.append("  },\n")

code = "\n".join(lines)
with open('d:/engl/vocakids/scratch/lop4_code.ts', 'w', encoding='utf-8') as fp:
    fp.write(code)

print("Generated d:/engl/vocakids/scratch/lop4_code.ts successfully!")
print(f"Total lines: {len(lines)}")
