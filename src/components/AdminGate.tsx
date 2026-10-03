'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAdminContext } from '@/context/AdminContext';

interface AdminGateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  allowChildPreview?: boolean;
}

export function AdminGate({
  children,
  title = 'Khu Vực Phụ Huynh & Quản Trị',
  subtitle = 'Phần này dành riêng cho Bố Mẹ và Quản Trị Viên để quản lý từ vựng, tài khoản và cài đặt.',
  allowChildPreview = false,
}: AdminGateProps) {
  const { isAdmin, openAdminModal, logoutAdmin } = useAdminContext();

  if (isAdmin) {
    return (
      <div className="relative">
        {/* Admin active banner indicator */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2 text-xs font-black flex items-center justify-between shadow-xs sticky top-0 z-40 border-b border-amber-400/50">
          <div className="flex items-center gap-2">
            <span className="text-base">👑</span>
            <span>Chế độ Quản Trị Viên (Admin) đang mở</span>
          </div>
          <button
            onClick={() => logoutAdmin()}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-black text-[11px] active:scale-95 transition-all cursor-pointer shadow-xs"
            title="Khóa lại để tránh bé nghịch"
          >
            <span>🔒</span>
            <span>Khóa Admin</span>
          </button>
        </div>

        {children}
      </div>
    );
  }

  // Not authenticated as Admin
  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col justify-center items-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-3 border-orange-200 text-center relative overflow-hidden"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg text-white">
          🔐
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight" style={{ fontFamily: 'var(--font-baloo), sans-serif' }}>
          {title}
        </h2>

        <p className="text-gray-500 text-xs sm:text-sm font-semibold mt-2 mb-6 leading-relaxed">
          {subtitle}
        </p>

        <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 mb-6 text-left">
          <div className="flex items-start gap-2.5">
            <span className="text-lg">🛡️</span>
            <div>
              <p className="text-xs font-black text-orange-800">Bảo Vệ Dữ Liệu Của Bé</p>
              <p className="text-[11px] font-semibold text-orange-700/90 mt-0.5">
                Vui lòng nhập mã PIN (mặc định <code className="bg-orange-200/80 px-1 py-0.5 rounded font-mono font-bold text-orange-900">1234</code>) hoặc giải phép toán dành cho phụ huynh để tiếp tục.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => openAdminModal()}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-98 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🔑</span>
            <span>Mở Khóa Quyền Phụ Huynh / Admin</span>
          </button>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🏠</span>
            <span>Quay Về Trang Chủ Học Tập Cho Bé</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
