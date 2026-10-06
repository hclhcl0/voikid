'use client';

// =============================================
// VocaKids – AuthModal Component
// Modal đăng nhập/đăng ký tài khoản cá nhân & quản lý chế độ Khách
// Thiết kế thân thiện, trực quan, dễ dùng cho phụ huynh và bé
// =============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProfileContext, AVATAR_LIST, COLOR_THEMES } from '@/context/ProfileContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';

export function AuthModal() {
  const {
    account,
    isGuest,
    isAuthenticated,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    logout,
    migrateGuestToAccount,
    cloudProfiles,
  } = useAuth();

  const { activeProfile, progress, syncWithServer } = useProfileContext();

  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Child info on registration
  const [childName, setChildName] = useState('');
  const [childAvatar, setChildAvatar] = useState('🐰');
  const [childGradeId, setChildGradeId] = useState('lop1');
  const [childColor, setChildColor] = useState('orange');

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [migrateLoading, setMigrateLoading] = useState(false);
  const [migrateSuccess, setMigrateSuccess] = useState(false);

  // Sync tab with context when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalTab);
      setStatusMsg(null);
      // Pre-fill child info from active profile if available
      if (activeProfile && isGuest) {
        setChildName(activeProfile.name);
        setChildAvatar(activeProfile.avatar);
        setChildGradeId(activeProfile.gradeId || 'lop1');
        setChildColor(activeProfile.color || 'orange');
      }
    }
  }, [isAuthModalOpen, authModalTab, activeProfile, isGuest]);

  if (!isAuthModalOpen) return null;

  // ── Handle Login ─────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập đầy đủ email và mật khẩu!' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || 'Đăng nhập thành công! 🎉' });
      await syncWithServer();
      setTimeout(() => {
        closeAuthModal();
      }, 1000);
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Email hoặc mật khẩu không chính xác.' });
    }
  };

  // ── Handle Register ──────────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setStatusMsg({ type: 'error', text: 'Vui lòng điền email và mật khẩu!' });
      return;
    }
    if (password.length < 6) {
      setStatusMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự!' });
      return;
    }
    if (!childName.trim()) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập tên của bé!' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    const res = await register({
      email: email.trim(),
      password,
      displayName: displayName.trim() || email.trim().split('@')[0],
      childName: childName.trim(),
      childAvatar,
      childGradeId,
      childColor,
    });
    setLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: res.message || 'Đăng ký thành công! Chào mừng bạn 🎉' });
      await syncWithServer();
      setTimeout(() => {
        closeAuthModal();
      }, 1200);
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Đăng ký không thành công. Vui lòng thử lại.' });
    }
  };

  // ── Handle Migrate Current Guest Progress ────────────────
  const handleMigrateGuest = async () => {
    if (!activeProfile) return;
    setMigrateLoading(true);
    const res = await migrateGuestToAccount(activeProfile, progress);
    setMigrateLoading(false);
    if (res.success) {
      setMigrateSuccess(true);
      await syncWithServer();
      setTimeout(() => setMigrateSuccess(false), 3000);
    } else {
      setStatusMsg({ type: 'error', text: res.message });
    }
  };

  // ── Handle Logout ────────────────────────────────────────
  const handleLogout = async () => {
    setLoading(true);
    await logout();
    setLoading(false);
    closeAuthModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-sm border-3 border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Claymorphic Banner */}
        <div className="bg-orange-600 p-5 text-white relative">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-4xl drop-shadow select-none">☁️</span>
            <div>
              <h2
                className="text-2xl font-bold drop-shadow-xs leading-tight"
                style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
              >
                {isAuthenticated ? 'Tài Khoản Của Bạn' : 'Đăng Nhập VocaKids'}
              </h2>
              <p className="text-xs text-white/90 font-bold">
                {isAuthenticated
                  ? 'Đồng bộ tiến độ học của bé lên Đám Mây'
                  : 'Lưu trữ tiến độ, học trên mọi điện thoại & máy tính'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 text-xs font-bold text-center ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border-b border-emerald-200'
                  : 'bg-rose-100 text-rose-800 border-b border-rose-200'
              }`}
            >
              {statusMsg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* ALREADY LOGGED IN VIEW */}
          {isAuthenticated && account ? (
            <div className="space-y-4">
              {/* Account Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                    {account.displayName ? account.displayName.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-base truncate">
                      {account.displayName || 'Phụ huynh'}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{account.email}</p>
                    <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">
                      ✓ Đã kết nối Đám Mây Cloud
                    </span>
                  </div>
                </div>
              </div>

              {/* Profiles managed under this account */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center justify-between">
                  <span>Hồ sơ các bé ({cloudProfiles.length})</span>
                  <span className="text-[11px] text-orange-600 font-bold">Tự động sao lưu</span>
                </h4>

                {cloudProfiles.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-gray-50 text-center text-xs text-gray-500 font-medium">
                    Chưa có hồ sơ nào được lưu trên đám mây.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cloudProfiles.map((cp) => (
                      <div
                        key={cp.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-200 shadow-xs"
                      >
                        <span className="text-2xl">{cp.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 truncate">{cp.name}</p>
                          <p className="text-xs text-slate-500 font-semibold font-mono">
                            Mã: {cp.code || 'CHUA_CO'}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200">
                          ⭐ Đồng bộ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Offer to migrate current local guest profile if active */}
              {!account?.role && activeProfile && !cloudProfiles.some((p) => p.id === activeProfile.id) && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
                  <p className="text-xs text-amber-900 font-bold mb-2">
                    💡 Bé <strong>{activeProfile.name}</strong> ({progress.totalStars} sao) đang ở bộ nhớ máy. Bạn có muốn lưu vào tài khoản cá nhân này không?
                  </p>
                  <button
                    type="button"
                    onClick={handleMigrateGuest}
                    disabled={migrateLoading || migrateSuccess}
                    className="w-full py-2.5 px-3 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-xs hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
                  >
                    {migrateSuccess
                      ? '✓ Đã đồng bộ thành công!'
                      : migrateLoading
                      ? 'Đang đồng bộ...'
                      : `📥 Đồng bộ tiến độ ${activeProfile.name} vào tài khoản`}
                  </button>
                </div>
              )}

              {/* Actions: Logout & Close */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {loading ? 'Đang thoát...' : '🚪 Đăng xuất (Về Khách)'}
                </button>
                <button
                  type="button"
                  onClick={closeAuthModal}
                  className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  ✓ Đã xong
                </button>
              </div>
            </div>
          ) : (
            /* NOT LOGGED IN — TABS: LOGIN OR REGISTER */
            <div className="space-y-4">
              {/* Tab Selector */}
              <div className="grid grid-cols-2 p-1 bg-orange-100/70 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setStatusMsg(null);
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    tab === 'login'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  🔑 Đăng Nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setStatusMsg(null);
                  }}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    tab === 'register'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  ✨ Đăng Ký Mới
                </button>
              </div>

              {/* TAB 1: LOGIN FORM */}
              {tab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Email phụ huynh:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="baome@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Mật khẩu:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gray-600 text-sm"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Đang kiểm tra...' : '🚀 Đăng Nhập Tài Khoản'}
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setTab('register')}
                      className="text-xs font-bold text-orange-600 hover:underline"
                    >
                      Chưa có tài khoản? Bấm vào đây để đăng ký miễn phí →
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: REGISTER FORM */}
              {tab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Tên phụ huynh (Bố / Mẹ):
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ví dụ: Mẹ Lan, Bố Tuấn..."
                      className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                      maxLength={30}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Email đăng ký:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="baome@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
                      Mật khẩu (tối thiểu 6 ký tự):
                    </label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                    />
                  </div>

                  {/* Child section */}
                  <div className="pt-2 border-t border-slate-200">
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-2">
                      👶 Hồ sơ bé đầu tiên:
                    </p>

                    <div className="space-y-2.5">
                      <div>
                        <input
                          type="text"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder="Tên của bé (Ví dụ: Bé Bống, Minh Quân...)"
                          required
                          className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                          maxLength={30}
                        />
                      </div>

                      {/* Grade Selector */}
                      <div className="grid grid-cols-3 gap-1.5">
                        {GRADE_LEVELS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setChildGradeId(g.id)}
                            className={`py-1.5 px-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                              childGradeId === g.id
                                ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                                : 'bg-gray-50 text-gray-600 border-gray-200'
                            }`}
                          >
                            {g.label}
                          </button>
                        ))}
                      </div>

                      {/* Avatar Selector */}
                      <div className="grid grid-cols-6 gap-1.5">
                        {AVATAR_LIST.slice(0, 6).map((av) => (
                          <button
                            key={av.emoji}
                            type="button"
                            onClick={() => setChildAvatar(av.emoji)}
                            className={`h-10 rounded-xl flex items-center justify-center text-xl border-2 transition-all cursor-pointer ${
                              childAvatar === av.emoji
                                ? 'bg-amber-100 border-amber-500 scale-105 shadow-xs'
                                : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            {av.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 hover:bg-orange-700 text-white font-bold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Đang tạo tài khoản...' : '🎉 Hoàn Tất Đăng Ký'}
                  </button>
                </form>
              )}

              {/* Guest Mode Callout */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="bg-orange-50/60 border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-700">
                      👤 <strong>Chế độ Khách:</strong>
                    </p>
                    <p className="text-[11px] text-gray-500 leading-tight">
                      Bé học ngay mà không cần email, tiến độ lưu trên máy này.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="py-1.5 px-3 rounded-xl bg-white border border-orange-300 text-orange-600 font-bold text-xs hover:bg-orange-50 transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    Học thử ngay →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
