import type { Word } from '@/types';
import { shuffle } from '@/lib/learning/engine';

export const wordSearchLevels = [
  { name: 'Dễ', size: 8, count: 5, directions: [[0, 1], [1, 0]], description: 'Ngang và dọc' },
  { name: 'Vừa', size: 10, count: 7, directions: [[0, 1], [1, 0], [1, 1]], description: 'Thêm đường chéo' },
  { name: 'Khó', size: 12, count: 10, directions: [[0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1]], description: 'Có từ viết ngược' },
] as const;
export type SearchCell = { row: number; col: number };
export type SearchWord = { word: Word; cells: SearchCell[] };
export const searchLetters = (value: string) => value.toUpperCase().replace(/[^A-Z]/g, '');
export function eligibleSearchWords(words: Word[]) {
  const seen = new Set<string>();
  return words.filter(word => {
    const text = searchLetters(word.en);
    if (text.length < 2 || text.length > 20 || seen.has(text)) return false;
    seen.add(text); return true;
  });
}
export function buildWordSearch(words: Word[], level: number, seed: string) {
  const rules = wordSearchLevels[level] ?? wordSearchLevels[0];
  const selected = shuffle(eligibleSearchWords(words), seed).slice(0, rules.count);
  const size = Math.max(rules.size, ...selected.map(w => searchLetters(w.en).length));
  let grid: string[][] = Array.from({length: size}, () => Array(size).fill(''));
  let placed: SearchWord[] = [];
  for (const word of selected) {
    const letters = searchLetters(word.en);
    const starts = shuffle(Array.from({length: size * size}, (_, i) => i), `${seed}:${word.id}`);
    let cells: SearchCell[] | undefined;
    for (const start of starts) {
      for (const [dr, dc] of shuffle([...rules.directions], `${seed}:${word.id}:${start}`)) {
        const path = [...letters].map((_, i) => ({row: Math.floor(start / size) + dr * i, col: start % size + dc * i}));
        if (path.every((p, i) => p.row >= 0 && p.col >= 0 && p.row < size && p.col < size && (!grid[p.row][p.col] || grid[p.row][p.col] === letters[i]))) { cells = path; break; }
      }
      if (cells) break;
    }
    if (!cells) {
      // Guaranteed fallback: one complete word per row, with no missing targets.
      grid = Array.from({length: size}, () => Array(size).fill(''));
      placed = selected.map((w, row) => ({word: w, cells: [...searchLetters(w.en)].map((letter, col) => { grid[row][col] = letter; return {row, col}; })}));
      break;
    }
    cells.forEach((p, i) => { grid[p.row][p.col] = letters[i]; });
    placed.push({word, cells});
  }
  const fill = shuffle(Array.from({length: size * size}, (_, i) => String.fromCharCode(65 + i % 26)), `${seed}:fill`);
  grid.forEach((row, r) => row.forEach((letter, c) => { if (!letter) grid[r][c] = fill[r * size + c]; }));
  return {grid, placed, size};
}
export function searchLine(from: SearchCell, to: SearchCell): SearchCell[] {
  const rowDiff = to.row - from.row, colDiff = to.col - from.col;
  if (rowDiff && colDiff && Math.abs(rowDiff) !== Math.abs(colDiff)) return [];
  return Array.from({length: Math.max(Math.abs(rowDiff), Math.abs(colDiff)) + 1}, (_, i) => ({row: from.row + Math.sign(rowDiff) * i, col: from.col + Math.sign(colDiff) * i}));
}
export function matchesSearchPath(cells: SearchCell[], target: SearchCell[]) {
  const equal = (path: SearchCell[]) => cells.length === path.length && cells.every((c, i) => c.row === path[i].row && c.col === path[i].col);
  return equal(target) || equal([...target].reverse());
}
export function wordSearchReward(level: number, hints: number, found: number, total: number) {
  const stars = total > 0 && found === total ? 2 + Math.max(0, Math.min(2, level)) + (hints === 0 ? 2 : 0) : 0;
  return {stars, points: stars * 10};
}
