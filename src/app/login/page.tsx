'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProfileContext, AVATAR_LIST } from '@/context/ProfileContext';
import { GRADE_LEVELS } from '@/lib/vocabulary';

export default function LoginPage() {
  const router = useRouter();
  const {
    account,
    isAuthenticated,
    isAdmin,
    login: authLogin,
    register: authRegister,
    logout: authLogout,
  } = useAuth();
  const { syncWithServer } = useProfileContext();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register extra fields
  const [displayName, setDisplayName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAvatar, setChildAvatar] = useState('🐰');
  const [childGrade, setChildGrade] = useState('lop1');

  // Status & loading
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Quick fill Admin credentials helper
  const handleFillAdmin = () => {
    setEmail('admin@vocakids.com');
    setPassword('admin123');
    setMsg(null);
  };

  // Handle Unified Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setMsg({ type: 'error', text: 'Vui lòng nhập email và mật khẩu!' });
      return;
    }

    setLoading(true);
    setMsg(null);

    const res = await authLogin(cleanEmail, password);
    setLoading(false);

    if (res.success) {
      const isUserAdmin = res.account?.role === 'admin';
      setMsg({
        type: 'success',
        text: isUserAdmin
          ? 'Đăng nhập Quản trị viên (Admin) thành công! Đang chuyển hướng... 👑'
          : 'Đăng nhập thành công! Đang chuyển hướng... 🚀',
      });
      await syncWithServer();
      setTimeout(() => {
        if (isUserAdmin) router.push('/admin');
        else router.push('/parent');
      }, 700);
    } else {
      setMsg({ type: 'error', text: res.message || 'Email hoặc mật khẩu không chính xác.' });
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setMsg({ type: 'error', text: 'Vui lòng nhập email và mật khẩu!' });
      return;
    }
    if (password.length < 6) {
      setMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự!' });
      return;
    }
    if (!childName.trim()) {
      setMsg({ type: 'error', text: 'Vui lòng nhập tên của bé!' });
      return;
    }

    setLoading(true);
    setMsg(null);

    const res = await authRegister({
      email: cleanEmail,
      password,
      displayName: displayName.trim() || cleanEmail.split('@')[0],
      childName: childName.trim(),
      childAvatar,
      childGradeId: childGrade,
    });
    setLoading(false);

    if (res.success) {
      setMsg({ type: 'success', text: 'Tạo tài khoản thành công! Đang vào bài học... 🎉' });
      await syncWithServer();
      setTimeout(() => {
        router.push('/');
      }, 900);
    } else {
      setMsg({ type: 'error', text: res.message || 'Đăng ký không thành công.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF7ED] py-8 px-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-orange-300/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-72 h-72 rounded-full bg-amber-300/20 blur-3xl pointer-events-none" />

      {/* Mascot Header */}
      <div className="text-center mb-6 max-w-md w-full">
        <Link href="/" className="inline-block hover:scale-105 transition-transform">
          <div className="text-6xl mb-2 drop-shadow-md">🦉</div>
          <h1
            className="text-3xl font-black text-gray-800 drop-shadow-xs"
            style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
          >
            VocaKids
          </h1>
        </Link>
        <p className="text-sm font-bold text-orange-600 mt-1">
          Hệ thống luyện từ vựng tiếng Anh cho bé ✨
        </p>
      </div>

      {/* Main Single Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border-3 border-orange-200 overflow-hidden relative z-10 p-6 sm:p-7"
      >
        {/* Status Message */}
        <AnimatePresence>
          {msg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-4 p-3.5 rounded-2xl text-xs font-black text-center ${
                msg.type === 'success'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}
            >
              {msg.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CASE 1: ALREADY LOGGED IN */}
        {isAuthenticated && account ? (
          <div className="space-y-4">
            <div className="text-center p-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
              <span className="text-4xl mb-2 inline-block">
                {account.role === 'admin' ? '👑' : '👨‍👩‍👧'}
              </span>
              <h2 className="text-lg font-black text-gray-800">
                Xin chào, {account.displayName || account.email}!
              </h2>
              <span
                className={`inline-block mt-1 text-xs font-black px-2.5 py-0.5 rounded-full ${
                  account.role === 'admin'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {account.role === 'admin' ? '👑 Quản Trị Viên Hệ Thống' : '👨‍👩‍👧 Tài Khoản Phụ Huynh'}
              </span>
              <p className="text-xs text-gray-500 mt-2 font-mono">{account.email}</p>
            </div>

            <div className="space-y-2 pt-2">
              {account.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer text-center"
                >
                  ⚙️ Vào Trang Quản Trị Hệ Thống (/admin)
                </button>
              )}

              <button
                type="button"
                onClick={() => router.push('/parent')}
                className="w-full py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-colors cursor-pointer text-center"
              >
                👨‍👩‍👧 Vào Góc Phụ Huynh (/parent)
              </button>

              <button
                type="button"
                onClick={() => router.push('/')}
                className="w-full py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm transition-colors cursor-pointer text-center"
              >
                📚 Về Trang Học Của Bé
              </button>

              <button
                type="button"
                onClick={async () => {
                  await authLogout();
                  setMsg({ type: 'success', text: 'Đã đăng xuất.' });
                }}
                className="w-full py-2.5 rounded-2xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors cursor-pointer"
              >
                Đăng xuất tài khoản
              </button>
            </div>
          </div>
        ) : !isRegistering ? (
          /* CASE 2: SINGLE UNIFIED LOGIN FORM */
          <div>
            <div className="text-center mb-5">
              <h2
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
              >
                Đăng Nhập
              </h2>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Một tài khoản duy nhất cho Phụ Huynh & Quản Trị Viên
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Email / Tên đăng nhập:
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vocakids.com hoặc email phụ huynh"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-black text-gray-700 uppercase tracking-wide">
                    Mật khẩu:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-orange-600 font-bold hover:underline"
                  >
                    {showPassword ? 'Ẩn' : 'Hiện'} mật khẩu
                  </button>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-md hover:shadow-lg active:scale-98 transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? 'Đang kiểm tra...' : 'Đăng Nhập 🚀'}
              </button>
            </form>

            {/* Quick Admin Helper Card */}
            <div className="mt-4 p-3 bg-amber-50/80 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <span className="font-black text-amber-900 block">👑 Quản trị viên (Admin):</span>
                <span className="font-mono text-[11px] text-amber-700">admin@vocakids.com / admin123</span>
              </div>
              <button
                type="button"
                onClick={handleFillAdmin}
                className="py-1 px-2.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-900 font-black text-[11px] cursor-pointer shrink-0 transition-colors"
              >
                Điền nhanh
              </button>
            </div>

            {/* Switch to Register */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setMsg(null);
                }}
                className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
              >
                Chưa có tài khoản? Đăng ký phụ huynh mới →
              </button>
            </div>
          </div>
        ) : (
          /* CASE 3: SIMPLE REGISTER FORM */
          <div>
            <div className="text-center mb-4">
              <h2
                className="text-2xl font-black text-gray-800"
                style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
              >
                Đăng Ký Phụ Huynh
              </h2>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">
                Tạo tài khoản để theo dõi tiến độ và quản lý bài học của bé
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1 uppercase tracking-wide">
                  Tên phụ huynh (Bố / Mẹ):
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Mẹ Lan, Bố Nam..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
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
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
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
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20"
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
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-sm bg-orange-50/20 mb-2"
                />

                <div className="grid grid-cols-3 gap-1.5 mb-2">
                  {GRADE_LEVELS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setChildGrade(g.id)}
                      className={`py-1.5 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        childGrade === g.id
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
                      className={`h-9 rounded-xl flex items-center justify-center text-lg border-2 transition-all cursor-pointer ${
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-base shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản & Bắt Đầu Học 🎉'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false);
                  setMsg(null);
                }}
                className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
              >
                ← Đã có tài khoản? Quay lại Đăng Nhập
              </button>
            </div>
          </div>
        )}

        {/* Guest Mode Direct Link */}
        <div className="mt-5 pt-4 border-t border-orange-100 text-center">
          <Link
            href="/"
            className="text-xs font-black text-gray-500 hover:text-orange-600 transition-colors inline-flex items-center gap-1"
          >
            <span>👶</span>
            <span>Hoặc vào học ngay với chế độ Khách (không cần tài khoản) →</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
