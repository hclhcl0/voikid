'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { useCustomCategories, CustomCategory } from '@/hooks/useCustomCategories';
import { useAdminContext } from '@/context/AdminContext';
import { Word } from '@/types';
import { WordImage } from '@/components/WordImage';
import { checkWordInDatabase, WordMatchInfo } from '@/lib/vocabularyChecker';

// ── Types ────────────────────────────────────────────────────────────────────
type SourceType = 'txt' | 'pdf' | 'image' | 'url' | 'manual';
type Step = 'input' | 'preview' | 'save' | 'done';
type SaveMode = 'auto' | 'new' | 'existing';

interface ExtractedTopic {
  topic_vi: string;
  topic_en: string;
  emoji: string;
  words: Word[];
}

// ── Source tab config ─────────────────────────────────────────────────────────
const SOURCES: { id: SourceType; label: string; icon: string; accept?: string; desc: string }[] = [
  { id: 'txt',    icon: '📄', label: 'File TXT',   accept: '.txt,text/plain',               desc: 'Văn bản, danh sách từ, đoạn văn...' },
  { id: 'pdf',    icon: '📕', label: 'File PDF',   accept: '.pdf,application/pdf',          desc: 'Sách giáo khoa, giáo trình, worksheet...' },
  { id: 'image',  icon: '🖼️', label: 'Hình ảnh',   accept: '.jpg,.jpeg,.png,.webp,image/*', desc: 'Ảnh chữ, flashcard, trang sách chụp lại...' },
  { id: 'url',    icon: '🌐', label: 'Link Web',   accept: undefined,                       desc: 'URL bài học, trang từ vựng online...' },
  { id: 'manual', icon: '✏️', label: 'Nhập tay',   accept: undefined,                       desc: 'Tự nhập từng từ hoặc dán danh sách...' },
];

const EMOJIS_PRESET = ['📚','🎓','✏️','🌍','🏫','🎯','🌟','📖','🧠','🏆','🎪','🌈','🦁','🌺','🚀','🎵'];

// ── Blank word factory ────────────────────────────────────────────────────────
function blankWord(): Word {
  return {
    id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    en: '', vi: '', phonetic: '', emoji: '📝', example_en: '', example_vi: '',
    topic_vi: 'Chủ đề chung', topic_en: 'General', topic_emoji: '📚',
  };
}

// ── Word Preview/Edit Card ────────────────────────────────────────────────────
function WordPreviewCard({
  word, index, matchInfo, onEdit, onRemove,
}: {
  word: Word;
  index: number;
  matchInfo?: WordMatchInfo;
  onEdit: (w: Word) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(word);
  const commit = () => { onEdit(draft); setEditing(false); };

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85 }}
      transition={{ delay: Math.min(index * 0.04, 0.4) }}
      className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm relative"
    >
      <button onClick={onRemove}
        className="absolute top-2 right-2 text-gray-300 hover:text-rose-500 text-xs font-bold transition-colors w-5 h-5 flex items-center justify-center rounded-full hover:bg-rose-50">
        ✕
      </button>
      {editing ? (
        <div className="space-y-2 pr-5">
          <div className="flex gap-2">
            <input value={draft.emoji} onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
              className="w-14 border rounded-lg px-2 py-1 text-center text-xl" placeholder="😀" />
            <input value={draft.en} onChange={(e) => setDraft({ ...draft, en: e.target.value })}
              className="flex-1 border rounded-lg px-2 py-1 font-bold text-violet-700 text-sm" placeholder="English" />
          </div>
          <input value={draft.vi} onChange={(e) => setDraft({ ...draft, vi: e.target.value })}
            className="w-full border rounded-lg px-2 py-1 text-sm text-rose-600 font-bold" placeholder="Tiếng Việt" />
          <div className="flex gap-2">
            <input value={draft.topic_emoji || '🏷️'} onChange={(e) => setDraft({ ...draft, topic_emoji: e.target.value })}
              className="w-12 border rounded-lg px-2 py-1 text-center text-sm" placeholder="🏷️" title="Icon chủ đề" />
            <input value={draft.topic_vi || ''} onChange={(e) => setDraft({ ...draft, topic_vi: e.target.value })}
              className="flex-1 border rounded-lg px-2 py-1 text-xs text-violet-700 font-bold" placeholder="Chủ đề (VD: Động vật, Trái cây...)" />
          </div>
          <input value={draft.phonetic} onChange={(e) => setDraft({ ...draft, phonetic: e.target.value })}
            className="w-full border rounded-lg px-2 py-1 text-xs text-gray-400 font-mono" placeholder="/phiên âm/" />
          <input value={draft.example_en} onChange={(e) => setDraft({ ...draft, example_en: e.target.value })}
            className="w-full border rounded-lg px-2 py-1 text-xs" placeholder="Example sentence..." />
          <input value={draft.example_vi} onChange={(e) => setDraft({ ...draft, example_vi: e.target.value })}
            className="w-full border rounded-lg px-2 py-1 text-xs" placeholder="Câu ví dụ tiếng Việt..." />
          <div className="flex gap-2">
            <button onClick={commit} className="flex-1 py-1.5 bg-violet-500 text-white rounded-lg text-xs font-bold">✓ Lưu</button>
            <button onClick={() => setEditing(false)} className="flex-1 py-1.5 bg-gray-100 rounded-lg text-xs font-bold">Hủy</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)} className="w-full text-left">
          <div className="flex items-center gap-3 pr-4">
            <div className="w-10 h-10 flex items-center justify-center shrink-0">
              <WordImage word={word} size="sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-black text-violet-700 text-sm">{word.en}</span>
                {word.phonetic && <span className="text-gray-400 text-xs font-mono">{word.phonetic}</span>}
                {matchInfo?.isDuplicate ? (
                  <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-300 font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs" title={`Đã có trong ${matchInfo.gradeName}: ${matchInfo.categoryName}`}>
                    <span>🟡</span>
                    <span>Đã có ({matchInfo.gradeName || 'SGK'})</span>
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-2xs">
                    <span>🟢</span>
                    <span>Từ mới tinh</span>
                  </span>
                )}
                {word.topic_vi && (
                  <span className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 font-bold px-1.5 py-0.5 rounded-full inline-flex items-center gap-1">
                    <span>{word.topic_emoji || '🏷️'}</span>
                    <span>{word.topic_vi}</span>
                  </span>
                )}
              </div>
              <p className="font-bold text-rose-500 text-xs">{word.vi}</p>
              {word.example_en && <p className="text-gray-400 text-xs mt-0.5 truncate">{word.example_en}</p>}
            </div>
            <span className="text-gray-300 text-xs shrink-0">✏️</span>
          </div>
        </button>
      )}
    </motion.div>
  );
}

// ── Drop Zone ─────────────────────────────────────────────────────────────────
function DropZone({ onFile, accept, label }: { onFile: (f: File) => void; accept: string; label: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }, [onFile]);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
        drag ? 'border-violet-500 bg-violet-50 scale-[1.01]' : 'border-gray-300 bg-gray-50 hover:border-violet-300 hover:bg-violet-50/50'
      }`}
    >
      <input ref={inputRef} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <div className="text-5xl mb-3">{drag ? '✨' : '📂'}</div>
      <p className="font-bold text-gray-600 text-sm">{label}</p>
      <p className="text-gray-400 text-xs mt-1">Kéo thả vào đây hoặc nhấn để chọn</p>
    </div>
  );
}

// ── Manual Entry Panel ────────────────────────────────────────────────────────
function ManualEntryPanel({ onDone }: { onDone: (words: Word[]) => void }) {
  const { apiKey } = useSettings();
  const [rows, setRows] = useState<Word[]>([blankWord()]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [enrichingId, setEnrichingId] = useState<string | null>(null);
  const [enrichingAll, setEnrichingAll] = useState(false);

  const addRow = () => setRows((p) => [...p, blankWord()]);
  const updateWord = (id: string, field: keyof Word, val: string) =>
    setRows((p) => p.map((w) => w.id === id ? { ...w, [field]: val } : w));
  const removeRow = (id: string) => setRows((p) => p.filter((w) => w.id !== id));

  const enrichWordWithAi = async (id: string, enText: string) => {
    if (!enText.trim()) return;
    setEnrichingId(id);
    try {
      const res = await fetch('/api/word/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: enText.trim(), apiKey: apiKey || undefined }),
      });
      const data = await res.json();
      if (data?.success && data?.word) {
        const w = data.word;
        setRows((prev) =>
          prev.map((row) => {
            if (row.id !== id) return row;
            return {
              ...row,
              vi: w.vi || row.vi,
              phonetic: w.phonetic || row.phonetic,
              emoji: (w.emoji && w.emoji !== '📝') ? w.emoji : row.emoji,
              example_en: w.example_en || row.example_en,
              example_vi: w.example_vi || row.example_vi,
              kids_phonics: w.kids_phonics || row.kids_phonics,
            };
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrichingId(null);
    }
  };

  const enrichAllMissing = async (targetRows?: Word[]) => {
    const list = targetRows || rows;
    const missing = list.filter((w) => w.en.trim() && (!w.vi || !w.example_en));
    if (missing.length === 0) return;
    setEnrichingAll(true);
    for (const item of missing) {
      await enrichWordWithAi(item.id, item.en);
    }
    setEnrichingAll(false);
  };

  const parseBulk = async (autoAi = false) => {
    const lines = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsed: Word[] = lines.map((line) => {
      const parts = line.split(/\s*[-|]\s*/).map((p) => p.trim());
      return {
        id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        en: parts[0] || '', vi: parts[1] || '', phonetic: parts[2] || '',
        emoji: '📝', example_en: '', example_vi: '',
        topic_vi: parts[3] || 'Từ vựng của bé', topic_en: 'General', topic_emoji: '📚',
      };
    });
    setRows(parsed);
    setBulkMode(false);
    setBulkText('');

    if (autoAi) {
      await enrichAllMissing(parsed);
    }
  };

  const validCount = rows.filter((w) => w.en.trim()).length;
  const missingCount = rows.filter((w) => w.en.trim() && (!w.vi || !w.example_en)).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setBulkMode(false)}
          className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${!bulkMode ? 'bg-violet-500 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>
          📝 Nhập từng từ
        </button>
        <button onClick={() => setBulkMode(true)}
          className={`flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all ${bulkMode ? 'bg-violet-500 text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}>
          📋 Dán danh sách
        </button>
      </div>

      {bulkMode ? (
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-3 text-xs font-mono text-gray-500 space-y-0.5">
            <p className="font-bold text-gray-600 mb-1 font-sans">💡 Mỗi dòng 1 từ (có thể chỉ gõ tiếng Anh, AI sẽ tự điền nghĩa & ví dụ):</p>
            <p>month</p>
            <p>year - năm</p>
            <p>cat | con mèo | /kæt/ | Động vật</p>
          </div>
          <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)}
            placeholder="Dán danh sách từ vựng vào đây..." rows={8}
            className="w-full border-2 border-gray-200 focus:border-violet-400 rounded-2xl px-4 py-3 text-sm font-mono focus:outline-none resize-none" />
          <div className="grid grid-cols-2 gap-2">
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => parseBulk(false)} disabled={!bulkText.trim()}
              className="py-3 rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 transition-colors">
              ✓ Nhập nguyên gốc
            </motion.button>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => parseBulk(true)} disabled={!bulkText.trim()}
              className="py-3 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg disabled:opacity-40 flex items-center justify-center gap-1.5">
              <span>✨ AI điền nghĩa & ví dụ</span>
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Missing enrichment banner */}
          {missingCount > 0 && (
            <button
              type="button"
              onClick={() => enrichAllMissing()}
              disabled={enrichingAll}
              className="w-full py-2.5 px-3 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {enrichingAll ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  🤖 Gemini đang tự động điền ({missingCount} từ)...
                </>
              ) : (
                <>✨ AI tự động điền nghĩa & câu ví dụ ({missingCount} từ chưa có)</>
              )}
            </button>
          )}

          <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
            <AnimatePresence>
              {rows.map((w, i) => (
                <motion.div key={w.id} layout
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border-2 border-gray-100 p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-300 w-5 text-center shrink-0">{i + 1}</span>
                    <input value={w.emoji} onChange={(e) => updateWord(w.id, 'emoji', e.target.value)}
                      className="w-10 border border-gray-200 rounded-lg px-1.5 py-1 text-center text-lg shrink-0" />
                    <input value={w.en} onChange={(e) => updateWord(w.id, 'en', e.target.value)}
                      className="flex-1 border-2 border-gray-200 focus:border-violet-400 rounded-xl px-2.5 py-1.5 text-sm font-bold text-violet-700 focus:outline-none"
                      placeholder="Từ tiếng Anh *" />
                    <button
                      type="button"
                      onClick={() => enrichWordWithAi(w.id, w.en)}
                      disabled={!w.en.trim() || enrichingId === w.id}
                      className="px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold text-xs hover:bg-amber-100 disabled:opacity-30 shrink-0"
                      title="AI tự động tìm nghĩa, phiên âm và ví dụ"
                    >
                      {enrichingId === w.id ? '⏳' : '✨ AI'}
                    </button>
                    <button onClick={() => removeRow(w.id)} disabled={rows.length === 1}
                      className="text-gray-300 hover:text-rose-400 font-bold disabled:opacity-20 transition-colors shrink-0">✕</button>
                  </div>
                  <div className="pl-7 grid grid-cols-2 gap-2">
                    <input value={w.vi} onChange={(e) => updateWord(w.id, 'vi', e.target.value)}
                      className="border border-gray-200 focus:border-violet-300 rounded-lg px-2 py-1 text-xs text-rose-600 font-bold focus:outline-none"
                      placeholder="Nghĩa tiếng Việt" />
                    <input value={w.phonetic} onChange={(e) => updateWord(w.id, 'phonetic', e.target.value)}
                      className="border border-gray-200 focus:border-violet-300 rounded-lg px-2 py-1 text-xs font-mono text-gray-400 focus:outline-none"
                      placeholder="/phiên âm/" />
                    <input value={w.topic_vi || ''} onChange={(e) => updateWord(w.id, 'topic_vi', e.target.value)}
                      className="col-span-2 border border-gray-200 focus:border-violet-300 rounded-lg px-2 py-1 text-xs text-violet-700 font-semibold focus:outline-none"
                      placeholder="Chủ đề (VD: Động vật, Trái cây...)" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <button onClick={addRow}
            className="w-full py-2.5 rounded-2xl border-2 border-dashed border-violet-300 text-violet-500 font-bold text-sm hover:bg-violet-50 transition-colors">
            + Thêm từ mới
          </button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onDone(rows)} disabled={validCount === 0}
            className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg disabled:opacity-40">
            ✓ Xem trước {validCount > 0 ? `(${validCount} từ)` : ''}
          </motion.button>
        </div>
      )}
    </div>
  );
}

// ── Main Import Page ──────────────────────────────────────────────────────────
export default function ImportPage() {
  const router = useRouter();
  const { apiKey } = useSettings();
  const { categories: customCats, addCategory, addMultipleCategories, appendWords } = useCustomCategories();

  const [activeSource, setActiveSource] = useState<SourceType>('txt');
  const [step,         setStep]         = useState<Step>('input');
  const [loading,      setLoading]      = useState(false);
  const [loadingMsg,   setLoadingMsg]   = useState('');
  const [error,        setError]        = useState<string | null>(null);
  const [words,        setWords]        = useState<Word[]>([]);
  const [catName,      setCatName]      = useState('');
  const [catEmoji,     setCatEmoji]     = useState('📚');
  const [urlInput,     setUrlInput]     = useState('');
  const [sourceLabel,  setSourceLabel]  = useState('');
  const [saveMode,     setSaveMode]     = useState<SaveMode>('auto');
  const [targetCatId,  setTargetCatId]  = useState<string>('');
  const [savedCats,    setSavedCats]    = useState<CustomCategory[]>([]);
  const [selectedFilterTopic, setSelectedFilterTopic] = useState<string>('all');
  const [extractMode, setExtractMode] = useState<'comprehensive' | 'selective'>('comprehensive');
  const [duplicateFilter, setDuplicateFilter] = useState<'all' | 'new_only' | 'duplicate_only'>('all');
  const [targetGrade, setTargetGrade] = useState<string>('lop1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tg = params.get('targetGrade') || params.get('grade');
      if (tg) setTargetGrade(tg);
    }
  }, []);

  // Compute dynamic topic clusters from current words list
  const groupedTopics: ExtractedTopic[] = useMemo(() => {
    if (!words.length) return [];
    const map = new Map<string, ExtractedTopic>();
    words.forEach((w) => {
      const key = w.topic_vi?.trim() || 'Chủ đề chung';
      if (!map.has(key)) {
        map.set(key, {
          topic_vi: key,
          topic_en: w.topic_en?.trim() || 'General',
          emoji: w.topic_emoji?.trim() || '📚',
          words: [],
        });
      }
      map.get(key)!.words.push(w);
    });
    return Array.from(map.values());
  }, [words]);

  // Compute cross-check matches against 1,210 SGK words & custom categories
  const wordMatches = useMemo(() => {
    const map = new Map<string, WordMatchInfo>();
    words.forEach((w) => {
      map.set(w.id, checkWordInDatabase(w.en, customCats));
    });
    return map;
  }, [words, customCats]);

  const duplicateWordsCount = useMemo(() => {
    return words.filter((w) => wordMatches.get(w.id)?.isDuplicate).length;
  }, [words, wordMatches]);

  const newWordsCount = words.length - duplicateWordsCount;

  const extract = async (formData: FormData) => {
    setLoading(true); setError(null);
    setLoadingMsg('🤖 Gemini đang phân tích nội dung...');
    try {
      if (apiKey) formData.append('apiKey', apiKey);
      formData.append('mode', extractMode);
      const res  = await fetch('/api/import/extract', { method: 'POST', body: formData });
      const data = await res.json() as { words?: Word[]; topics?: ExtractedTopic[]; error?: string; message?: string };
      if (!res.ok) {
        setError(data.error === 'NO_API_KEY'
          ? '⚙️ Chưa có Gemini API Key. Vào Cài đặt để nhập key!'
          : data.error || 'Lỗi không xác định');
        return;
      }
      if (!data.words?.length) {
        setError('Không tìm thấy từ vựng phù hợp. Thử file khác hoặc nội dung khác.');
        return;
      }
      setWords(data.words);
      setSaveMode('auto');
      setSelectedFilterTopic('all');
      setStep('preview');
    } catch (err) {
      setError('Lỗi kết nối. Kiểm tra mạng và thử lại.');
      console.error(err);
    } finally {
      setLoading(false); setLoadingMsg('');
    }
  };

  const handleFile = async (file: File, type: SourceType) => {
    setSourceLabel(file.name);
    const fd = new FormData();
    fd.append('sourceType', type); fd.append('file', file);
    await extract(fd);
  };

  const handleUrl = async () => {
    if (!urlInput.trim()) return;
    setSourceLabel(urlInput.trim());
    const fd = new FormData();
    fd.append('sourceType', 'url'); fd.append('url', urlInput.trim());
    await extract(fd);
  };

  const handleManualDone = (result: Word[]) => {
    const valid = result.filter((w) => w.en.trim());
    if (!valid.length) return;
    setWords(valid);
    setSourceLabel('Nhập tay');
    setSaveMode('auto');
    setSelectedFilterTopic('all');
    setStep('preview');
  };

  const handleSave = () => {
    if (saveMode === 'auto') {
      if (!groupedTopics.length) return;
      const catsToCreate = groupedTopics.map((t) => ({
        name: t.topic_vi,
        emoji: t.emoji,
        words: t.words,
        sourceType: activeSource,
        sourceLabel,
        gradeId: targetGrade,
      }));
      const created = addMultipleCategories(catsToCreate);
      setSavedCats(created);
      setStep('done');
    } else if (saveMode === 'existing') {
      if (!targetCatId) return;
      appendWords(targetCatId, words);
      const target = customCats.find((c) => c.id === targetCatId);
      setSavedCats(target ? [target] : []);
      setStep('done');
    } else {
      if (!catName.trim()) return;
      const cat = addCategory(catName.trim(), catEmoji, words, activeSource, sourceLabel, targetGrade);
      setSavedCats([cat]);
      setStep('done');
    }
  };

  const handleReset = () => {
    setStep('input'); setWords([]); setError(null);
    setCatName(''); setCatEmoji('📚'); setUrlInput(''); setSavedCats([]);
    setSaveMode('auto'); setTargetCatId(''); setSelectedFilterTopic('all');
  };

  const { isAdmin, openAdminModal, logoutAdmin } = useAdminContext();

  const src = SOURCES.find((s) => s.id === activeSource)!;

  const displayWords = words.filter((w) => {
    if (selectedFilterTopic !== 'all') {
      if ((w.topic_vi?.trim() || 'Chủ đề chung') !== selectedFilterTopic) return false;
    }
    if (duplicateFilter === 'new_only') {
      return !wordMatches.get(w.id)?.isDuplicate;
    }
    if (duplicateFilter === 'duplicate_only') {
      return wordMatches.get(w.id)?.isDuplicate;
    }
    return true;
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border-2 border-violet-100 space-y-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-violet-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
            ✏️🔒
          </div>
          <div>
            <h2 className="font-black text-xl text-gray-800">Thêm Từ Vựng Mới</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Chức năng nhập từ vựng từ PDF, hình ảnh hoặc AI chỉ dành cho Phụ huynh & Quản trị viên.
            </p>
          </div>
          <button
            onClick={() => openAdminModal()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-sm shadow-md transition-all cursor-pointer"
          >
            🔑 Mở Khóa Quyền Admin
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
          >
            ← Về Trang Học Của Bé
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50">

      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b border-violet-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <button onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center font-bold text-violet-600 hover:bg-violet-100 transition-colors cursor-pointer"
              title="Quay lại"
            >←</button>
            <Link href="/"
              className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 hover:bg-orange-200/80 flex items-center justify-center font-bold text-base transition-colors shadow-xs cursor-pointer"
              title="Về trang chủ"
            >🏠</Link>
          </div>
          <div className="flex-1 min-w-0 px-2">
            <h1 className="font-black text-lg md:text-xl text-gray-800 leading-tight">📥 Thêm từ vựng</h1>
            <p className="text-xs text-gray-400 font-semibold truncate">Tự động phân loại theo chủ đề bằng AI</p>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={logoutAdmin}
              title="Khóa quyền Admin"
              className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Khóa</span>
            </button>
            <div className="flex gap-1.5 items-center">
              {(['input', 'preview', 'save', 'done'] as Step[]).map((s, i) => {
                const order: Step[] = ['input', 'preview', 'save', 'done'];
                const cur = order.indexOf(step);
                return (
                  <div key={s} className={`rounded-full transition-all duration-300 ${
                    step === s ? 'w-5 h-2 bg-violet-500' : i < cur ? 'w-2 h-2 bg-violet-300' : 'w-2 h-2 bg-gray-200'
                  }`} />
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
        <AnimatePresence mode="wait">

          {/* ── STEP: Input ── */}
          {step === 'input' && (
            <motion.div key="input" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="bg-white rounded-3xl p-4 shadow border border-violet-100">
                <h2 className="font-black text-gray-800 mb-3">Chọn nguồn</h2>
                <div className="grid grid-cols-5 gap-1.5">
                  {SOURCES.map((s) => (
                    <button key={s.id} onClick={() => { setActiveSource(s.id); setError(null); }}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-2xl text-center transition-all border-2 ${
                        activeSource === s.id ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-violet-200'
                      }`}>
                      <span className="text-xl">{s.icon}</span>
                      <p className="font-bold text-[10px] leading-tight">{s.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow border border-violet-100">
                <h3 className="font-black text-gray-800 mb-1 flex items-center gap-2">
                  <span>{src.icon}</span> {src.label}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mb-4">{src.desc}</p>

                {activeSource === 'manual' && <ManualEntryPanel onDone={handleManualDone} />}

                {activeSource === 'url' && (
                  <div className="space-y-3">
                    <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleUrl()}
                      placeholder="https://yourhomework.net/story/..."
                      className="w-full border-2 border-gray-200 focus:border-violet-400 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none" />
                    
                    {/* Extraction Mode selector */}
                    <div className="p-3 bg-violet-50/70 rounded-2xl border border-violet-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-violet-900 flex items-center gap-1">
                          <span>🎯</span> Chế độ trích xuất:
                        </span>
                        <span className="text-[10px] font-bold text-violet-700 bg-white px-2 py-0.5 rounded-full border border-violet-200">
                          {extractMode === 'comprehensive' ? 'Bóc tách triệt để' : 'Cốt lõi'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setExtractMode('comprehensive')}
                          className={`p-2 rounded-xl text-left transition-all border-2 ${
                            extractMode === 'comprehensive'
                              ? 'border-violet-500 bg-white text-violet-900 shadow-2xs ring-1 ring-violet-300'
                              : 'border-transparent bg-white/60 text-gray-500 hover:bg-white'
                          }`}
                        >
                          <p className="font-black text-xs">✨ Tối đa từ (Nhiều từ)</p>
                          <p className="text-[10px] text-gray-500">Lấy cả danh từ, động từ, tính từ...</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setExtractMode('selective')}
                          className={`p-2 rounded-xl text-left transition-all border-2 ${
                            extractMode === 'selective'
                              ? 'border-violet-500 bg-white text-violet-900 shadow-2xs ring-1 ring-violet-300'
                              : 'border-transparent bg-white/60 text-gray-500 hover:bg-white'
                          }`}
                        >
                          <p className="font-black text-xs">🎯 Tiêu chuẩn (5–15 từ)</p>
                          <p className="text-[10px] text-gray-500">Chỉ lọc từ danh từ cơ bản nhất</p>
                        </button>
                      </div>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleUrl}
                      disabled={!urlInput.trim() || loading}
                      className="w-full py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg disabled:opacity-40">
                      {loading
                        ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{loadingMsg}</span>
                        : '🤖 Trích xuất từ vựng'}
                    </motion.button>
                  </div>
                )}

                {(activeSource === 'txt' || activeSource === 'pdf' || activeSource === 'image') && (
                  <div className="space-y-3">
                    {/* Extraction Mode selector */}
                    <div className="p-3 bg-violet-50/70 rounded-2xl border border-violet-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-violet-900 flex items-center gap-1">
                          <span>🎯</span> Chế độ trích xuất:
                        </span>
                        <span className="text-[10px] font-bold text-violet-700 bg-white px-2 py-0.5 rounded-full border border-violet-200">
                          {extractMode === 'comprehensive' ? 'Bóc tách triệt để' : 'Cốt lõi'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setExtractMode('comprehensive')}
                          className={`p-2 rounded-xl text-left transition-all border-2 ${
                            extractMode === 'comprehensive'
                              ? 'border-violet-500 bg-white text-violet-900 shadow-2xs ring-1 ring-violet-300'
                              : 'border-transparent bg-white/60 text-gray-500 hover:bg-white'
                          }`}
                        >
                          <p className="font-black text-xs">✨ Tối đa từ (Nhiều từ)</p>
                          <p className="text-[10px] text-gray-500">Lấy cả danh từ, động từ, tính từ...</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setExtractMode('selective')}
                          className={`p-2 rounded-xl text-left transition-all border-2 ${
                            extractMode === 'selective'
                              ? 'border-violet-500 bg-white text-violet-900 shadow-2xs ring-1 ring-violet-300'
                              : 'border-transparent bg-white/60 text-gray-500 hover:bg-white'
                          }`}
                        >
                          <p className="font-black text-xs">🎯 Tiêu chuẩn (5–15 từ)</p>
                          <p className="text-[10px] text-gray-500">Chỉ lọc từ danh từ cơ bản nhất</p>
                        </button>
                      </div>
                    </div>

                    <DropZone accept={src.accept!} label={`Chọn ${src.label}`}
                      onFile={(f) => handleFile(f, activeSource)} />
                    {loading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex items-center gap-3 bg-violet-50 rounded-2xl p-3">
                        <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                        <p className="text-sm font-bold text-violet-600">{loadingMsg}</p>
                      </motion.div>
                    )}
                  </div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-3 bg-rose-50 border border-rose-200 rounded-2xl p-3">
                    <p className="text-sm font-bold text-rose-600">{error}</p>
                    {error.includes('API Key') && (
                      <button onClick={() => router.push('/settings')}
                        className="mt-2 text-xs font-bold text-violet-600 underline">→ Vào Cài đặt</button>
                    )}
                  </motion.div>
                )}
              </div>

              {activeSource !== 'manual' && (
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-4">
                  <p className="font-black text-blue-800 text-sm mb-2">💡 Mẹo tự động phân loại</p>
                  <ul className="space-y-1 text-xs text-blue-700 font-semibold">
                    <li>• Gemini sẽ <strong>tự động nhận diện chủ đề</strong> (Động vật, Trái cây, Trường học...) cho từng từ.</li>
                    <li>• Khi lưu, bạn có thể tạo thành <strong>nhiều chủ đề tương ứng</strong> chỉ với 1 cú chạm!</li>
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {/* ── STEP: Preview ── */}
          {step === 'preview' && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-3xl p-5 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-bold mb-1">
                      {activeSource === 'manual' ? '✏️ Đã nhập' : '🤖 Gemini phân tích thành công'}
                    </p>
                    <p className="font-black text-4xl">{words.length} <span className="text-2xl font-bold">từ</span></p>
                    {groupedTopics.length > 1 && (
                      <p className="text-violet-200 text-xs mt-1 font-semibold">
                        ✨ Phân loại thành <strong className="text-white">{groupedTopics.length} chủ đề</strong>
                      </p>
                    )}
                    {sourceLabel && <p className="text-white/60 text-xs mt-1 truncate max-w-[220px]">📎 {sourceLabel}</p>}
                  </div>
                  <div className="text-6xl drop-shadow">✨</div>
                </div>
              </div>

              {/* Comparison & Duplicate Stats Banner */}
              <div className="bg-white rounded-3xl p-4 shadow border border-violet-100 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-xs font-black text-gray-800">
                      🔍 Đối chiếu với kho 1.210 từ SGK & Bộ từ của bé:
                    </p>
                    <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                      Có <strong className="text-emerald-600 font-black">{newWordsCount} từ mới</strong> và <strong className="text-amber-600 font-black">{duplicateWordsCount} từ đã có trong SGK</strong>
                    </p>
                  </div>
                  {duplicateWordsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Bạn có chắc muốn bỏ ${duplicateWordsCount} từ đã có trong kho và chỉ giữ lại ${newWordsCount} từ mới?`)) {
                          setWords((prev) => prev.filter((w) => !wordMatches.get(w.id)?.isDuplicate));
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <span>🧹</span>
                      <span>Chỉ giữ {newWordsCount} từ mới</span>
                    </button>
                  )}
                </div>

                {/* Filter pills */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setDuplicateFilter('all')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      duplicateFilter === 'all'
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả ({words.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplicateFilter('new_only')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      duplicateFilter === 'new_only'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <span>🟢</span>
                    <span>Từ mới ({newWordsCount})</span>
                  </button>
                  {duplicateWordsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setDuplicateFilter('duplicate_only')}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                        duplicateFilter === 'duplicate_only'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <span>🟡</span>
                      <span>Đã có ({duplicateWordsCount})</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Topic Filter Pills (if multiple topics detected) */}
              {groupedTopics.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setSelectedFilterTopic('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-black transition-all shrink-0 ${
                      selectedFilterTopic === 'all'
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-violet-100 hover:bg-violet-50'
                    }`}
                  >
                    Tất cả ({words.length})
                  </button>
                  {groupedTopics.map((t) => (
                    <button
                      key={t.topic_vi}
                      onClick={() => setSelectedFilterTopic(t.topic_vi)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        selectedFilterTopic === t.topic_vi
                          ? 'bg-violet-600 text-white shadow-sm'
                          : 'bg-white text-gray-600 border border-violet-100 hover:bg-violet-50'
                      }`}
                    >
                      <span>{t.emoji}</span>
                      <span>{t.topic_vi}</span>
                      <span className="opacity-75">({t.words.length})</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-3xl p-4 shadow border border-violet-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-gray-800">
                    {selectedFilterTopic === 'all' ? 'Xem trước từ vựng' : `Chủ đề: ${selectedFilterTopic}`}
                  </h3>
                  <span className="text-xs text-gray-400 font-semibold">Nhấn để sửa • ✕ xóa</span>
                </div>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  <AnimatePresence>
                    {displayWords.map((w, i) => (
                      <WordPreviewCard key={w.id} word={w} index={i} matchInfo={wordMatches.get(w.id)}
                        onEdit={(updated) => setWords((p) => p.map((x) => x.id === w.id ? updated : x))}
                        onRemove={() => setWords((p) => p.filter((x) => x.id !== w.id))} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset}
                  className="flex-1 py-3 rounded-2xl font-bold border-2 border-gray-200 text-gray-500 bg-white hover:border-violet-300 transition-colors">
                  ← Thử lại
                </button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep('save')} disabled={words.length === 0}
                  className="flex-1 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg disabled:opacity-40">
                  Tiếp theo →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP: Save ── */}
          {step === 'save' && (
            <motion.div key="save" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow border border-violet-100 space-y-5">
                <h2 className="font-black text-gray-800 text-lg">💾 Lưu vào thư viện</h2>

                {/* Save Mode Selector */}
                <div className="space-y-2">
                  {groupedTopics.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSaveMode('auto')}
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative ${
                        saveMode === 'auto'
                          ? 'border-violet-500 bg-violet-50 shadow-md ring-1 ring-violet-400'
                          : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">🤖</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-gray-900 text-sm">AI tự động phân loại theo chủ đề</span>
                              <span className="text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                                Khuyên dùng
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Tách thành {groupedTopics.length} chủ đề riêng biệt hoặc tự gộp vào chủ đề cũ nếu trùng tên
                            </p>
                          </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          saveMode === 'auto' ? 'border-violet-600 bg-violet-600 text-white text-xs font-bold' : 'border-gray-300'
                        }`}>
                          {saveMode === 'auto' && '✓'}
                        </div>
                      </div>
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSaveMode('new')}
                      className={`p-3 rounded-2xl text-xs font-bold border-2 text-left transition-all ${
                        saveMode === 'new'
                          ? 'border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-violet-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>✨</span>
                        <span className="font-bold">Gom vào 1 chủ đề</span>
                      </div>
                      <p className="text-[11px] text-gray-400">Tự đặt tên chủ đề chung</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSaveMode('existing')}
                      disabled={customCats.length === 0}
                      className={`p-3 rounded-2xl text-xs font-bold border-2 text-left transition-all disabled:opacity-40 ${
                        saveMode === 'existing'
                          ? 'border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-violet-200'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>📂</span>
                        <span className="font-bold">Thêm vào có sẵn</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {customCats.length === 0 ? 'Chưa có chủ đề nào' : 'Gộp vào bài cũ'}
                      </p>
                    </button>
                  </div>
                </div>

                {/* AUTO MODE PREVIEW */}
                {saveMode === 'auto' && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <p className="text-xs font-bold text-gray-600">
                      Danh sách chủ đề AI sẽ tạo ({groupedTopics.length} chủ đề, {words.length} từ):
                    </p>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {groupedTopics.map((t, idx) => (
                        <div
                          key={t.topic_vi + idx}
                          className="flex items-center justify-between p-3 rounded-2xl bg-violet-50/60 border border-violet-100"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-2xl">{t.emoji}</span>
                            <div className="min-w-0">
                              <p className="font-black text-gray-800 text-sm truncate">{t.topic_vi}</p>
                              <p className="text-[11px] text-gray-400 truncate">
                                {t.words.map((w) => w.en).slice(0, 4).join(', ')}{t.words.length > 4 ? '...' : ''}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-black bg-white px-2.5 py-1 rounded-full text-violet-700 shadow-xs border border-violet-100 shrink-0">
                            {t.words.length} từ
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/60 flex items-start gap-2 text-xs text-amber-800">
                      <span className="text-base shrink-0">💡</span>
                      <span>
                        Nếu chủ đề cùng tên đã tồn tại trong ứng dụng, VocaKids sẽ tự động gộp các từ mới vào mà không làm trùng lặp.
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* NEW SINGLE CATEGORY MODE */}
                {saveMode === 'new' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">Chọn biểu tượng</p>
                      <div className="flex flex-wrap gap-2">
                        {EMOJIS_PRESET.map((e) => (
                          <button key={e} onClick={() => setCatEmoji(e)}
                            className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all ${
                              catEmoji === e ? 'bg-violet-100 ring-2 ring-violet-400 scale-110' : 'bg-gray-50 hover:bg-violet-50'
                            }`}>{e}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-3xl border-2 border-violet-200 shrink-0">
                        {catEmoji}
                      </div>
                      <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        placeholder="Tên chủ đề (VD: Từ vựng lớp 1)"
                        className="flex-1 border-2 border-gray-200 focus:border-violet-400 rounded-2xl px-4 py-3 font-bold text-sm focus:outline-none" />
                    </div>
                    <p className="text-xs text-gray-400 font-semibold">Sẽ lưu toàn bộ {words.length} từ vào 1 chủ đề này</p>
                  </motion.div>
                )}

                {/* EXISTING CATEGORY MODE */}
                {saveMode === 'existing' && customCats.length > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    <p className="text-xs font-bold text-gray-500">Chọn chủ đề muốn thêm vào</p>
                    <div className="space-y-2 max-h-52 overflow-y-auto">
                      {customCats.map((cat) => (
                        <button key={cat.id} onClick={() => setTargetCatId(cat.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                            targetCatId === cat.id ? 'border-violet-400 bg-violet-50' : 'border-gray-100 bg-gray-50 hover:border-violet-200'
                          }`}>
                          <span className="text-2xl">{cat.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-800 text-sm truncate">{cat.name_vi}</p>
                            <p className="text-xs text-gray-400">{cat.words.length} từ hiện có</p>
                          </div>
                          {targetCatId === cat.id && <span className="text-violet-500 font-black text-lg">✓</span>}
                        </button>
                      ))}
                    </div>
                    {targetCatId && (
                      <p className="text-xs text-gray-400 font-semibold">
                        Sẽ thêm {words.length} từ mới (từ trùng lặp tự động bỏ qua)
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep('preview')}
                  className="flex-1 py-3 rounded-2xl font-bold border-2 border-gray-200 text-gray-500 bg-white hover:border-violet-300 transition-colors">
                  ← Quay lại
                </button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
                  disabled={
                    saveMode === 'auto'
                      ? groupedTopics.length === 0
                      : saveMode === 'new'
                        ? !catName.trim()
                        : !targetCatId
                  }
                  className="flex-1 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg disabled:opacity-40">
                  💾 Lưu vào app
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP: Done ── */}
          {step === 'done' && (
            <motion.div key="done"
              initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-2xl border-2 border-violet-100 text-center">
                <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.1 }}
                  className="text-6xl mb-3 inline-block">🎉</motion.div>
                <h2 className="font-black text-2xl text-violet-700 mb-1">
                  {saveMode === 'auto' ? 'Đã tự động phân loại thành công!' : 'Đã lưu thành công!'}
                </h2>
                <p className="text-gray-500 text-xs mb-3">
                  {saveMode === 'auto' ? (
                    <>Đã lưu <strong>{words.length} từ</strong> vào <strong>{savedCats.length} chủ đề</strong> riêng biệt.</>
                  ) : saveMode === 'existing' && savedCats[0] ? (
                    <>Đã thêm <strong>{words.length} từ</strong> vào <strong>{savedCats[0].emoji} {savedCats[0].name_vi}</strong>.</>
                  ) : (
                    <>Đã lưu <strong>{words.length} từ</strong> vào chủ đề <strong>{savedCats[0]?.emoji || catEmoji} {savedCats[0]?.name_vi || catName}</strong>.</>
                  )}
                </p>

                {/* Banner thông báo đồng thời lưu vào mục Từ mới của bé */}
                <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 text-left shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="text-2xl shrink-0">🌟</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-amber-900 text-xs sm:text-sm">
                        Đã tự động đồng bộ vào mục &ldquo;🌟 Từ mới của bé&rdquo;
                      </p>
                      <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                        Bé có thể học theo từng chủ đề riêng bên dưới, HOẶC học toàn bộ {words.length} từ mới tại mục Từ mới tập trung!
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-amber-200 flex gap-2">
                    <button
                      onClick={() => router.push('/learn/custom_new_words')}
                      className="flex-1 py-2 px-2.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>▶</span>
                      <span>Học toàn bộ từ mới</span>
                    </button>
                    <button
                      onClick={() => router.push('/test/custom_new_words')}
                      className="flex-1 py-2 px-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>🎯</span>
                      <span>8 Dạng bài tập</span>
                    </button>
                  </div>
                </div>

                {/* Categories summary list */}
                <div className="text-left mb-2 px-1">
                  <span className="text-xs font-bold text-gray-500">
                    Danh sách các chủ đề đã phân loại:
                  </span>
                </div>
                <div className="space-y-2 mb-6 max-h-56 overflow-y-auto text-left">
                  {savedCats.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 rounded-2xl bg-violet-50 border border-violet-100">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl">{cat.emoji}</span>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-800 text-sm truncate">{cat.name_vi}</p>
                          <p className="text-xs text-gray-400">{cat.words.length} từ</p>
                        </div>
                      </div>
                      <button
                        onClick={() => router.push(`/learn/${cat.id}`)}
                        className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer"
                      >
                        Học chủ đề →
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  {savedCats.length > 0 && (
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => router.push(`/learn/${savedCats[0].id}`)}
                      className="py-3 rounded-2xl font-black text-white bg-gradient-to-r from-violet-500 to-purple-600 shadow-lg cursor-pointer">
                      📖 Học ngay: {savedCats[0].emoji} {savedCats[0].name_vi}
                    </motion.button>
                  )}
                  <button onClick={handleReset}
                    className="py-3 rounded-2xl font-bold text-violet-600 border-2 border-violet-200 hover:bg-violet-50 transition-colors cursor-pointer">
                    📥 Thêm từ vựng nữa
                  </button>
                  <button onClick={() => router.push('/')}
                    className="py-2 font-bold text-gray-400 text-sm hover:text-gray-600 transition-colors cursor-pointer">
                    🏠 Về trang chủ
                  </button>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
