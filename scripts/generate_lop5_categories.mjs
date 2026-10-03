// scripts/generate_lop5_categories.mjs
import fs from 'fs';

const lop5Units = [
  // ── UNIT 1 ──────────────────────────────
  {
    id: 'lop5_unit1',
    gradeId: 'lop5',
    name_vi: 'Unit 1: Tất Cả Về Tôi',
    name_en: 'All about me!',
    emoji: '🙋',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l5_u1_city', en: 'city', vi: 'thành phố', emoji: '🏙️', phonetic: '/ˈsɪti/', example_en: 'I live in a peaceful city.', example_vi: 'Tôi sống ở một thành phố yên bình.' },
      { id: 'l5_u1_class', en: 'class', vi: 'lớp học', emoji: '🏫', phonetic: '/klɑːs/', example_en: 'There are thirty pupils in our class.', example_vi: 'Có ba mươi học sinh trong lớp học của chúng tôi.' },
      { id: 'l5_u1_countryside', en: 'countryside', vi: 'nông thôn', emoji: '🌾', phonetic: '/ˈkʌntrisaɪd/', example_en: 'My grandparents live in the countryside.', example_vi: 'Ông bà tôi sống ở vùng nông thôn.' },
      { id: 'l5_u1_dolphin', en: 'dolphin', vi: 'con cá heo', emoji: '🐬', phonetic: '/ˈdɒlfɪn/', example_en: 'The dolphin jumps out of the water.', example_vi: 'Chú cá heo nhảy lên khỏi mặt nước.' },
      { id: 'l5_u1_pink', en: 'pink', vi: 'màu hồng', emoji: '🩷', phonetic: '/pɪŋk/', example_en: 'She has a pretty pink pencil case.', example_vi: 'Bạn ấy có một chiếc hộp bút màu hồng xinh xắn.' },
      { id: 'l5_u1_sandwich', en: 'sandwich', vi: 'bánh mì kẹp', emoji: '🥪', phonetic: '/ˈsænwɪtʃ/', example_en: 'He eats a tuna sandwich for breakfast.', example_vi: 'Cậu ấy ăn một chiếc bánh mì kẹp cá ngừ cho bữa sáng.' },
      { id: 'l5_u1_table_tennis', en: 'table tennis', vi: 'môn bóng bàn', emoji: '🏓', phonetic: '/ˈteɪbl ˈtenɪs/', example_en: 'We play table tennis in the gym.', example_vi: 'Chúng tôi chơi bóng bàn trong nhà thể chất.' },
    ],
  },

  // ── UNIT 2 ──────────────────────────────
  {
    id: 'lop5_unit2',
    gradeId: 'lop5',
    name_vi: 'Unit 2: Ngôi Nhà Của Chúng Tôi',
    name_en: 'Our homes',
    emoji: '🏡',
    color: 'from-blue-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    words: [
      { id: 'l5_u2_building', en: 'building', vi: 'tòa nhà', emoji: '🏢', phonetic: '/ˈbɪldɪŋ/', example_en: 'That is a very tall building.', example_vi: 'Đó là một tòa nhà rất cao.' },
      { id: 'l5_u2_flat', en: 'flat', vi: 'căn hộ', emoji: '🏬', phonetic: '/flæt/', example_en: 'My family lives in a cozy flat.', example_vi: 'Gia đình tôi sống trong một căn hộ ấm cúng.' },
      { id: 'l5_u2_house', en: 'house', vi: 'ngôi nhà', emoji: '🏠', phonetic: '/haʊs/', example_en: 'They have a lovely house with flowers.', example_vi: 'Họ có một ngôi nhà đáng yêu với nhiều hoa.' },
      { id: 'l5_u2_tower', en: 'tower', vi: 'tòa tháp', emoji: '🗼', phonetic: '/ˈtaʊər/', example_en: 'The clock tower looks magnificent.', example_vi: 'Tòa tháp đồng hồ trông thật tráng lệ.' },
      { id: 'l5_u2_twenty_three', en: 'twenty-three (23)', vi: 'hai mươi ba', emoji: '🔢', phonetic: '/ˌtwenti ˈθriː/', example_en: 'My classroom is on floor twenty-three.', example_vi: 'Lớp học của tớ ở tầng hai mươi ba.' },
      { id: 'l5_u2_thirty_eight', en: 'thirty-eight (38)', vi: 'ba mươi tám', emoji: '🔢', phonetic: '/ˌθɜːti ˈeɪt/', example_en: 'There are thirty-eight flats in this block.', example_vi: 'Có ba mươi tám căn hộ trong tòa nhà này.' },
      { id: 'l5_u2_ninety_three', en: 'ninety-three (93)', vi: 'chín mươi ba', emoji: '🔢', phonetic: '/ˌnaɪnti ˈθriː/', example_en: 'Her house number is ninety-three.', example_vi: 'Số nhà của bạn ấy là chín mươi ba.' },
      { id: 'l5_u2_one_hundred_sixteen', en: 'one hundred and sixteen (116)', vi: 'một trăm mười sáu', emoji: '🔢', phonetic: '/wʌn ˈhʌndrəd ənd ˌsɪksˈtiːn/', example_en: 'The address is one hundred and sixteen Green Street.', example_vi: 'Địa chỉ là số một trăm mười sáu phố Xanh.' },
    ],
  },

  // ── UNIT 3 ──────────────────────────────
  {
    id: 'lop5_unit3',
    gradeId: 'lop5',
    name_vi: 'Unit 3: Bạn Bè Quốc Tế Của Tôi',
    name_en: 'My foreign friends',
    emoji: '🌏',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l5_u3_american', en: 'American', vi: 'người / thuộc về nước Mỹ', emoji: '🇺🇸', phonetic: '/əˈmerɪkən/', example_en: 'Tony is an American student.', example_vi: 'Tony là một học sinh người Mỹ.' },
      { id: 'l5_u3_australian', en: 'Australian', vi: 'người / thuộc về nước Úc', emoji: '🇦🇺', phonetic: '/ɒˈstreɪliən/', example_en: 'Emma has an Australian teacher.', example_vi: 'Emma có một cô giáo người Úc.' },
      { id: 'l5_u3_japanese', en: 'Japanese', vi: 'người / thuộc về Nhật Bản', emoji: '🇯🇵', phonetic: '/ˌdʒæpəˈniːz/', example_en: 'Kenji loves Japanese anime.', example_vi: 'Kenji rất thích phim hoạt hình Nhật Bản.' },
      { id: 'l5_u3_malaysian', en: 'Malaysian', vi: 'người / thuộc về Ma-lai-xi-a', emoji: '🇲🇾', phonetic: '/məˈleɪʒn/', example_en: 'Aiman is from Malaysia. He is Malaysian.', example_vi: 'Aiman đến từ Malaysia. Cậu ấy là người Ma-lai-xi-a.' },
      { id: 'l5_u3_active', en: 'active', vi: 'năng động, nhanh nhẹn', emoji: '🏃', phonetic: '/ˈæktɪv/', example_en: 'Tom is very active in outdoor sports.', example_vi: 'Tom rất năng động trong các môn thể thao ngoài trời.' },
      { id: 'l5_u3_clever', en: 'clever', vi: 'thông minh, lanh lợi', emoji: '💡', phonetic: '/ˈklevər/', example_en: 'The clever boy solved the riddle easily.', example_vi: 'Cậu bé thông minh đã giải được câu đố một cách dễ dàng.' },
      { id: 'l5_u3_friendly', en: 'friendly', vi: 'thân thiện', emoji: '😊', phonetic: '/ˈfrendli/', example_en: 'Our new neighbours are very friendly.', example_vi: 'Những người hàng xóm mới rất thân thiện.' },
      { id: 'l5_u3_helpful', en: 'helpful', vi: 'tốt bụng, hay giúp đỡ', emoji: '🤝', phonetic: '/ˈhelpfl/', example_en: 'She is always helpful to her classmates.', example_vi: 'Bạn ấy luôn luôn tốt bụng và hay giúp đỡ bạn bè cùng lớp.' },
    ],
  },

  // ── UNIT 4 ──────────────────────────────
  {
    id: 'lop5_unit4',
    gradeId: 'lop5',
    name_vi: 'Unit 4: Hoạt Động Lúc Rảnh Rỗi',
    name_en: 'Our free-time activities',
    emoji: '🚴',
    color: 'from-purple-400 to-violet-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-violet-100',
    words: [
      { id: 'l5_u4_go_for_a_walk', en: 'go for a walk', vi: 'đi dạo bộ', emoji: '🚶', phonetic: '/ɡəʊ fɔːr ə wɔːk/', example_en: 'We often go for a walk in the park.', example_vi: 'Chúng tôi thường đi dạo bộ trong công viên.' },
      { id: 'l5_u4_play_violin', en: 'play the violin', vi: 'chơi đàn vi-ô-lông', emoji: '🎻', phonetic: '/pleɪ ðə ˌvaɪəˈlɪn/', example_en: 'She learns to play the violin every Sunday.', example_vi: 'Bạn ấy học chơi đàn vi-ô-lông vào mỗi Chủ nhật.' },
      { id: 'l5_u4_surf_internet', en: 'surf the Internet', vi: 'lướt mạng Internet', emoji: '💻', phonetic: '/sɜːf ði ˈɪntənet/', example_en: 'I surf the Internet to learn new English words.', example_vi: 'Tôi lướt mạng Internet để học từ vựng tiếng Anh mới.' },
      { id: 'l5_u4_water_flowers', en: 'water the flowers', vi: 'tưới hoa', emoji: '🌺', phonetic: '/ˈwɔːtər ðə ˈflaʊərz/', example_en: 'He helps his mother water the flowers.', example_vi: 'Cậu ấy giúp mẹ tưới hoa mỗi sáng.' },
      { id: 'l5_u4_always', en: 'always', vi: 'luôn luôn', emoji: '⏰', phonetic: '/ˈɔːlweɪz/', example_en: 'I always brush my teeth before bed.', example_vi: 'Tôi luôn luôn đánh răng trước khi đi ngủ.' },
      { id: 'l5_u4_often', en: 'often', vi: 'thường xuyên', emoji: '🔄', phonetic: '/ˈɒfn/', example_en: 'We often play football after school.', example_vi: 'Chúng tôi thường xuyên chơi bóng đá sau giờ học.' },
      { id: 'l5_u4_sometimes', en: 'sometimes', vi: 'thỉnh thoảng', emoji: '⏳', phonetic: '/ˈsʌmtaɪmz/', example_en: 'Sometimes we go camping at weekends.', example_vi: 'Thỉnh thoảng chúng tôi đi cắm trại vào cuối tuần.' },
      { id: 'l5_u4_usually', en: 'usually', vi: 'thường thường', emoji: '📅', phonetic: '/ˈjuːʒuəli/', example_en: 'She usually gets up at six o’clock.', example_vi: 'Bạn ấy thường thường thức dậy lúc 6 giờ.' },
    ],
  },

  // ── UNIT 5 ──────────────────────────────
  {
    id: 'lop5_unit5',
    gradeId: 'lop5',
    name_vi: 'Unit 5: Nghề Nghiệp Tương Lai',
    name_en: 'My future job',
    emoji: '👨‍🚒',
    color: 'from-rose-400 to-red-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-red-100',
    words: [
      { id: 'l5_u5_firefighter', en: 'firefighter', vi: 'lính cứu hỏa', emoji: '👨‍🚒', phonetic: '/ˈfaɪəfaɪtər/', example_en: 'He wants to be a brave firefighter.', example_vi: 'Cậu ấy muốn trở thành một người lính cứu hỏa dũng cảm.' },
      { id: 'l5_u5_gardener', en: 'gardener', vi: 'người làm vườn', emoji: '🧑‍🌾', phonetic: '/ˈɡɑːrdnər/', example_en: 'The gardener takes care of colourful flowers.', example_vi: 'Người làm vườn chăm sóc những bông hoa nhiều màu sắc.' },
      { id: 'l5_u5_reporter', en: 'reporter', vi: 'phóng viên', emoji: '🎤', phonetic: '/rɪˈpɔːrtər/', example_en: 'The reporter is reporting the news on TV.', example_vi: 'Phóng viên đang đưa tin trên truyền hình.' },
      { id: 'l5_u5_writer', en: 'writer', vi: 'nhà văn', emoji: '✍️', phonetic: '/ˈraɪtər/', example_en: 'She dreams of becoming a famous writer.', example_vi: 'Cô ấy ước mơ trở thành một nhà văn nổi tiếng.' },
      { id: 'l5_u5_grow_flowers', en: 'grow flowers', vi: 'trồng hoa', emoji: '🌷', phonetic: '/ɡroʊ ˈflaʊərz/', example_en: 'My aunt likes to grow flowers in the garden.', example_vi: 'Cô tôi thích trồng hoa trong vườn.' },
      { id: 'l5_u5_report_news', en: 'report the news', vi: 'đưa tin tức', emoji: '📰', phonetic: '/rɪˈpɔːrt ðə njuːz/', example_en: 'Reporters report the news every day.', example_vi: 'Các phóng viên đưa tin tức mỗi ngày.' },
      { id: 'l5_u5_teach_children', en: 'teach children', vi: 'dạy trẻ em', emoji: '👩‍🏫', phonetic: '/tiːtʃ ˈtʃɪldrən/', example_en: 'Teachers teach children to read and write.', example_vi: 'Các thầy cô giáo dạy trẻ em tập đọc và tập viết.' },
      { id: 'l5_u5_write_stories', en: 'write stories', vi: 'viết truyện', emoji: '📖', phonetic: '/raɪt ˈstɔːriz/', example_en: 'He likes to write stories for kids.', example_vi: 'Chú ấy thích viết truyện cho thiếu nhi.' },
    ],
  },

  // ── UNIT 6 ──────────────────────────────
  {
    id: 'lop5_unit6',
    gradeId: 'lop5',
    name_vi: 'Unit 6: Các Phòng Học Ở Trường',
    name_en: 'Our school rooms',
    emoji: '🏫',
    color: 'from-sky-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-indigo-100',
    words: [
      { id: 'l5_u6_first_floor', en: 'first floor', vi: 'tầng một', emoji: '🏢', phonetic: '/ˌfɜːst ˈflɔːr/', example_en: 'The library is on the first floor.', example_vi: 'Thư viện ở trên tầng một.' },
      { id: 'l5_u6_ground_floor', en: 'ground floor', vi: 'tầng trệt', emoji: '🚪', phonetic: '/ˌɡraʊnd ˈflɔːr/', example_en: 'The computer room is on the ground floor.', example_vi: 'Phòng máy tính ở tầng trệt.' },
      { id: 'l5_u6_second_floor', en: 'second floor', vi: 'tầng hai', emoji: '🏫', phonetic: '/ˌsekənd ˈflɔːr/', example_en: 'Our classroom is on the second floor.', example_vi: 'Lớp học của chúng tôi ở trên tầng hai.' },
      { id: 'l5_u6_third_floor', en: 'third floor', vi: 'tầng ba', emoji: '🪜', phonetic: '/ˌθɜːd ˈflɔːr/', example_en: 'The art room is on the third floor.', example_vi: 'Phòng mĩ thuật ở trên tầng ba.' },
      { id: 'l5_u6_go_along', en: 'go along', vi: 'đi dọc theo', emoji: '➡️', phonetic: '/ɡoʊ əˈlɒŋ/', example_en: 'Go along the corridor to find the music room.', example_vi: 'Đi dọc theo hành lang để tìm phòng âm nhạc.' },
      { id: 'l5_u6_go_downstairs', en: 'go downstairs', vi: 'đi xuống tầng', emoji: '⬇️', phonetic: '/ɡoʊ ˌdaʊnˈsteəz/', example_en: 'Please walk slowly when you go downstairs.', example_vi: 'Xin hãy đi chậm khi đi xuống tầng.' },
      { id: 'l5_u6_go_past', en: 'go past', vi: 'đi qua', emoji: '🚶', phonetic: '/ɡoʊ pɑːst/', example_en: 'Go past the gym and turn left.', example_vi: 'Đi qua phòng tập thể dục rồi rẽ trái.' },
      { id: 'l5_u6_go_upstairs', en: 'go upstairs', vi: 'đi lên tầng', emoji: '⬆️', phonetic: '/ɡoʊ ˌʌpˈsteəz/', example_en: 'They go upstairs to the science lab.', example_vi: 'Các bạn ấy đi lên tầng tới phòng thí nghiệm khoa học.' },
    ],
  },

  // ── UNIT 7 ──────────────────────────────
  {
    id: 'lop5_unit7',
    gradeId: 'lop5',
    name_vi: 'Unit 7: Hoạt Động Học Tập Yêu Thích',
    name_en: 'Our favourite school activities',
    emoji: '🔬',
    color: 'from-teal-400 to-green-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-green-100',
    words: [
      { id: 'l5_u7_do_projects', en: 'do projects', vi: 'làm bài tập dự án', emoji: '📑', phonetic: '/duː ˈprɒdʒekts/', example_en: 'We do projects in science class.', example_vi: 'Chúng tôi làm bài tập dự án trong giờ khoa học.' },
      { id: 'l5_u7_play_games', en: 'play games', vi: 'chơi trò chơi', emoji: '🎮', phonetic: '/pleɪ ɡeɪmz/', example_en: 'We play games during break time.', example_vi: 'Chúng tôi chơi trò chơi trong giờ ra chơi.' },
      { id: 'l5_u7_read_books', en: 'read books', vi: 'đọc sách', emoji: '📚', phonetic: '/riːd bʊks/', example_en: 'I love to read books in the library.', example_vi: 'Tôi thích đọc sách trong thư viện.' },
      { id: 'l5_u7_solve_maths', en: 'solve maths problems', vi: 'giải bài tập toán', emoji: '🧮', phonetic: '/sɒlv mæθs ˈprɒbləmz/', example_en: 'He can solve maths problems quickly.', example_vi: 'Cậu ấy có thể giải bài tập toán rất nhanh.' },
      { id: 'l5_u7_fun', en: 'fun', vi: 'vui thích', emoji: '🥳', phonetic: '/fʌn/', example_en: 'English club is always fun and lively.', example_vi: 'Câu lạc bộ tiếng Anh luôn luôn vui thích và sôi nổi.' },
      { id: 'l5_u7_group_work', en: 'good for group work', vi: 'tốt cho hoạt động nhóm', emoji: '👥', phonetic: '/ɡʊd fɔːr ɡruːp wɜːk/', example_en: 'Project learning is good for group work.', example_vi: 'Học theo dự án rất tốt cho hoạt động nhóm.' },
      { id: 'l5_u7_interesting', en: 'interesting', vi: 'thú vị', emoji: '💡', phonetic: '/ˈɪntrəstɪŋ/', example_en: 'The history lesson is very interesting.', example_vi: 'Bài học lịch sử rất thú vị.' },
      { id: 'l5_u7_useful', en: 'useful', vi: 'bổ ích, hữu ích', emoji: '🛠️', phonetic: '/ˈjuːsfl/', example_en: 'Learning English is very useful for the future.', example_vi: 'Học tiếng Anh rất bổ ích cho tương lai.' },
    ],
  },

  // ── UNIT 8 ──────────────────────────────
  {
    id: 'lop5_unit8',
    gradeId: 'lop5',
    name_vi: 'Unit 8: Trong Lớp Học',
    name_en: 'In our classroom',
    emoji: '📐',
    color: 'from-amber-400 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'l5_u8_above', en: 'above', vi: 'ở phía trên', emoji: '⬆️', phonetic: '/əˈbʌv/', example_en: 'The clock is above the whiteboard.', example_vi: 'Đồng hồ ở phía trên bảng trắng.' },
      { id: 'l5_u8_beside', en: 'beside', vi: 'bên cạnh', emoji: '➡️', phonetic: '/bɪˈsaɪd/', example_en: 'The bin is beside the teacher’s desk.', example_vi: 'Thùng rác ở bên cạnh bàn giáo viên.' },
      { id: 'l5_u8_in_front_of', en: 'in front of', vi: 'ở phía trước', emoji: '🪑', phonetic: '/ɪn frʌnt əv/', example_en: 'He sits in front of me in class.', example_vi: 'Cậu ấy ngồi ở phía trước tôi trong lớp.' },
      { id: 'l5_u8_under', en: 'under', vi: 'ở phía dưới', emoji: '⬇️', phonetic: '/ˈʌndər/', example_en: 'My school bag is under the chair.', example_vi: 'Cặp sách của tôi ở phía dưới ghế.' },
      { id: 'l5_u8_crayon', en: 'crayon', vi: 'bút sáp màu', emoji: '🖍️', phonetic: '/ˈkreɪən/', example_en: 'She draws a picture with crayons.', example_vi: 'Bạn ấy vẽ một bức tranh bằng bút sáp màu.' },
      { id: 'l5_u8_glue_stick', en: 'glue stick', vi: 'keo / hồ dán', emoji: '🧴', phonetic: '/ˈɡluː stɪk/', example_en: 'Use a glue stick to paste the paper.', example_vi: 'Dùng hồ dán để dán giấy.' },
      { id: 'l5_u8_sharpener', en: 'pencil sharpener', vi: 'gọt bút chì', emoji: '✏️', phonetic: '/ˈpensl ˌʃɑːpnər/', example_en: 'May I borrow your pencil sharpener?', example_vi: 'Tớ có thể mượn cái gọt bút chì của bạn không?' },
      { id: 'l5_u8_set_square', en: 'set square', vi: 'thước ê-ke', emoji: '📐', phonetic: '/ˈset skweər/', example_en: 'Draw a triangle with a set square.', example_vi: 'Vẽ một hình tam giác bằng thước ê-ke.' },
    ],
  },

  // ── UNIT 9 ──────────────────────────────
  {
    id: 'lop5_unit9',
    gradeId: 'lop5',
    name_vi: 'Unit 9: Hoạt Động Ngoài Trời',
    name_en: 'Our outdoor activities',
    emoji: '🏕️',
    color: 'from-lime-400 to-green-500',
    gradient: 'bg-gradient-to-br from-lime-100 to-green-100',
    words: [
      { id: 'l5_u9_aquarium', en: 'aquarium', vi: 'thủy cung', emoji: '🐟', phonetic: '/əˈkweəriəm/', example_en: 'We saw colourful sharks at the aquarium.', example_vi: 'Chúng tôi đã thấy những chú cá mập nhiều màu ở thủy cung.' },
      { id: 'l5_u9_campsite', en: 'campsite', vi: 'địa điểm cắm trại', emoji: '⛺', phonetic: '/ˈkæmpsaɪt/', example_en: 'We set up our tents at the campsite.', example_vi: 'Chúng tôi dựng lều tại địa điểm cắm trại.' },
      { id: 'l5_u9_funfair', en: 'funfair', vi: 'hội chợ giải trí', emoji: '🎡', phonetic: '/ˈfænfeər/', example_en: 'Children love riding the wheel at the funfair.', example_vi: 'Trẻ em thích đi đu quay tại hội chợ giải trí.' },
      { id: 'l5_u9_theatre', en: 'theatre', vi: 'nhà hát', emoji: '🎭', phonetic: '/ˈθɪətər/', example_en: 'We watched a puppet play at the theatre.', example_vi: 'Chúng tôi xem múa rối tại nhà hát.' },
      { id: 'l5_u9_campfire_dance', en: 'dance around the campfire', vi: 'nhảy múa quanh lửa trại', emoji: '🔥', phonetic: '/dɑːns əˈraʊnd ðə ˈkæmpfaɪər/', example_en: 'We dance around the campfire at night.', example_vi: 'Chúng tôi nhảy múa quanh lửa trại vào buổi tối.' },
      { id: 'l5_u9_listen_music', en: 'listen to music', vi: 'nghe nhạc', emoji: '🎧', phonetic: '/ˈlɪsn tu ˈmjuːzɪk/', example_en: 'I like to relax and listen to music.', example_vi: 'Tôi thích thư giãn và nghe nhạc.' },
      { id: 'l5_u9_play_chess', en: 'play chess', vi: 'chơi cờ', emoji: '♟️', phonetic: '/pleɪ tʃes/', example_en: 'My brother and I often play chess.', example_vi: 'Anh trai và tôi thường chơi cờ.' },
      { id: 'l5_u9_watch_fish', en: 'watch the fish', vi: 'xem cá', emoji: '🐠', phonetic: '/wɒtʃ ðə fɪʃ/', example_en: 'The kids watch the fish swimming in the pond.', example_vi: 'Các bạn nhỏ ngắm nhìn đàn cá bơi trong ao.' },
    ],
  },

  // ── UNIT 10 ─────────────────────────────
  {
    id: 'lop5_unit10',
    gradeId: 'lop5',
    name_vi: 'Unit 10: Chuyến Tham Quan Trường',
    name_en: 'Our school trip',
    emoji: '🚌',
    color: 'from-orange-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-rose-100',
    words: [
      { id: 'l5_u10_bana_hills', en: 'Ba Na Hills', vi: 'Bà Nà Hills', emoji: '🌁', phonetic: '/bɑː nɑː hɪlz/', example_en: 'We took a cable car at Ba Na Hills.', example_vi: 'Chúng tôi đi cáp treo ở Bà Nà Hills.' },
      { id: 'l5_u10_bai_dinh', en: 'Bai Dinh Pagoda', vi: 'Chùa Bái Đính', emoji: '🏯', phonetic: '/baɪ dɪn pəˈɡoʊdə/', example_en: 'Bai Dinh Pagoda is very large and famous.', example_vi: 'Chùa Bái Đính rất lớn và nổi tiếng.' },
      { id: 'l5_u10_hoan_kiem', en: 'Hoan Kiem Lake', vi: 'Hồ Hoàn Kiếm', emoji: '🐢', phonetic: '/hwɑːn kjem leɪk/', example_en: 'We walked around Hoan Kiem Lake in Ha Noi.', example_vi: 'Chúng tôi đi dạo quanh Hồ Hoàn Kiếm ở Hà Nội.' },
      { id: 'l5_u10_suoi_tien', en: 'Suoi Tien Theme Park', vi: 'Công viên Suối Tiên', emoji: '🎢', phonetic: '/swiː tɪen θiːm pɑːrk/', example_en: 'We had great fun at Suoi Tien Theme Park.', example_vi: 'Chúng tôi đã rất vui ở Công viên Suối Tiên.' },
      { id: 'l5_u10_plant_trees', en: 'plant trees', vi: 'trồng cây', emoji: '🌱', phonetic: '/plɑːnt triːz/', example_en: 'Students plant trees to protect nature.', example_vi: 'Học sinh trồng cây để bảo vệ thiên nhiên.' },
      { id: 'l5_u10_play_games', en: 'play games', vi: 'chơi trò chơi', emoji: '⚽', phonetic: '/pleɪ ɡeɪmz/', example_en: 'We play team games on the lawn.', example_vi: 'Chúng tôi chơi các trò chơi đồng đội trên bãi cỏ.' },
      { id: 'l5_u10_old_buildings', en: 'visit the old buildings', vi: 'thăm các tòa nhà cổ', emoji: '🏛️', phonetic: '/ˈvɪzɪt ði oʊld ˈbɪldɪŋz/', example_en: 'We visit the old buildings in the ancient town.', example_vi: 'Chúng tôi đi thăm các tòa nhà cổ trong phố cổ.' },
      { id: 'l5_u10_walk_around_lake', en: 'walk around the lake', vi: 'đi dạo quanh hồ', emoji: '🚶', phonetic: '/wɔːk əˈraʊnd ðə leɪk/', example_en: 'People love to walk around the lake in the morning.', example_vi: 'Mọi người thích đi dạo quanh hồ vào buổi sáng.' },
    ],
  },

  // ── UNIT 11 ─────────────────────────────
  {
    id: 'lop5_unit11',
    gradeId: 'lop5',
    name_vi: 'Unit 11: Thời Gian Bên Gia Đình',
    name_en: 'Family time',
    emoji: '🏖️',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l5_u11_souvenirs', en: 'buy souvenirs', vi: 'mua quà lưu niệm', emoji: '🎁', phonetic: '/baɪ ˌsuːvəˈnɪərz/', example_en: 'We buy souvenirs for our grandparents.', example_vi: 'Chúng tôi mua quà lưu niệm tặng ông bà.' },
      { id: 'l5_u11_seashells', en: 'collect seashells', vi: 'nhặt vỏ sò / vỏ ốc', emoji: '🐚', phonetic: '/kəˈlekt ˈsiːʃelz/', example_en: 'The children collect seashells on the shore.', example_vi: 'Các bạn nhỏ nhặt vỏ sò trên bờ biển.' },
      { id: 'l5_u11_seafood', en: 'eat seafood', vi: 'ăn hải sản', emoji: '🦀', phonetic: '/iːt ˈsiːfuːd/', example_en: 'We eat delicious seafood in Da Nang.', example_vi: 'Chúng tôi ăn hải sản thơm ngon ở Đà Nẵng.' },
      { id: 'l5_u11_see_places', en: 'see some interesting places', vi: 'thăm các địa điểm thú vị', emoji: '🗺️', phonetic: '/siː sʌm ˈɪntrəstɪŋ ˈpleɪsɪz/', example_en: 'We see some interesting places during the trip.', example_vi: 'Chúng tôi đi thăm vài địa điểm thú vị trong chuyến đi.' },
      { id: 'l5_u11_boat_trip', en: 'take a boat trip around the bay', vi: 'đi thuyền quanh vịnh', emoji: '⛵', phonetic: '/teɪk ə boʊt trɪp əˈraʊnd ðə beɪ/', example_en: 'They take a boat trip around Ha Long Bay.', example_vi: 'Họ đi thuyền ngắm cảnh quanh Vịnh Hạ Long.' },
      { id: 'l5_u11_walk_beach', en: 'walk on the beach', vi: 'đi dạo trên bờ biển', emoji: '🏖️', phonetic: '/wɔːk ɒn ðə biːtʃ/', example_en: 'I like to walk on the beach at sunset.', example_vi: 'Tôi thích đi dạo trên bờ biển lúc hoàng hôn.' },
    ],
  },

  // ── UNIT 12 ─────────────────────────────
  {
    id: 'lop5_unit12',
    gradeId: 'lop5',
    name_vi: 'Unit 12: Ngày Tết Của Chúng Tôi',
    name_en: 'Our Tet holiday',
    emoji: '🧧',
    color: 'from-red-500 to-amber-500',
    gradient: 'bg-gradient-to-br from-red-100 to-amber-100',
    words: [
      { id: 'l5_u12_buy_roses', en: 'buy roses', vi: 'mua hoa hồng', emoji: '🌹', phonetic: '/baɪ ˈroʊzɪz/', example_en: 'My father buys roses to decorate the living room.', example_vi: 'Bố tôi mua hoa hồng để trang trí phòng khách.' },
      { id: 'l5_u12_peach_blossom', en: 'buy a branch of peach blossoms', vi: 'mua cành đào', emoji: '🌸', phonetic: '/baɪ ə brɑːntʃ əv piːtʃ ˈblɒsəmz/', example_en: 'We buy a branch of peach blossoms for Tet.', example_vi: 'Chúng tôi mua một cành đào cho ngày Tết.' },
      { id: 'l5_u12_decorate_house', en: 'decorate the house', vi: 'trang trí nhà cửa', emoji: '🏮', phonetic: '/ˈdekəreɪt ðə haʊs/', example_en: 'We clean and decorate the house before Tet.', example_vi: 'Chúng tôi dọn dẹp và trang trí nhà cửa trước Tết.' },
      { id: 'l5_u12_do_shopping', en: 'do the shopping', vi: 'đi sắm sửa / mua sắm', emoji: '🛍️', phonetic: '/duː ðə ˈʃɒpɪŋ/', example_en: 'Mum and I do the shopping at the supermarket.', example_vi: 'Mẹ và tôi đi sắm sửa ở siêu thị.' },
      { id: 'l5_u12_make_banh_chung', en: 'make banh chung', vi: 'gói bánh chưng', emoji: '🎍', phonetic: '/meɪk bɑːn tʃʊŋ/', example_en: 'My family gathers to make banh chung.', example_vi: 'Gia đình tôi quây quần gói bánh chưng.' },
      { id: 'l5_u12_spring_rolls', en: 'make spring rolls', vi: 'làm nem rán / chả giò', emoji: '🥟', phonetic: '/meɪk sprɪŋ roʊlz/', example_en: 'We make crispy spring rolls for the feast.', example_vi: 'Chúng tôi làm nem rán giòn cho mâm cỗ Tết.' },
      { id: 'l5_u12_fireworks', en: 'fireworks show', vi: 'màn bắn pháo hoa', emoji: '🎆', phonetic: '/ˈfaɪəwɜːks ʃoʊ/', example_en: 'We watch the fireworks show on New Year’s Eve.', example_vi: 'Chúng tôi xem màn bắn pháo hoa vào đêm Giao thừa.' },
      { id: 'l5_u12_flower_festival', en: 'flower festival', vi: 'lễ hội hoa', emoji: '🌺', phonetic: '/ˈflaʊər ˈfestɪvl/', example_en: 'Many people visit the spring flower festival.', example_vi: 'Nhiều người đi tham quan lễ hội hoa xuân.' },
      { id: 'l5_u12_new_year_party', en: 'New Year party', vi: 'bữa tiệc năm mới', emoji: '🎉', phonetic: '/njuː jɪər ˈpɑːti/', example_en: 'We have a joyful New Year party together.', example_vi: 'Chúng tôi tổ chức bữa tiệc năm mới ngập tràn niềm vui cùng nhau.' },
    ],
  },

  // ── UNIT 13 ─────────────────────────────
  {
    id: 'lop5_unit13',
    gradeId: 'lop5',
    name_vi: 'Unit 13: Những Ngày Đặc Biệt',
    name_en: 'Our special days',
    emoji: '🎉',
    color: 'from-pink-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-purple-100',
    words: [
      { id: 'l5_u13_mid_autumn', en: 'at Mid-Autumn Festival', vi: 'vào Tết Trung thu', emoji: '🥮', phonetic: '/æt mɪd ˈɔːtəm ˈfestɪvl/', example_en: 'We carry star lanterns at Mid-Autumn Festival.', example_vi: 'Chúng tôi rước đèn ông sao vào Tết Trung thu.' },
      { id: 'l5_u13_childrens_day', en: 'on Children’s Day', vi: 'vào Ngày Quốc tế Thiếu nhi', emoji: '🎈', phonetic: '/ɒn ˈtʃɪldrənz deɪ/', example_en: 'Kids receive lovely gifts on Children’s Day.', example_vi: 'Trẻ em nhận được quà đáng yêu vào Ngày Quốc tế Thiếu nhi.' },
      { id: 'l5_u13_sports_day', en: 'on Sports Day', vi: 'vào Ngày Hội thể thao', emoji: '🏅', phonetic: '/ɒn spɔːrts deɪ/', example_en: 'Our class ran fast on Sports Day.', example_vi: 'Lớp chúng tôi chạy rất nhanh trong Ngày Hội thể thao.' },
      { id: 'l5_u13_teachers_day', en: 'on Teachers’ Day', vi: 'vào Ngày Nhà giáo', emoji: '💐', phonetic: '/ɒn ˈtiːtʃərz deɪ/', example_en: 'We give fresh flowers to teachers on Teachers’ Day.', example_vi: 'Chúng tôi tặng hoa tươi cho các thầy cô vào Ngày Nhà giáo.' },
      { id: 'l5_u13_apple_juice', en: 'apple juice', vi: 'nước ép táo', emoji: '🧃', phonetic: '/ˈæpl dʒuːs/', example_en: 'I like drinking cold apple juice.', example_vi: 'Tôi thích uống nước ép táo mát lạnh.' },
      { id: 'l5_u13_burgers', en: 'burgers', vi: 'bánh burger', emoji: '🍔', phonetic: '/ˈbɜːrɡərz/', example_en: 'They ordered beef burgers for the picnic.', example_vi: 'Họ đã gọi bánh burger thịt bò cho chuyến dã ngoại.' },
      { id: 'l5_u13_milk_tea', en: 'milk tea', vi: 'trà sữa', emoji: '🧋', phonetic: '/mɪlk tiː/', example_en: 'Milk tea with pearls is delicious.', example_vi: 'Trà sữa trân châu rất ngon.' },
      { id: 'l5_u13_pizza', en: 'pizza', vi: 'bánh pizza', emoji: '🍕', phonetic: '/ˈpiːtsə/', example_en: 'We shared a big cheese pizza at the party.', example_vi: 'Chúng tôi đã chia nhau một chiếc bánh pizza phô mai lớn ở bữa tiệc.' },
    ],
  },

  // ── UNIT 14 ─────────────────────────────
  {
    id: 'lop5_unit14',
    gradeId: 'lop5',
    name_vi: 'Unit 14: Giữ Gìn Sức Khỏe',
    name_en: 'Staying healthy',
    emoji: '🏃',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l5_u14_morning_exercise', en: 'do morning exercise', vi: 'tập thể dục buổi sáng', emoji: '🧘', phonetic: '/duː ˈmɔːrnɪŋ ˈeksəsaɪz/', example_en: 'We do morning exercise at six o’clock.', example_vi: 'Chúng tôi tập thể dục buổi sáng lúc sáu giờ.' },
      { id: 'l5_u14_yoga', en: 'do yoga', vi: 'tập yoga', emoji: '🧘‍♀️', phonetic: '/duː ˈjoʊɡə/', example_en: 'My mother does yoga to stay fit.', example_vi: 'Mẹ tôi tập yoga để giữ dáng khỏe đẹp.' },
      { id: 'l5_u14_fresh_juice', en: 'drink fresh juice', vi: 'uống nước ép tươi', emoji: '🍹', phonetic: '/drɪŋk freʃ dʒuːs/', example_en: 'Drink fresh juice for vitamins.', example_vi: 'Hãy uống nước ép tươi để bổ sung vitamin.' },
      { id: 'l5_u14_healthy_food', en: 'eat healthy food', vi: 'ăn thực phẩm lành mạnh', emoji: '🥗', phonetic: '/iːt ˈhelθi fuːd/', example_en: 'Doctors advise us to eat healthy food.', example_vi: 'Bác sĩ khuyên chúng ta nên ăn thực phẩm lành mạnh.' },
      { id: 'l5_u14_vegetables', en: 'eat vegetables', vi: 'ăn rau củ', emoji: '🥦', phonetic: '/iːt ˈvedʒtəblz/', example_en: 'Kids should eat vegetables every day.', example_vi: 'Trẻ em nên ăn rau củ mỗi ngày.' },
      { id: 'l5_u14_play_sports', en: 'play sports', vi: 'chơi thể thao', emoji: '⚽', phonetic: '/pleɪ spɔːrts/', example_en: 'Playing sports makes our bodies strong.', example_vi: 'Chơi thể thao giúp cơ thể chúng ta khỏe mạnh.' },
      { id: 'l5_u14_every_day', en: 'every day', vi: 'mỗi ngày', emoji: '📅', phonetic: '/ˈevri deɪ/', example_en: 'Drink clean water every day.', example_vi: 'Hãy uống nước sạch mỗi ngày.' },
      { id: 'l5_u14_once_a_week', en: 'once a week', vi: 'một lần một tuần', emoji: '1️⃣', phonetic: '/wʌns ə wiːk/', example_en: 'He goes swimming once a week.', example_vi: 'Cậu ấy đi bơi một lần một tuần.' },
      { id: 'l5_u14_twice_a_week', en: 'twice a week', vi: 'hai lần một tuần', emoji: '2️⃣', phonetic: '/twaɪs ə wiːk/', example_en: 'We have English lessons twice a week.', example_vi: 'Chúng tôi học tiếng Anh hai lần một tuần.' },
      { id: 'l5_u14_three_times_week', en: 'three times a week', vi: 'ba lần một tuần', emoji: '3️⃣', phonetic: '/θriː taɪmz ə wiːk/', example_en: 'She practices badminton three times a week.', example_vi: 'Cô ấy tập cầu lông ba lần một tuần.' },
    ],
  },

  // ── UNIT 15 ─────────────────────────────
  {
    id: 'lop5_unit15',
    gradeId: 'lop5',
    name_vi: 'Unit 15: Sức Khỏe Của Chúng Ta',
    name_en: 'Our health',
    emoji: '🩺',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l5_u15_headache', en: 'headache', vi: 'đau đầu', emoji: '🤕', phonetic: '/ˈhedeɪk/', example_en: 'He has a bad headache today.', example_vi: 'Hôm nay cậu ấy bị đau đầu dữ dội.' },
      { id: 'l5_u15_sore_throat', en: 'sore throat', vi: 'đau họng', emoji: '🧣', phonetic: '/ˌsɔːr ˈθroʊt/', example_en: 'Drink warm water when you have a sore throat.', example_vi: 'Hãy uống nước ấm khi bạn bị đau họng.' },
      { id: 'l5_u15_stomach_ache', en: 'stomach ache', vi: 'đau dạ dày / đau bụng', emoji: '😣', phonetic: '/ˈstʌmək eɪk/', example_en: 'Eating too much candy causes stomach ache.', example_vi: 'Ăn quá nhiều kẹo sẽ gây đau bụng.' },
      { id: 'l5_u15_toothache', en: 'toothache', vi: 'đau răng', emoji: '🦷', phonetic: '/ˈtuːθeɪk/', example_en: 'I have a toothache so I cannot eat well.', example_vi: 'Tôi bị đau răng nên không thể ăn ngon được.' },
      { id: 'l5_u15_warm_water', en: 'drink warm water', vi: 'uống nước ấm', emoji: '🍵', phonetic: '/drɪŋk wɔːrm ˈwɔːtər/', example_en: 'Drink warm water when you feel cold.', example_vi: 'Hãy uống nước ấm khi bạn thấy lạnh.' },
      { id: 'l5_u15_dentist', en: 'go to the dentist', vi: 'đi khám nha sĩ', emoji: '👨‍⚕️', phonetic: '/ɡoʊ tu ðə ˈdentɪst/', example_en: 'You should go to the dentist twice a year.', example_vi: 'Bạn nên đi khám nha sĩ hai lần một năm.' },
      { id: 'l5_u15_have_rest', en: 'have a rest', vi: 'nghỉ ngơi', emoji: '🛌', phonetic: '/hæv ə rest/', example_en: 'Lie down and have a rest now.', example_vi: 'Hãy nằm xuống và nghỉ ngơi ngay nhé.' },
      { id: 'l5_u15_medicine', en: 'take some medicine', vi: 'uống thuốc', emoji: '💊', phonetic: '/teɪk sʌm ˈmedsn/', example_en: 'Take some medicine after meals.', example_vi: 'Hãy uống thuốc sau bữa ăn.' },
    ],
  },

  // ── UNIT 16 ─────────────────────────────
  {
    id: 'lop5_unit16',
    gradeId: 'lop5',
    name_vi: 'Unit 16: Các Mùa & Thời Tiết',
    name_en: 'Seasons and the weather',
    emoji: '⛅',
    color: 'from-amber-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-cyan-100',
    words: [
      { id: 'l5_u16_autumn', en: 'autumn', vi: 'mùa thu', emoji: '🍂', phonetic: '/ˈɔːtəm/', example_en: 'Leaves turn yellow in autumn.', example_vi: 'Lá chuyển sang màu vàng vào mùa thu.' },
      { id: 'l5_u16_spring', en: 'spring', vi: 'mùa xuân', emoji: '🌸', phonetic: '/sprɪŋ/', example_en: 'Flowers bloom happily in spring.', example_vi: 'Hoa đua nở rực rỡ vào mùa xuân.' },
      { id: 'l5_u16_summer', en: 'summer', vi: 'mùa hè', emoji: '☀️', phonetic: '/ˈsʌmər/', example_en: 'Summer is sunny and hot.', example_vi: 'Mùa hè nhiều nắng và nóng bức.' },
      { id: 'l5_u16_winter', en: 'winter', vi: 'mùa đông', emoji: '❄️', phonetic: '/ˈwɪntər/', example_en: 'Winter is cold with snow in many countries.', example_vi: 'Mùa đông lạnh giá có tuyết ở nhiều quốc gia.' },
      { id: 'l5_u16_cold', en: 'cold', vi: 'lạnh', emoji: '🥶', phonetic: '/koʊld/', example_en: 'Wear a warm coat when it is cold.', example_vi: 'Hãy mặc áo khoác ấm khi trời lạnh.' },
      { id: 'l5_u16_cool', en: 'cool', vi: 'mát mẻ', emoji: '🍃', phonetic: '/kuːl/', example_en: 'The evening breeze is very cool.', example_vi: 'Cơn gió buổi tối rất mát mẻ.' },
      { id: 'l5_u16_hot', en: 'hot', vi: 'nóng', emoji: '🥵', phonetic: '/hɒt/', example_en: 'It is very hot at noon in July.', example_vi: 'Trời rất nóng vào buổi trưa tháng Bảy.' },
      { id: 'l5_u16_warm', en: 'warm', vi: 'ấm áp', emoji: '🌤️', phonetic: '/wɔːrm/', example_en: 'Spring brings warm and pleasant weather.', example_vi: 'Mùa xuân mang lại thời tiết ấm áp dễ chịu.' },
      { id: 'l5_u16_blouse', en: 'blouse', vi: 'áo sơ mi nữ', emoji: '👚', phonetic: '/blaʊz/', example_en: 'She wears a white silk blouse.', example_vi: 'Cô ấy mặc một chiếc áo sơ mi nữ lụa trắng.' },
      { id: 'l5_u16_jeans', en: 'jeans', vi: 'quần bò / jean', emoji: '👖', phonetic: '/dʒiːnz/', example_en: 'Blue jeans are comfortable to wear.', example_vi: 'Quần jean xanh mặc rất thoải mái.' },
      { id: 'l5_u16_jumper', en: 'jumper', vi: 'áo len chui đầu', emoji: '🧥', phonetic: '/ˈdʒʌmpər/', example_en: 'Put on your jumper before going out.', example_vi: 'Mặc áo len vào trước khi ra ngoài nhé.' },
      { id: 'l5_u16_trousers', en: 'trousers', vi: 'quần dài', emoji: '👖', phonetic: '/ˈtraʊzərz/', example_en: 'He wears dark trousers for school.', example_vi: 'Cậu ấy mặc quần dài màu tối đi học.' },
    ],
  },

  // ── UNIT 17 ─────────────────────────────
  {
    id: 'lop5_unit17',
    gradeId: 'lop5',
    name_vi: 'Unit 17: Truyện Kể Cho Trẻ Em',
    name_en: 'Stories for children',
    emoji: '🧚',
    color: 'from-purple-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-indigo-100',
    words: [
      { id: 'l5_u17_ant', en: 'ant', vi: 'con kiến', emoji: '🐜', phonetic: '/ænt/', example_en: 'The little ant works hard all summer.', example_vi: 'Chú kiến nhỏ làm việc chăm chỉ suốt cả mùa hè.' },
      { id: 'l5_u17_crow', en: 'crow', vi: 'con quạ', emoji: '🦅', phonetic: '/kroʊ/', example_en: 'The clever crow dropped stones into the jar.', example_vi: 'Chú quạ thông minh thả từng viên sỏi vào bình nước.' },
      { id: 'l5_u17_dwarfs', en: 'dwarfs', vi: 'chú lùn', emoji: '🧙', phonetic: '/dwɔːrvz/', example_en: 'Snow White lived with seven dwarfs.', example_vi: 'Bạch Tuyết sống cùng bảy chú lùn.' },
      { id: 'l5_u17_fox', en: 'fox', vi: 'con cáo', emoji: '🦊', phonetic: '/fɒks/', example_en: 'The sly fox tricked the crow.', example_vi: 'Con cáo xảo quyệt đã lừa con quạ.' },
      { id: 'l5_u17_grasshopper', en: 'grasshopper', vi: 'con châu chấu', emoji: '🦗', phonetic: '/ˈɡrɑːshɒpər/', example_en: 'The grasshopper sang and danced all day.', example_vi: 'Con châu chấu ca hát và nhảy múa cả ngày.' },
      { id: 'l5_u17_hare', en: 'hare', vi: 'con thỏ rừng', emoji: '🐇', phonetic: '/heər/', example_en: 'The hare ran fast but lost the race.', example_vi: 'Thỏ rừng chạy rất nhanh nhưng đã thua cuộc đua.' },
      { id: 'l5_u17_snow_white', en: 'Snow White', vi: 'Nàng Bạch Tuyết', emoji: '👸', phonetic: '/ˌsnoʊ ˈwaɪt/', example_en: 'Snow White is gentle and kind.', example_vi: 'Bạch Tuyết rất hiền dịu và tốt bụng.' },
      { id: 'l5_u17_tortoise', en: 'tortoise', vi: 'con rùa', emoji: '🐢', phonetic: '/ˈtɔːrtəs/', example_en: 'The tortoise won the race with patience.', example_vi: 'Chú rùa đã thắng cuộc đua nhờ sự kiên trì.' },
      { id: 'l5_u17_cook_well', en: 'cook well', vi: 'nấu ăn ngon', emoji: '🍳', phonetic: '/kʊk wel/', example_en: 'Grandma can cook well.', example_vi: 'Bà có thể nấu ăn rất ngon.' },
      { id: 'l5_u17_run_fast', en: 'run fast', vi: 'chạy nhanh', emoji: '🏃', phonetic: '/rʌn fɑːst/', example_en: 'The athlete can run fast.', example_vi: 'Vận động viên có thể chạy rất nhanh.' },
      { id: 'l5_u17_sing_beautifully', en: 'sing beautifully', vi: 'hát hay', emoji: '🎤', phonetic: '/sɪŋ ˈbjuːtɪfli/', example_en: 'The birds sing beautifully in the morning.', example_vi: 'Những chú chim hót thật hay vào buổi sáng.' },
      { id: 'l5_u17_work_hard', en: 'work hard', vi: 'làm việc chăm chỉ', emoji: '🐝', phonetic: '/wɜːrk hɑːrd/', example_en: 'Bees work hard to make honey.', example_vi: 'Những chú ong làm việc chăm chỉ để tạo ra mật.' },
    ],
  },

  // ── UNIT 18 ─────────────────────────────
  {
    id: 'lop5_unit18',
    gradeId: 'lop5',
    name_vi: 'Unit 18: Phương Tiện Giao Thông',
    name_en: 'Means of transport',
    emoji: '🚆',
    color: 'from-cyan-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-teal-100',
    words: [
      { id: 'l5_u18_dragon_bridge', en: 'Dragon Bridge', vi: 'Cầu Rồng', emoji: '🌉', phonetic: '/ˈdræɡən brɪdʒ/', example_en: 'Dragon Bridge in Da Nang breathes fire at weekends.', example_vi: 'Cầu Rồng ở Đà Nẵng phun lửa vào cuối tuần.' },
      { id: 'l5_u18_opera_house', en: 'Ha Noi Opera House', vi: 'Nhà hát Lớn Hà Nội', emoji: '🏛️', phonetic: '/hɑː ˈnɔɪ ˈɒprə haʊs/', example_en: 'The Ha Noi Opera House has French architecture.', example_vi: 'Nhà hát Lớn Hà Nội có kiến trúc kiểu Pháp.' },
      { id: 'l5_u18_hcm_museum', en: 'Ho Chi Minh City Museum', vi: 'Bảo tàng Thành phố Hồ Chí Minh', emoji: '🏛️', phonetic: '/ˌhoʊ tʃiː ˈmɪn ˈsɪti mjuːˈziːəm/', example_en: 'We visited Ho Chi Minh City Museum yesterday.', example_vi: 'Hôm qua chúng tôi đã tham quan Bảo tàng TP.HCM.' },
      { id: 'l5_u18_ngo_mon', en: 'Ngo Mon Square', vi: 'Quảng trường Ngọ Môn', emoji: '🏯', phonetic: '/ŋɒ mɒn skweər/', example_en: 'Ngo Mon Square is in front of the Hue Citadel.', example_vi: 'Quảng trường Ngọ Môn ở phía trước Đại Nội Huế.' },
      { id: 'l5_u18_by_bicycle', en: 'by bicycle', vi: 'bằng xe đạp', emoji: '🚲', phonetic: '/baɪ ˈbaɪsɪkl/', example_en: 'She travels to school by bicycle.', example_vi: 'Bạn ấy đi học bằng xe đạp.' },
      { id: 'l5_u18_by_bus', en: 'by bus', vi: 'bằng xe buýt', emoji: '🚌', phonetic: '/baɪ bʌs/', example_en: 'We go to the park by bus.', example_vi: 'Chúng tôi đi đến công viên bằng xe buýt.' },
      { id: 'l5_u18_by_taxi', en: 'by taxi', vi: 'bằng xe taxi', emoji: '🚕', phonetic: '/baɪ ˈtæksi/', example_en: 'They took a trip to the airport by taxi.', example_vi: 'Họ đã đi ra sân bay bằng xe taxi.' },
      { id: 'l5_u18_on_foot', en: 'on foot', vi: 'đi bộ', emoji: '🚶', phonetic: '/ɒn fʊt/', example_en: 'My house is near so I go to school on foot.', example_vi: 'Nhà tôi gần nên tôi đi bộ đến trường.' },
    ],
  },

  // ── UNIT 19 ─────────────────────────────
  {
    id: 'lop5_unit19',
    gradeId: 'lop5',
    name_vi: 'Unit 19: Địa Điểm Thú Vị',
    name_en: 'Places of interest',
    emoji: '🏰',
    color: 'from-amber-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-rose-100',
    words: [
      { id: 'l5_u19_beautiful', en: 'beautiful', vi: 'đẹp', emoji: '✨', phonetic: '/ˈbjuːtɪfl/', example_en: 'The landscape in Da Lat is very beautiful.', example_vi: 'Phong cảnh ở Đà Lạt rất đẹp.' },
      { id: 'l5_u19_exciting', en: 'exciting', vi: 'thú vị / sôi động', emoji: '🎢', phonetic: '/ɪkˈsaɪtɪŋ/', example_en: 'The roller coaster ride was very exciting.', example_vi: 'Trò tàu lượn siêu tốc rất sôi động và hào hứng.' },
      { id: 'l5_u19_fantastic', en: 'fantastic', vi: 'tuyệt vời', emoji: '🌟', phonetic: '/fænˈtæstɪk/', example_en: 'We had a fantastic trip in Hue.', example_vi: 'Chúng tôi đã có một chuyến đi tuyệt vời ở Huế.' },
      { id: 'l5_u19_peaceful', en: 'peaceful', vi: 'yên bình', emoji: '🕊️', phonetic: '/ˈpiːsfl/', example_en: 'The countryside is quiet and peaceful.', example_vi: 'Vùng nông thôn rất yên tĩnh và thanh bình.' },
      { id: 'l5_u19_twenty_nine', en: 'twenty-nine (29)', vi: 'hai mươi chín', emoji: '🔢', phonetic: '/ˌtwenti ˈnaɪn/', example_en: 'There are twenty-nine days in February this leap year.', example_vi: 'Có hai mươi chín ngày trong tháng Hai năm nhuận này.' },
      { id: 'l5_u19_forty', en: 'forty (40)', vi: 'bốn mươi', emoji: '🔢', phonetic: '/ˈfɔːrti/', example_en: 'There are forty books on the shelf.', example_vi: 'Có bốn mươi cuốn sách trên giá.' },
      { id: 'l5_u19_one_hundred', en: 'one hundred (100)', vi: 'một trăm', emoji: '💯', phonetic: '/wʌn ˈhʌndrəd/', example_en: 'He scored one hundred points in the test.', example_vi: 'Cậu ấy đạt một trăm điểm trong bài kiểm tra.' },
      { id: 'l5_u19_one_hundred_twenty_nine', en: 'one hundred and twenty-nine (129)', vi: 'một trăm hai mươi chín', emoji: '🔢', phonetic: '/wʌn ˈhʌndrəd ənd ˌtwenti ˈnaɪn/', example_en: 'The ticket costs one hundred and twenty-nine thousand dong.', example_vi: 'Vé tàu có giá một trăm hai mươi chín nghìn đồng.' },
    ],
  },

  // ── UNIT 20 ─────────────────────────────
  {
    id: 'lop5_unit20',
    gradeId: 'lop5',
    name_vi: 'Unit 20: Kỳ Nghỉ Hè Của Chúng Tôi',
    name_en: 'Our summer holidays',
    emoji: '🌴',
    color: 'from-emerald-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-cyan-100',
    words: [
      { id: 'l5_u20_dam_sen', en: 'Dam Sen Aquarium', vi: 'Thủy cung Đầm Sen', emoji: '🐬', phonetic: '/dɑːm sɛn əˈkweəriəm/', example_en: 'We saw rare turtles at Dam Sen Aquarium.', example_vi: 'Chúng tôi thấy những chú rùa quý ở Thủy cung Đầm Sen.' },
      { id: 'l5_u20_huong_river', en: 'Huong River', vi: 'Sông Hương', emoji: '🌊', phonetic: '/hwʌŋ ˈrɪvər/', example_en: 'We listened to folk songs on the Huong River.', example_vi: 'Chúng tôi nghe ca Huế trên Sông Hương.' },
      { id: 'l5_u20_phong_nha', en: 'Phong Nha Cave', vi: 'Động Phong Nha', emoji: '🏔️', phonetic: '/fɒŋ njɑː keɪv/', example_en: 'Phong Nha Cave is a wonderful natural wonder.', example_vi: 'Động Phong Nha là một kỳ quan thiên nhiên kỳ vĩ.' },
      { id: 'l5_u20_phu_quoc', en: 'Phu Quoc Island', vi: 'Đảo Phú Quốc', emoji: '🏝️', phonetic: '/fuː kwɒk ˈaɪlənd/', example_en: 'Phu Quoc Island has white sandy beaches.', example_vi: 'Đảo Phú Quốc có những bãi cát trắng trải dài.' },
      { id: 'l5_u20_go_camping', en: 'go camping', vi: 'đi cắm trại', emoji: '⛺', phonetic: '/ɡoʊ ˈkæmpɪŋ/', example_en: 'We go camping in the forest in July.', example_vi: 'Chúng tôi đi cắm trại trong rừng vào tháng Bảy.' },
      { id: 'l5_u20_music_club', en: 'join a music club', vi: 'tham gia câu lạc bộ âm nhạc', emoji: '🎸', phonetic: '/dʒɔɪn ə ˈmjuːzɪk klʌb/', example_en: 'She will join a music club this summer.', example_vi: 'Cô ấy sẽ tham gia một câu lạc bộ âm nhạc vào mùa hè này.' },
      { id: 'l5_u20_swimming', en: 'practise swimming', vi: 'luyện tập bơi', emoji: '🏊', phonetic: '/ˈpræktɪs ˈswɪmɪŋ/', example_en: 'Boys and girls practise swimming to stay safe.', example_vi: 'Các bạn nhỏ luyện tập bơi để giữ an toàn dưới nước.' },
      { id: 'l5_u20_eco_farm', en: 'visit an eco-farm', vi: 'thăm trang trại sinh thái', emoji: '🐄', phonetic: '/ˈvɪzɪt ən ˈiːkoʊ fɑːrm/', example_en: 'We visit an eco-farm and harvest strawberries.', example_vi: 'Chúng tôi đi thăm trang trại sinh thái và thu hoạch dâu tây.' },
    ],
  },
];

const generatedCode = '  // ════════════════════════════════════════\n' +
  '  // LỚP 5 – SGK Tiếng Anh 5 Global Success (Tập 1 & Tập 2 - 20 Units)\n' +
  '  // ════════════════════════════════════════\n' +
  lop5Units.map(unit => {
    return '  {\n' +
      `    id: '${unit.id}',\n` +
      `    gradeId: '${unit.gradeId}',\n` +
      `    name_vi: '${unit.name_vi}',\n` +
      `    name_en: '${unit.name_en}',\n` +
      `    emoji: '${unit.emoji}',\n` +
      `    color: '${unit.color}',\n` +
      `    gradient: '${unit.gradient}',\n` +
      '    words: [\n' +
      unit.words.map(w => {
        const enEsc = w.en.replace(/'/g, "\\'");
        const viEsc = w.vi.replace(/'/g, "\\'");
        const exEnEsc = w.example_en.replace(/'/g, "\\'");
        const exViEsc = w.example_vi.replace(/'/g, "\\'");
        return `      { id: '${w.id}', en: '${enEsc}', vi: '${viEsc}', emoji: '${w.emoji}', phonetic: '${w.phonetic}', example_en: '${exEnEsc}', example_vi: '${exViEsc}' },`;
      }).join('\n') +
      '\n    ],\n  },';
  }).join('\n\n');

fs.writeFileSync('d:/engl/vocakids/scratch/lop5_code.ts', generatedCode, 'utf-8');
console.log('Successfully generated scratch/lop5_code.ts. Total units: ' + lop5Units.length);
