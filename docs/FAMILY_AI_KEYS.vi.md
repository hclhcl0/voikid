# Key Gemini riêng của gia đình

Vào **Góc gia đình → API key AI của gia đình**. Dán key, chọn **Dùng key riêng của gia đình** và lưu. Nút **Kiểm tra key đã lưu** gọi Gemini bằng model đang được admin chọn và có dùng hạn mức API.

- Mặc định dùng key chung; dự phòng từ key riêng sang key chung mặc định tắt.
- Key riêng dùng cho chấm phát âm, tạo đoạn văn và rà soát từ vựng, kể cả khi bé đăng nhập bằng tài khoản học sinh thuộc gia đình.
- Dự phòng chỉ diễn ra khi được bật, với lỗi xác thực, hạn mức hoặc kết nối. Kết quả học tập chưa chắc chắn không làm chuyển key.
- Học sinh không xem/sửa/xóa/kiểm tra key. API quản lý chỉ trả trạng thái và bốn ký tự cuối cho phụ huynh/admin.
- Giới hạn tạo bài mỗi ngày do admin đặt vẫn áp dụng cho phụ huynh dùng key riêng. Mở bài đã lưu trong cache không gọi AI thêm.
- Chọn lại key chung giữ key riêng đã lưu. **Xóa key riêng** xóa bản mã và chuyển về key chung.

## Lưu trữ trên Coolify/Docker

Thư mục `ai-keys` nằm trong `VOCAKIDS_FAMILY_DIR` (mặc định `data/families`). Mỗi tài khoản có một tệp cấu hình riêng, key mã hóa AES-256-GCM, gắn với ID chủ tài khoản. `master.key` là khóa mã hóa tự tạo, dùng lại sau khi khởi động lại. Tệp được ghi với quyền `0600` trên hệ thống hỗ trợ quyền POSIX.

Docker Compose hiện tại đặt thư mục gia đình tại `/app/data/families`, thuộc volume `appdata:/app/data`. Sao lưu/khôi phục cả thư mục `ai-keys`, gồm `master.key`; mất khóa mã hóa thì cần nhập lại các API key. Không đưa thư mục dữ liệu này vào Git. Mã hóa này không thay thế bảo vệ truy cập máy chủ/volume.

Chọn key riêng không thay model AI hiện tại và không áp dụng cho ElevenLabs. Các key Gemini cùng Google Cloud project dùng chung hạn mức.
