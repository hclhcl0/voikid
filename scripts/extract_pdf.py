import os
import sys
import glob
import pypdf
import json

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

# Find the exact PDF file
target_files = glob.glob('C:/Users/SingPC/Downloads/*SGK*4*1*.pdf')
if not target_files:
    target_files = glob.glob('C:/Users/SingPC/Downloads/*4*1*.pdf')

print("Matching files:")
for f in target_files:
    print(" -", os.path.basename(f), f"({os.path.getsize(f)} bytes)")

pdf_path = None
for f in target_files:
    if "SGK" in f and "Tap 1" in f or "Tập 1" in f or "13258100" in str(os.path.getsize(f)):
        pdf_path = f
        break

if not pdf_path and target_files:
    pdf_path = target_files[0]

print(f"\nAnalyzing: {pdf_path}")
reader = pypdf.PdfReader(pdf_path)
total_pages = len(reader.pages)
print(f"Total pages: {total_pages}")

# Check text length on all pages
non_empty = 0
for i in range(total_pages):
    text = reader.pages[i].extract_text() or ""
    if len(text.strip()) > 20:
        non_empty += 1
        if non_empty <= 5 or i >= total_pages - 10:
            print(f"Page {i+1} ({len(text)} chars):")
            first_lines = [l.strip() for l in text.split('\n') if l.strip()][:8]
            print("   " + " | ".join(first_lines))

print(f"\nNon-empty text pages: {non_empty}/{total_pages}")
