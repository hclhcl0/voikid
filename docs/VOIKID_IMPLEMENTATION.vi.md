# Bàn giao nền tảng học bổ trợ VocaKids lớp 1–5

Ngày kiểm tra: 05/10/2026. Căn cứ: `D:\engl\VOIKID_GLOBAL_SUCCESS_AI_SPEC.md`.

Đã triển khai trên ứng dụng hiện có, giữ thương hiệu VocaKids, ID, URL và dữ liệu cũ. Đây là nền tảng dùng chung và năm Unit thí điểm có tương tác thực tế, **chưa phải toàn bộ chương trình Global Success đã đối chiếu và xuất bản**. Không triển khai production.

## 1. Chạy và kiểm tra

```powershell
npm run dev
npm run test:learning
npm run audit:learning
npx tsc --noEmit
npm run build
npm run lint
```

Các đường dẫn mới:

| Đường dẫn | Chức năng |
|---|---|
| `/curriculum?grade=1` … `?grade=5` | Bản đồ bộ từ, trạng thái nguồn, chủ đề mở rộng và độ phủ |
| `/unit/lop1_unit1` | Lớp 1: ba từ, câu mẫu ngắn, chọn nghĩa, ngữ cảnh và nói theo |
| `/unit/lop2_unit1` | Lớp 2: bữa tiệc, chọn từ, sắp chữ, hội thoại có hỗ trợ |
| `/unit/lop3_unit1` | Lớp 3: chào hỏi, nhớ cách viết, đọc hội thoại và tạo câu |
| `/unit/lop4_c1_unit_1_my_friends` | Lớp 4: những người bạn mới, đọc chi tiết và đóng vai |
| `/unit/lop5_c1_unit_1_all_about_me` | Lớp 5: tự giới thiệu, phân biệt thông tin nhân vật, viết/nói có hướng dẫn |
| `/learning-report` | Báo cáo kỹ năng, lịch sử, bài viết chưa chấm và gợi ý ôn; dùng PIN phụ huynh hiện có |

Mọi category lớp 1–5 hiện có đều có URL `/unit/<categoryId>` để dùng phòng luyện chung. Chỉ năm Unit trên có ngữ cảnh bổ trợ đã biên soạn cho bản thí điểm. Không tự gán Unit vào tập chưa xác minh. Lớp đang xem không thay đổi lớp trong hồ sơ.

## 2. Kiểm kê và bản đồ chương trình

Nguồn chính thức đã truy cập: [cổng Global Success](https://gs.hoclieu.vn/), có danh mục sách học sinh lớp 1–5 và hai tập cho lớp 3–5. Chưa truy cập được nội dung từ [cổng tập huấn](https://taphuan.nxbgd.vn/) để xác nhận mục lục, trang, ấn bản, mục tiêu và âm theo bài. Hai URL YourHomework trong đặc tả cũng chưa truy cập được, nên dùng bảng ý tưởng trong đặc tả, không tuyên bố đã kiểm thử website tham khảo.

`docs/global-success-map.json` là bảng kiểm kê đầy đủ: lớp, sách dự kiến, tập/ấn bản chưa xác minh, loại phần, thứ tự theo dữ liệu hiện có, ID cũ, từ/cụm từ, nghĩa, ví dụ, mục tiêu bổ trợ, kỹ năng, chặng học, nguồn và trạng thái. Nó **không phải mục lục chính thức**. Có thể tái tạo bằng `npm run audit:learning`.

| Lớp | Bộ dữ liệu hiện có | Tên Unit trong dữ liệu chưa đối chiếu | Chủ đề mở rộng | Từ/cụm đủ dữ liệu cho phòng luyện mới | Ngữ cảnh thí điểm | Đã đối chiếu / xuất bản |
|---|---:|---:|---:|---:|---:|---:|
| 1 | 24 | 16 | 8 | 129 | 1 | 0 / 0 |
| 2 | 25 | 16 | 9 | 132 | 1 | 0 / 0 |
| 3 | 31 | 20 | 10 | 275 | 1 | 0 / 0 |
| 4 | 36 | 20 | 16 | 332 | 1 | 0 / 0 |
| 5 | 30 | 20 | 10 | 275 | 1 | 0 / 0 |

Lớp 3 còn một Starter được giữ nguyên loại khởi động theo tên hiện có; không đổi thành Unit. Mẫu giáo giữ luồng cũ, không gắn vào bản đồ Global Success lớp 1–5.

Tổng cộng 146 bộ dữ liệu, 1.143 mục đủ dữ liệu cho bộ chuyển đổi mới. Audit đánh dấu 618 mục ngôn ngữ cần rà soát, gồm 30 mục thiếu nghĩa và nhiều ví dụ lặp mẫu “We learn about…”. Đây là cờ rà soát, không khẳng định tất cả 618 mục đều sai. Các mục thiếu nghĩa không sinh câu hỏi mới. Năm thí điểm giới hạn từ vào danh sách có ví dụ bổ trợ biên soạn riêng; không sửa hàng loạt từ gốc.

Các nhãn khẳng định “toàn bộ … chuẩn SGK” trên metadata lớp 3–5 đã đổi thành mô tả dữ liệu hiện có/cần đối chiếu.

## 3. YourHomework → VocaKids

| Ý tưởng trong đặc tả | Thực hiện | Giới hạn / phần tiếp theo |
|---|---|---|
| Flashcard | Làm quen, tự nhớ, nghe trước, nghĩa, ví dụ, audio câu và IPA tùy chọn | Tự đánh giá không tính là thành thạo |
| Từ → nghĩa; nghĩa → từ | Engine chọn đáp án theo ID, cấu hình số lựa chọn theo lớp | Dữ liệu chưa đối chiếu là bản nháp |
| Nghe → từ | Chỉ mở khi có giọng tiếng Anh; chỉ chấm khi audio thực sự bắt đầu | Chưa có audio sách có quyền sử dụng |
| Nghĩa/Nghe → viết | Đáp án chuẩn hóa khoảng trắng, hoa/thường, dấu câu cuối; không sửa hộ chính tả | Mở mặc định từ lớp 3 |
| Sắp chữ | Token có ID riêng, hỗ trợ chữ lặp và khoảng trắng; chạm thay kéo | Chưa có xếp từ thành câu |
| Ghép/lật thẻ; tìm từ | Nối sang các trò chơi cũ qua phòng luyện | Kết quả trò chơi cũ chưa chuyển thành bằng chứng kỹ năng mới |
| Câu chuyện/hội thoại | Năm tài nguyên bổ trợ, nghe cảnh, mở nghĩa đúng từ và quay về vị trí cảnh | Chưa biên soạn cho các Unit còn lại |
| Hiểu ngữ cảnh | Câu hỏi chi tiết biên soạn theo tài nguyên, đáp án/nguồn rõ | Chưa có nghe hiểu độc lập toàn bài |
| Speaking Cards | Nghe mẫu, thử nói, ghi âm tùy chọn và nghe lại tại máy | Chưa chấm phát âm hoặc bài viết bằng AI |
| What is missing, Bingo, Hangman, Battle | Chưa triển khai mới | Giai đoạn mở rộng sau khi hoàn thiện học liệu |

Phòng luyện có năm nhóm theo đặc tả. Lộ trình chính ngắn gồm thẻ từ, 3–4 câu nhận biết/tự nhớ, một câu ngữ cảnh và vận dụng. Không bắt chơi toàn bộ game.

## 4. Kiến trúc và dữ liệu

- `src/lib/learning/types.ts`: VocabularyItem, CurriculumUnit, LearningResource, Activity union, AnswerEvidence, LearningSession và nhãn kỹ năng. Phiên bản nội dung hiện tại: 2.
- `src/lib/learning/curriculum.ts`: chuyển dữ liệu hiện có, cấu hình lớp, nguồn, mục tiêu bổ trợ, phân loại và validation.
- `src/lib/learning/pilots.ts`: dữ liệu năm tình huống/hội thoại, ví dụ, câu hỏi chi tiết và nhiệm vụ mở, tất cả mang trạng thái nháp.
- `src/lib/learning/engine.ts`: sinh câu hỏi, đảo thứ tự có seed, chấm theo ID, chuẩn hóa, lịch ôn và kiểm tra dữ liệu.
- `src/lib/learning/progress.ts`: kiểm tra dữ liệu phiên, tổng hợp kỹ năng theo bằng chứng mới nhất, gợi ý ôn, merge và khóa thưởng.
- `src/components/learning/LearningPlayer.tsx`: thẻ, câu hỏi, ngữ cảnh, vận dụng, ghi âm và kết quả.
- `src/components/learning/LearningSummary.tsx`: lối vào trang chủ và báo cáo kỹ năng dùng chung.

Activity là union có discriminant `kind`. Các dạng hiện có: meaning-choice, word-choice, listen-choice, spelling, dictation, letter-order, context-choice. Đáp án dùng ID hoặc chuỗi khai báo, không dùng vị trí mảng.

Nguồn câu hỏi chi tiết là `LearningResource.questions`. Không sinh câu khuyết chưa duyệt từ câu mơ hồ. Các lựa chọn chào hỏi đồng nghĩa Hello/Hi và Bye/Goodbye không đứng cùng câu chọn từ. Bộ ít từ giảm lựa chọn; bộ một từ chuyển sang sắp chữ. Bộ 3 từ không bị ép thành game 10 từ.

## 5. Bảo toàn URL, hồ sơ và tiến trình

Ánh xạ ID là đồng nhất: `legacyCategoryId = CurriculumUnit.id`, `legacyWord.id = VocabularyItem.id`, sense bổ sung là `<wordId>:sense1`. Không có chuyển ID hay ghi đè dữ liệu từ gốc.

Các URL `/learn`, `/quiz`, `/speak`, `/test`, `/wordsearch`, `/review`, `/parent` và kho tiến trình/sao/sticker hiện có được giữ. Trang chủ thêm lối vào lộ trình; trang phụ huynh thêm bảng kỹ năng mới.

`AppProgress` có hai trường optional, tương thích dữ liệu cũ: `learningSessions` và `learningRewardKeys`. Phiên được lưu vào đúng khóa localStorage cũ theo hồ sơ, sau mỗi đáp án, gợi ý, xem đáp án, đổi thẻ, đổi cảnh và nhập bài viết. Có kiểm tra hồ sơ, phiên bản và cấu trúc trước khi khôi phục. Dữ liệu hỏng không được đưa vào player. `readProgress` phục hồi trường mặc định khi JSON cũ hỏng hoặc thiếu cấu trúc.

Order câu/đáp án nằm trong session, không đảo lại lúc render/reload. Lịch sử đáp án ghi response, kết quả và thời điểm từng lượt thử. Đổi hồ sơ remount player bằng key hồ sơ + Unit + phiên bản, nên không mang state câu/ghi âm sang bé khác.

JSON server nhận phiên mới qua API sync cũ và merge theo ID/thời điểm. Ghi file qua file tạm rồi rename, lỗi ghi được trả về handler. Có thể đặt `VOCAKIDS_DATA_DIR` để chọn thư mục dữ liệu; Docker tạo thư mục `/app/data` có quyền cho user ứng dụng. Khi dùng JSON ở production phải gắn volume; thao tác ghi file chưa có transaction/lock giữa nhiều instance.

PostgreSQL có bảng mới `learning_sessions` (payload JSONB, ID, profile_id, updated_at) và `user_profiles.learning_reward_keys`. Phiên sync chỉ cập nhật nếu mới hơn và cùng hồ sơ; đăng nhập hồ sơ đọc lại phiên/khóa thưởng. Schema được khởi tạo theo cơ chế hiện có. Đã sửa phép cộng lại attempts từ snapshot thành GREATEST, tránh tăng số lần thử khi gửi lặp. Merge WordProgress không còn yêu cầu số sao phải tăng mới nhận cập nhật.

Backend Supabase cũ chưa có schema/adapter cho session mới; phiên mới vẫn lưu localStorage và file JSON của server, **không tuyên bố đồng bộ phiên mới qua Supabase hoàn chỉnh**. PostgreSQL mới chưa được kiểm thử với database thực trong lần bàn giao này.

Debounce sync tách timer theo hồ sơ để học ở bé khác không hủy request đang chờ của bé trước. Khi server lỗi hoặc offline, localStorage là bản khôi phục trên thiết bị. Hiện lỗi localStorage hiện rõ trên player và có nút thử lưu; chưa có hàng đợi đồng bộ offline bền vững/hiển thị trạng thái sync server toàn ứng dụng.

## 6. Đánh giá, ôn và phần thưởng

Đúng độc lập = đúng ngay lần đầu, chưa gợi ý, chưa xem đáp án; bài nghe còn yêu cầu audio đã bắt đầu. Sai rồi đúng hoặc đúng có gợi ý được tính riêng. Flashcard “Nhớ rồi” là tự đánh giá. Không kết luận thành thạo từ một lượt.

Báo cáo dùng bằng chứng mới nhất theo sense/kỹ năng và phiên bản; một từ được kiểm tra nghĩa và ngữ cảnh có hai bằng chứng riêng. Nói/vận dụng chỉ ghi đã thực hành, chưa chấm. Không gửi bản ghi âm hoặc gọi AI từ luồng mới.

Lịch ôn mặc định 1, 3, 7, 14, 30 ngày trong `nextReviewDate`; tăng theo số lượt độc lập trước đó của cùng từ/kỹ năng. Cần hỗ trợ hoặc tự đánh dấu “cần xem lại” được ưu tiên. Thay lịch trong engine rồi tăng CONTENT_VERSION nếu thay đổi ý nghĩa đánh giá. Chưa có màn hình phụ huynh chỉnh lịch.

Khóa thưởng: `<profileId>:<unitId>:v<contentVersion>:completion`. Mỗi bài/phiên bản/hồ sơ nhận một sao nỗ lực và một sticker khi hoàn thành lần đầu; reload, bấm lặp hay tạo lượt mới không cộng lại. Kết quả độc lập không suy ra từ sao.

## 7. Audio và khả năng tiếp cận

Tái sử dụng Web Speech API. Các hook TTS dùng listener voiceschanged, hủy timer chờ và speech khi chuyển màn/unmount; phát TTS dừng audio nghe lại. Lỗi audio/không có giọng phù hợp có đường tiếp tục đọc và bỏ qua bài nghe, không nhận điểm nghe giả.

Recorder chỉ xin quyền khi bấm ghi, có đường thử nói không ghi âm. AudioBlob chỉ sống trong component, URL được thu hồi; stream/AudioContext được đóng khi dừng hoặc đổi màn. Không lưu audio đang phát vào session.

Nút tương tác tối thiểu 44 px; chọn/chạm thay kéo thả; input hỗ trợ Enter; nút có tên và focus hiển thị; đáp án có ký hiệu chọn, không chỉ dựa màu. Có prefers-reduced-motion. Giao diện mới không đếm ngược.

## 8. Thêm dữ liệu

1. Thêm/sửa category trong kho từ hiện có, giữ ID đã dùng; điền nghĩa và ví dụ đúng ngữ cảnh.
2. Thêm nguồn, sách/tập/ấn bản và mục tiêu đã đối chiếu. Hiện adapter chưa gán tập từ số Unit; cần thêm metadata có bằng chứng, không sửa heuristic để đoán.
3. Trong `PILOT_DRAFTS`, khai báo unitId, scenes song ngữ, terms liên kết từ hiện có, examples, comprehension với answer/choices và application. Câu hỏi phải có một đáp án đúng và lựa chọn cùng loại thông tin.
4. Chạy `npm run audit:learning` và `npm run test:learning`. Bộ từ mới tự dùng engine chung, không sửa player.
5. Rà soát ngôn ngữ, mục tiêu, ảnh/audio, đáp án và quyền sử dụng; chuyển trạng thái theo draft → source-verified → content-reviewed → ready → published sau khi có quy trình duyệt. Hiện chưa có UI biên tập/duyệt và không có nội dung mới mang trạng thái published.
6. Tăng phiên bản nội dung khi đổi đáp án/câu hỏi để không áp phiên cũ vào bài mới. Các trường cũ vẫn nằm trong AppProgress; player chỉ khôi phục phiên bản hiện tại.

## 9. Kiểm thử và hạn chế

Đã chạy build, TypeScript, test logic và lint phần mới. Test bao gồm cả năm lớp, mọi category, bộ ít từ, lựa chọn ổn định, ID đáp án, chữ lặp, không có audio, chuẩn hóa, phân biệt hỗ trợ, hai hồ sơ, dữ liệu hỏng, phiên bản khác, merge và thưởng lặp.

| Kiểm tra | Kết quả |
|---|---|
| Production build và kiểm tra TypeScript của build | Đạt |
| `npx tsc --noEmit` | Đạt |
| `npm run test:learning` | 16/16 đạt |
| `npm run audit:learning` | Đạt validation 146 bộ dữ liệu |
| HTTP của năm URL Unit thí điểm, curriculum, báo cáo và URL cũ learn/test/wordsearch | Tất cả trả 200 |
| Lint module/trang/component mới, hook audio đã sửa và test/audit | Đạt, không lỗi/cảnh báo |
| Lint toàn repository | Còn 110 lỗi, 69 cảnh báo; baseline trước thay đổi là 112 lỗi, 70 cảnh báo |

Đã kiểm tra browser: URL trực tiếp, hoàn thành chặng lớp 1, trả lời sai rồi đúng có gợi ý, reload thẻ/câu/cảnh/kết quả, mở từ trong ngữ cảnh, đổi hai hồ sơ, hồ sơ lớp 5 mở lớp 1 mà giữ nguyên lớp, nhập sai chính tả lớp 5, mở báo cáo qua PIN và gợi ý ôn đúng mục cần hỗ trợ. Đã đo không cuộn ngang ở chiều rộng 390, 768 và 1280 px. Ảnh trong `docs/screenshots/`.

Lint toàn repository có lỗi tồn tại trước thay đổi (any, Hooks và scratch). Không đổi dữ liệu người dùng hoặc sửa toàn bộ code cũ để làm sạch lint. Kiểm thử micro thực, chất lượng giọng đọc trên các hệ điều hành và database thực chưa hoàn tất. Các request browser dùng JSON store thử riêng ở `.tmp-learning`, không ghi lên file hồ sơ hiện có.

Các vấn đề phân quyền API hồ sơ, JWT secret mặc định và chính sách Supabase công khai được xác định trong lần phân tích trước vẫn cần xử lý trước triển khai công khai. PIN hiện có là khóa giao diện, không phải quyền server. Phiên học mới kế thừa giới hạn này của backend hiện có.

Giai đoạn tiếp theo còn: đối chiếu sách thật/ấn bản và toàn bộ mục tiêu âm; rà soát 618 mục ngôn ngữ; mở rộng ngữ cảnh cho 141 bộ còn lại; workflow duyệt/xuất bản; ngân hàng bài ôn cùng mục tiêu với câu mới; UI chỉnh lịch ôn; nghe hiểu không lộ transcript; xếp câu/điền câu đã duyệt; game mở rộng; đồng bộ Supabase và hardening quyền server. Không tính các mục này là đã hoàn thành.
