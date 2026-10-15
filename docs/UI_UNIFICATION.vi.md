# Thống nhất giao diện VocaKids

## Những điểm đã rà soát

- Trang chủ dùng bóng đổ dày và nút 3D, trong khi các màn học, phụ huynh và admin dùng thẻ phẳng.
- Header, nút quay lại, tên màn và vị trí chọn học sinh khác nhau giữa các chức năng.
- Điều hướng cũ chỉ hiện trên điện thoại, không đánh dấu các màn con và luôn dẫn tới Admin.
- Nút, biểu mẫu, tab có nhiều kích thước và màu trạng thái chọn; một số tiêu đề bị cắt trên màn nhỏ.
- Một số màn thiếu khoảng trống cho thanh điều hướng dưới cùng.

## Hệ giao diện chung

- Nền slate sáng, thẻ trắng, viền nhẹ và bo góc 20px. Nút bo góc 12px, cao tối thiểu 44px.
- Cam đậm cho hành động chính, tím cho lựa chọn học tập. Màu thành công/lỗi và hình minh họa game được giữ riêng.
- Màu, bóng đổ và khoảng cách dùng các biến `--ui-*` trong `globals.css`.
- `AppPageHeader` dùng chung cho học hằng ngày, bài đọc, IPA, ôn tập, sticker, trò chơi, quản lý từ, nhập học liệu, tiến độ, gia đình, Admin và hướng dẫn. Các thao tác lưu, xuất/nhập, khóa và đăng xuất được giữ lại.
- Các màn luyện học/nói giữ thanh tiến độ chuyên biệt, dùng chung kiểu tab và nút.
- Một thanh điều hướng dùng trên desktop lẫn điện thoại: Học từ, Bài đọc, Trò chơi, Sticker, Gia đình. Tài khoản học sinh thấy Ôn tập thay cho Gia đình.
- Trang `/games` tập hợp Đấu trường, Cửa hàng, Săn kho báu và Tìm từ theo lớp của học sinh, đồng thời tôn trọng cài đặt ẩn trò chơi.
- Có liên kết bỏ qua điều hướng, trạng thái chọn cho trình đọc màn hình, focus rõ, khoảng chừa thanh dưới cùng và hỗ trợ giảm chuyển động.

## Giới hạn kiểm tra

Các kiểm thử render xác nhận điều hướng, header và trạng thái tài khoản; kiểm tra HTTP xác nhận route biên dịch. Những kiểm tra này không thay thế việc xem trực tiếp trên điện thoại và kiểm tra micro thật.
