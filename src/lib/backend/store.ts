import { defaultPronunciationSettings } from '@/lib/pronunciation/settings';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { CATEGORIES } from '@/lib/vocabulary';
import { defaultSettings, validateContent, type ContentStore, type ManagedCategory } from './types';
const directory = process.env.VOCAKIDS_CONTENT_DIR || path.join(process.cwd(), 'data', 'backend');
const file = path.join(directory, 'content.json');
export function readContent(): ContentStore {
  if (fs.existsSync(/* turbopackIgnore: true */ file)) { const data = JSON.parse(fs.readFileSync(file, 'utf8')) as ContentStore; data.settings.pronunciation = { ...defaultPronunciationSettings, ...data.settings.pronunciation }; return data; }
  return { revision: 0, categories: structuredClone(CATEGORIES) as ManagedCategory[], settings: { ...defaultSettings }, updatedAt: '' };
}
export function writeContent(input: unknown): ContentStore {
  validateContent(input);
  const current = readContent();
  if (input.revision !== current.revision) throw new Error('CONFLICT');
  for (const cat of input.categories) for (const word of cat.words) {
    const old = current.categories.find(c => c.id === cat.id)?.words.find(w => w.id === word.id);
    if ((!old || old.en !== word.en || old.vi !== word.vi) && (!word.en.trim() || !word.vi.trim())) throw new Error('Từ mới hoặc nghĩa được sửa cần đủ tiếng Anh và tiếng Việt.');
  }
  const next = { ...input, settings: { ...input.settings, pronunciation: input.settings.pronunciation ?? current.settings.pronunciation }, revision: current.revision + 1, updatedAt: new Date().toISOString() };
  fs.mkdirSync(directory, { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, JSON.stringify(next, null, 2), { mode: 0o600 });
  fs.renameSync(temporary, file);
  return next;
}

