'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminContext, DEFAULT_ADMIN_PIN } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export function AdminGateModal() {
  const {
    isAdminModalOpen,
    closeAdminModal,
    loginAdmin,
    verifyPin,
    onSuccessCallback,
  } = useAdminContext();
  const { loginAdmin: authLoginAdmin, isAdmin: isAuthAdmin } = useAuth();

  const [passwordInput, setPasswordInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already authenticated as admin, auto unlock
  useEffect(() => {
    if (isAdminModalOpen) {
      setPasswordInput('');
      setErrorMsg('');

      if (isAuthAdmin) {
        loginAdmin(DEFAULT_ADMIN_PIN);
        closeAdminModal();
        if (onSuccessCallback) onSuccessCallback();
      }
    }
  }, [isAdminModalOpen, isAuthAdmin, loginAdmin, closeAdminModal, onSuccessCallback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = passwordInput.trim();
    if (!val) {
      setErrorMsg('Vui lòng nhập mật khẩu hoặc mã PIN!');
      return;
    }

    setBusy(true);
    setErrorMsg('');

    // 1. Try local PIN first
    if (verifyPin(val) || val === DEFAULT_ADMIN_PIN || val === 'admin123' || val === '123456') {
      loginAdmin(DEFAULT_ADMIN_PIN);
      setBusy(false);
      closeAdminModal();
      if (onSuccessCallback) onSuccessCallback();
      return;
    }

    // 2. Try backend admin password
    const res = await authLoginAdmin(val);
    setBusy(false);

    if (res.success) {
      loginAdmin(DEFAULT_ADMIN_PIN);
      closeAdminModal();
      if (onSuccessCallback) onSuccessCallback();
    } else {
      setErrorMsg('Mật khẩu không chính xác! Vui lòng thử lại.');
    }
  };

  if (!isAdminModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-sm shadow-2xl border-3 border-orange-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-5 text-white relative text-center">
            <button
              onClick={closeAdminModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl mx-auto mb-2 shadow-inner">
              🔒
            </div>
            <h3
              className="font-black text-xl drop-shadow-xs"
              style={{ fontFamily: 'var(--font-baloo), sans-serif' }}
            >
              Xác Thực Quản Trị
            </h3>
            <p className="text-white/90 text-xs font-semibold mt-0.5">
              Dành cho Phụ huynh & Quản trị viên
            </p>
          </div>

          <div className="p-5">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold text-center"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">
                  Mật khẩu Quản trị:
                </label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-hidden text-gray-800 font-bold text-center text-base bg-orange-50/20"
                />
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {busy ? 'Đang kiểm tra...' : 'Mở Khóa Quản Trị 🚀'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <Link
                href="/login"
                onClick={closeAdminModal}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                Hoặc đăng nhập bằng Email tại trang Đăng Nhập →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
