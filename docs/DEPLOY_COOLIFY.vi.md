# VocaKids trên Coolify / Docker

## Đặt mật khẩu admin

1. Mở ứng dụng VocaKids trong Coolify → **Configuration → Environment Variables**.
2. Thêm `VOCAKIDS_ADMIN_PASSWORD` với mật khẩu riêng do bạn chọn. Bật **Runtime Variable**, tắt **Build Variable**. Không thêm tiền tố `NEXT_PUBLIC_`.
3. Thêm `JWT_SECRET` với chuỗi ngẫu nhiên riêng, ít nhất 32 byte, giữ ổn định giữa các lần deploy. Đây là khóa ký phiên phụ huynh/học sinh, không phải mật khẩu đăng nhập. Có thể tạo trên VPS bằng `openssl rand -hex 32`; chỉ dán kết quả vào Coolify, không đưa vào mã nguồn.
4. Lưu và **Restart** để áp dụng biến runtime. Nếu vừa cập nhật mã nguồn, **Redeploy** để chạy bản mới.
5. Mở `https://voikid.vnos.org/admin` và nhập mật khẩu đã đặt.

Dockerfile loại `.env.local` khỏi image. Vì vậy mật khẩu dev không tự có trên VPS. Admin dùng mật khẩu server, phụ huynh/học sinh dùng tài khoản email riêng. PIN phụ huynh không thay thế mật khẩu admin.

Kiểm tra `https://voikid.vnos.org/api/admin/session` khi chưa đăng nhập: `configured: true` nghĩa là server đã nhận mật khẩu. API không trả mật khẩu. `configured: false` nghĩa là biến chưa có trong container đang chạy; kiểm tra đúng resource và mục Runtime Variable rồi khởi động lại.

Đổi mật khẩu admin rồi restart sẽ hủy phiên admin cũ. Đổi `JWT_SECRET` sẽ buộc phụ huynh/học sinh đăng nhập lại.

## Giữ tài khoản, học liệu và media qua lần deploy

VocaKids hiện lưu tài khoản gia đình, tiến độ, cấu hình, danh sách API key và audio tạo bằng AI trong `/app/data`. Volume PostgreSQL không bảo vệ các file này.

**Nếu container hiện tại đã có dữ liệu, sao lưu toàn bộ `/app/data` ra VPS trước khi restart/redeploy hoặc thêm volume.** Volume mới có thể che dữ liệu trong container cũ. Phục hồi bản sao vào volume mới trước khi đưa ứng dụng chạy tiếp; không dùng volume trống để thay thế dữ liệu đang có.

Với ứng dụng **Dockerfile**:

- **Configuration → Persistent Storage → Add Volume Mount**.
- Đặt tên volume, ví dụ `vocakids-data`, và **Destination Path** là `/app/data`.
- Giữ các thư mục mặc định, hoặc đặt runtime: `VOCAKIDS_DATA_DIR=/app/data`, `VOCAKIDS_CONTENT_DIR=/app/data/backend`, `VOCAKIDS_FAMILY_DIR=/app/data/families`.
- Volume phải cho người dùng container UID/GID `1001:1001` ghi dữ liệu. Với bind mount, chỉnh quyền đúng thư mục mount trên VPS.

Với **Docker Compose**, mục Persistent Storage trên Coolify chỉ hiển thị cấu hình đã đọc từ Compose; không thêm/sửa volume ở đây. Chữ **read-only** nói về giao diện quản lý, không có nghĩa ứng dụng chỉ được đọc dữ liệu.

File `docker-compose.yml` của dự án đã khai báo `appdata:/app/data` trong service `vocakids` và khai báo `appdata` tại mục `volumes` cấp cao nhất. Mount này cho ứng dụng đọc/ghi, không dùng `:ro`.

1. Sao lưu `/app/data` hiện tại nếu đã có tài khoản, tiến độ hoặc audio.
2. Nếu Coolify lấy mã từ **Git**, đưa file Compose đã cập nhật lên đúng repository/nhánh được deploy. Mở **Configuration → General**, kiểm tra **Docker Compose Location** trỏ tới `/docker-compose.yml`, rồi **Reload Compose File** (tên nút có thể là Reload trên phiên bản đang dùng).
3. Nếu resource dùng **Docker Compose Empty**, mở **Edit Compose File**, thêm mount và khai báo volume vào Compose hiện có, lưu rồi tải lại cấu hình. Giữ các service/volume hiện có, đặc biệt `pgdata`.
4. Sau khi tải lại, kiểm tra **Persistent Storage** có mount tới `/app/data`. Điền `VOCAKIDS_ADMIN_PASSWORD` và `JWT_SECRET` trong Environment Variables.
5. Phục hồi dữ liệu đã sao lưu vào volume mới nếu có, rồi **Redeploy**. Kiểm tra ứng dụng ghi được dữ liệu.

Reload chỉ cập nhật cấu hình Coolify đã đọc; cần redeploy để container chạy với mount mới. Không xóa volume để đổi mật khẩu.

File trong volume chứa tài khoản và API key: bảo vệ bản sao lưu, chỉ quản trị viên được đọc. Chạy một instance Node với kho file hiện tại.

## Hồ sơ học sinh

- Khách thấy **Học thử**, lưu trên thiết bị. Đây không phải học sinh được tạo sẵn trên server.
- Phụ huynh đăng ký tài khoản và nhập tên/lớp của con; hoặc vào `/parent` để thêm học sinh.
- Admin đăng nhập `/admin`, rồi mở `/parent` để tạo hồ sơ/tài khoản học sinh và quản lý tiến độ.
- Sau đăng nhập, danh sách chỉ lấy từ server theo quyền tài khoản. Không ghép bé mẫu vào danh sách. Tài khoản chưa có học sinh được hướng dẫn thêm hồ sơ.
- Lựa chọn bé được lưu riêng theo tài khoản trong trình duyệt. Mã nguồn trên VPS không tự có hồ sơ/tài khoản từ máy dev; cần chuyển dữ liệu đã sao lưu nếu muốn dùng dữ liệu cũ.

Tài liệu Coolify: [Environment Variables](https://coolify.io/docs/applications/configuration/environment-variables), [Persistent Storage](https://coolify.io/docs/applications/configuration/persistent-storage), [Docker Compose](https://coolify.io/docs/applications/builds/docker-compose).
