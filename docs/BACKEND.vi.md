# Quản trị backend VocaKids

Mở http://localhost:3000/admin. Mật khẩu nằm trong biến VOCAKIDS_ADMIN_PASSWORD của .env.local; thông tin truy cập được tạo cho máy phát triển tại .tmp-learning/backend-access.txt. Không dùng PIN phụ huynh 1234 cho backend.

## Quản lý

- Chọn chủ đề, sửa tên, lớp, biểu tượng; thêm chủ đề mới.
- Thêm/sửa từ, nghĩa, IPA, ví dụ Anh–Việt, đường dẫn ảnh và âm thanh. Mã chủ đề và từ giữ ổn định để bảo toàn tiến độ.
- Nhấn Cập nhật từ để cập nhật bản nháp, sau đó Lưu thay đổi để lưu trên server.
- Ẩn chủ đề để ngừng hiển thị, Khôi phục chủ đề để hiện lại.
- Xóa từ khỏi chủ đề cần xác nhận. Xuất bản sao JSON trước khi thay đổi lớn; giữ file sao lưu để phục hồi thủ công.
- Cài đặt tên app, lời chào, mục tiêu từ/ngày và hiện trò chơi trên trang chủ. Mục tiêu là lời nhắc; không tự động giới hạn số từ mỗi lượt.

Dữ liệu server được dùng tại trang chủ, danh sách luyện tập, học thẻ từ, nói, tìm từ, bài kiểm tra và lộ trình lớp 1–5. Mở lại trang học để nhận thay đổi. Các bộ từ cá nhân trong localStorage vẫn riêng biệt, chưa tự chuyển vào kho chung. Học liệu đoạn văn thí điểm giữ nguyên; nếu xóa/đổi các từ được học liệu tham chiếu, phần ngữ cảnh đó sẽ tạm không hiển thị.

## Lưu trữ và vận hành

Mặc định: data/backend/content.json, ghi file tạm rồi đổi tên, kiểm tra revision để ngăn ghi đè từ phiên cũ. Chưa có file thì dùng dữ liệu từ src/lib/vocabulary.ts, tạo file khi lưu lần đầu. Không thay đổi trực tiếp file mã nguồn.

VOCAKIDS_CONTENT_DIR chọn thư mục lưu khác. Khi dùng Docker cần gắn volume bền vững cho thư mục này. Giải pháp hiện tại dành cho một tiến trình Node với ổ đĩa bền vững; nhiều instance hoặc hosting có filesystem tạm cần adapter PostgreSQL trước khi vận hành.

VOCAKIDS_ADMIN_PASSWORD chỉ nằm trên server. Phiên cookie HttpOnly, SameSite=Strict có hiệu lực 8 giờ; đổi mật khẩu trong môi trường rồi restart sẽ hủy token cũ. Có kiểm tra Origin, giới hạn thử mật khẩu trong bộ nhớ, kiểm tra đầu vào và xung đột phiên bản. Chạy production sau HTTPS. API key và chuỗi kết nối vẫn quản lý bằng biến môi trường, không trả qua catalog.

GET /api/catalog: dữ liệu công khai, loại chủ đề đã ẩn.
GET/POST/DELETE /api/admin/session: trạng thái, đăng nhập, đăng xuất.
GET/PUT /api/admin/content: đọc/lưu dữ liệu quản trị; cần cookie quản trị. PUT gửi đầy đủ ContentStore và revision hiện tại.

Các mục nghĩa trống đã tồn tại được giữ để quản trị viên sửa dần. Từ mới hoặc sửa từ/nghĩa bắt buộc đủ tiếng Anh và tiếng Việt.

Kiểm tra: npm run test:backend, npm run test:learning, npx tsc --noEmit, npm run build.

## Cài đặt trong admin

Toàn bộ giao diện /settings đã chuyển thành tab Cài đặt tại /admin?tab=settings. Đường dẫn /settings tự chuyển đến tab này. Phiên đăng nhập backend mở phần cài đặt, không cần mở khóa PIN phụ huynh lần nữa. Các cài đặt chung lưu server qua nút Lưu thay đổi; hồ sơ, PIN và cấu hình thiết bị giữ các nút lưu riêng và cơ chế lưu hiện có.

## Ba vai trò tài khoản

Admin đăng nhập riêng ở /admin bằng mật khẩu server; quản lý cài đặt chung. Phụ huynh đăng ký qua hộp đăng ký tài khoản trên trang chủ, đăng nhập bằng email/mật khẩu, mở /parent để quản lý học sinh, sửa tên/lớp, xem tiến độ và thêm từ theo lớp. Học sinh do phụ huynh tạo, đăng nhập qua hộp đăng nhập với email/mật khẩu được cấp. Học sinh chỉ nhận hồ sơ của mình, ghi tiến độ của mình và đọc kho từ của gia đình; không được sửa hồ sơ hay kho từ.

Kho từ gia đình được dùng trong các trang thẻ từ, luyện nói, bài kiểm tra và tìm từ. Kho cá nhân mới có scope gia đình; phụ huynh khác không đọc được. Admin không dùng PIN phụ huynh làm quyền backend.

Dữ liệu mới nằm tại data/families/families.json (VOCAKIDS_FAMILY_DIR để đổi vị trí), gồm mật khẩu băm bcrypt, tài khoản, quan hệ sở hữu, hồ sơ, tiến độ và kho từ. Cần ổ đĩa bền vững và một tiến trình Node. Phiên đăng nhập dùng cookie HttpOnly JWT; role lấy lại từ bản ghi tài khoản khi xử lý API. Đăng ký không nhận quyền admin/học sinh từ khách; tài khoản học sinh chỉ tạo bởi phụ huynh đã đăng nhập. API kiểm tra quan hệ sở hữu, chặn học sinh sửa dữ liệu quản trị và chặn phụ huynh truy cập gia đình khác.

Tài khoản PostgreSQL cũ vẫn có nhánh đăng nhập tương thích; không tự chuyển dữ liệu cũ sang kho gia đình mới. Tài khoản mới dùng kho gia đình trên server, không yêu cầu cấu hình PostgreSQL. Tiến độ hiển thị là dữ liệu các màn học đồng bộ về server, không phải đánh giá học thuật độc lập.

Kiểm tra quyền và luồng gia đình: npm run test:family.

Admin được kế thừa quyền phụ huynh tại /parent bằng phiên backend hiện có. API /api/admin/family dùng cookie admin đúng phạm vi đường dẫn để đọc học sinh/tiến độ toàn hệ thống gia đình và tạo/sửa học sinh; học sinh được tạo cho hồ sơ có sẵn vẫn giữ phụ huynh sở hữu ban đầu. Kho từ thêm bởi admin ở Góc phụ huynh dùng scope backend_admin. Phụ huynh thường và học sinh vẫn chỉ truy cập gia đình của mình.

## Thu âm và đánh giá phát âm

Trong /admin, mục **Thu âm & đánh giá phát âm** lưu chung trên server bằng nút **Lưu thay đổi**: bật/tắt AI, model Gemini, thời gian chờ AI, thời lượng thu từ/câu, thời gian chờ bé nói, khoảng lặng tự dừng, thời lượng tiếng nói tối thiểu, ngưỡng micro thích ứng và chấp nhận mạo từ/lặp đáp án. Mở lại trang học để nhận cấu hình thu âm mới. API key trong phần cài đặt thiết bị vẫn lưu riêng tại trình duyệt; server cũng hỗ trợ GEMINI_API_KEY.

GET /api/pronunciation/config cung cấp cấu hình công khai, không cung cấp API key. POST /api/pronunciation kiểm tra đầu vào, giới hạn dung lượng 3 MB và 30 lượt mới/phút theo địa chỉ đầu vào trong một tiến trình. Cùng attemptId, bản ghi và cấu hình được dùng lại trong 60 giây để tránh gọi AI trùng. Lỗi dịch vụ cho phép gửi lại. Tiến độ không cộng lại attemptId gần nhất.

Recorder dùng RMS, lọc bản ghi quá ngắn hoặc vỡ tiếng trước khi gửi, dừng giọng mẫu và hiển thị mức micro. VAD dựa trên năng lượng âm thanh, chưa xác định được người nói hoặc phân biệt mọi loại tiếng nền. Hai nhánh Gemini dùng structured output và kiểm tra cấu trúc/quan hệ trường lúc chạy. So khớp yêu cầu toàn bộ đáp án, không dùng khoảng cách chữ; chữ nhận diện không ghi đè lỗi phát âm từ nhánh đánh giá. Kết quả không rõ/lỗi dịch vụ giữ tiến độ. Hai lượt đạt chỉ dùng động viên, không tự chuyển từ sang thành thạo hoặc xóa từ mới. Các từ thành thạo cũ vẫn giữ lịch ôn hiện có.

Chưa có điểm 0–100 được hiệu chuẩn hoặc chấm phoneme bằng dịch vụ chuyên dụng. Chưa kiểm chứng cải tiến bằng bản ghi của trẻ và lời gọi Gemini thật; cần bộ ghi âm có nhãn cùng kiểm tra micro trên thiết bị sử dụng để đánh giá độ chính xác. Model nhập trong admin cần hỗ trợ audio/structured output và khả dụng với API key.

Kiểm thử quy tắc: npm run test:pronunciation; kiểm thử lưu cấu hình: npm run test:backend.

## Nhiều Gemini API key

Admin có mục **API key cho AI**, lưu riêng bằng **Lưu danh sách key**. Tối đa 10 key, mỗi key gồm tên, mã Google Cloud project, trạng thái bật/tắt. Thứ tự danh sách quyết định key chính/dự phòng; có nút đổi thứ tự và chế độ luân phiên. Mỗi lượt thử tối đa 1–3 key, vẫn nằm trong tổng thời gian chờ AI. Hết thời gian thì yêu cầu gửi lại, không kéo dài vô hạn.

Key được lưu trong data/backend/api-keys.json (theo VOCAKIDS_CONTENT_DIR), tách khỏi content.json và bản xuất nội dung. File dùng quyền 0600 khi filesystem hỗ trợ; trên Windows cần ACL của thư mục server để giới hạn tài khoản đọc file. GET quản trị chỉ trả key đã che; key đầy đủ không trả lại trình duyệt. Bản sao/volume vận hành phải bảo vệ file này như .env.local.

Chế độ mặc định key chính + dự phòng: chỉ đổi key khi lỗi quyền/key, 429 hoặc lỗi mạng/timeout/5xx. Lỗi đầu ra AI không hợp lệ hoặc kết quả bé cần luyện/thu lại không tự chuyển key để tìm kết quả đạt. Lỗi quyền/key tạm khóa credential trong tiến trình; thay secret hoặc kiểm tra kết nối thành công để dùng lại. Lỗi 429 tạm nghỉ cả nhóm project. Luân phiên đổi key bắt đầu cho lượt mới. Giới hạn Gemini áp dụng theo project, tạo nhiều key cùng project không tăng hạn mức.

Khi có danh sách, chấm phát âm dùng danh sách server; nếu toàn bộ key tắt/nghỉ/khóa thì trả lỗi dịch vụ, không âm thầm đổi sang key thiết bị. Khi danh sách trống, giữ cơ chế key thiết bị rồi GEMINI_API_KEY. Các tính năng AI khác (tạo từ, ảnh, nhập học liệu…) vẫn dùng cơ chế key hiện có; danh sách này hiện áp dụng cho chấm phát âm và tạo bài đọc theo unit.

GET/PUT/POST /api/admin/api-keys yêu cầu phiên admin; PUT/POST kiểm tra Origin. POST kiểm tra kết nối bằng một lời gọi văn bản nhỏ tới model đang cấu hình, có thể dùng quota; không xác nhận chất lượng audio. Không trả lỗi provider thô có thể chứa key. Thống kê lượt dùng/hoàn tất/lỗi và thời gian nghỉ ở bộ nhớ của tiến trình, đặt lại sau restart; một lượt chấm dùng hai nhánh Gemini. Không có kiểm thử gọi Gemini thật tự động.

Kiểm thử lưu key, che secret, quyền quản trị, failover, nghỉ theo project và luân phiên: npm run test:api-keys.
