'use client';

import Link from 'next/link';
import { Swords } from 'lucide-react';
import { useVocabularyCatalog } from '@/hooks/useVocabularyCatalog';

export function ArenaInvite({ categoryId, words }: { categoryId?: string; words?: { catId: string; wordId: string }[] }) {
  const { settings } = useVocabularyCatalog();
  const groups = new Map<string, Set<string>>();
  words?.forEach(w => {
    const group = groups.get(w.catId) ?? new Set<string>();
    group.add(w.wordId); groups.set(w.catId, group);
  });
  if (!settings.showGames || (words && ![...groups.values()].some(group => group.size >= 2))) return null;
  const query = new URLSearchParams();
  if (categoryId) query.set('category', categoryId);
  words?.forEach(w => query.append('word', `${w.catId}:${w.wordId}`));
  return <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 space-y-2">
    <p className="text-sm text-violet-800">Dùng từ vừa học để tung chiêu!</p>
    <Link href={`/arena?${query}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white"><Swords size={18} />Thử sức ở đấu trường</Link>
  </div>;
}
