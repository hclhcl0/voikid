'use client';

import { AppPageHeader } from '@/components/ui/AppPageHeader';
import Link from 'next/link';

import { useState } from 'react';
import { Sparkles, ShieldCheck, ChevronRight, HelpCircle, Trophy, CheckCircle2, Phone } from 'lucide-react';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'student' | 'parent'>('student');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Header */}
      <AppPageHeader title="Hướng dẫn sử dụng" description="Những bước đơn giản để bắt đầu cùng bé." inset/>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {/* Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-6 sm:p-10 text-white shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Dành Cho Người Mới Sử Dụng Lần Đầu
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Chào mừng bạn đến với VocaKids!
            </h1>
            <p className="text-sm sm:text-base text-orange-50 leading-relaxed">
              Ứng dụng học tiếng Anh tương tác thông minh cho học sinh từ Mẫu giáo đến Lớp 5, kết hợp cùng giọng đọc bản xứ ElevenLabs và AI chấm điểm phát âm tương tác Gemini.
            </p>
          </div>
          <div className="absolute right-4 bottom-2 text-7xl sm:text-9xl opacity-20 pointer-events-none select-none">
            🦉
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="flex rounded-2xl bg-slate-200/80 p-1.5 text-sm font-bold">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 transition-all ${
              activeTab === 'student'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Bé & Phụ Huynh Học Tập
          </button>
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 transition-all ${
              activeTab === 'parent'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            Góc Phụ Huynh
          </button>
        </div>

        {/* TAB 1: Học sinh & Phụ huynh */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Lộ trình 4 bước bắt đầu dễ dàng
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Bước 1 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 font-extrabold text-orange-600 text-sm">
                    1
                  </span>
                  <span className="text-2xl">👶</span>
                </div>
                <h3 className="text-lg font-bold">Chọn hồ sơ & khối lớp</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Bấm vào huy hiệu bé ở góc trên để chọn lớp (Mẫu giáo, Lớp 1 - 5). Toàn bộ bài học SGK Global Success sẽ tự động điều chỉnh theo đúng độ tuổi của con.
                </p>
                <Link
                  href="/parent"
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:underline"
                >
                  Tạo hoặc đổi hồ sơ <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Bước 2 */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-200 font-extrabold text-amber-700 text-sm">
                    2
                  </span>
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-lg font-bold text-amber-950">Học Từ Mới & Luyện Nói AI</h3>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Mỗi ngày bé học từ mới qua Flashcard, nghe phát âm chuẩn/chậm, xem Kids Phonics và mở phòng micro để luyện nói. Gemini AI chấm điểm từ 0-100 tức thì!
                </p>
                <Link
                  href="/daily"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                >
                  Vào phòng từ mới hôm nay <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Bước 3 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 font-extrabold text-emerald-600 text-sm">
                    3
                  </span>
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className="text-lg font-bold">Vui chơi tại Little Market</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Đóng vai mua bán tại Tiệm bánh, Cửa hàng trái cây, Đồ chơi,... với 500 mặt hàng. Nghe khách order tiếng Anh và giao món đúng để kiếm tiền xu thưởng.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
                >
                  Khám phá Cửa hàng <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Bước 4 */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 font-extrabold text-purple-600 text-sm">
                    4
                  </span>
                  <span className="text-2xl">🎁</span>
                </div>
                <h3 className="text-lg font-bold">Thu thập Sticker 3D</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Dùng số Sao tích lũy được khi học bài để mở hộp quà bất ngờ. Sưu tập hàng trăm sticker động vật, phi thuyền, siêu anh hùng và dán vào album cá nhân!
                </p>
                <Link
                  href="/stickers"
                  className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
                >
                  Xem Album Sticker <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Mẹo học tập */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50 p-6 space-y-3">
              <h3 className="font-bold text-orange-950 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-orange-600" />
                Mẹo giúp bé nhớ từ sâu và lâu hơn
              </h3>
              <ul className="grid gap-2 text-sm text-orange-900 sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                  <span><strong>Duy trì chuỗi ngày (Streak 🔥):</strong> Mỗi ngày chỉ cần dành 5 - 10 phút để nhận điểm streak liên tiếp.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                  <span><strong>Tập nghe nút Rùa 🐢:</strong> Nghe phát âm chậm để nhìn rõ từng âm tiết Kids Phonics trước khi thu âm.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                  <span><strong>Vào mục Ôn tập định kỳ:</strong> Hệ thống tự động nhắc các từ bé sắp quên theo thuật toán lặp lại ngắt quãng.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-600 mt-0.5" />
                  <span><strong>Khám phá 44 âm IPA:</strong> Giúp bé hiểu khẩu hình miệng và bật âm đuôi chuẩn xác.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Góc Phụ Huynh */}
        {activeTab === 'parent' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              Công cụ quản lý dành cho cha mẹ
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                <div className="text-2xl">👨‍👩‍👧‍👦</div>
                <h3 className="font-bold text-base">Nhiều bé học chung</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tạo hồ sơ độc lập cho từng con. Tiến độ, số sao và bộ sưu tập sticker được lưu riêng biệt cho từng bé mà không bị lẫn lộn.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                <div className="text-2xl">🔒</div>
                <h3 className="font-bold text-base">Khóa PIN Phụ huynh</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thiết lập mã PIN 4 số an toàn để bảo vệ phần cài đặt, quản lý tài khoản và danh sách chủ đề học tập của bé.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2">
                <div className="text-2xl">📊</div>
                <h3 className="font-bold text-base">Báo cáo & Thống kê</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Theo dõi số lượng từ bé đã ghi nhớ vững vàng (đạt 2-3 sao), thời gian học và các chủ đề cần ôn tập thêm.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
              <h3 className="font-bold text-base">Cách sử dụng khu vực Phụ huynh:</h3>
              <ol className="space-y-3 text-sm text-slate-600 list-decimal list-inside">
                <li>Truy cập mục <strong>Góc Phụ huynh</strong> từ thanh điều hướng hoặc vào liên kết <code>/parent</code>.</li>
                <li>Bấm <strong>"Thêm học sinh"</strong> để tạo hồ sơ mới, đặt tên và chọn khối lớp hiện tại của bé.</li>
                <li>Xem danh sách các chủ đề trong SGK, bấm vào từng chủ đề để xem từ nào con đã nắm vững hoặc cần luyện tập thêm.</li>
                <li>Nếu cần chỉnh sửa mã PIN hoặc quản lý sao, truy cập tab Cài đặt Phụ huynh.</li>
              </ol>
              <Link
                href="/parent"
                className="learning-button inline-flex bg-emerald-600 text-white text-sm"
              >
                Mở Góc Phụ Huynh Ngay
              </Link>
            </div>
          </div>
        )}

        {/* Author Contact Card */}
        <section className="rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/90 via-amber-50/80 to-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
                👨‍💻 Hỗ trợ &amp; Đồng hành
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Liên hệ tác giả: Hồ Công Lượng
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                Mọi góp ý về nội dung, tính năng bài học hoặc hỗ trợ kỹ thuật trong quá trình học tập của bé, xin vui lòng liên hệ trực tiếp với tác giả.
              </p>
            </div>
            <a
              href="tel:0935593353"
              className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3.5 text-base font-black text-white shadow-md hover:from-orange-700 hover:to-amber-700 active:scale-95 transition-all whitespace-nowrap"
            >
              <Phone className="h-5 w-5" />
              <span>SĐT: 0935593353</span>
            </a>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <HelpCircle className="h-5 w-5 text-orange-500" />
            Câu hỏi thường gặp (FAQ)
          </h2>

          <div className="space-y-4 divide-y divide-slate-100 text-sm">
            <div className="pt-3 first:pt-0 space-y-1">
              <h3 className="font-bold text-slate-800">
                1. Máy tính hoặc điện thoại không thu âm được tiếng bé?
              </h3>
              <p className="text-slate-600">
                Bạn vui lòng kiểm tra quyền Micro trên trình duyệt (bấm vào biểu tượng ổ khóa 🔒 bên trái thanh địa chỉ web và chọn "Cho phép Micro").
              </p>
            </div>

            <div className="pt-3 space-y-1">
              <h3 className="font-bold text-slate-800">
                2. Dữ liệu học và sticker của con có bị mất khi tắt máy không?
              </h3>
              <p className="text-slate-600">
                Không. Dữ liệu được lưu trữ tự động trong bộ nhớ trình duyệt của thiết bị. Khi đăng nhập tài khoản gia đình, dữ liệu sẽ được đồng bộ lên đám mây an toàn.
              </p>
            </div>

            <div className="pt-3 space-y-1">
              <h3 className="font-bold text-slate-800">
                3. Có cần trả phí tài khoản AI ElevenLabs để học không?
              </h3>
              <p className="text-slate-600">
                Hệ thống có sẵn giọng đọc mẫu được lưu đệm và cơ chế tự động chuyển sang Web Speech API miễn phí của trình duyệt, đảm bảo bé luôn nghe được phát âm tiếng Anh.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Footer Action */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-100 p-6">
          <div>
            <h3 className="font-bold text-slate-800">Sẵn sàng cùng bé khám phá?</h3>
            <p className="text-sm text-slate-500">Bắt đầu ngay hôm nay với bài học từ mới thú vị!</p>
          </div>
          <Link
            href="/daily"
            className="ui-button ui-button-primary text-sm"
          >
            Bắt đầu học ngay 🚀
          </Link>
        </div>
      </main>
    </div>
  );
}
