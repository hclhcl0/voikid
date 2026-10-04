'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Tự động tải lại trang nếu gặp lỗi không tải được file JavaScript do vừa có bản cập nhật mới trên server (ChunkLoadError)
    const msg = error?.message?.toLowerCase() || '';
    if (
      msg.includes('chunk') ||
      msg.includes('failed to fetch') ||
      msg.includes('dynamically imported module') ||
      error?.name === 'ChunkLoadError'
    ) {
      const lastReload = sessionStorage.getItem('vocakids_last_chunk_reload');
      const now = Date.now();
      // Tránh lặp vô hạn, chỉ tự reload nếu cách lần trước hơn 5 giây
      if (!lastReload || now - parseInt(lastReload, 10) > 5000) {
        sessionStorage.setItem('vocakids_last_chunk_reload', now.toString());
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 text-center shadow-xl border-2 border-orange-200">
        <div className="text-5xl mb-4 animate-bounce-slow">🦉</div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 mb-2">
          Đang làm mới bài học!
        </h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Ứng dụng vừa được cập nhật phiên bản mới. Bé hãy bấm nút tải lại để nạp bài học mới nhất nhé!
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              sessionStorage.removeItem('vocakids_last_chunk_reload');
              window.location.reload();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            🔄 Tải lại trang
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all flex items-center justify-center"
          >
            🏠 Về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
