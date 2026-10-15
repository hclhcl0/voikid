# Học liệu admin dùng chung

## Bài đọc

- Trong mỗi unit, phụ huynh mở **Bài đọc chung của admin → Học bài này**. Không cần gọi AI để mở bài chung.
- Admin tạo bài bằng AI sẽ tự thêm bài vào thư viện chung. Admin dán bài tự viết hoặc bấm **Lưu bài dùng chung** cũng đưa bài lên thư viện.
- Với bài cũ nằm trong hồ sơ/localStorage: admin mở đúng bài rồi bấm **Chia sẻ bài đang mở**. Không tự công khai toàn bộ cache AI vì cache có cả bài do phụ huynh tạo riêng.
- Phụ huynh chỉ đọc và chọn bài chung. Chỉ admin được thêm/gỡ bài chung. Bài do phụ huynh tự tạo vẫn riêng cho gia đình.
- Thư viện chỉ chứa nội dung bài: không sao chép hồ sơ, tên bé, đáp án, điểm hoặc tiến độ admin. Mỗi bé có bản học và tiến độ riêng khi phụ huynh chọn bài.
- Gỡ bài khỏi thư viện không xóa bản bài/tiến độ đã được lưu trong hồ sơ bé. Nội dung được định danh theo hash; thay nội dung tạo bản bài mới, không đè các đáp án đang học.
- Đoạn văn đầy đủ và thư viện chung vẫn chỉ hiện với admin/phụ huynh. Bé dùng bài đã được phụ huynh chuẩn bị qua hồ sơ.

## Từ vựng

Danh mục học chung gồm kho chính thức trong admin và các chủ đề admin đã nhập vào kho riêng của admin, theo lớp. Không đưa từ riêng của phụ huynh khác vào danh mục chung. Bỏ danh mục tổng hợp “Từ mới” của admin để tránh trùng từ và trộn lớp; các từ vẫn có trong chủ đề gốc. Kho từ gia đình của phụ huynh vẫn chỉnh sửa riêng.

## Lưu trữ

Bài dùng chung nằm trong `VOCAKIDS_CONTENT_DIR/shared-stories`, chia theo unit. Docker Compose hiện có lưu tại `/app/data/backend/shared-stories` trong volume `appdata`. Tối đa 50 bài mỗi unit. Sao lưu cùng dữ liệu ứng dụng.
