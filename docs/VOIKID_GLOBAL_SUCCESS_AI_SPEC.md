# ĐẶC TẢ PHÁT TRIỂN VOIKID CHO AI LẬP TRÌNH

## 1. Nhiệm vụ

Bạn là AI phụ trách phân tích và phát triển ứng dụng VoiKid tại https://voikid.vnos.org/. Giao diện hiện hiển thị tên VocaKids; giữ thương hiệu hiện có trừ khi chủ ứng dụng yêu cầu đổi.

Xây dựng hệ thống học tiếng Anh bổ trợ cho **toàn bộ lớp 1–5**, bám bộ **Tiếng Anh Global Success của Nhà xuất bản Giáo dục Việt Nam**, tham khảo các dạng luyện từ vựng tại https://yourhomework.net/vocab/029564244 và cách học theo câu chuyện tại https://yourhomework.net/story/466340456.

**Dựa vào các chủ đề, Unit, bài học và bộ từ vựng đã có sẵn trên VoiKid để phát triển các dạng luyện tập, câu ví dụ, hội thoại và câu chuyện tương ứng. Ưu tiên mở rộng ngay trên dữ liệu hiện tại; đối chiếu với Global Success để bổ sung hoặc chỉnh sửa phần cần thiết, giữ các chủ đề mở rộng có sẵn và gắn nhãn rõ ràng.**

Triển khai công việc được mô tả dưới đây trong mã nguồn được cung cấp. Không dừng ở kế hoạch. Không thu hẹp dự án thành một bài lớp 4. Xây một nền tảng dùng chung, cấu hình theo lớp và dữ liệu theo Unit.

Mục tiêu tổng thể:

```text
Global Success → Lớp → Sách/tập → Unit/Lesson
→ Từ vựng + mẫu câu + phát âm
→ Nhận biết → tự nhớ → hiểu trong ngữ cảnh
→ Câu chuyện/hội thoại → vận dụng → ôn tập
```

## 2. Kiểm tra trước khi sửa

1. Đọc AGENTS.md và hướng dẫn repository.
2. Xác định framework, routing, thiết kế giao diện, dữ liệu chương trình, audio, hồ sơ bé, lưu tiến trình và phần thưởng.
3. Kiểm tra tính năng thật trong mã nguồn; không coi mô tả giao diện là bằng chứng mọi tính năng đã hoàn thiện.
4. Tái sử dụng thành phần phù hợp; không viết lại ứng dụng nếu không cần.
5. Bảo toàn URL, hồ sơ và tiến trình hiện tại. Nếu chuyển dữ liệu, lập bảng ánh xạ ID.
6. Thực hiện và kiểm thử trong môi trường phát triển. Không tự triển khai production.
7. Chỉ hỏi khi thiếu thông tin thực sự chặn công việc. Các quyết định thông thường dựa vào kiến trúc hiện có.

## 3. Nguồn và đối chiếu chương trình

Nguồn ưu tiên: sách học sinh, sách giáo viên, sách bài tập đúng phiên bản và học liệu chính thức.

- https://gs.hoclieu.vn/
- https://taphuan.nxbgd.vn/
- https://www.nxbgd.vn/

Lập bảng cho toàn bộ lớp 1–5:

| Trường | Yêu cầu |
|---|---|
| Lớp | 1–5 |
| Sách/phiên bản | Tên, tập, năm/ấn bản nếu xác định được |
| Phần | Unit, Lesson, Review, Fun time hoặc phần thực tế trong sách |
| Thứ tự | Đúng mục lục đã đối chiếu |
| Chủ đề | Chức năng giao tiếp |
| Từ/cụm từ | Mục tiêu của bài |
| Mẫu câu | Cấu trúc và chức năng |
| Phát âm | Âm/chữ/trọng âm theo bài |
| Kỹ năng | Nghe, nói, đọc, viết |
| Nguồn | URL/tài liệu/trang |
| Trạng thái | Đã xác minh/cần đối chiếu |

Quy tắc:

- Không đoán số Unit, tên bài, nội dung hoặc mục tiêu từ trí nhớ.
- Không mặc định danh sách hiện tại trên VoiKid là mục lục chính thức.
- Phân biệt chương trình chính khóa, ôn tập và chủ đề mở rộng.
- Không biến Review hoặc Fun time thành Unit chính khóa nếu sách không tổ chức như vậy.
- Không trộn các phiên bản sách âm thầm.
- Nội dung chưa xác minh được giữ ở trạng thái nháp; không tuyên bố đã bám sách đầy đủ.
- Không tự gán CEFR theo lớp nếu thiếu nguồn phù hợp.
- Mẫu giáo là chương trình làm quen riêng, không gắn nhãn Global Success Mẫu giáo khi chưa có cơ sở.
- Biên soạn nội dung bổ trợ riêng. Không sao chép giao diện, mã, tranh, audio và bài tập của YourHomework. Chỉ dùng học liệu sách chính thức khi có quyền sử dụng phù hợp; nếu chưa có, tạo học liệu riêng bám mục tiêu.

## 4. Bức tranh tổng thể

| Tầng | Chức năng |
|---|---|
| Chương trình | Lớp → sách/tập → Unit → Lesson → Review |
| Học liệu | Từ, cụm từ, mẫu câu, phát âm, truyện, hội thoại, bảng thông tin |
| Hoạt động | Flashcard, nghe/chọn, ghép, điền, viết, nói, vận dụng, trò chơi |
| Tiến trình | Kết quả theo bé, mục tiêu, kỹ năng, lượt học và lịch ôn |

Mỗi Unit có các mục phù hợp: Từ vựng; Mẫu câu & giao tiếp; Âm & phát âm; Tình huống/câu chuyện; Luyện tập; Vận dụng; Ôn tập. Không buộc hoàn thành mọi mục trong một buổi.

## 5. Tham khảo YourHomework và chuyển sang VoiKid

Trang tham khảo hiển thị flashcard, trắc nghiệm nhiều chiều, nghe/điền, sắp chữ, ghép/nối, tìm từ, luyện nói và các trò chơi. Đây là quan sát menu, không phải xác nhận hoạt động thực tế của mọi game.

Ý tưởng cốt lõi: **một bộ từ/cụm từ cung cấp dữ liệu cho nhiều dạng luyện**.

| Dạng tham khảo | Triển khai trên VoiKid | Ưu tiên |
|---|---|---|
| Flashcard học từ | Tranh, từ, audio, nghĩa, ví dụ | Cao |
| Hai mặt/ẩn nghĩa | Tự nhớ trước khi mở đáp án | Cao |
| Flashcard nghe | Nghe trước, hiện đáp án sau | Cao |
| Từ → nghĩa | Chọn nghĩa; lớp nhỏ ưu tiên tranh | Cao |
| Nghĩa → từ | Chọn từ phù hợp | Cao |
| Nghe → từ | Nhận diện âm và mặt chữ | Cao |
| Nghe → nghĩa/tranh | Nghe hiểu | Cao |
| Nghĩa → viết từ | Tự nhớ và chính tả | Theo lớp |
| Nghe → viết từ | Chính tả từ/cụm từ | Theo lớp |
| Sắp chữ | Chạm/kéo chữ tạo từ | Cao |
| Ghép/nối | Từ–tranh hoặc từ–nghĩa | Cao |
| What is missing? | Nhớ và tìm mục bị ẩn | Cao |
| Word Search | Tìm từ trên bảng | Sau |
| Bingo | Nghe và chọn trên bảng | Sau |
| Hangman | Đoán chữ với hình ảnh thân thiện | Sau |
| Speaking Cards | Nghe mẫu, nói, nghe lại nếu hỗ trợ | Cao |
| Group/Battle | Chế độ lớp học/thi đua | Sau |

Không xây mọi game chỉ vì trang tham khảo có. Mỗi dạng cần mục tiêu rõ.

## 6. Cấu hình lớp 1–5

Các giới hạn sau là đề xuất sản phẩm để thử nghiệm, không phải cấu trúc chính thức của sách. Ngữ pháp, từ và mục tiêu phải đối chiếu theo Unit.

| Lớp | Trọng tâm | Học liệu ngữ cảnh | Tương tác | Vận dụng |
|---|---|---|---|---|
| 1 | Nghe, từ, âm, câu mẫu ngắn | 3–4 cảnh, lặp lại | Chạm tranh, nghe chọn, ghép | Từ/câu mẫu; không gõ dài |
| 2 | Từ, cụm từ, câu ngắn | 4–5 cảnh, hội thoại đơn giản | Nhìn chọn, điền chữ, sắp chữ | Hỏi–đáp một lượt có hỗ trợ |
| 3 | Bốn kỹ năng phù hợp | 5–7 cảnh có diễn biến | Nghe chi tiết, đọc ngắn, điền/xếp | Tạo 2–3 câu theo mẫu |
| 4 | Cụm từ, câu, đoạn ngắn | 6–8 cảnh hoặc hội thoại | Quiz, nghe điền, xếp câu | Nói/viết ngắn có hướng dẫn |
| 5 | Ngôn ngữ trong ngữ cảnh rộng hơn | 7–10 cảnh, nhiệm vụ có mục đích | Hoàn thành hội thoại/đoạn, nghe/đọc | Nói/viết theo nhiệm vụ Unit |

| Cấu hình | Lớp 1–2 | Lớp 3 | Lớp 4–5 |
|---|---|---|---|
| Lựa chọn mỗi câu | 2–3 | 3 | 3–4 |
| Nhóm từ mỗi lượt | 3–5 | 4–6 | 5–8 |
| Hỗ trợ | Tranh/audio | Gợi ý tùy chọn | Gợi ý tùy chọn |
| Viết | Chọn/ghép chữ | Từ/câu ngắn | Câu/đoạn theo bài |

Điều chỉnh hỗ trợ theo kết quả. Lớp là cấu hình mặc định, không phải kết luận năng lực.

## 7. Giao diện và điều hướng

```text
Trang chủ → Lớp → Sách/tập → Unit → Lesson/chặng học
→ Hoạt động → Kết quả → Ôn tập
```

Trong Unit thêm Phòng luyện từ với năm nhóm:

1. Học từ: flashcard, tranh, audio, nghĩa, ví dụ.
2. Nghe & chọn: nghe chọn tranh/từ/nghĩa, nhìn chọn.
3. Nhớ & viết: điền chữ, sắp chữ, viết từ, điền câu.
4. Chơi & ôn: ghép, nối, tìm từ, Bingo, tìm mục còn thiếu.
5. Nói & dùng từ: nói theo, tạo câu, hội thoại/câu chuyện.

Hai lối vào: **Học theo lộ trình** (chính) và **Chọn dạng luyện** (ôn tự chọn). Không hiện hàng chục nút ngang nhau ngay đầu buổi.

Trang chủ: Tiếp tục bài; Unit hiện tại; Ôn hôm nay; Câu chuyện phù hợp; Chọn lớp.

Gắn nhãn rõ: Bám sách Global Success; Nội dung bổ trợ VoiKid; Ôn tập; Mở rộng.

Một nhiệm vụ mỗi màn hình, nghe lại rõ, trẻ chủ động tiếp tục. Vùng chạm tối thiểu khoảng 44×44 px, không cuộn ngang, có focus/nhãn nút/alt tranh, hỗ trợ bàn phím và giảm chuyển động. Không dùng màu làm tín hiệu duy nhất. Không đếm ngược mặc định.

Mở bài lớp khác không tự đổi lớp hồ sơ. Lưu dưới đúng hồ sơ đang chọn. URL truy cập trực tiếp và reload được. Giữ URL cũ hoặc có chuyển hướng phù hợp.

## 8. Flashcard

Mỗi thẻ có tranh khi phù hợp, từ/cụm từ, audio, nghĩa ẩn/hiện, câu ví dụ và audio câu, nút Chưa nhớ/Nhớ rồi.

Chế độ: làm quen; tự nhớ; nghe trước; ôn mục yếu. Đánh dấu Nhớ rồi là tự đánh giá, không kết luận thành thạo.

IPA hỗ trợ tùy chọn, không bắt trẻ nhỏ hiểu IPA để hoàn thành. Từ trừu tượng có thể dùng ngữ cảnh thay cho tranh.

## 9. Engine bài tập

Một bộ dữ liệu cấp cho nhiều hoạt động. Mỗi hoạt động khai báo loại, kỹ năng, mục tiêu, dữ liệu nguồn, mức hỗ trợ, đầu vào, cách trả lời, đáp án, gợi ý và phản hồi.

Quy tắc sinh bài:

- Chỉ tạo bài nghe khi có audio/TTS hoạt động.
- Chỉ tạo bài chọn tranh khi có tranh đúng nghĩa và phân biệt rõ.
- Chỉ tạo câu khuyết khi câu nguồn, mục tiêu và đáp án đã kiểm tra.
- Không đủ lựa chọn thì giảm số lựa chọn hoặc đổi dạng.
- Unit 3–4 từ không bị ép thành bảng 10 từ. Từ ôn của Unit trước phải khai báo phạm vi.
- Lựa chọn sai cùng loại thông tin, khác nghĩa rõ, không trùng, không có hai đáp án đúng và không đòi kiến thức chưa học.
- Đảo lựa chọn một lần mỗi lượt, lưu thứ tự để ổn định khi render/reload.
- Có phương án chạm thay thế kéo thả.

Chấm nhập từ: chuẩn hóa khoảng trắng, chữ hoa khi phù hợp và dấu câu không thuộc mục tiêu; đáp án thay thế phải khai báo. Không tự chấp nhận sai chính tả. Có thể phản hồi gần đúng nhưng ghi nhận lỗi.

## 10. Từ vựng và mô hình dữ liệu

```ts
type VocabularyItem = {
  id: string;
  text: string;
  kind: "word" | "phrase" | "expression";
  senses: {
    id: string;
    meaningVi: string;
    imageSrc?: string;
    exampleEn: string;
    exampleVi: string;
  }[];
  ipa?: string;
  audioSrc?: string;
  grade: number;
  unitId: string;
  lessonIds: string[];
  objectiveIds: string[];
  sourceReferences: string[];
  verificationStatus: "unverified" | "verified";
  version: number;
};
```

Mô hình chương trình: Curriculum → BookEdition → Grade → Volume (nếu có) → Unit/Review/section → Lesson → LearningObjective.

Các mục tiêu liên kết Vocabulary, LanguagePattern, PronunciationTarget, LearningResource và Activity. Các trường ngôn ngữ phải bám đúng Unit và nghĩa trong ngữ cảnh.

LearningResource hỗ trợ truyện, hội thoại, nhật ký, lịch/bảng, thiệp/tin nhắn và nhiệm vụ tranh. Có ID/version, cảnh/câu, nghĩa, audio, tranh, vocabularyIds, objectiveIds và tham chiếu nguồn.

Activity dùng discriminated union theo loại để tránh dữ liệu thiếu. Đáp án đúng dùng ID ổn định, không dùng vị trí mảng làm định danh.

Kiểm tra dữ liệu: ID trùng; tham chiếu không tồn tại; đáp án không hợp lệ; tài nguyên thiếu; nội dung chưa duyệt; nhiều đáp án đúng ngoài ý muốn. Tính số câu/cảnh/từ từ dữ liệu.

## 11. Câu chuyện và vận dụng

Mỗi Unit có học liệu ngữ cảnh phù hợp, không ép mọi bài thành truyện có cốt truyện. Dùng từ/mẫu câu mục tiêu và kiến thức đã học. Từ mở rộng phải được đánh dấu và hỗ trợ.

Luồng:

```text
Học từ → nhận biết → tự nhớ → gặp từ trong ngữ cảnh
→ hiểu nội dung → tạo câu/hỏi đáp → ôn
```

Chạm từ/cụm trong bài: nghĩa đúng ngữ cảnh, nghe, mở flashcard, quay lại đúng vị trí.

Các dạng ngữ cảnh: nghe chọn tranh; Quiz ý chính/chi tiết/nghĩa; nghe điền; câu khuyết; xếp sự kiện; nói theo; tạo câu cá nhân. Dictation toàn câu là phần nâng cao phù hợp lớp/bài, không bắt mọi lớp.

Không chấm hoạt động cá nhân nhiều đáp án hợp lệ như trắc nghiệm. Không coi nhận biết từ là bằng chứng dùng được trong câu.

## 12. Audio và nói

Tái sử dụng audio hoặc TTS hiện tại. Hỗ trợ từ, câu, cảnh và toàn bài khi phù hợp. Dừng khi đổi màn hình, không phát chồng. Phát theo thao tác người dùng; xử lý lỗi tải và không có giọng phù hợp.

Audio lỗi: cho tiếp tục phần đọc và đánh dấu bài nghe chưa đánh giá. Không chấm bài có transcript hiển thị như nghe độc lập.

Luyện nói bước đầu: nghe mẫu → nói/ghi âm nếu được hỗ trợ → nghe lại → luyện lại. Không mặc định thu âm; xin quyền micro đúng luồng, có cách tiếp tục khi từ chối.

Chấm phát âm/viết mở bằng AI nằm ngoài bản đầu nếu chưa có công nghệ kiểm chứng. Không dùng transcript nhận diện đúng để kết luận phát âm chuẩn. Không tạo điểm giả.

## 13. Lộ trình và điều chỉnh hỗ trợ

Mỗi phiên 3–5 hoạt động ngắn: làm quen → nhận biết → tự nhớ → dùng trong câu → kết quả. Không bắt chơi mọi game.

Sai nhiều: giảm lựa chọn, thêm tranh, nghe lại, flashcard ngắn, kiểm tra bằng câu khác cùng mục tiêu. Đúng độc lập: giảm gợi ý, chuyển sang tự nhớ và ngữ cảnh.

Lớp 1–2 ưu tiên nghe/tranh/nói mẫu. Lớp 3 thêm điền/xếp/tạo câu. Lớp 4–5 thêm nghe/đọc chi tiết và vận dụng theo Unit.

## 14. Tiến trình và đánh giá

Lưu theo hồ sơ bé, nội dung, phiên bản và lượt học:

- activityId, vocabularyId/senseId, objectiveIds, kỹ năng.
- Đúng/sai lần đầu, số lần thử, gợi ý, xem đáp án.
- Trạng thái hoàn thành, thời điểm, vị trí hiện tại.
- Lịch sử và thứ tự lựa chọn của lượt.

Tách Đã gặp, Đã luyện, Tự làm được. Đúng độc lập = đúng lần đầu, chưa gợi ý/chưa xem đáp án. Đúng sau hỗ trợ được báo riêng. Không kết luận thành thạo từ một lượt.

Theo dõi nhận biết nghĩa; nghe nhận biết; mặt chữ; viết; hiểu trong câu; vận dụng; thực hành nói. Trò chơi chỉ đóng góp bằng chứng cho mục tiêu thực sự được kiểm tra.

Tự lưu sau câu trả lời/chuyển cảnh. Reload khôi phục. Đổi hồ sơ không trộn. Học lại tạo lượt mới. Nội dung đổi phiên bản không âm thầm áp kết quả cũ vào câu mới. Xử lý dữ liệu lưu hỏng/không ghi được. Không lưu audio đang phát.

## 15. Ôn tập và báo cáo

Ôn theo sách: bám đúng Review/phạm vi đã xác minh. Ôn cá nhân: ưu tiên mục sai hoặc cần hỗ trợ, giãn ôn với mục đúng độc lập, dùng câu mới cùng mục tiêu. Lịch ôn cấu hình được.

Báo cáo phụ huynh: Unit/Lesson hiện tại; mục tiêu đã luyện; kỹ năng; tự làm được; cần hỗ trợ; thực hành nói chưa chấm; bài ôn đề xuất.

Ví dụ: Bé nhận biết tốt 6 từ qua tranh; cần luyện nghe 2 từ; cần ôn cách viết 3 từ; đã tạo 2 câu theo mẫu. Không thay báo cáo kỹ năng bằng số sao.

## 16. Trò chơi và phần thưởng

Game gắn mục tiêu: ghép/lật thẻ = từ–nghĩa; tìm mục thiếu = gọi lại; Bingo = nghe; sắp chữ = chính tả; tìm từ = mặt chữ; đoán chữ = cách viết.

Tái sử dụng sao/sticker hiện tại. Thưởng hoàn thành và nỗ lực, kết quả độc lập tính riêng. Không trừ sao vì sai, không cộng lặp khi reload/bấm nhiều lần. Dùng khóa thưởng ổn định theo hồ sơ/nội dung/phiên bản/sự kiện. Thi đua/lớp học triển khai sau.

## 17. Biên soạn và xuất bản

```text
Đối chiếu nguồn → mục tiêu Unit → học liệu riêng → bài tập
→ kiểm tra ngôn ngữ → tranh/audio → đáp án → duyệt → xuất bản
```

Trạng thái: draft, source-verified, content-reviewed, ready, published. AI tạo nháp, không tự xuất bản hàng loạt chưa kiểm tra.

Báo cáo độ phủ từng lớp: đã đối chiếu; có dữ liệu; có học liệu; đã kiểm tra; đã xuất bản. Không tính màn hình trống hoặc tên Unit là nội dung hoàn chỉnh.

## 18. Lộ trình triển khai

1. Kiểm kê mã và dữ liệu; báo cáo chênh lệch với Global Success.
2. Bản đồ chương trình toàn bộ lớp 1–5 có nguồn/trạng thái.
3. Nền tảng chung: dữ liệu, flashcard, engine luyện, audio, hồ sơ, tiến trình.
4. Thí điểm ít nhất một Unit hoàn chỉnh mỗi lớp; chứng minh tương tác khác nhau theo tuổi.
5. Mở rộng tự nhớ/viết và ôn: sắp chữ, điền, nghe/viết, nghĩa/viết.
6. Kết nối câu ví dụ, hội thoại/câu chuyện, nghe/đọc hiểu và vận dụng.
7. Mở rộng game, báo cáo phụ huynh và nội dung từng nhóm Unit đã duyệt.

Thí điểm năm lớp không có nghĩa toàn bộ chương trình đã hoàn tất. Nêu rõ các giai đoạn và nội dung còn thiếu. Không dùng dữ liệu AI đoán để lấp chỗ trống.

## 19. Kiểm thử và nghiệm thu

- URL mới mở trực tiếp/reload được; URL và luồng cũ vẫn hoạt động.
- Ít nhất một Unit mỗi lớp có từ, luyện, ngữ cảnh, vận dụng, kết quả.
- Bộ từ mới chạy được nhiều dạng mà không sửa engine.
- Unit ít từ không sinh lựa chọn lỗi hoặc bài không thể hoàn thành.
- Audio dừng khi chuyển, không chồng; lỗi được xử lý.
- Đáp án/normalization/gợi ý/đúng độc lập được tính đúng.
- Thứ tự lựa chọn ổn định khi render và khôi phục.
- Tiến trình hai hồ sơ độc lập; reload khôi phục; dữ liệu hỏng không làm trắng trang.
- Phần thưởng chỉ trao một lần theo quy tắc.
- Kiểm tra ID/tham chiếu/asset/đáp án/nội dung xuất bản.
- Kiểm tra điện thoại, tablet, desktop, bàn phím, kéo thả có chạm thay thế.
- Chạy build, lint, type check và test phù hợp; phân biệt lỗi có sẵn với lỗi mới.

## 20. Bàn giao

1. Bản đồ Global Success lớp 1–5 có nguồn và trạng thái.
2. Bảng YourHomework → tính năng VoiKid, phần đã triển khai/còn lại.
3. Báo cáo kiểm kê, di chuyển dữ liệu và bảo toàn tiến trình.
4. Kiến trúc, cấu hình theo lớp và mô hình dữ liệu.
5. Năm Unit thí điểm hoàn chỉnh cùng URL kiểm tra.
6. Danh sách file thay đổi, cách audio/lưu tiến trình/phần thưởng hoạt động.
7. Kết quả kiểm thử và ảnh giao diện nếu hỗ trợ.
8. Hướng dẫn thêm bộ từ, Unit, câu chuyện và bài tập bằng dữ liệu.
9. Độ phủ từng lớp, nội dung thiếu/chưa xác minh và hạn chế.

**Định nghĩa thành công:** VoiKid có nền tảng xuyên suốt lớp 1–5 theo Global Success; một bộ từ/cụm từ của Unit được luyện theo nhiều cách phù hợp lớp, được dùng trong câu/tình huống, kết quả lưu theo từng bé và dẫn tới ôn tập. Nội dung mới thêm bằng dữ liệu. Công việc hoàn thành phải có thể chạy và kiểm tra, không chỉ là bản mô tả hoặc màn hình mẫu.
