'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfileContext, COLOR_THEMES, AVATAR_LIST } from '@/context/ProfileContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';

export default function LoginPage() {
  const router = useRouter();
  const {
    profiles,
    activeProfileId,
    setActiveProfileId,
    getProfileStars,
    loginWithCodeOrName,
    createProfile,
    hydrated,
  } = useProfileContext();

  const [tab, setTab] = useState<'pick' | 'code' | 'new'>('pick');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // New child form
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🐰');
  const [newGradeId, setNewGradeId] = useState('lop1');
  const [newColor, setNewColor] = useState('orange');
  const [newCustomCode, setNewCustomCode] = useState('');
  const [newError, setNewError] = useState('');

  const handleSelectChild = (id: string, name: string) => {
    setActiveProfileId(id);
    setMsg({ type: 'success', text: `Chào mừng ${name} đã đăng nhập! Đang vào bài học... 🚀` });
    setTimeout(() => {
      router.push('/');
    }, 800);
  };

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setMsg({ type: 'error', text: 'Vui lòng nhập tên của bé hoặc mã tài khoản!' });
      return;
    }
    setLoading(true);
    setMsg(null);

    const res = await loginWithCodeOrName(query) as { success: boolean; message?: string; profile?: { name: string } };
    setLoading(false);

    if (res.success && res.profile) {
      setMsg({ type: 'success', text: res.message || `Đăng nhập thành công cho ${res.profile.name}! Đang chuyển hướng... 🚀` });
      setTimeout(() => {
        router.push('/');
      }, 900);
    } else {
      setMsg({ type: 'error', text: res.message || 'Không tìm thấy bé với tên hoặc mã này.' });
    }
  };

  const handleCreateChild = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    if (!cleanName) {
      setNewError('Vui lòng nhập tên của bé!');
      return;
    }

    setLoading(true);
    setNewError('');

    try {
      const created = await createProfile({
        name: cleanName,
        avatar: newAvatar,
        gradeId: newGradeId,
        color: newColor,
        code: newCustomCode.trim() ? newCustomCode.trim().toUpperCase() : undefined,
      });

      setMsg({
        type: 'success',
        text: `Đã tạo tài khoản cho ${created.name} với Mã: ${created.code || ''}! Đang vào học... 🎉`,
      });

      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setNewError(err?.message || 'Có lỗi xảy ra khi tạo tài khoản.');
      setLoading(false);
    }
  };

  const handleCopy = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-orange-300/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-amber-300/20 blur-2xl pointer-events-none" />

      {/* Header Mascot */}
      <div className="text-center mb-6 max-w-md w-full">
        <Link href="/" className="inline-block hover:scale-105 transition-transform">
          <div className="text-6xl mb-2 drop-shadow-md">🦉</div>
          <h1
            className="text-3xl font-black text-gray-800 drop-shadow-xs"
            style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
          >
            VocaKids Login
          </h1>
        </Link>
        <p className="text-sm font-bold text-orange-600 mt-1">
          Bé đăng nhập để học & đồng bộ sao trên mọi thiết bị ✨
        </p>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border-3 border-orange-200 overflow-hidden relative z-10"
      >
        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 p-1.5 bg-orange-100/60 border-b border-orange-200 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setTab('pick');
              setMsg(null);
            }}
            className={`py-2.5 rounded-2xl transition-all cursor-pointer ${
              tab === 'pick' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            👶 Chọn bé ({profiles.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('code');
              setMsg(null);
            }}
            className={`py-2.5 rounded-2xl transition-all cursor-pointer ${
              tab === 'code' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            🔑 Nhập mã / Tên
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('new');
              setMsg(null);
            }}
            className={`py-2.5 rounded-2xl transition-all cursor-pointer ${
              tab === 'new' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            ➕ Thêm bé mới
          </button>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 text-xs font-black text-center ${
                msg.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border-b border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border-b border-rose-200'
              }`}
            >
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-5">
          {/* TAB 1: PICK EXISTING CHILD */}
          {tab === 'pick' && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-500 mb-2">
                Chạm vào bé để đăng nhập và học tiếp:
              </p>

              <div className="space-y-2.5">
                {profiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  const stars = getProfileStars(p.id);
                  const grade = GRADE_LEVELS.find((g) => g.id === p.gradeId) || GRADE_LEVELS[1];
                  const theme = COLOR_THEMES[p.color] || COLOR_THEMES.orange;
                  const code = p.code || 'CHUA_CO';

                  return (
                    <motion.div
                      key={p.id}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectChild(p.id, p.name)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3.5 group ${
                        isActive
                          ? 'bg-amber-50/90 border-amber-400 shadow-md ring-2 ring-amber-300/60'
                          : 'bg-white hover:bg-orange-50/50 border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-3xl shadow-md shrink-0 group-hover:scale-105 transition-transform`}
                      >
                        {p.avatar}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-gray-800 text-base truncate">{p.name}</h3>
                          {isActive && (
                            <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full shrink-0">
                              Đang chọn ✓
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500 font-semibold">{grade.label}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs font-black text-amber-600">⭐ {stars} sao</span>
                        </div>

                        {/* Account Code */}
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100/90 text-amber-800 border border-amber-200">
                            Mã: {code}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleCopy(code, e)}
                            className="text-[10px] text-gray-400 hover:text-orange-600 font-bold"
                          >
                            {copiedCode === code ? '✓ Đã chép' : '📋 Chép mã'}
                          </button>
                        </div>
                      </div>

                      <span className="text-orange-400 group-hover:text-orange-600 font-black text-lg transition-colors">
                        →
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setTab('code')}
                  className="text-xs font-black text-orange-600 hover:underline"
                >
                  📲 Bé đã có tài khoản trên điện thoại khác? Nhập mã tại đây →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOGIN BY CODE / NAME */}
          {tab === 'code' && (
            <form onSubmit={handleCodeLogin} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
                <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                  📲 <strong>Đồng bộ giữa các máy:</strong> Nhập <strong>Tên của bé</strong> (VD: <code className="font-bold">Bé Bống</code>) hoặc <strong>Mã tài khoản</strong> (VD: <code className="font-mono font-bold">BONG88</code>) để tải toàn bộ bài học và số sao về thiết bị này.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Tên bé hoặc Mã tài khoản:
                </label>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ví dụ: Bé Bống hoặc BONG88..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-base bg-orange-50/20"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang kiểm tra & đồng bộ...' : '🚀 Đăng Nhập & Bắt Đầu Học'}
              </button>
            </form>
          )}

          {/* TAB 3: REGISTER NEW CHILD */}
          {tab === 'new' && (
            <form onSubmit={handleCreateChild} className="space-y-4">
              {newError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold">
                  ⚠️ {newError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Tên của bé:
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ví dụ: Bé Bống, Minh Quân, Bo..."
                  className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                  maxLength={30}
                  autoFocus
                />
              </div>

              {/* Custom Code */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wide">
                    Mã tài khoản (tùy chọn):
                  </label>
                  <span className="text-[11px] text-gray-400">Tự tạo nếu để trống</span>
                </div>
                <input
                  type="text"
                  value={newCustomCode}
                  onChange={(e) => setNewCustomCode(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: BONG88, BO12..."
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-mono font-bold text-sm bg-orange-50/20 uppercase"
                  maxLength={15}
                />
              </div>

              {/* Grade */}
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Lớp của bé:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADE_LEVELS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setNewGradeId(g.id)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        newGradeId === g.id
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Chọn con vật đại diện:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_LIST.map((av) => (
                    <button
                      key={av.emoji}
                      type="button"
                      onClick={() => setNewAvatar(av.emoji)}
                      className={`h-11 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all cursor-pointer ${
                        newAvatar === av.emoji
                          ? 'bg-amber-100 border-amber-500 scale-110 shadow-sm ring-2 ring-amber-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                      title={av.name}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Màu sắc yêu thích:
                </label>
                <div className="flex gap-2">
                  {Object.entries(COLOR_THEMES).map(([k, t]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setNewColor(k)}
                      className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.bg} border-2 transition-all cursor-pointer ${
                        newColor === k ? 'ring-3 ring-orange-500 scale-110 border-white' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang tạo tài khoản...' : '🎉 Tạo Tài Khoản & Vào Học'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Link back home */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <Link href="/" className="text-xs font-bold text-gray-500 hover:text-orange-600">
            ← Quay lại Trang Chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
