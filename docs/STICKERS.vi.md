# Album sticker

Album `/stickers` có 4 bộ, mỗi bộ 6 mốc: Thú cưng, Thế giới phép thuật, Nhà thám hiểm và Ngôi sao học tập. Hình Fluent Emoji 3D được lưu tại `public/media/stickers/fluent-3d` cùng giấy phép MIT và nguồn tại `SOURCE.json`. Tải lại bằng `node scripts/download-sticker-assets.cjs`.

Mốc thưởng nằm trong `src/lib/stickers.ts`. Hoạt động luyện nói từ vựng, hoàn thành đoạn văn, chặng luyện bổ trợ, bài luyện âm và kiểm tra được xét thưởng khi lưu tiến độ. Mốc chủ đề tính cả bài đọc hiện tại và chặng luyện cũ, chỉ một lần cho mỗi unit. Album bổ sung các mốc đã đủ điều kiện từ tiến độ cũ và xếp sticker đã nhận lên trước. Mỗi ID chỉ được thưởng một lần, không cộng thêm sao/điểm từ việc mở album. Bài luyện âm phản ánh việc tham gia và kết quả chọn câu nghe; sticker không xác nhận phát âm thành thạo. La bàn ôn tập yêu cầu bài luyện được hoàn thành lại sau lịch ôn.

Ngày học được tích lũy theo hồ sơ trong `stickerStudyDays` để việc làm lại cùng một bài không xóa ngày học trước. Mốc ngày khác nhau không yêu cầu liên tiếp; chuỗi 7/30 ngày sử dụng chuỗi luyện từ vựng hiện có. Những ngày cũ chỉ có thể khôi phục từ dữ liệu tiến độ đã lưu.

Sticker bài kiểm tra/chặng học từ phiên bản trước hiển thị trong Kỷ niệm bài học. Chúng vẫn được giữ khi đổi lớp hoặc xóa đoạn văn. Liên kết đến chủ đề dùng danh mục hiện tại của lớp bé. Đồng bộ hợp nhất sticker theo ID và ngày nhận đầu tiên. Đặt lại tiến độ tạo `progressResetAt`, xóa thưởng cũ và ngăn thiết bị chưa tải lại hồ sơ ghi đè bằng tiến độ trước lần đặt lại.

Điểm kiểm tra gồm cả thưởng tốc độ nên không dùng 130 điểm để suy ra bài hoàn hảo. Kết quả mới lưu `correctAnswers`/`questionCount`; sticker viên ngọc yêu cầu đúng tất cả câu. Sticker hoàn hảo đã nhận trước đây được giữ nguyên.

Sticker đã nhận có quầng sáng pastel, sao nhỏ lấp lánh, vệt sáng lướt qua và chuyển động nhấp nhô nhẹ. Mỗi lưới chỉ chạy hiệu ứng lặp cho 6 sticker đầu để album lớn vẫn nhẹ. Thẻ xuất hiện theo nhịp ngắn, nhấn xuống thu nhỏ nhẹ; hộp chi tiết mở với hiệu ứng phóng nhẹ. Khi bật `prefers-reduced-motion`, giữ trang trí tĩnh và tắt animation. Chạm sticker mở hộp thông tin hỗ trợ bàn phím, có điều kiện, tiến độ và nút vào hoạt động học. Hình 3D lỗi sẽ dùng SVG Fluent đã lưu hoặc emoji dự phòng.

Kiểm tra: `node --test tests/stickers.test.cjs tests/family.test.cjs`, `npx tsc --noEmit`, `npm run build`.
