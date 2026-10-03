'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { ChildBadge } from '@/components/ChildBadge';
import { Sticker, StickerTier } from '@/types';
import { CATEGORIES } from '@/lib/vocabulary';

// ─── All possible stickers the app can award ──────────────────────────────────
// These are the "sticker slots" in the album. Earned ones light up.
const ALL_STICKER_SLOTS: Array<Omit<Sticker, 'earnedAt'>> = [
  // Unit Test stickers — one per category per grade
  ...CATEGORIES.map(cat => ([
    { id: `${cat.id}_test_excellent`, name: 'Ngôi Sao Xuất Sắc', emoji: '🌟', tier: 'rare' as StickerTier,
      setId: 'unit_test', unitId: cat.id, condition: `Đạt Xuất Sắc bài kiểm tra ${cat.name_vi}` },
    { id: `${cat.id}_test_good`,      name: 'Sao Học Giỏi',      emoji: '⭐', tier: 'star' as StickerTier,
      setId: 'unit_test', unitId: cat.id, condition: `Đạt Giỏi bài kiểm tra ${cat.name_vi}` },
    { id: `${cat.id}_test_pass`,      name: 'Chiến Thắng!',      emoji: '🎉', tier: 'basic' as StickerTier,
      setId: 'unit_test', unitId: cat.id, condition: `Đạt bài kiểm tra ${cat.name_vi}` },
  ])).flat(),
  // Special / bonus stickers
  { id: 'streak_7',    name: '7 Ngày Liên Tiếp', emoji: '🔥', tier: 'star' as StickerTier,
    setId: 'achievement', condition: 'Học 7 ngày liên tiếp' },
  { id: 'streak_30',   name: '30 Ngày Huyền Thoại', emoji: '👑', tier: 'legendary' as StickerTier,
    setId: 'achievement', condition: 'Học 30 ngày liên tiếp' },
  { id: 'stars_100',   name: '100 Ngôi Sao', emoji: '💯', tier: 'star' as StickerTier,
    setId: 'achievement', condition: 'Thu thập 100 sao' },
  { id: 'stars_500',   name: '500 Ngôi Sao', emoji: '🏆', tier: 'rare' as StickerTier,
    setId: 'achievement', condition: 'Thu thập 500 sao' },
  { id: 'perfect_test',name: 'Điểm Hoàn Hảo', emoji: '💎', tier: 'legendary' as StickerTier,
    setId: 'achievement', condition: 'Đạt 130/130 điểm bài kiểm tra' },
];

const TIER_ORDER: StickerTier[] = ['legendary', 'rare', 'star', 'basic', 'special'];
const TIER_LABELS: Record<StickerTier, { label: string; color: string; bg: string }> = {
  legendary: { label: '👑 Huyền Thoại', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-300' },
  rare:      { label: '💎 Hiếm',         color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-300' },
  star:      { label: '⭐ Thường',        color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-300' },
  basic:     { label: '🌱 Cơ Bản',       color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-300' },
  special:   { label: '🎁 Đặc Biệt',     color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-300' },
};

type TabId = 'all' | StickerTier;

function StickerCard({ slot, earned }: { slot: Omit<Sticker, 'earnedAt'>; earned?: Sticker }) {
  const tier = TIER_LABELS[slot.tier];
  const isEarned = !!earned;

  return (
    <motion.div
      initial={isEarned ? { scale: 0.5, rotate: -15 } : false}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`rounded-2xl border-2 p-3 text-center transition-all relative ${
        isEarned
          ? `${tier.bg} shadow-md`
          : 'bg-gray-50 border-gray-200 opacity-50'
      }`}>
      {/* Emoji */}
      <div className={`text-4xl mb-1 ${isEarned ? 'drop-shadow' : 'grayscale opacity-40 filter'}`}>
        {isEarned ? slot.emoji : '❓'}
      </div>

      {/* Name */}
      <p className={`text-[10px] font-black leading-tight ${isEarned ? tier.color : 'text-gray-400'}`}>
        {isEarned ? slot.name : '???'}
      </p>

      {/* Tier badge */}
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block ${
        isEarned ? tier.color : 'text-gray-400'
      } bg-white/60`}>
        {tier.label.split(' ')[0]}
      </span>

      {/* Earned date */}
      {isEarned && earned?.earnedAt && (
        <p className="text-[8px] text-gray-400 mt-1">
          {new Date(earned.earnedAt).toLocaleDateString('vi-VN')}
        </p>
      )}

      {/* New badge */}
      {isEarned && earned?.earnedAt && (Date.now() - new Date(earned.earnedAt).getTime()) < 86400000 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
          MỚI!
        </span>
      )}
    </motion.div>
  );
}

export default function StickersPage() {
  const { progress, hydrated, activeProfile } = useProgress();
  const [activeTab, setActiveTab] = useState<TabId>('all');

  const earnedMap = useMemo(() => {
    const map = new Map<string, Sticker>();
    (progress.stickers ?? []).forEach(s => map.set(s.id, s));
    return map;
  }, [progress.stickers]);

  const earnedCount = earnedMap.size;
  const totalSlots  = ALL_STICKER_SLOTS.length;
  const pct = totalSlots > 0 ? Math.round((earnedCount / totalSlots) * 100) : 0;

  const filteredSlots = useMemo(() => {
    if (activeTab === 'all') return ALL_STICKER_SLOTS;
    return ALL_STICKER_SLOTS.filter(s => s.tier === activeTab);
  }, [activeTab]);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'all', label: '🎨 Tất cả' },
    { id: 'legendary', label: '👑 Huyền Thoại' },
    { id: 'rare',      label: '💎 Hiếm' },
    { id: 'star',      label: '⭐ Thường' },
    { id: 'basic',     label: '🌱 Cơ Bản' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="max-w-md mx-auto px-4 py-6 pb-24 space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="w-9 h-9 rounded-xl bg-white/80 shadow flex items-center justify-center text-violet-600 font-bold hover:bg-white transition-colors shrink-0">
            ←
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-black text-gray-800 text-lg">🎨 Bộ Sưu Tập Sticker</h1>
            <p className="text-xs text-gray-400">
              {activeProfile?.name?.toLowerCase().startsWith('bé') ? activeProfile.name : `Bé ${activeProfile?.name || 'Yêu'}`} {activeProfile?.avatar}
            </p>
          </div>
          <ChildBadge />
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border-2 border-violet-100">
          <div className="flex items-center gap-4">
            <div className="text-5xl">🎁</div>
            <div className="flex-1">
              <p className="font-black text-gray-800 text-base">
                {earnedCount} / {totalSlots} sticker
              </p>
              <div className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
              </div>
              <p className="text-xs text-gray-400 mt-1">{pct}% hoàn thành</p>
            </div>
          </div>

          {/* Tier summary */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {(['legendary','rare','star','basic'] as StickerTier[]).map(tier => {
              const count = (progress.stickers ?? []).filter(s => s.tier === tier).length;
              const t = TIER_LABELS[tier];
              return (
                <div key={tier} className={`rounded-xl p-2 text-center border ${t.bg}`}>
                  <div className="font-black text-lg text-gray-800">{count}</div>
                  <div className={`text-[9px] font-bold ${t.color}`}>{t.label.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-2 rounded-2xl text-xs font-black border-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-transparent shadow-lg'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-violet-300'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sticker grid */}
        {hydrated ? (
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {filteredSlots.map((slot, i) => (
                <motion.div key={slot.id}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}>
                  <StickerCard slot={slot} earned={earnedMap.get(slot.id)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl animate-bounce mb-3">🎨</div>
            <p className="text-violet-500 font-bold">Đang tải album…</p>
          </div>
        )}

        {/* CTA if no stickers yet */}
        {hydrated && earnedCount === 0 && (
          <div className="bg-white rounded-3xl p-6 text-center border-2 border-violet-100 shadow">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-black text-gray-800 mb-1">Chưa có sticker nào!</p>
            <p className="text-gray-500 text-sm mb-4">Học từ vựng và làm bài kiểm tra để nhận sticker nhé!</p>
            <Link href="/"
              className="inline-block bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition-transform">
              🚀 Bắt đầu học ngay
            </Link>
          </div>
        )}

        {/* Bottom nav placeholder */}
        <div className="h-4" />
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-white/95 backdrop-blur border-t-2 border-violet-100 max-w-md mx-auto">
          <div className="flex items-center justify-around px-2 py-2">
            {[
              { href: '/', icon: '🏠', label: 'Trang chủ' },
              { href: '/stickers', icon: '🎨', label: 'Sticker', active: true },
            ].map(({ href, icon, label, active }) => (
              <Link key={href} href={href}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all ${
                  active ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:text-violet-500 hover:bg-violet-50'
                }`}>
                <span className="text-xl">{icon}</span>
                <span className="text-[10px] font-black">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
