'use client';

// =============================================
// VocaKids – AuthModal Component
// Modal đăng nhập duy nhất cho Quản trị viên & Phụ huynh
// Đơn giản, gọn gàng, không chia tab rắc rối
// =============================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useProfileContext, AVATAR_LIST } from '@/context/ProfileContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';
import { useRouter } from 'next/navigation';

export function AuthModal() {
  const router = useRouter();
  const {
    account,
    isAuthenticated,
    isAuthModalOpen,
    authModalTab,
    closeAuthModal,
    login,
    register,
    logout,
  } = useAuth();

  const { syncWithServer } = useProfileContext();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register fields
  const [displayName, setDisplayName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAvatar, setChildAvatar] = useState('🐰');
  const [childGradeId, setChildGradeId] = useState('lop1');

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync mode with context
  useEffect(() => {
    if (isAuthModalOpen) {
      setIsRegistering(authModalTab === 'register');
      setStatusMsg(null);
    }
  }, [isAuthModalOpen, authModalTab]);

  if (!isAuthModalOpen) return null;


  // ── Handle Login ─────────────────────────────────────────
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập email và mật khẩu!' });
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    const res = await login(cleanEmail, password);
    setLoading(false);

    if (res.success) {
      const isUserAdmin = res.account?.role === 'admin';
      setStatusMsg({
        type: 'success',
        text: isUserAdmin
          ? 'Đăng nhập Quản trị viên (Admin) thành công! 👑'
          : 'Đăng nhập thành công! 🎉',
      });
      await syncWithServer();
      setTimeout(() => {
        closeAuthModal();
        if (isUserAdmin) router.push('/admin');
      }, 700);
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Email hoặc mật khẩu không chính xác.' });
    }
  };

  // ── Handle Register ──────────────────────────────────────
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
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
      email: cleanEmail,
      password,
      displayName: displayName.trim() || cleanEmail.split('@')[0],
      childName: childName.trim(),
      childAvatar,
      childGradeId,
    });
    setLoading(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: 'Đăng ký thành công! Chào mừng bạn 🎉' });
      await syncWithServer();
      setTimeout(() => {
        closeAuthModal();
      }, 900);
    } else {
      setStatusMsg({ type: 'error', text: res.message || 'Đăng ký không thành công. Vui lòng thử lại.' });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-3 border-orange-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white relative">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white font-bold text-lg transition-colors cursor-pointer"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-4xl drop-shadow select-none">🦉</span>
            <div>
              <h2
                className="text-2xl font-black drop-shadow-xs leading-tight"
                style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
              >
                {isAuthenticated ? 'Tài Khoản Của Bạn' : isRegistering ? 'Đăng Ký Phụ Huynh' : 'Đăng Nhập Hệ Thống'}
              </h2>
              <p className="text-xs text-white/90 font-bold">
                {isAuthenticated
                  ? 'Quản lý tài khoản và đồng bộ dữ liệu'
                  : 'Một tài khoản duy nhất cho Phụ Huynh & Quản Trị Viên'}
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
              className={`p-3 text-xs font-black text-center ${
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
          {isAuthenticated && account ? (
            /* VIEW 1: ALREADY LOGGED IN */
            <div className="space-y-4">
              <div className="bg-orange-50/70 p-4 rounded-2xl border-2 border-orange-200 text-center">
                <span className="text-4xl mb-1 inline-block">
                  {account.role === 'admin' ? '👑' : '👨‍👩‍👧'}
                </span>
                <h3 className="font-black text-gray-800 text-base">
                  {account.displayName || account.email}
                </h3>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{account.email}</p>
                <span
                  className={`inline-block mt-2 text-xs font-black px-2.5 py-0.5 rounded-full ${
                    account.role === 'admin'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {account.role === 'admin' ? '👑 Quản Trị Viên Hệ Thống' : '👨‍👩‍👧 Tài Khoản Phụ Huynh'}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {account.role === 'admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      closeAuthModal();
                      router.push('/admin');
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer text-center"
                  >
                    ⚙️ Vào Trang Quản Trị Hệ Thống (/admin)
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    closeAuthModal();
                    router.push('/parent');
                  }}
                  className="w-full py-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors cursor-pointer text-center"
                >
                  👨‍👩‍👧 Vào Góc Phụ Huynh (/parent)
                </button>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    {loading ? 'Đang thoát...' : '🚪 Đăng xuất'}
                  </button>
                  <button
                    type="button"
                    onClick={closeAuthModal}
                    className="flex-1 py-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    ✓ Đóng
                  </button>
                </div>
              </div>
            </div>
          ) : !isRegistering ? (
            /* VIEW 2: SINGLE CLEAN LOGIN FORM */
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 uppercase tracking-wide">
                  Email / Tên đăng nhập:
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vocakids.com hoặc email phụ huynh"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
                    Mật khẩu:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-orange-600 font-bold hover:underline"
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'}
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? 'Đang kiểm tra...' : 'Đăng Nhập 🚀'}
              </button>


              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setStatusMsg(null);
                  }}
                  className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  Chưa có tài khoản? Đăng ký phụ huynh mới →
                </button>
              </div>
            </form>
          ) : (
            /* VIEW 3: REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 uppercase tracking-wide">
                  Tên phụ huynh (Bố / Mẹ):
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Mẹ Lan, Bố Tuấn..."
                  className="w-full px-3.5 py-2 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                  maxLength={30}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 uppercase tracking-wide">
                  Email đăng ký:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="baome@example.com"
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 uppercase tracking-wide">
                  Mật khẩu (tối thiểu 6 ký tự):
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                />
              </div>

              <div className="pt-2 border-t border-orange-100">
                <label className="block text-xs font-black text-orange-600 mb-1 uppercase tracking-wide">
                  👶 Tên của bé:
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Ví dụ: Bé Bống, Minh Quân..."
                  required
                  className="w-full px-3.5 py-2 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20 mb-2"
                />

                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {GRADE_LEVELS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setChildGradeId(g.id)}
                      className={`py-1 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        childGradeId === g.id
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-6 gap-1.5">
                  {AVATAR_LIST.slice(0, 6).map((av) => (
                    <button
                      key={av.emoji}
                      type="button"
                      onClick={() => setChildAvatar(av.emoji)}
                      className={`h-8 rounded-xl flex items-center justify-center text-lg border-2 transition-all cursor-pointer ${
                        childAvatar === av.emoji
                          ? 'bg-amber-100 border-amber-500 scale-105'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? 'Đang tạo...' : 'Tạo Tài Khoản & Bắt Đầu Học 🎉'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setStatusMsg(null);
                  }}
                  className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  ← Đã có tài khoản? Quay lại Đăng Nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
