# 🦉 VocaKids - Ứng Dụng Học Tiếng Anh Cho Trẻ Em (K-5)

VocaKids là ứng dụng học tiếng Anh tương tác thông minh bám sát chương trình Giáo dục Phổ thông (bộ SGK Global Success) từ Mẫu giáo đến Lớp 5, kết hợp cùng công nghệ Trí tuệ Nhân tạo giọng nói (**ElevenLabs**) và AI chấm điểm phát âm tương tác (**Gemini AI**).

---

## 🌟 Điểm Nổi Bật

* 📚 **Bám sát SGK Global Success**: Khung bài học chuẩn xác từ Mẫu giáo đến Lớp 5 với hơn 1.000 từ vựng và chủ đề quen thuộc.
* ✨ **Mỗi ngày N từ mới (`/daily`)**: Học từ vựng qua thẻ Flashcard, tách âm Kids Phonics, nghe giọng chuẩn/chậm và phòng Luyện nói AI với phản hồi chấm điểm tức thì.
* 🎙️ **Multi-key ElevenLabs TTS**: Hỗ trợ nhiều API Key dự phòng (chế độ Failover và Round-Robin) giúp hệ thống âm thanh luôn mượt mà và không gián đoạn.
* 🏪 **Game Little Market (`/shop`)**: Đóng vai mua bán sinh động với hơn 500 mặt hàng đời sống, luyện phản xạ nghe - nói tiếng Anh tự nhiên.
* 🎁 **Bộ sưu tập Sticker 3D (`/stickers`)**: Mở hộp quà bất ngờ bằng số sao đạt được, dán hình trang trí vào album cá nhân.
* 👨‍👩‍👧 **Khu vực Phụ huynh (`/parent`)**: Quản lý nhiều học sinh, theo dõi số từ thành thạo, chuỗi ngày học (streak) và bảo vệ bằng mã PIN.
* ⚙️ **Trang Quản trị (`/admin`)**: Cấu hình nguồn từ vựng, số lượng từ mới mỗi ngày, quản lý AI và công cụ tạo âm thanh hàng loạt (Batch TTS).

---

## 📖 Hướng Dẫn Sử Dụng Chi Tiết

Xem tài liệu hướng dẫn từng bước dành cho người mới bắt đầu tại:
👉 **[Xem Hướng Dẫn Sử Dụng Toàn Diện (Tiếng Việt)](docs/HUONG_DAN_SU_DUNG.vi.md)**

---

## 🚀 Khởi Chạy Nhanh (Local Development)

### Yêu cầu:
* Node.js 18+ hoặc 20+
* NPM / PNPM / Yarn

### Cài đặt và chạy:
```bash
# Cài đặt thư viện
npm install

# Khởi chạy máy chủ phát triển
npm run dev
```

Mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000)

### Chạy kiểm thử tự động:
```bash
# Kiểm tra logic từ mới mỗi ngày
node --test tests/daily-words.test.cjs

# Kiểm tra cơ chế đa API key ElevenLabs
node --test tests/media.test.cjs

# Kiểm tra tiến độ học tập
npm run test:learning

# Kiểm tra backend & bảo mật
npm run test:backend
```

---

## 📜 Giấy Phép
Dự án được xây dựng và phát triển vì mục đích giáo dục cho trẻ em.
