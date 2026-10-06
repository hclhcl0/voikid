'use client';

// =============================================
// VocaKids – Word Search Game (Tìm Từ)
// Trẻ tìm từ tiếng Anh ẩn trong bảng chữ cái
// Hỗ trợ: chạm/kéo, bàn phím, click-to-select
// =============================================

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';
import { useCustomCategories } from '@/hooks/useCustomCategories';
import { useTTS } from '@/hooks/useTTS';
import { Word } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Cell {
  letter: string;
  row: number;
  col: number;
}

interface PlacedWord {
  word: Word;
  cells: Cell[];
  direction: 'H' | 'V' | 'D'; // Horizontal, Vertical, Diagonal
  found: boolean;
}

interface Selection {
  cells: Cell[];
  dragging: boolean;
}

// ── Grid Builder ──────────────────────────────────────────────────────────────
const GRID_SIZE = 12;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function buildGrid(words: string[]): {
  grid: string[][];
  placedWords: { word: string; cells: Cell[]; direction: 'H' | 'V' | 'D' }[];
} {
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill('')
  );
  const placedWords: { word: string; cells: Cell[]; direction: 'H' | 'V' | 'D' }[] = [];

  const canPlace = (
    word: string,
    row: number,
    col: number,
    dr: number,
    dc: number
  ): boolean => {
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) return false;
      if (grid[r][c] !== '' && grid[r][c] !== word[i]) return false;
    }
    return true;
  };

  const placeWord = (
    word: string,
    row: number,
    col: number,
    dr: number,
    dc: number,
    dirType: 'H' | 'V' | 'D'
  ) => {
    const cells: Cell[] = [];
    for (let i = 0; i < word.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      grid[r][c] = word[i];
      cells.push({ letter: word[i], row: r, col: c });
    }
    placedWords.push({ word, cells, direction: dirType });
  };

  // Try to place each word
  const directions: { dr: number; dc: number; type: 'H' | 'V' | 'D' }[] = [
    { dr: 0, dc: 1, type: 'H' },  // Horizontal →
    { dr: 1, dc: 0, type: 'V' },  // Vertical ↓
    { dr: 1, dc: 1, type: 'D' },  // Diagonal ↘
  ];

  for (const w of words) {
    const upper = w.toUpperCase().replace(/[^A-Z]/g, '');
    if (upper.length === 0 || upper.length > GRID_SIZE - 1) continue;

    let placed = false;
    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = shuffledDirs[attempt % shuffledDirs.length];
      const maxRow = GRID_SIZE - (dir.dr === 1 ? upper.length : 1);
      const maxCol = GRID_SIZE - (dir.dc === 1 ? upper.length : 1);
      if (maxRow < 0 || maxCol < 0) continue;
      const row = Math.floor(Math.random() * (maxRow + 1));
      const col = Math.floor(Math.random() * (maxCol + 1));
      if (canPlace(upper, row, col, dir.dr, dir.dc)) {
        placeWord(upper, row, col, dir.dr, dir.dc, dir.type);
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return { grid, placedWords };
}

// ── Color palette for found words ─────────────────────────────────────────────
const WORD_COLORS = [
  'bg-emerald-400',
  'bg-blue-400',
  'bg-violet-400',
  'bg-rose-400',
  'bg-amber-400',
  'bg-teal-400',
  'bg-orange-400',
  'bg-pink-400',
];

// ── Main Component ────────────────────────────────────────────────────────────
export default function WordSearchPage() {
  const { categories: serverCategories } = useVocabularyCatalog();
  const params = useParams<{ catId: string }>();
  const router = useRouter();
  const { categories: customCats } = useCustomCategories();
  const { speak } = useTTS();

  const [mounted, setMounted] = useState(false);
  const [gameKey, setGameKey] = useState(0); // increment to restart
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selection, setSelection] = useState<Selection>({ cells: [], dragging: false });
  const [foundWordColors, setFoundWordColors] = useState<Record<string, string>>({}); // word -> color class
  const [colorIdx, setColorIdx] = useState(0);
  const [startCell, setStartCell] = useState<Cell | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const cat = useMemo(() => {
    if (!mounted) return null;
    if (params.catId?.startsWith('custom_')) {
      return customCats.find((c) => c.id === params.catId) || serverCategories.find(c => c.id === params.catId);
    }
    return serverCategories.find(c => c.id === params.catId);
  }, [params.catId, customCats, mounted, serverCategories]);

  // Pick up to 10 short words
  const wordsToUse = useMemo<Word[]>(() => {
    if (!cat) return [];
    return cat.words
      .filter((w) => w.en.replace(/[^a-zA-Z]/g, '').length <= 10)
      .slice(0, 10);
  }, [cat]);

  // Build new grid whenever wordsToUse or gameKey changes
  useEffect(() => {
    if (wordsToUse.length === 0) return;
    const { grid: g, placedWords: pw } = buildGrid(wordsToUse.map((w) => w.en));
    const enriched: PlacedWord[] = pw.map((p) => ({
      word: wordsToUse.find(
        (w) => w.en.toUpperCase().replace(/[^A-Z]/g, '') === p.word
      ) || wordsToUse[0],
      cells: p.cells,
      direction: p.direction,
      found: false,
    }));
    setGrid(g);
    setPlacedWords(enriched);
    setFoundWordColors({});
    setColorIdx(0);
    setSelection({ cells: [], dragging: false });
    setStartCell(null);
    setShowCongrats(false);
    setElapsedSec(0);
  }, [wordsToUse, gameKey]);

  // Timer
  useEffect(() => {
    if (showCongrats) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [showCongrats, gameKey]);

  useEffect(() => { setMounted(true); }, []);

  // ── Selection logic ──
  const getCellsInLine = useCallback(
    (from: Cell, to: Cell): Cell[] => {
      if (!grid.length) return [];
      const dr = Math.sign(to.row - from.row);
      const dc = Math.sign(to.col - from.col);

      // Only allow H / V / D movements
      const isH = dr === 0 && dc !== 0;
      const isV = dr !== 0 && dc === 0;
      const isD = Math.abs(to.row - from.row) === Math.abs(to.col - from.col);
      if (!isH && !isV && !isD) return [from];

      const len = Math.max(Math.abs(to.row - from.row), Math.abs(to.col - from.col)) + 1;
      return Array.from({ length: len }, (_, i) => {
        const r = from.row + dr * i;
        const c = from.col + dc * i;
        return { letter: grid[r][c], row: r, col: c };
      });
    },
    [grid]
  );

  const handleCellDown = (cell: Cell) => {
    setStartCell(cell);
    setSelection({ cells: [cell], dragging: true });
  };

  const handleCellEnter = (cell: Cell) => {
    if (!selection.dragging || !startCell) return;
    setSelection({ cells: getCellsInLine(startCell, cell), dragging: true });
  };

  const checkSelection = useCallback(
    (cells: Cell[]) => {
      if (cells.length < 2) return;
      const selectedWord = cells.map((c) => c.letter).join('');
      const selectedWordRev = [...cells].reverse().map((c) => c.letter).join('');

      const match = placedWords.find(
        (pw) =>
          !pw.found &&
          (pw.word.en.toUpperCase().replace(/[^A-Z]/g, '') === selectedWord ||
            pw.word.en.toUpperCase().replace(/[^A-Z]/g, '') === selectedWordRev)
      );

      if (match) {
        const color = WORD_COLORS[colorIdx % WORD_COLORS.length];
        setColorIdx((i) => i + 1);
        setFoundWordColors((prev) => ({ ...prev, [match.word.en]: color }));
        setPlacedWords((prev) =>
          prev.map((pw) =>
            pw.word.en === match.word.en ? { ...pw, found: true } : pw
          )
        );
        speak(match.word.en, 'en-US', 0.8);

        const allFound = placedWords.filter((pw) => !pw.found).length === 1;
        if (allFound) {
          setTimeout(() => {
            setShowCongrats(true);
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 },
              colors: ['#6c63ff', '#ffd93d', '#ff6b6b', '#6bcb77'],
            });
          }, 400);
        }
      }
    },
    [placedWords, colorIdx, speak]
  );

  const handleCellUp = () => {
    if (!selection.dragging) return;
    checkSelection(selection.cells);
    setSelection({ cells: [], dragging: false });
    setStartCell(null);
  };

  // Prevent scroll while dragging on touch
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', prevent, { passive: false });
    return () => el.removeEventListener('touchmove', prevent);
  }, []);

  // Check if a cell is in the current selection
  const isSelected = (r: number, c: number) =>
    selection.cells.some((cell) => cell.row === r && cell.col === c);

  // Check if a cell belongs to a found word; return color
  const getFoundColor = (r: number, c: number): string | null => {
    for (const pw of placedWords) {
      if (pw.found && pw.cells.some((cell) => cell.row === r && cell.col === c)) {
        return foundWordColors[pw.word.en] ?? 'bg-emerald-400';
      }
    }
    return null;
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const foundCount = placedWords.filter((pw) => pw.found).length;
  const totalCount = placedWords.length;

  if (!mounted || !cat) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="text-6xl animate-bounce">🔍</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pb-24">
      {/* Header */}
      <header className="bg-white/85 backdrop-blur sticky top-0 z-50 border-b border-emerald-100 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center font-bold text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Quay lại"
          >
            ←
          </button>
          <Link
            href="/"
            className="w-10 h-10 rounded-xl bg-orange-100/80 text-orange-600 hover:bg-orange-200/80 flex items-center justify-center font-bold transition-colors shadow-xs"
          >
            🏠
          </Link>
          <div className="flex-1">
            <h1 className="font-black text-gray-800 text-base flex items-center gap-2">
              <span>🔍 Tìm Từ</span>
              <span className="text-xl">{cat.emoji}</span>
            </h1>
            <p className="text-xs text-gray-500 font-semibold">{cat.name_vi}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-emerald-50 rounded-2xl px-3 py-1.5 text-center">
              <div className="font-black text-emerald-700 text-sm">{foundCount}/{totalCount}</div>
              <div className="text-[10px] text-emerald-500 font-bold">Tìm được</div>
            </div>
            <div className="bg-amber-50 rounded-2xl px-3 py-1.5 text-center">
              <div className="font-black text-amber-700 text-sm">{formatTime(elapsedSec)}</div>
              <div className="text-[10px] text-amber-500 font-bold">Thời gian</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-3 pt-4 space-y-4">
        {/* Progress bar */}
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div
            animate={{ width: totalCount > 0 ? `${(foundCount / totalCount) * 100}%` : '0%' }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
          />
        </div>

        {/* Word list */}
        <div className="flex flex-wrap gap-2">
          {placedWords.map((pw) => (
            <motion.div
              key={pw.word.en}
              animate={pw.found ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border-2 transition-all ${
                pw.found
                  ? `${foundWordColors[pw.word.en] || 'bg-emerald-400'} text-white border-transparent shadow-md`
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              <span>{pw.word.emoji}</span>
              <span className={pw.found ? '' : 'tracking-wider'}>{pw.word.en.toUpperCase()}</span>
              {pw.found && <span className="text-white/80">✓</span>}
            </motion.div>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="relative bg-white rounded-3xl shadow-xl border-2 border-emerald-100 overflow-hidden select-none"
          style={{ touchAction: 'none' }}
          onMouseLeave={handleCellUp}
        >
          <div
            className="grid p-2"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {grid.map((row, r) =>
              row.map((letter, c) => {
                const sel = isSelected(r, c);
                const foundColor = getFoundColor(r, c);
                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseDown={() => handleCellDown({ letter, row: r, col: c })}
                    onMouseEnter={() => handleCellEnter({ letter, row: r, col: c })}
                    onMouseUp={handleCellUp}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleCellDown({ letter, row: r, col: c });
                    }}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      const touch = e.touches[0];
                      const el = document.elementFromPoint(touch.clientX, touch.clientY);
                      const cellData = el?.getAttribute('data-cell');
                      if (cellData) {
                        const [tr, tc] = cellData.split(',').map(Number);
                        handleCellEnter({ letter: grid[tr][tc], row: tr, col: tc });
                      }
                    }}
                    onTouchEnd={(e) => { e.preventDefault(); handleCellUp(); }}
                    data-cell={`${r},${c}`}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg text-xs sm:text-sm font-black cursor-pointer
                      transition-all duration-100 select-none
                      ${foundColor ? `${foundColor} text-white shadow-sm` : sel
                        ? 'bg-violet-500 text-white scale-110 shadow-md z-10 relative'
                        : 'text-gray-700 hover:bg-emerald-50'}
                    `}
                    style={{ fontFamily: 'var(--font-andika), "Andika", monospace' }}
                  >
                    {letter}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hint / tip */}
        <p className="text-center text-xs text-gray-400 font-semibold">
          👆 Kéo để chọn từ trên bảng · Ngang, dọc hoặc chéo
        </p>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setGameKey((k) => k + 1)}
            className="py-3 rounded-2xl font-black text-sm border-2 border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            🔄 Xáo Bảng Mới
          </button>
          <Link
            href={`/learn/${cat.id}`}
            className="py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md flex items-center justify-center gap-2"
          >
            📖 Học Từ
          </Link>
        </div>
      </div>

      {/* Congrats overlay */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-4"
            >
              <div className="text-6xl">🏆</div>
              <h2 className="font-black text-2xl text-gray-800">Xuất Sắc!</h2>
              <p className="text-gray-500 font-semibold text-sm">
                Bé tìm được tất cả {totalCount} từ trong {formatTime(elapsedSec)}!
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {placedWords.map((pw) => (
                  <span
                    key={pw.word.en}
                    className="text-2xl"
                    title={`${pw.word.en} – ${pw.word.vi}`}
                  >
                    {pw.word.emoji}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setGameKey((k) => k + 1)}
                  className="flex-1 py-3 rounded-2xl font-black text-sm border-2 border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50 cursor-pointer transition-colors"
                >
                  🔄 Chơi Lại
                </button>
                <Link
                  href={`/test/${cat.id}`}
                  className="flex-1 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md flex items-center justify-center"
                >
                  🎯 Luyện Tập
                </Link>
              </div>
              <Link
                href="/"
                className="block w-full py-2.5 rounded-2xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                🏠 Về Trang Chủ
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
