'use client';

import { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomCategories, CustomCategory, NEW_WORDS_CAT_ID } from '@/hooks/useCustomCategories';
import { useAdminContext } from '@/context/AdminContext';
import { Word } from '@/types';
import { WordImage } from '@/components/WordImage';

const EMOJIS_PRESET = ['📚','🎓','✏️','🌍','🏫','🎯','🌟','📖','🧠','🏆','🎪','🌈','🦁','🌺','🚀','🎵','🐶','🐱','🍎','🍌'];

export default function ManageVocabularyPage() {
  const router = useRouter();
  const {
    categories,
    hydrated,
    deleteCategory,
    updateCategory,
    updateWord,
    deleteWord,
    addWord,
    exportJSON,
    importJSON,
  } = useCustomCategories();

  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCat, setEditingCat] = useState<CustomCategory | null>(null);
  const [catNameInput, setCatNameInput] = useState('');
  const [catEmojiInput, setCatEmojiInput] = useState('📚');

  // Word edit modal state
  const [editingWord, setEditingWord] = useState<{ catId: string; word: Word } | null>(null);
  const [addingWordToCatId, setAddingWordToCatId] = useState<string | null>(null);
  const [newWordDraft, setNewWordDraft] = useState<Word>({
    id: '',
    en: '',
    vi: '',
    phonetic: '',
    emoji: '📝',
    example_en: '',
    example_vi: '',
    image_url: undefined,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Image Generation state
  const [generatingImage, setGeneratingImage] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const totalWords = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.words.length, 0);
  }, [categories]);

  // Filter categories and words by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter((cat) => {
      const matchCat = cat.name_vi.toLowerCase().includes(q) || cat.name_en.toLowerCase().includes(q);
      const matchWord = cat.words.some(
        (w) => w.en.toLowerCase().includes(q) || w.vi.toLowerCase().includes(q)
      );
      return matchCat || matchWord;
    });
  }, [categories, searchQuery]);

  // Audio preview helper
  const playWordAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  // AI Image Generation Handler
  const handleGenerateImage = async (enWord: string, viWord: string, emojiChar: string, isDraft: boolean) => {
    if (!enWord.trim()) {
      showToast('Vui lòng nhập từ tiếng Anh trước!', 'error');
      return;
    }
    setGeneratingImage(true);
    try {
      const res = await fetch('/api/word/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: enWord.trim(), vi: viWord, emoji: emojiChar }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        if (isDraft) {
          setNewWordDraft((prev) => ({ ...prev, image_url: data.imageUrl }));
        } else if (editingWord) {
          setEditingWord({ ...editingWord, word: { ...editingWord.word, image_url: data.imageUrl } });
        }
        showToast('AI đã tạo ảnh minh họa! 🎨');
      } else if (data.error === 'NO_API_KEY') {
        showToast('Chưa có API Key Gemini. Vào cài đặt để nhập key!', 'error');
      } else {
        showToast('Không tạo được ảnh. Thử lại sau!', 'error');
      }
    } catch {
      showToast('Lỗi kết nối AI tạo ảnh.', 'error');
    } finally {
      setGeneratingImage(false);
    }
  };

  // 1-Click AI Auto-fill word info (examples, translation, phonetic, emoji, phonics)
  const [enriching, setEnriching] = useState(false);
  const handleEnrichWord = async (enWord: string, isDraft: boolean) => {
    if (!enWord.trim()) {
      showToast('Vui lòng nhập từ tiếng Anh trước!', 'error');
      return;
    }
    setEnriching(true);
    try {
      const res = await fetch('/api/word/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: enWord.trim() }),
      });
      const data = await res.json();
      if (data.success && data.word) {
        if (isDraft) {
          setNewWordDraft((prev) => ({
            ...prev,
            en: data.word.en,
            vi: data.word.vi || prev.vi,
            phonetic: data.word.phonetic || prev.phonetic,
            emoji: data.word.emoji || prev.emoji,
            example_en: data.word.example_en || prev.example_en,
            example_vi: data.word.example_vi || prev.example_vi,
            kids_phonics: data.word.kids_phonics || prev.kids_phonics,
          }));
        } else if (editingWord) {
          setEditingWord({
            ...editingWord,
            word: {
              ...editingWord.word,
              vi: data.word.vi || editingWord.word.vi,
              phonetic: data.word.phonetic || editingWord.word.phonetic,
              emoji: data.word.emoji || editingWord.word.emoji,
              example_en: data.word.example_en || editingWord.word.example_en,
              example_vi: data.word.example_vi || editingWord.word.example_vi,
              kids_phonics: data.word.kids_phonics || editingWord.word.kids_phonics,
            },
          });
        }
        showToast('AI đã tự động điền ví dụ và phát âm! ✨');
      } else {
        showToast(data.error === 'NO_API_KEY' ? 'Chưa có API Key. Vào cài đặt để nhập key!' : 'Không tìm thấy thông tin từ.', 'error');
      }
    } catch {
      showToast('Lỗi kết nối AI.', 'error');
    } finally {
      setEnriching(false);
    }
  };

  // Export JSON backup
  const handleExport = () => {
    if (categories.length === 0) {
      showToast('Chưa có từ vựng nào để xuất!', 'error');
      return;
    }
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `vocakids_tuvung_${dateStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Đã xuất file sao lưu thành công! 📦');
  };

  // Import JSON backup
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const count = importJSON(content);
        if (count > 0) {
          showToast(`Đã nhập thành công ${count} chủ đề mới! 🎉`);
        } else {
          showToast('File không có chủ đề mới hoặc không đúng định dạng.', 'error');
        }
      } catch {
        showToast('Lỗi đọc file JSON. Vui lòng kiểm tra lại.', 'error');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Save Category Edit
  const handleSaveCatEdit = () => {
    if (!editingCat || !catNameInput.trim()) return;
    updateCategory(editingCat.id, {
      name_vi: catNameInput.trim(),
      name_en: catNameInput.trim(),
      emoji: catEmojiInput,
    });
    setEditingCat(null);
    showToast('Đã cập nhật tên chủ đề! ✨');
  };

  // Save Word Edit
  const handleSaveWordEdit = () => {
    if (!editingWord || !editingWord.word.en.trim()) return;
    updateWord(editingWord.catId, editingWord.word.id, editingWord.word);
    setEditingWord(null);
    showToast(`Đã cập nhật từ "${editingWord.word.en}"! ✨`);
  };

  // Add New Word
  const handleAddNewWord = () => {
    if (!addingWordToCatId || !newWordDraft.en.trim()) return;
    const wordToAdd: Word = {
      ...newWordDraft,
      id: `w_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      en: newWordDraft.en.trim(),
      vi: newWordDraft.vi.trim() || newWordDraft.en.trim(),
    };
    addWord(addingWordToCatId, wordToAdd);
    setAddingWordToCatId(null);
    setNewWordDraft({
      id: '',
      en: '',
      vi: '',
      phonetic: '',
      emoji: '📝',
      example_en: '',
      example_vi: '',
    });
    showToast(`Đã thêm từ "${wordToAdd.en}" vào chủ đề và tự động cập nhật vào mục Từ Mới! 👏`);
  };

  const { isAdmin, openAdminModal, logoutAdmin } = useAdminContext();

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED]">
        <div className="text-4xl animate-bounce-slow">🦉</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-xl border-2 border-orange-200 space-y-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-orange-100 flex items-center justify-center text-3xl mx-auto shadow-inner">
            📚🔒
          </div>
          <div>
            <h2 className="font-black text-xl text-gray-800">Quản Lý Kho Từ Vựng</h2>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Chức năng sửa từ, xóa chủ đề và xuất/nhập dữ liệu yêu cầu quyền Admin/Phụ huynh.
            </p>
          </div>
          <button
            onClick={() => openAdminModal()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer"
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-violet-50 pb-28">

      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileImport}
      />

      {/* ── HEADER ── */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-40 border-b border-orange-100 px-4 py-3 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between w-full">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => router.back()}
                className="w-10 h-10 rounded-2xl bg-orange-100/70 hover:bg-orange-200/70 flex items-center justify-center font-black text-orange-700 transition-colors cursor-pointer"
                title="Quay lại"
              >
                ←
              </button>
              <Link
                href="/"
                className="w-10 h-10 rounded-2xl bg-orange-100/70 hover:bg-orange-200/70 flex items-center justify-center font-black text-orange-700 transition-colors shadow-xs cursor-pointer"
                title="Về trang chủ"
              >
                🏠
              </Link>
            </div>
            <div>
              <h1 className="font-black text-lg md:text-xl text-gray-800 leading-tight">📚 Quản lý từ vựng</h1>
              <p className="text-xs text-gray-500 font-semibold truncate">Chỉnh sửa, xóa &amp; sao lưu từ tự thêm</p>
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              title="Khóa quyền Admin"
              className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>🔒</span>
              <span className="hidden sm:inline">Khóa</span>
            </button>
            <button
              onClick={handleExport}
              title="Xuất file JSON sao lưu"
              className="px-3 py-2 rounded-xl bg-orange-100/70 hover:bg-orange-200/80 text-orange-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <span>📤</span>
              <span className="hidden sm:inline">Xuất JSON</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Nhập file JSON sao lưu"
              className="px-3 py-2 rounded-xl bg-violet-100/80 hover:bg-violet-200 text-violet-800 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
            >
              <span>📥</span>
              <span className="hidden sm:inline">Nhập JSON</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <span>{notification.type === 'success' ? '✓' : '⚠️'}</span>
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── STATS CARD ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="bg-white/80 backdrop-blur rounded-3xl p-4 sm:p-5 border-2 border-orange-100 shadow-sm flex items-center gap-3">
            <span className="text-3xl sm:text-4xl p-2.5 bg-orange-100/60 rounded-2xl">🗂️</span>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-gray-800 leading-none">{categories.length}</p>
              <p className="text-xs text-gray-500 font-bold mt-1">Chủ đề tự tạo</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-3xl p-4 sm:p-5 border-2 border-orange-100 shadow-sm flex items-center gap-3">
            <span className="text-3xl sm:text-4xl p-2.5 bg-violet-100/60 rounded-2xl">📝</span>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-gray-800 leading-none">{totalWords}</p>
              <p className="text-xs text-gray-500 font-bold mt-1">Từ vựng đã thêm</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-3xl p-4 sm:p-5 border-2 border-orange-100 shadow-sm flex items-center gap-3">
            <span className="text-3xl sm:text-4xl p-2.5 bg-emerald-100/60 rounded-2xl">🌟</span>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-gray-800 leading-none">
                {categories.find((c) => c.id === NEW_WORDS_CAT_ID)?.words.length ?? 0}
              </p>
              <p className="text-xs text-gray-500 font-bold mt-1">Từ mới của bé</p>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-3xl p-4 sm:p-5 border-2 border-orange-100 shadow-sm flex items-center gap-3">
            <span className="text-3xl sm:text-4xl p-2.5 bg-amber-100/60 rounded-2xl">🎯</span>
            <div>
              <p className="font-black text-2xl sm:text-3xl text-gray-800 leading-none">
                {categories.filter((c) => c.id !== NEW_WORDS_CAT_ID).length}
              </p>
              <p className="text-xs text-gray-500 font-bold mt-1">Chủ đề bài học</p>
            </div>
          </div>
        </div>

        {/* ── SEARCH BAR ── */}
        {categories.length > 0 && (
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Tìm từ tiếng Anh hoặc tiếng Việt..."
              className="w-full bg-white rounded-2xl px-4 py-3 text-sm font-semibold border-2 border-orange-100 focus:border-orange-400 focus:outline-none shadow-sm pl-10"
            />
            <span className="absolute left-3.5 top-3.5 text-gray-400 text-sm pointer-events-none">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 font-bold text-xs bg-gray-100 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {categories.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-orange-100 shadow-sm space-y-4">
            <div className="text-6xl mb-2">📭</div>
            <h3 className="font-black text-lg text-gray-800">Chưa có từ vựng tự thêm nào</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Bạn có thể trích xuất từ vựng từ sách giáo khoa PDF, ảnh chụp, file TXT hoặc nhập tay bằng công nghệ Gemini AI.
            </p>
            <Link
              href="/import"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg hover:brightness-105 transition-all text-sm"
            >
              <span>📥</span>
              <span>Thêm từ vựng ngay</span>
            </Link>
          </div>
        )}

        {/* ── CATEGORIES LIST ── */}
        <div className="space-y-3">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCat === cat.id;
            const isNewWordsCat = cat.id === NEW_WORDS_CAT_ID;

            return (
              <motion.div
                key={cat.id}
                layout
                className={`rounded-3xl border-2 shadow-sm overflow-hidden ${
                  isNewWordsCat
                    ? 'bg-gradient-to-r from-amber-50/50 via-white to-orange-50/50 border-amber-300 ring-2 ring-amber-200/50'
                    : 'bg-white border-orange-100'
                }`}
              >
                {/* Category Header */}
                <div
                  onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    isNewWordsCat ? 'hover:bg-amber-100/40' : 'hover:bg-orange-50/40'
                  }`}
                >
                  <span
                    className={`text-3xl shrink-0 p-1.5 rounded-2xl border ${
                      isNewWordsCat ? 'bg-amber-100 border-amber-200 shadow-xs' : 'bg-orange-50 border-orange-100'
                    }`}
                  >
                    {cat.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-gray-800 text-sm truncate">{cat.name_vi}</h3>
                      {isNewWordsCat ? (
                        <span className="text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                          🌟 TỔNG HỢP TỰ ĐỘNG
                        </span>
                      ) : (
                        <span className="text-[10px] font-black bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full shrink-0">
                          {cat.words.length} từ
                        </span>
                      )}
                      {isNewWordsCat && (
                        <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full shrink-0">
                          {cat.words.length} từ
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      {isNewWordsCat ? (
                        <span className="text-[11px] font-semibold text-amber-700">
                          ⚡ Tự động gom từ mới từ tất cả các chủ đề để bé ôn tập
                        </span>
                      ) : (
                        <>
                          {cat.sourceType && (
                            <span className="text-[11px] font-semibold">
                              {cat.sourceType === 'pdf' ? '📕 PDF' : cat.sourceType === 'image' ? '🖼️ Ảnh' : cat.sourceType === 'url' ? '🌐 Web' : '✏️ Nhập tay'}
                            </span>
                          )}
                          {cat.sourceLabel && (
                            <span className="truncate max-w-[140px] text-[10px] opacity-75">
                              • {cat.sourceLabel}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingCat(cat);
                        setCatNameInput(cat.name_vi);
                        setCatEmojiInput(cat.emoji);
                      }}
                      title="Sửa tên / đổi icon chủ đề"
                      className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-orange-100 text-gray-500 hover:text-orange-700 flex items-center justify-center text-xs transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => {
                        const confirmMsg = isNewWordsCat
                          ? `Bạn có chắc chắn muốn đặt lại danh mục "🌟 Từ mới của bé" (${cat.words.length} từ)?`
                          : `Bạn có chắc chắn muốn xóa toàn bộ chủ đề "${cat.name_vi}" (${cat.words.length} từ)?`;
                        if (confirm(confirmMsg)) {
                          deleteCategory(cat.id);
                          showToast(isNewWordsCat ? 'Đã đặt lại danh mục Từ mới!' : `Đã xóa chủ đề "${cat.name_vi}"!`);
                        }
                      }}
                      title={isNewWordsCat ? 'Đặt lại danh mục từ mới' : 'Xóa chủ đề này'}
                      className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-rose-100 text-gray-400 hover:text-rose-600 flex items-center justify-center text-xs transition-colors"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => router.push(`/learn/${cat.id}`)}
                      title="Học chủ đề này"
                      className={`w-8 h-8 rounded-xl text-white flex items-center justify-center text-xs font-bold transition-colors ${
                        isNewWordsCat ? 'bg-amber-500 hover:bg-amber-600 shadow-xs' : 'bg-orange-500 hover:bg-orange-600'
                      }`}
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Expanded Words List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t-2 border-orange-100 bg-orange-50/20"
                    >
                      {/* Sub-header inside accordion */}
                      <div className="px-4 py-2.5 bg-orange-50/60 border-b border-orange-100/60 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">
                          Danh sách từ vựng ({cat.words.length}):
                        </span>
                        <button
                          onClick={() => {
                            setAddingWordToCatId(cat.id);
                            setNewWordDraft({
                              id: '',
                              en: '',
                              vi: '',
                              phonetic: '',
                              emoji: '📝',
                              example_en: '',
                              example_vi: '',
                            });
                          }}
                          className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl shadow-xs border border-orange-200"
                        >
                          <span>+</span>
                          <span>Thêm từ</span>
                        </button>
                      </div>

                      {/* Words grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 p-3.5 max-h-[30rem] overflow-y-auto">
                        {cat.words.length === 0 ? (
                          <div className="col-span-full p-4 text-center text-xs text-gray-400">
                            Chưa có từ nào trong chủ đề này.
                          </div>
                        ) : (
                          cat.words.map((word) => (
                            <div
                              key={word.id}
                              className="p-3 bg-white rounded-2xl border border-orange-100/90 flex items-start gap-3 shadow-2xs hover:shadow-xs transition-all"
                            >
                              <span className="text-2xl shrink-0 mt-0.5">{word.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-black text-gray-900 text-sm">{word.en}</span>
                                  {word.phonetic && (
                                    <span className="text-xs font-mono text-gray-400">{word.phonetic}</span>
                                  )}
                                  <button
                                    onClick={() => playWordAudio(word.en)}
                                    title="Nghe phát âm mẫu"
                                    className="text-xs text-orange-500 hover:text-orange-700 font-bold px-1.5 py-0.5 bg-orange-50 rounded cursor-pointer"
                                  >
                                    🔊
                                  </button>
                                </div>
                                <p className="font-bold text-rose-600 text-xs mt-0.5">{word.vi}</p>
                                {word.kids_phonics?.text && (
                                  <p className="text-[11px] font-bold text-violet-700 mt-0.5">
                                    🗣️ Phonics: {word.kids_phonics.text}
                                  </p>
                                )}
                                {word.example_en && (
                                  <p className="text-gray-400 text-xs italic mt-0.5 truncate">
                                    &ldquo;{word.example_en}&rdquo;
                                  </p>
                                )}
                              </div>

                              {/* Word actions */}
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => setEditingWord({ catId: cat.id, word })}
                                  title="Chỉnh sửa từ này"
                                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-orange-700 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Bạn có chắc muốn xóa từ "${word.en}"?`)) {
                                      deleteWord(cat.id, word.id);
                                      showToast(`Đã xóa từ "${word.en}"!`);
                                    }
                                  }}
                                  title="Xóa từ này"
                                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-400 hover:text-rose-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── ADD MORE CTA ── */}
        <div className="pt-2">
          <Link
            href="/import"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-3xl font-black text-orange-600 bg-white border-2 border-dashed border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 shadow-sm transition-all text-sm"
          >
            <span>✨</span>
            <span>Trích xuất thêm từ mới (PDF, Ảnh, Web, AI)</span>
          </Link>
        </div>

      </div>

      {/* ── MODAL: EDIT CATEGORY ── */}
      <AnimatePresence>
        {editingCat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-orange-100 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-800 text-base">✏️ Chỉnh sửa chủ đề</h3>
                <button
                  onClick={() => setEditingCat(null)}
                  className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">Chọn biểu tượng:</label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-gray-50 rounded-2xl border">
                  {EMOJIS_PRESET.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setCatEmojiInput(em)}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all ${
                        catEmojiInput === em ? 'bg-orange-200 ring-2 ring-orange-400 scale-110' : 'hover:bg-white'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Tên chủ đề:</label>
                <div className="flex gap-2">
                  <div className="w-12 h-11 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-2xl shrink-0">
                    {catEmojiInput}
                  </div>
                  <input
                    type="text"
                    value={catNameInput}
                    onChange={(e) => setCatNameInput(e.target.value)}
                    className="flex-1 border-2 border-gray-200 focus:border-orange-400 rounded-2xl px-3 py-2 text-sm font-bold focus:outline-none"
                    placeholder="VD: Động vật nuôi"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="flex-1 py-2.5 rounded-2xl font-bold bg-gray-100 text-gray-600 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveCatEdit}
                  disabled={!catNameInput.trim()}
                  className="flex-1 py-2.5 rounded-2xl font-black bg-orange-500 text-white text-xs disabled:opacity-40 shadow-md"
                >
                  ✓ Cập nhật
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: EDIT WORD ── */}
      <AnimatePresence>
        {editingWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-orange-100 space-y-3 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-800 text-base">✏️ Sửa từ vựng</h3>
                <button
                  onClick={() => setEditingWord(null)}
                  className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* AI Image Preview for Edit Modal */}
              {editingWord && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-violet-200 flex items-center justify-center shrink-0 shadow-sm">
                    <WordImage word={editingWord.word} size="lg" showSkeleton />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-violet-700 mb-1">Hình minh hoạ</p>
                    {editingWord.word.image_url ? (
                      <div className="flex gap-1.5 flex-wrap">
                        <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">✓ Ảnh AI</span>
                        <button
                          type="button"
                          onClick={() => setEditingWord({ ...editingWord, word: { ...editingWord.word, image_url: undefined } })}
                          className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full hover:bg-rose-200 transition-colors"
                        >
                          ✕ Xóa ảnh
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 mb-1.5">Đang dùng emoji</p>
                    )}
                    <button
                      type="button"
                      disabled={!editingWord.word.en.trim() || generatingImage}
                      onClick={() => handleGenerateImage(editingWord.word.en, editingWord.word.vi, editingWord.word.emoji, false)}
                      className="text-[10px] font-black text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all disabled:opacity-50 shadow-sm"
                    >
                      {generatingImage ? (
                        <><span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" /> Đang tạo...</>
                      ) : (
                        '🎨 AI tạo ảnh'
                      )}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="w-16">
                    <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Icon</label>
                    <input
                      value={editingWord.word.emoji}
                      onChange={(e) =>
                        setEditingWord({
                          ...editingWord,
                          word: { ...editingWord.word, emoji: e.target.value },
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl p-1.5 text-center text-2xl focus:outline-none focus:border-orange-400"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[11px] font-bold text-gray-500">Từ tiếng Anh *</label>
                      <button
                        type="button"
                        onClick={() => handleEnrichWord(editingWord.word.en, false)}
                        disabled={!editingWord.word.en.trim() || enriching}
                        className="text-[10px] font-black text-violet-700 bg-violet-100 hover:bg-violet-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all disabled:opacity-40"
                      >
                        {enriching ? (
                          <span className="w-2.5 h-2.5 border border-violet-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          '✨ AI điền mẫu'
                        )}
                      </button>
                    </div>
                    <input
                      value={editingWord.word.en}
                      onChange={(e) =>
                        setEditingWord({
                          ...editingWord,
                          word: { ...editingWord.word, en: e.target.value },
                        })
                      }
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-black text-violet-700 focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Nghĩa tiếng Việt *</label>
                  <input
                    value={editingWord.word.vi}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        word: { ...editingWord.word, vi: e.target.value },
                      })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-rose-600 focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Phiên âm IPA</label>
                  <input
                    value={editingWord.word.phonetic}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        word: { ...editingWord.word, phonetic: e.target.value },
                      })
                    }
                    placeholder="/kæt/"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-500 focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Câu ví dụ tiếng Anh</label>
                  <input
                    value={editingWord.word.example_en}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        word: { ...editingWord.word, example_en: e.target.value },
                      })
                    }
                    placeholder="The cat is sleeping."
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Dịch ví dụ tiếng Việt</label>
                  <input
                    value={editingWord.word.example_vi}
                    onChange={(e) =>
                      setEditingWord({
                        ...editingWord,
                        word: { ...editingWord.word, example_vi: e.target.value },
                      })
                    }
                    placeholder="Con mèo đang ngủ."
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingWord(null)}
                  className="flex-1 py-2.5 rounded-2xl font-bold bg-gray-100 text-gray-600 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveWordEdit}
                  disabled={!editingWord.word.en.trim()}
                  className="flex-1 py-2.5 rounded-2xl font-black bg-orange-500 text-white text-xs disabled:opacity-40 shadow-md"
                >
                  ✓ Lưu thay đổi
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MODAL: ADD WORD ── */}
      <AnimatePresence>
        {addingWordToCatId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl border border-orange-100 space-y-3 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-black text-gray-800 text-base">➕ Thêm từ mới</h3>
                <button
                  onClick={() => setAddingWordToCatId(null)}
                  className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* AI Image Preview for Add Word Modal */}
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-violet-50 to-pink-50 rounded-2xl border border-violet-100">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border-2 border-violet-200 flex items-center justify-center shrink-0 shadow-sm">
                  <WordImage word={newWordDraft.en ? newWordDraft : { ...newWordDraft, en: 'word' }} size="lg" showSkeleton />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-violet-700 mb-1">Hình minh hoạ</p>
                  {newWordDraft.image_url ? (
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">✓ Ảnh AI</span>
                      <button
                        type="button"
                        onClick={() => setNewWordDraft((p) => ({ ...p, image_url: undefined }))}
                        className="text-[10px] bg-rose-100 text-rose-600 font-bold px-2 py-0.5 rounded-full hover:bg-rose-200 transition-colors"
                      >
                        ✕ Xóa ảnh
                      </button>
                    </div>
                  ) : (
                    <p className="text-[10px] text-gray-400 mb-1.5">Đang dùng emoji Twemoji</p>
                  )}
                  <button
                    type="button"
                    disabled={!newWordDraft.en.trim() || generatingImage}
                    onClick={() => handleGenerateImage(newWordDraft.en, newWordDraft.vi, newWordDraft.emoji, true)}
                    className="text-[10px] font-black text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {generatingImage ? (
                      <><span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" /> Đang tạo...</>
                    ) : (
                      '🎨 AI tạo ảnh'
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <div className="w-16">
                    <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Icon</label>
                    <input
                      value={newWordDraft.emoji}
                      onChange={(e) => setNewWordDraft({ ...newWordDraft, emoji: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl p-1.5 text-center text-2xl focus:outline-none focus:border-orange-400"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <label className="block text-[11px] font-bold text-gray-500">Từ tiếng Anh *</label>
                      <button
                        type="button"
                        onClick={() => handleEnrichWord(newWordDraft.en, true)}
                        disabled={!newWordDraft.en.trim() || enriching}
                        className="text-[10px] font-black text-violet-700 bg-violet-100 hover:bg-violet-200 px-2 py-0.5 rounded-full flex items-center gap-1 transition-all disabled:opacity-40"
                      >
                        {enriching ? (
                          <span className="w-2.5 h-2.5 border border-violet-700 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          '✨ AI tự điền'
                        )}
                      </button>
                    </div>
                    <input
                      value={newWordDraft.en}
                      onChange={(e) => setNewWordDraft({ ...newWordDraft, en: e.target.value })}
                      placeholder="apple"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-black text-violet-700 focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Nghĩa tiếng Việt *</label>
                  <input
                    value={newWordDraft.vi}
                    onChange={(e) => setNewWordDraft({ ...newWordDraft, vi: e.target.value })}
                    placeholder="quả táo"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-sm font-bold text-rose-600 focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Phiên âm IPA</label>
                  <input
                    value={newWordDraft.phonetic}
                    onChange={(e) => setNewWordDraft({ ...newWordDraft, phonetic: e.target.value })}
                    placeholder="/ˈæp.əl/"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-500 focus:outline-none focus:border-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-0.5">Câu ví dụ tiếng Anh</label>
                  <input
                    value={newWordDraft.example_en}
                    onChange={(e) => setNewWordDraft({ ...newWordDraft, example_en: e.target.value })}
                    placeholder="I eat an apple."
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingWordToCatId(null)}
                  className="flex-1 py-2.5 rounded-2xl font-bold bg-gray-100 text-gray-600 text-xs"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleAddNewWord}
                  disabled={!newWordDraft.en.trim()}
                  className="flex-1 py-2.5 rounded-2xl font-black bg-orange-500 text-white text-xs disabled:opacity-40 shadow-md"
                >
                  ✓ Thêm từ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
