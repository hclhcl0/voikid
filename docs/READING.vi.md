# Học theo đoạn văn của unit

/curriculum hiện là danh sách bài đọc theo lớp trong hồ sơ học sinh. /unit/[unitId] dùng trình đọc mới cho 92 unit chính trong kho dữ liệu; các chủ đề mở rộng giữ phòng luyện từ hiện có. Tiến độ và lịch sử luyện từ cũ không bị xóa.

## Học liệu và AI

Mẫu câu được trích từ phần đầu file D:/engl/tong-hop-sgk-tieng-anh-lop-1-den-5-v2.txt vào src/lib/stories/patterns.json: lớp 1–2 mỗi lớp 16 unit, lớp 3–5 mỗi lớp 20 unit. Ghép bằng lớp + số unit, không suy đoán từ tên chủ đề gần giống. Đây là file tổng hợp do người dùng cung cấp, không phải xác nhận độc lập ấn bản SGK.

AI viết đoạn văn gốc theo chủ đề, mẫu câu của đúng unit, ngữ pháp đã học ở unit trước cùng lớp và từ vựng của unit đang quản lý trên server. Không sao chép bài đọc của trang mẫu YourHomework. Bài gồm tiêu đề, từng câu Anh–Việt, từ/cụm từ có xuất hiện trong bài, câu hỏi trắc nghiệm có câu làm bằng chứng. Kiểm tra cấu trúc, độ dài, số câu, liên kết mẫu câu, từ vựng và đáp án phải có trong câu; loại chuỗi hỏi–đáp bị gộp vào một câu hoặc mốc “hôm nay” mâu thuẫn. Đầu ra lỗi được sửa tối đa một lần bằng cùng key, trong thời gian chờ còn lại; không lặp vô hạn. Những kiểm tra này không thay thế giáo viên duyệt độ tự nhiên, dịch thuật hoặc độ khó.

Mức Có hỗ trợ / Vừa sức / Mở rộng nhẹ dựa vào câu hỏi hiểu bài của unit và kết quả tự làm trong chặng luyện cũ. Ít hơn 4 bằng chứng hoặc đúng độc lập dưới 60%: có hỗ trợ. Từ 4 bằng chứng và ít nhất 60%: vừa sức. Từ 8 bằng chứng và ít nhất 85%: mở rộng nhẹ trong cùng lớp. Câu xem đáp án và câu chỉ đúng sau khi thử lại không tính độc lập; sao thưởng và kết quả AI chấm phát âm không dùng xác định mức. Đây là quy tắc hỗ trợ chọn bài, không phải chuẩn hóa trình độ CEFR.

## Bố cục và hoạt động

Bốn phần: Bài đọc / Theo câu / Từ vựng / Hoạt động. Có nghe toàn bài bằng TTS của thiết bị, dòng đọc hiện tại, tốc độ 0.7/0.85/1/1.2, bật/tắt dịch, hai cột, tra từ trong đoạn và danh sách từ kèm nghĩa/IPA. IPA có thể để trống khi AI không chắc. TTS không tạo file audio và không có timestamp từng từ giả định.

Hoạt động gồm hiểu bài, nghe–viết cả câu, nghe–điền từ, điền từ theo đoạn và đọc theo/tự nghe lại; từ vựng là phần luyện thứ sáu tương ứng trang mẫu. Bài nghe chỉ chấm đáp án sau khi giọng đọc thực sự bắt đầu. Trong hoạt động, ẩn dòng đọc hiện tại và thanh từ vựng để không tự hiển thị đáp án nghe–viết. Đọc theo ghi âm cục bộ, chưa gửi chấm phát âm; chỉ ghi nhận thực hành.

Nghe–điền từ lấy từ trong toàn bộ đoạn văn, không giới hạn ở danh sách từ AI chọn. Chọn 1–3 chỗ trống mỗi lượt, luyện từ chính hoặc tất cả từ (kể cả từ ngữ pháp); mặc định lớp 1–2 một chỗ trống, lớp 3–5 hai chỗ trống. Một câu được chia thành nhiều lượt để luyện hết các từ đã chọn; lượt cuối có thể ít chỗ trống hơn. Chấm và lưu từng chỗ trống riêng, giữ kết quả lần đầu khi đổi số chỗ trống. Áp dụng cả bài đã lưu, không cần tạo lại bằng AI. Tên riêng và các lần xuất hiện lặp lại cũng được tính là lượt điền từ; đây không phải số từ vựng khác nhau.

Giữ nguyên các cụm từ nhiều từ trong danh sách từ vựng của bài, ưu tiên cụm dài nhất khi trùng vị trí. “Viet Nam” được giữ thành một đáp án ngay cả khi chưa có trong danh sách từ vựng. Cụm từ dùng khóa kết quả riêng, không kế thừa kết quả từ đơn bị tách trước đó. Mỗi ô nhập có gợi ý số ký tự; cụm từ hiện độ dài từng phần, ví dụ “Viet Nam”: 2 từ, 4 + 3 ký tự, không tính khoảng trắng. Một chỗ trống có thể cần một từ hoặc cả cụm từ.

Mỗi bài có 5 biến thể tối đa. Nút Tạo đoạn văn khác chọn biến thể kế tiếp, còn mở lại dùng bài và đáp án đã lưu. Hoàn thành sau khi đánh dấu đã đọc và trả lời các câu hỏi hiểu bài; không đòi tất cả đều đúng và không tự xác nhận thành thạo.

## Kho đoạn văn và bài tự viết

Mục Từ vựng & Cụm từ chỉ hiện các mục từ của bài chưa có trong kho chung hoặc kho gia đình đã phân lớp, tính toàn bộ lớp 1 đến lớp hiện tại (lớp 4 đối chiếu lớp 1–4). So sánh nguyên từ/cụm từ, không phân biệt hoa/thường, chuẩn hóa khoảng trắng và cách viết Viet Nam/Vietnam; không suy đoán biến thể ngữ pháp. Từ chỉ có ở lớp cao hơn vẫn là từ mới. Kho lưu trữ đã ẩn không được dùng đối chiếu. Bộ lọc áp dụng cho danh sách, tô từ trong đoạn và chọn từ để thêm vào kho; các hoạt động giữ dữ liệu cụm từ gốc để không tách sai đáp án. Đây là đối chiếu danh sách từ của các lớp, không phải xác nhận trẻ đã thành thạo từng từ.

Bài AI tự lưu vào hồ sơ khi tạo. Nút Lưu đoạn văn lưu lại bài và tiến độ hiện tại; Đoạn văn đã lưu trên trang unit liệt kê mọi bài của hồ sơ trong unit đó để mở lại hoặc xóa từng bài. Trang danh sách bài đọc có mục Đoạn văn đã lưu cho tất cả unit của lớp, với liên kết mở đúng bài. Xóa chỉ gỡ bài và tiến độ bài đó khỏi hồ sơ, không xóa cache dùng chung hay từ vựng đã nhập vào kho. Lưu dấu thời gian xóa để bản tiến độ cũ từ thiết bị khác không đưa bài trở lại; tạo/lưu lại bài sau đó có thể khôi phục.

Dán đoạn văn tự viết cho phép nhập tiêu đề và nguyên văn tiếng Anh (tối đa 6.000 ký tự/60 câu). Bản dịch tùy chọn: mỗi dòng ứng với một câu tiếng Anh. Danh sách từ tùy chọn: mỗi dòng `English | nghĩa tiếng Việt`, từ phải xuất hiện trong bài. Không gọi AI, không tự bịa nghĩa hoặc câu hỏi; bài tự viết dùng đọc, TTS, nghe–viết, nghe–điền từ và đọc theo. Chưa có Quiz khi chưa có câu hỏi, và chỉ có bài điền từ theo đoạn khi đã nhập danh sách từ. Bài gắn với lớp/unit hiện tại nhưng không được tự đánh giá là đạt mẫu câu SGK.

Thêm từ vào kho từ vựng cho chọn từng từ của bài, chuyển nghĩa/IPA/câu ví dụ sang định dạng kho hiện có. Admin lưu vào unit của kho chung qua API admin; phụ huynh lưu vào chủ đề của lớp trong kho gia đình; người dùng thiết bị lưu vào kho tùy chỉnh trên thiết bị. Học sinh không được sửa kho từ. Bỏ qua từ trùng (so sánh tiếng Anh, không phân biệt hoa/thường và khoảng trắng) trong chủ đề đích, giữ ID và nghĩa đã sửa của từ cũ. Chỉ thông báo thành công sau khi lưu xong; xung đột phiên sửa trả lỗi để tải lại.

## Server và tiến độ

POST /api/story cho hồ sơ thông thường; POST /api/admin/story cho phiên admin có cookie phạm vi /api/admin. API kiểm tra Origin, giới hạn yêu cầu, hồ sơ thuộc tài khoản và lớp của học sinh. Với tài khoản gia đình, kết quả học lấy từ kho tiến độ server; với hồ sơ thiết bị chưa có tài khoản, dùng thống kê tổng hợp hợp lệ từ client. Không gửi tên, email, mã hồ sơ hoặc thông tin riêng của trẻ tới Gemini; chỉ gửi lớp, mức hỗ trợ và dữ liệu học liệu.

Tạo bài dùng bộ nhiều key trong admin và model/thời gian chờ đang cấu hình; danh sách trống thì dùng key thiết bị hoặc GEMINI_API_KEY. Cache trong data/backend/stories theo nội dung unit, phiên bản mẫu/prompt, model, mức hỗ trợ, biến thể. Cache dùng chung vì bài không chứa thông tin định danh; tiến độ riêng từng hồ sơ trong storySessions của AppProgress, theo cơ chế localStorage và đồng bộ gia đình hiện có. Yêu cầu trùng dùng chung một tác vụ tạo; mở lại cache không gọi Gemini thêm. Tối đa 6 tác vụ tạo mới/phút theo tài khoản hoặc địa chỉ đầu vào trong tiến trình.

Phụ huynh xem bài hoàn thành và câu hiểu bài tự làm tại /parent, chi tiết tại /learning-report. Dữ liệu thiết bị vẫn dùng cơ chế lưu của ứng dụng; cache/file server cần ổ đĩa bền vững và giải pháp hiện tại dành cho một tiến trình Node.

## Kiểm chứng

npm run test:stories kiểm tra độ phủ 92 unit, chọn mức, dữ liệu lỗi, sửa đầu ra có giới hạn, quyền học sinh, failover key, gộp yêu cầu và cache. Các bộ kiểm thử học tập, backend, gia đình, key và chấm phát âm vẫn chạy. Đã gọi Gemini thật: Lớp 1 Unit 2 (có hỗ trợ, 3 câu), Lớp 4 Unit 3 (có hỗ trợ, 7 câu), Lớp 5 Unit 5 (mở rộng nhẹ, 15 câu). Đã bổ sung kiểm tra câu hỏi giả dạng bằng dấu chấm và câu mở đầu Because thiếu mệnh đề chính, đồng thời kiểm tra lại cache trước khi dùng. Chưa đánh giá sư phạm toàn bộ 92 unit và chưa thử micro/TTS trên từng thiết bị học sinh.

## Quyền hiển thị đoạn văn

Chỉ phiên admin hoặc tài khoản phụ huynh được xem Bài đọc đầy đủ, Theo câu, bản dịch và công cụ tạo/lưu/xóa/dán bài. Chờ xác định vai trò trước khi dựng phần đọc để tránh lộ nội dung khi tải trang. Học sinh và người chưa đăng nhập mở unit vào Hoạt động, vẫn nghe/luyện các câu nhưng không có phần đọc toàn bài hay thanh tra từ kèm câu ví dụ. API tạo đoạn văn từ chối học sinh/khách, kể cả bài đã có cache; phụ huynh vẫn phải sở hữu hồ sơ và chọn đúng lớp. Đây là giới hạn hiển thị và quyền tạo bài: dữ liệu câu/đáp án vẫn nằm trong tiến độ học trên thiết bị để chạy hoạt động, không phải cơ chế bảo mật đáp án khỏi công cụ phát triển trình duyệt.

## Rà soát từ mới trong toàn bài

Danh sách từ AI chọn khi viết bài không nhất thiết bao phủ toàn đoạn văn. Khi danh sách này bị lọc hết, không kết luận rằng mọi từ trong đoạn đều đã học. Nút AI rà soát toàn bộ đoạn văn quét từng câu để bổ sung tối đa 40 từ/cụm từ có nghĩa trong ngữ cảnh, kiểm tra chúng thực sự xuất hiện trong câu và lọc tiếp với kho từ lớp 1 đến lớp hiện tại. Chỉ admin/phụ huynh có quyền, kiểm tra sở hữu hồ sơ trước cache, giới hạn 6 tác vụ mới/phút và gộp yêu cầu trùng. Kết quả AI được cache theo nội dung câu/lớp/model trong data/backend/stories/vocabulary; bộ lọc dùng kho hiện tại mỗi lần. Bổ sung danh sách từ vào bài và lưu tiến độ mà không sửa đoạn văn, Quiz hoặc các đáp án cũ. Chưa rà soát thì thông báo rõ là danh sách chọn ban đầu còn thiếu; chỉ sau rà soát mới báo chưa tìm thấy từ mới.
