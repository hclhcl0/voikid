'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share2, PlusSquare, CheckCircle, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra xem đang chạy ở chế độ standalone (đã cài đặt) chưa
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    setIsStandalone(isStandaloneMode);

    // 2. Phát hiện iOS (iPhone/iPad/iPod)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    // 3. Lắng nghe sự kiện beforeinstallprompt trên Android / Chromium
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Chỉ hiện banner nếu chưa bị người dùng ẩn trong phiên làm việc
      const dismissed = sessionStorage.getItem('vocakids:pwa-prompt-dismissed');
      if (!dismissed && !isStandaloneMode) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Lắng nghe sự kiện mở thủ công từ nút "Cài đặt WebApp"
    const handleOpenManual = () => {
      setShowModal(true);
    };
    window.addEventListener('vocakids:open-install-guide', handleOpenManual);

    // 5. Nếu là iOS và chưa cài đặt, hiển thị banner sau 3 giây
    if (isIosDevice && !isStandaloneMode) {
      const dismissed = sessionStorage.getItem('vocakids:pwa-prompt-dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => setShowBanner(true), 3500);
        return () => clearTimeout(timer);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('vocakids:open-install-guide', handleOpenManual);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
        setShowModal(false);
      }
      setDeferredPrompt(null);
    } else {
      // Nếu không có prompt native (như trên iOS hoặc trình duyệt khác), mở modal hướng dẫn
      setShowModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('vocakids:pwa-prompt-dismissed', 'true');
  };

  if (isStandalone) {
    return null; // Đã cài đặt thành webapp trên màn hình chính, không hiện prompt
  }

  return (
    <>
      {/* Floating Bottom Banner trên điện thoại */}
      <AnimatePresence>
        {showBanner && (
          <motion.aside
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-orange-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md"
            role="region"
            aria-label="Cài đặt ứng dụng VocaKids"
          >
            <div className="flex items-center gap-3">
              <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-2xl shadow-md border border-orange-100">
                <Image
                  src="/icon-192.png"
                  alt="VocaKids App Logo"
                  width={52}
                  height={52}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate">VocaKids App</h4>
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.2 text-[10px] font-bold text-amber-800">
                    <Sparkles className="h-2.5 w-2.5" /> WebApp
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                  Cài lên màn hình chính để học nhanh &amp; mượt hơn!
                </p>
              </div>

              <button
                onClick={handleDismissBanner}
                className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Đóng thông báo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 px-3 text-xs font-bold text-white shadow-md hover:bg-orange-700 active:scale-95 transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                {deferredPrompt ? 'Cài Đặt Ngay' : 'Xem Hướng Dẫn Cài'}
              </button>
              <button
                onClick={handleDismissBanner}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Để sau
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Modal Hướng Dẫn Cài Đặt Chi Tiết Cho Điện Thoại (iOS & Android) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-5"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-400 hover:text-slate-700 transition-colors"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl shadow-lg border-2 border-orange-200">
                  <Image
                    src="/icon-192.png"
                    alt="Logo"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">Cài Đặt VocaKids</h3>
                  <p className="text-xs text-orange-600 font-semibold">Thêm vào màn hình chính điện thoại</p>
                </div>
              </div>

              {isIOS ? (
                /* Hướng dẫn trên iOS Safari */
                <div className="space-y-3 rounded-2xl bg-orange-50/70 p-4 text-xs text-slate-700 border border-orange-100">
                  <p className="font-bold text-orange-950 flex items-center gap-1.5 text-sm">
                    <Smartphone className="h-4 w-4 text-orange-600" />
                    Cách cài đặt trên iPhone / iPad:
                  </p>
                  <ol className="space-y-2.5 list-none pl-0">
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-200 font-extrabold text-orange-800 text-[11px]">1</span>
                      <span>Chạm vào nút <strong>Chia sẻ</strong> <Share2 className="inline h-3.5 w-3.5 text-blue-600" /> ở thanh dưới của trình duyệt Safari.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-200 font-extrabold text-orange-800 text-[11px]">2</span>
                      <span>Cuộn xuống dưới và chọn mục <strong>"Thêm vào MH chính"</strong> (Add to Home Screen) <PlusSquare className="inline h-3.5 w-3.5 text-slate-800" />.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-200 font-extrabold text-orange-800 text-[11px]">3</span>
                      <span>Nhấn nút <strong>"Thêm" (Add)</strong> ở góc trên bên phải để hoàn tất!</span>
                    </li>
                  </ol>
                </div>
              ) : (
                /* Hướng dẫn trên Android / Chrome */
                <div className="space-y-3 rounded-2xl bg-amber-50/70 p-4 text-xs text-slate-700 border border-amber-100">
                  <p className="font-bold text-amber-950 flex items-center gap-1.5 text-sm">
                    <Smartphone className="h-4 w-4 text-amber-600" />
                    Cách cài đặt trên Android / Chrome:
                  </p>
                  {deferredPrompt ? (
                    <button
                      onClick={handleInstallClick}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-700"
                    >
                      <Download className="h-4 w-4" /> Bấm Để Cài Đặt Ngay
                    </button>
                  ) : (
                    <ol className="space-y-2.5 list-none pl-0">
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 font-extrabold text-amber-800 text-[11px]">1</span>
                        <span>Nhấn vào biểu tượng <strong>Ba chấm (⋮)</strong> ở góc trên bên phải trình duyệt Chrome.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 font-extrabold text-amber-800 text-[11px]">2</span>
                        <span>Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 font-extrabold text-amber-800 text-[11px]">3</span>
                        <span>Biểu tượng VocaKids sẽ xuất hiện trên màn hình điện thoại như một App thông thường!</span>
                      </li>
                    </ol>
                  )}
                </div>
              )}

              <div className="space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Mở toàn màn hình, không vướng thanh địa chỉ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Tải nhanh hơn và tiết kiệm dung lượng 4G/Wifi</span>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Đã hiểu
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
