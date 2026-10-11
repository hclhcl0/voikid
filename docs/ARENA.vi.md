# Đấu trường từ vựng

Lời mời “Thử sức ở đấu trường” xuất hiện sau bài đọc, kết quả lượt luyện/bài thi, thẻ từ cuối cùng và phiên ôn tập. Link bài học truyền category để chọn sẵn chủ đề; link ôn tập truyền danh sách từ thực sự đã ôn, lọc theo chủ đề và lớp hiện hành, không lấy từ khác. Cần ít nhất 2 từ trong cùng chủ đề. Cài đặt showGames ẩn cả lời mời và trò chơi.

Đấu trường mặc định hiệu ứng Đầy đủ. Người chơi vẫn có thể chọn Theo thiết bị hoặc Nhẹ. Nhân vật tự trở về đứng chờ sau khi tung đòn (0,9 giây) hoặc trúng phản đòn (1,8 giây), không cần chuyển câu. Chế độ giảm chuyển động hiển thị tư thế hành động tĩnh trong 0,25 giây rồi về đứng chờ.

Âm thanh chiến đấu tổng hợp tại máy bằng Web Audio: tiếng vút lúc tung đòn, va chạm lúc trúng đòn, chuỗi âm phép thuật cho tuyệt chiêu hoặc trả lời chớp nhoáng. Nút Âm thanh ở màn chọn và trong trận tắt/bật riêng hiệu ứng chiến đấu, không đổi chức năng phát âm từ. Âm thanh được mở bằng thao tác trả lời của người chơi; dừng khi tắt tiếng, chuyển câu, rời trận, ẩn tab hoặc gỡ component. Chế độ giảm chuyển động rút ngắn thời điểm phát. Trình duyệt không hỗ trợ hoặc chặn âm thanh vẫn cho chơi bình thường.

Thưởng tốc độ chỉ áp dụng khi đúng và không dùng gợi ý: trong 3/6/10 giây được +12/+8/+4 sức mạnh, lâu hơn giữ sức mạnh cơ bản. Câu viết từ có các mốc 6/12/20 giây. Đòn đặc biệt nhân đôi phần thưởng tốc độ. Thời gian bắt đầu khi câu hỏi xuất hiện và không tính lượt animation trước đó. Không có giới hạn thời gian hay phạt trả lời chậm. Mức tốc độ điều khiển biểu ngữ, hào quang và số tia sáng; tùy chọn giảm chuyển động vẫn được tôn trọng.

Kho nhân vật gồm 3 Fallen Angel, 3 Valkyrie và 3 Seer để người chơi chọn. Đối thủ gồm 3 Skeleton Warrior và 3 Dark Oracle, chọn ở màn chuẩn bị trước trận. Mỗi lựa chọn chỉ đổi hình và animation, giữ cùng quy tắc tính điểm. Valkyrie là lựa chọn mặc định. Cả 5 bộ đều do chủ dự án cung cấp ZIP; thông tin nguồn ở `public/arena/chibi/CREDITS.md`.

Mở `/arena` hoặc nút Đấu trường trên trang chủ. Cài đặt `showGames` kiểm soát cả nút trên trang chủ và truy cập trò chơi. Bé chọn một trong ba nhân vật và một chủ đề theo lớp/hồ sơ hiện có, gồm cả kho từ riêng. Chủ đề cần ít nhất hai từ có nghĩa.

Nhân vật dùng bộ Fallen Angel Chibi của CraftPix do chủ dự án cung cấp. Ba biến thể có Idle (18 khung), Slashing (12), Hurt (12) và Dying (15), chuyển thành sprite sheet WebP 320px, tổng khoảng 1,4 MB. Thông tin nguồn và giấy phép ở public/arena/chibi/CREDITS.md. Hoạt ảnh chém và trúng đòn theo thời điểm tấn công/phản công, rồi trở lại đứng chờ. Đối thủ dùng biến thể khác nhân vật đã chọn. Hiệu ứng năng lượng, va chạm, combo và đòn đặc biệt được giữ. Lượt hiệu ứng dài 2,1 giây. Theo thiết bị tôn trọng giảm chuyển động; Đầy đủ bật animation trong sân đấu; Nhẹ giữ hình tĩnh và cho chuyển câu ngay. Các bộ đếm được dọn khi rời trận.

Mỗi trận đấu với Vệ binh Từ Vựng có tối đa 10 từ khác nhau, lần lượt chọn nghĩa, chọn từ và viết từ. Không có giới hạn thời gian. Kho từ không đủ đáp án phân biệt được chuyển sang viết từ để tránh câu trắc nghiệm mơ hồ. Viết từ bỏ qua chữ hoa/thường, khoảng trắng dư và dấu câu cuối.

Hai bên bắt đầu với 100 sức lực. Đáp án đúng gây 15 sức mạnh, combo tăng thêm 3 mỗi lượt, tối đa 24. Gợi ý cho thấy đáp án, giảm sức mạnh xuống 8 và không tăng combo/năng lượng. Ba lượt đúng không gợi ý nạp đủ năng lượng cho đòn đặc biệt: thêm 15 sức mạnh nếu đúng, tiêu hao 3 năng lượng kể cả khi sai. vệ binh có cơ hội đáp lại mỗi lượt; đòn của vệ binh giảm từ 14 xuống 5 nếu bé đúng. Trận kết thúc khi một bên hết sức lực hoặc hết câu; bên còn nhiều sức lực hơn thắng, bằng nhau hòa.

Kết quả ghi qua `recordUnitTest` hiện có, với mã `arena:<categoryId>`, tách khỏi mã unit học tập. Điểm luyện tập là tỷ lệ đúng không gợi ý; dùng chính sách điểm thưởng hiện có. Không gọi `recordAttempt` phát âm và không đánh dấu từ thành thạo. Kết quả chỉ ghi một lần khi trận hoàn thành, rời trận giữa chừng không thưởng. Trang kết quả liệt kê từ sai hoặc dùng gợi ý, cho nghe lại và mở thẻ từ của chủ đề.

Bản đầu chạy ở trình duyệt, đấu với máy và không có xếp hạng/multiplayer. Kết quả dùng cơ chế lưu hồ sơ/đồng bộ hiện có; không dùng làm thành tích thi đấu được server xác minh.

Kiểm thử quy tắc: `npm run test:arena`.
