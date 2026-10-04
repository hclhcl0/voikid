import fs from 'fs';

export const LOP2_CATEGORIES = [
  // ════════════════════════════════════════
  // LỚP 2: PHẦN 1 - 16 UNITS SGK GLOBAL SUCCESS
  // ════════════════════════════════════════

  // ── UNIT 1: AT MY BIRTHDAY PARTY ────────
  {
    id: 'lop2_unit1',
    gradeId: 'lop2',
    name_vi: 'Unit 1: Tại Bữa Tiệc Sinh Nhật',
    name_en: 'Unit 1: At My Birthday Party',
    emoji: '🍕',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'lop2_u1_pasta',   en: 'Pasta',   vi: 'Mì Ý',       emoji: '🍝', phonetic: '/ˈpæstə/',   example_en: 'I eat pasta with tomato sauce.',         example_vi: 'Tôi ăn mì Ý với sốt cà chua.' },
      { id: 'lop2_u1_popcorn', en: 'Popcorn', vi: 'Bỏng ngô',   emoji: '🍿', phonetic: '/ˈpɒpkɔːn/', example_en: 'The popcorn is warm and yummy.',          example_vi: 'Bỏng ngô ấm nóng và ngon tuyệt.' },
      { id: 'lop2_u1_pizza',   en: 'Pizza',   vi: 'Bánh pizza', emoji: '🍕', phonetic: '/ˈpiːtsə/',  example_en: 'We share a cheese pizza at the party.',  example_vi: 'Chúng mình cùng chia nhau bánh pizza phô mai ở bữa tiệc.' },
    ],
  },

  // ── UNIT 2: IN THE BACKYARD ────────────
  {
    id: 'lop2_unit2',
    gradeId: 'lop2',
    name_vi: 'Unit 2: Trong Sân Sau Nhà',
    name_en: 'Unit 2: In the Backyard',
    emoji: '🪁',
    color: 'from-lime-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-lime-100 to-emerald-100',
    words: [
      { id: 'lop2_u2_kite',   en: 'Kite',   vi: 'Con diều',  emoji: '🪁', phonetic: '/kaɪt/',   example_en: 'Is she flying a kite in the backyard?',   example_vi: 'Cô ấy đang thả diều trong sân sau phải không?' },
      { id: 'lop2_u2_bike',   en: 'Bike',   vi: 'Xe đạp',    emoji: '🚲', phonetic: '/baɪk/',   example_en: 'I ride my bike every afternoon.',         example_vi: 'Tôi đạp xe đạp mỗi buổi chiều.' },
      { id: 'lop2_u2_kitten', en: 'Kitten', vi: 'Mèo con',   emoji: '🐱', phonetic: '/ˈkɪtn/',  example_en: 'The cute kitten is playing with a ball.', example_vi: 'Chú mèo con dễ thương đang chơi với quả bóng.' },
    ],
  },

  // ── UNIT 3: AT THE SEASIDE ─────────────
  {
    id: 'lop2_unit3',
    gradeId: 'lop2',
    name_vi: 'Unit 3: Ở Bờ Biển',
    name_en: 'Unit 3: At the Seaside',
    emoji: '🏖️',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'lop2_u3_sail', en: 'Sail', vi: 'Cánh buồm', emoji: '⛵', phonetic: '/seɪl/', example_en: 'The white sail moves in the sea wind.',   example_vi: 'Cánh buồm trắng lướt đi trong gió biển.' },
      { id: 'lop2_u3_sand', en: 'Sand', vi: 'Bãi cát',   emoji: '🏖️', phonetic: '/sænd/', example_en: 'The yellow sand is soft and warm.',         example_vi: 'Bãi cát vàng mềm mại và ấm áp.' },
      { id: 'lop2_u3_sea',  en: 'Sea',  vi: 'Biển',      emoji: '🌊', phonetic: '/siː/',  example_en: "Let's look at the blue sea!",               example_vi: 'Hãy cùng nhìn ra biển xanh nào!' },
    ],
  },

  // ── UNIT 4: IN THE COUNTRYSIDE ─────────
  {
    id: 'lop2_unit4',
    gradeId: 'lop2',
    name_vi: 'Unit 4: Ở Vùng Nông Thôn',
    name_en: 'Unit 4: In the Countryside',
    emoji: '🌈',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'lop2_u4_rainbow', en: 'Rainbow', vi: 'Cầu vồng',  emoji: '🌈', phonetic: '/ˈreɪnbəʊ/', example_en: 'I can see a colourful rainbow in the sky.', example_vi: 'Tôi có thể thấy một chiếc cầu vồng rực rỡ trên bầu trời.' },
      { id: 'lop2_u4_river',   en: 'River',   vi: 'Dòng sông', emoji: '🏞️', phonetic: '/ˈrɪvər/',   example_en: 'The river flows gently through the village.',example_vi: 'Dòng sông êm đềm chảy qua ngôi làng.' },
      { id: 'lop2_u4_road',    en: 'Road',    vi: 'Con đường', emoji: '🛣️', phonetic: '/rəʊd/',    example_en: 'The quiet road leads to our farmhouse.',     example_vi: 'Con đường yên tĩnh dẫn tới trang trại của chúng tôi.' },
    ],
  },

  // ── UNIT 5: IN THE CLASSROOM ───────────
  {
    id: 'lop2_unit5',
    gradeId: 'lop2',
    name_vi: 'Unit 5: Trong Lớp Học',
    name_en: 'Unit 5: In the Classroom',
    emoji: '📐',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'lop2_u5_question', en: 'Question', vi: 'Câu hỏi',                  emoji: '❓', phonetic: '/ˈkwestʃən/', example_en: 'Raise your hand to ask a question.',      example_vi: 'Hãy giơ tay khi muốn đặt câu hỏi.' },
      { id: 'lop2_u5_square',   en: 'Square',   vi: 'Hình vuông',                emoji: '⏹️', phonetic: '/skweər/',   example_en: 'She draws a neat square on the paper.',    example_vi: 'Bạn ấy vẽ một hình vuông gọn gàng trên giấy.' },
      { id: 'lop2_u5_quiz',     en: 'Quiz',     vi: 'Bài kiểm tra / Câu đố vui', emoji: '📝', phonetic: '/kwɪz/',     example_en: "He is doing a fun English quiz.",          example_vi: 'Cậu ấy đang làm một bài câu đố tiếng Anh vui nhộn.' },
    ],
  },

  // ── UNIT 6: ON THE FARM ────────────────
  {
    id: 'lop2_unit6',
    gradeId: 'lop2',
    name_vi: 'Unit 6: Ở Trang Trại',
    name_en: 'Unit 6: On the Farm',
    emoji: '🦊',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'lop2_u6_box', en: 'Box', vi: 'Cái hộp',    emoji: '📦', phonetic: '/bɒks/', example_en: 'There is a wooden box on the farm.',      example_vi: 'Có một chiếc hộp gỗ ở trang trại.' },
      { id: 'lop2_u6_fox', en: 'Fox', vi: 'Con cáo',    emoji: '🦊', phonetic: '/fɒks/', example_en: 'The clever fox is hiding behind the tree.',example_vi: 'Con cáo thông minh đang trốn sau gốc cây.' },
      { id: 'lop2_u6_ox',  en: 'Ox',  vi: 'Con bò đực', emoji: '🐂', phonetic: '/ɒks/',  example_en: 'The strong ox is resting in the field.',    example_vi: 'Con bò đực khỏe mạnh đang nghỉ ngơi trên cánh đồng.' },
    ],
  },

  // ── UNIT 7: IN THE KITCHEN ─────────────
  {
    id: 'lop2_unit7',
    gradeId: 'lop2',
    name_vi: 'Unit 7: Trong Căn Bếp',
    name_en: 'Unit 7: In the Kitchen',
    emoji: '🧃',
    color: 'from-orange-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-rose-100',
    words: [
      { id: 'lop2_u7_juice', en: 'Juice', vi: 'Nước ép',        emoji: '🧃', phonetic: '/dʒuːs/',  example_en: 'I like sweet orange juice.',          example_vi: 'Tôi thích uống nước cam ngọt ngào.' },
      { id: 'lop2_u7_jelly', en: 'Jelly', vi: 'Thạch trái cây', emoji: '🍮', phonetic: '/ˈdʒeli/', example_en: 'The strawberry jelly is sweet and cool.',example_vi: 'Món thạch dâu tây ngọt ngào và mát lạnh.' },
      { id: 'lop2_u7_jam',   en: 'Jam',   vi: 'Mứt hoa quả',    emoji: '🍓', phonetic: '/dʒæm/',   example_en: 'Pass me the strawberry jam, please.',   example_vi: 'Làm ơn chuyền cho mình lọ mứt dâu tây với.' },
    ],
  },

  // ── UNIT 8: IN THE VILLAGE ─────────────
  {
    id: 'lop2_unit8',
    gradeId: 'lop2',
    name_vi: 'Unit 8: Ở Trong Làng',
    name_en: 'Unit 8: In the Village',
    emoji: '🏡',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    words: [
      { id: 'lop2_u8_village',    en: 'Village',    vi: 'Ngôi làng',          emoji: '🏡', phonetic: '/ˈvɪlɪdʒ/',   example_en: 'Our village is peaceful and green.',       example_vi: 'Ngôi làng của chúng tôi rất thanh bình và xanh mát.' },
      { id: 'lop2_u8_van',        en: 'Van',        vi: 'Xe bán tải / Xe van',emoji: '🚐', phonetic: '/væn/',       example_en: 'Can you draw a blue van?',                 example_vi: 'Bạn có thể vẽ một chiếc xe bán tải màu xanh không?' },
      { id: 'lop2_u8_volleyball', en: 'Volleyball', vi: 'Môn bóng chuyền',    emoji: '🏐', phonetic: '/ˈvɒlibɔːl/', example_en: 'The children play volleyball together.',    example_vi: 'Các bạn nhỏ cùng chơi bóng chuyền với nhau.' },
    ],
  },

  // ── UNIT 9: IN THE GROCERY STORE ───────
  {
    id: 'lop2_unit9',
    gradeId: 'lop2',
    name_vi: 'Unit 9: Cửa Hàng Tạp Hóa',
    name_en: 'Unit 9: In the Grocery Store',
    emoji: '🛒',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'lop2_u9_yogurt', en: 'Yogurt', vi: 'Sữa chua',          emoji: '🥛', phonetic: '/ˈjɒɡət/',  example_en: 'I love fresh strawberry yogurt.',      example_vi: 'Tôi rất thích sữa chua dâu tây tươi ngon.' },
      { id: 'lop2_u9_yams',   en: 'Yams',   vi: 'Củ khoai / Củ từ',   emoji: '🍠', phonetic: '/jæmz/',    example_en: 'Mother bought some sweet yams today.', example_vi: 'Hôm nay mẹ đã mua một vài củ khoai ngọt.' },
      { id: 'lop2_u9_yoyos',  en: 'Yo-yos', vi: 'Con quay Yo-yo',     emoji: '🪀', phonetic: '/ˈjəʊjəʊz/',example_en: 'He has two colourful yo-yos.',         example_vi: 'Cậu ấy có hai con quay yo-yo sặc sỡ.' },
    ],
  },

  // ── UNIT 10: AT THE ZOO ────────────────
  {
    id: 'lop2_unit10',
    gradeId: 'lop2',
    name_vi: 'Unit 10: Ở Sở Thú',
    name_en: 'Unit 10: At the Zoo',
    emoji: '🦓',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'lop2_u10_zoo',   en: 'Zoo',   vi: 'Sở thú',       emoji: '🦒', phonetic: '/zuː/',    example_en: 'Do you like visiting the zoo?',              example_vi: 'Bạn có thích đi thăm sở thú không?' },
      { id: 'lop2_u10_zebu',  en: 'Zebu',  vi: 'Con bò u',     emoji: '🐂', phonetic: '/ˈziːbuː/',example_en: 'A zebu has a big hump on its back.',         example_vi: 'Con bò u có một cái bướu lớn trên lưng.' },
      { id: 'lop2_u10_zebra', en: 'Zebra', vi: 'Con ngựa vằn', emoji: '🦓', phonetic: '/ˈzebrə/', example_en: 'The zebra has black and white stripes.',      example_vi: 'Con ngựa vằn có những sọc đen và trắng.' },
    ],
  },

  // ── UNIT 11: IN THE PLAYGROUND ─────────
  {
    id: 'lop2_unit11',
    gradeId: 'lop2',
    name_vi: 'Unit 11: Ở Sân Chơi',
    name_en: 'Unit 11: In the Playground',
    emoji: '🛝',
    color: 'from-cyan-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'lop2_u11_sliding', en: 'Sliding', vi: 'Đang trượt',    emoji: '🛝', phonetic: '/ˈslaɪdɪŋ/', example_en: 'The boy is sliding down happily.',             example_vi: 'Cậu bé đang trượt xuống một cách vui vẻ.' },
      { id: 'lop2_u11_riding',  en: 'Riding',  vi: 'Đang đi xe đạp',emoji: '🚲', phonetic: '/ˈraɪdɪŋ/',  example_en: 'She is riding a new bicycle in the park.',     example_vi: 'Cô bé đang đạp một chiếc xe đạp mới trong công viên.' },
      { id: 'lop2_u11_driving', en: 'Driving', vi: 'Đang lái xe',   emoji: '🚗', phonetic: '/ˈdraɪvɪŋ/', example_en: 'They are driving toy cars in the playground.',  example_vi: 'Họ đang lái xe ô tô đồ chơi trong sân chơi.' },
    ],
  },

  // ── UNIT 12: AT THE CAFÉ ───────────────
  {
    id: 'lop2_unit12',
    gradeId: 'lop2',
    name_vi: 'Unit 12: Ở Quán Cà Phê',
    name_en: 'Unit 12: At the Café',
    emoji: '🍰',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'lop2_u12_grapes', en: 'Grapes', vi: 'Những quả nho', emoji: '🍇', phonetic: '/ɡreɪps/', example_en: 'These purple grapes are very sweet.',    example_vi: 'Những quả nho tím này rất ngọt.' },
      { id: 'lop2_u12_cake',   en: 'Cake',   vi: 'Bánh ngọt',     emoji: '🍰', phonetic: '/keɪk/',   example_en: 'The cake is on the table.',                example_vi: 'Bánh ngọt ở trên bàn.' },
      { id: 'lop2_u12_table',  en: 'Table',  vi: 'Cái bàn',       emoji: '🪑', phonetic: '/ˈteɪbl/',  example_en: 'Sit at the small table, please.',          example_vi: 'Mời bạn ngồi vào chiếc bàn nhỏ nhé.' },
    ],
  },

  // ── UNIT 13: IN THE MATHS CLASS ────────
  {
    id: 'lop2_unit13',
    gradeId: 'lop2',
    name_vi: 'Unit 13: Giờ Học Toán',
    name_en: 'Unit 13: In the Maths Class',
    emoji: '🔢',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'lop2_u13_eleven',   en: 'Eleven',   vi: 'Số 11', emoji: '1️⃣1️⃣', phonetic: '/ɪˈlevn/',   example_en: 'What number is it? – It is eleven.',      example_vi: 'Đó là số mấy? – Đó là số 11.' },
      { id: 'lop2_u13_thirteen', en: 'Thirteen', vi: 'Số 13', emoji: '1️⃣3️⃣', phonetic: '/ˌθɜːˈtiːn/', example_en: 'There are thirteen pencils in the box.',   example_vi: 'Có mười ba chiếc bút chì trong hộp.' },
      { id: 'lop2_u13_fourteen', en: 'Fourteen', vi: 'Số 14', emoji: '1️⃣4️⃣', phonetic: '/ˌfɔːˈtiːn/', example_en: 'She counted fourteen little stars.',       example_vi: 'Cô bé đã đếm được mười bốn ngôi sao nhỏ.' },
      { id: 'lop2_u13_fifteen',  en: 'Fifteen',  vi: 'Số 15', emoji: '1️⃣5️⃣', phonetic: '/ˌfɪfˈtiːn/', example_en: 'We have fifteen minutes of playtime.',       example_vi: 'Chúng mình có mười lăm phút giờ ra chơi.' },
    ],
  },

  // ── UNIT 14: AT HOME ───────────────────
  {
    id: 'lop2_unit14',
    gradeId: 'lop2',
    name_vi: 'Unit 14: Ở Nhà',
    name_en: 'Unit 14: At Home',
    emoji: '👨‍👩‍👦',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'lop2_u14_brother',     en: 'Brother',     vi: 'Anh / Em trai', emoji: '👦', phonetic: '/ˈbrʌðər/',    example_en: 'How old is your brother? – He is nineteen.',example_vi: 'Anh trai bạn bao nhiêu tuổi? – Anh ấy mười chín tuổi.' },
      { id: 'lop2_u14_sister',      en: 'Sister',      vi: 'Chị / Em gái',  emoji: '👧', phonetic: '/ˈsɪstər/',    example_en: 'My sister loves listening to music.',      example_vi: 'Chị gái tôi rất thích nghe nhạc.' },
      { id: 'lop2_u14_grandmother', en: 'Grandmother', vi: 'Bà',            emoji: '👵', phonetic: '/ˈɡrænmʌðər/',example_en: 'My grandmother tells wonderful stories.',  example_vi: 'Bà tôi kể những câu chuyện tuyệt vời.' },
    ],
  },

  // ── UNIT 15: IN THE CLOTHES SHOP ───────
  {
    id: 'lop2_unit15',
    gradeId: 'lop2',
    name_vi: 'Unit 15: Cửa Hàng Quần Áo',
    name_en: 'Unit 15: In the Clothes Shop',
    emoji: '👕',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'lop2_u15_shirts', en: 'Shirts', vi: 'Những chiếc áo sơ mi', emoji: '👔', phonetic: '/ʃɜːts/', example_en: 'These shirts look very nice and clean.', example_vi: 'Những chiếc áo sơ mi này trông rất đẹp và sạch sẽ.' },
      { id: 'lop2_u15_shoes',  en: 'Shoes',  vi: 'Những đôi giày',        emoji: '👟', phonetic: '/ʃuːz/',  example_en: 'Where are the shoes? – Over there.',     example_vi: 'Những đôi giày ở đâu? – Ở đằng kia kìa.' },
      { id: 'lop2_u15_shorts', en: 'Shorts', vi: 'Những chiếc quần đùi',  emoji: '🩳', phonetic: '/ʃɔːts/', example_en: 'He wears blue shorts in the summer.',   example_vi: 'Cậu ấy mặc quần đùi màu xanh vào mùa hè.' },
    ],
  },

  // ── UNIT 16: AT THE CAMPSITE ───────────
  {
    id: 'lop2_unit16',
    gradeId: 'lop2',
    name_vi: 'Unit 16: Điểm Cắm Trại',
    name_en: 'Unit 16: At the Campsite',
    emoji: '⛺',
    color: 'from-emerald-500 to-green-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'lop2_u16_tent',    en: 'Tent',    vi: 'Cái lều',           emoji: '⛺', phonetic: '/tent/',    example_en: "It is in the tent.",                         example_vi: 'Nó ở trong chiếc lều.' },
      { id: 'lop2_u16_teapot',  en: 'Teapot',  vi: 'Ấm pha trà',        emoji: '🫖', phonetic: '/ˈtiːpɒt/', example_en: 'Grandpa pours warm tea from the teapot.',   example_vi: 'Ông rót trà ấm từ chiếc ấm trà.' },
      { id: 'lop2_u16_blanket', en: 'Blanket', vi: 'Cái chăn / Mền ấm', emoji: '🛋️', phonetic: '/ˈblæŋkɪt/',example_en: 'Is the blanket near the tent? – No, it is in the tent.', example_vi: 'Cái chăn có ở gần lều không? – Không, nó ở trong lều.' },
    ],
  },

  // ════════════════════════════════════════
  // LỚP 2: PHẦN 2 - 9 CHỦ ĐỀ MỞ RỘNG (CHO BÉ 7 TUỔI)
  // ════════════════════════════════════════

  // ── CHỦ ĐỀ 1: BỮA TIỆC & ĐỒ ĂN NGỌT ────
  {
    id: 'lop2_ext_party',
    gradeId: 'lop2',
    name_vi: 'Bữa Tiệc & Đồ Ngọt',
    name_en: 'Party & Sweet Food',
    emoji: '🎉',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'lop2_ep_birthday',  en: 'Birthday',   vi: 'Sinh nhật',          emoji: '🎂', phonetic: '/ˈbɜːθdeɪ/',   example_en: 'Today is my seventh birthday!',          example_vi: 'Hôm nay là sinh nhật lần thứ bảy của mình!' },
      { id: 'lop2_ep_party',     en: 'Party',      vi: 'Bữa tiệc',           emoji: '🎈', phonetic: '/ˈpɑːti/',     example_en: 'Welcome to our fun birthday party!',     example_vi: 'Chào mừng các bạn đến với bữa tiệc sinh nhật vui vẻ!' },
      { id: 'lop2_ep_candle',    en: 'Candle',     vi: 'Cây nến',            emoji: '🕯️', phonetic: '/ˈkændl/',    example_en: 'Blow out the candle on the cake.',        example_vi: 'Hãy thổi tắt cây nến trên bánh nhé.' },
      { id: 'lop2_ep_balloon',   en: 'Balloon',    vi: 'Quả bóng bay',       emoji: '🎈', phonetic: '/bəˈluːn/',    example_en: 'The red balloon flies high into the sky.',example_vi: 'Quả bóng bay đỏ bay vút lên bầu trời.' },
      { id: 'lop2_ep_gift',      en: 'Gift',       vi: 'Món quà',            emoji: '🎁', phonetic: '/ɡɪft/',       example_en: 'I received a nice gift from my friend.',  example_vi: 'Tôi nhận được một món quà đẹp từ bạn mình.' },
      { id: 'lop2_ep_icecream',  en: 'Ice cream',  vi: 'Kem lạnh',           emoji: '🍦', phonetic: '/ˌaɪs ˈkriːm/',example_en: 'I want a delicious chocolate ice cream.', example_vi: 'Mình muốn một cây kem sô-cô-la thơm ngon.' },
      { id: 'lop2_ep_chocolate', en: 'Chocolate',  vi: 'Sô-cô-la',           emoji: '🍫', phonetic: '/ˈtʃɒklət/',   example_en: 'Dark chocolate is sweet and rich.',       example_vi: 'Sô-cô-la đen ngọt ngào và béo ngậy.' },
      { id: 'lop2_ep_candy',     en: 'Candy',      vi: 'Viên kẹo',           emoji: '🍬', phonetic: '/ˈkændi/',     example_en: "Don't eat too much candy before bed.",    example_vi: 'Đừng ăn quá nhiều kẹo trước khi đi ngủ nhé.' },
      { id: 'lop2_ep_sweet',     en: 'Sweet',      vi: 'Đồ ngọt / Ngọt ngào',emoji: '🍭', phonetic: '/swiːt/',      example_en: 'These cookies taste very sweet.',         example_vi: 'Những chiếc bánh quy này có vị rất ngọt.' },
      { id: 'lop2_ep_clown',     en: 'Clown',      vi: 'Chú hề',             emoji: '🤡', phonetic: '/klaʊn/',      example_en: 'The funny clown makes us laugh.',         example_vi: 'Chú hề vui tính làm chúng mình bật cười.' },
    ],
  },

  // ── CHỦ ĐỀ 2: HOẠT ĐỘNG & ĐỒ VẬT Ở BIỂN ─
  {
    id: 'lop2_ext_beach',
    gradeId: 'lop2',
    name_vi: 'Biển & Bờ Biển',
    name_en: 'Seaside & Beach',
    emoji: '🏖️',
    color: 'from-cyan-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-teal-100',
    words: [
      { id: 'lop2_eb_sandcastle', en: 'Sandcastle', vi: 'Lâu đài cát',      emoji: '🏰', phonetic: '/ˈsændkɑːsl/', example_en: 'We build a giant sandcastle together.',     example_vi: 'Chúng mình cùng nhau xây một lâu đài cát khổng lồ.' },
      { id: 'lop2_eb_seashell',   en: 'Seashell',   vi: 'Vỏ sò / Vỏ ốc',    emoji: '🐚', phonetic: '/ˈsiːʃel/',    example_en: 'Look at this pretty pink seashell!',        example_vi: 'Hãy nhìn chiếc vỏ sò màu hồng xinh xắn này kìa!' },
      { id: 'lop2_eb_wave',       en: 'Wave',       vi: 'Sóng biển',        emoji: '🌊', phonetic: '/weɪv/',       example_en: 'The ocean waves crash onto the shore.',     example_vi: 'Những con sóng biển xô vào bờ cát.' },
      { id: 'lop2_eb_sunglasses', en: 'Sunglasses', vi: 'Kính râm',         emoji: '🕶️', phonetic: '/ˈsʌnɡlɑːsɪz/',example_en: 'Wear sunglasses to protect your eyes.',      example_vi: 'Hãy đeo kính râm để bảo vệ mắt nhé.' },
      { id: 'lop2_eb_swimsuit',   en: 'Swimsuit',   vi: 'Đồ bơi',           emoji: '🩱', phonetic: '/ˈswɪmsuːt/',   example_en: 'Put on your swimsuit and let us swim.',     example_vi: 'Hãy mặc đồ bơi vào và cùng đi bơi nào.' },
      { id: 'lop2_eb_towel',      en: 'Towel',      vi: 'Khăn tắm',         emoji: '🧣', phonetic: '/ˈtaʊəl/',     example_en: 'Dry yourself with a big blue towel.',       example_vi: 'Hãy lau khô người bằng chiếc khăn tắm to màu xanh nhé.' },
      { id: 'lop2_eb_seagull',    en: 'Seagull',    vi: 'Chim hải âu',      emoji: '🕊️', phonetic: '/ˈsiːɡʌl/',    example_en: 'A white seagull flies above the waves.',    example_vi: 'Một chú chim hải âu trắng bay lượn trên những ngọn sóng.' },
      { id: 'lop2_eb_picnic',     en: 'Picnic',     vi: 'Chuyến dã ngoại',  emoji: '🧺', phonetic: '/ˈpɪknɪk/',    example_en: 'We have a seaside picnic on sunny days.',   example_vi: 'Chúng mình có chuyến dã ngoại bên bờ biển vào ngày nắng đẹp.' },
    ],
  },

  // ── CHỦ ĐỀ 3: TRANG TRẠI & ĐỘNG VẬT NÔNG THÔN ─
  {
    id: 'lop2_ext_farm',
    gradeId: 'lop2',
    name_vi: 'Trang Trại & Động Vật',
    name_en: 'Farm & Country Animals',
    emoji: '🌾',
    color: 'from-amber-400 to-green-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-green-100',
    words: [
      { id: 'lop2_ef_farm',    en: 'Farm',    vi: 'Trang trại',         emoji: '🚜', phonetic: '/fɑːm/',    example_en: 'My uncle works on a large vegetable farm.',   example_vi: 'Bác tôi làm việc tại một trang trại rau rộng lớn.' },
      { id: 'lop2_ef_barn',    en: 'Barn',    vi: 'Nhà kho nông trại',  emoji: '🏚️', phonetic: '/bɑːn/',    example_en: 'The animals sleep safely inside the barn.',   example_vi: 'Các con vật ngủ an toàn bên trong nhà kho.' },
      { id: 'lop2_ef_field',   en: 'Field',   vi: 'Cánh đồng',          emoji: '🌾', phonetic: '/fiːld/',   example_en: 'Green grass grows all over the field.',       example_vi: 'Cỏ xanh mọc khắp cánh đồng.' },
      { id: 'lop2_ef_cow',     en: 'Cow',     vi: 'Con bò sữa',         emoji: '🐄', phonetic: '/kaʊ/',     example_en: 'The spotted cow gives us fresh milk.',        example_vi: 'Con bò khoang cho chúng mình sữa tươi thơm ngon.' },
      { id: 'lop2_ef_sheep',   en: 'Sheep',   vi: 'Con cừu',            emoji: '🐑', phonetic: '/ʃiːp/',    example_en: 'The fluffy white sheep is eating grass.',     example_vi: 'Chú cừu trắng lông xù đang thong thả ăn cỏ.' },
      { id: 'lop2_ef_goat',    en: 'Goat',    vi: 'Con dê',             emoji: '🐐', phonetic: '/ɡəʊt/',    example_en: 'The little goat climbs up the rocky hill.',   example_vi: 'Chú dê nhỏ leo thoăn thoắt lên ngọn đồi đá.' },
      { id: 'lop2_ef_horse',   en: 'Horse',   vi: 'Con ngựa',           emoji: '🐎', phonetic: '/hɔːs/',    example_en: 'The brown horse runs fast across the pasture.',example_vi: 'Chú ngựa nâu phi nhanh qua đồng cỏ.' },
      { id: 'lop2_ef_pig',     en: 'Pig',     vi: 'Con heo / Con lợn',  emoji: '🐖', phonetic: '/pɪɡ/',     example_en: 'The chubby pink pig loves playing in the mud.',example_vi: 'Chú lợn hồng mập mạp rất thích nghịch bùn.' },
      { id: 'lop2_ef_rooster', en: 'Rooster', vi: 'Con gà trống',       emoji: '🐓', phonetic: '/ˈruːstər/',example_en: 'The rooster crows loudly every early morning.',example_vi: 'Chú gà trống gáy vang vào mỗi sớm mai.' },
      { id: 'lop2_ef_duck',    en: 'Duck',    vi: 'Con vịt',            emoji: '🦆', phonetic: '/dʌk/',     example_en: 'The yellow duck swims cheerfully in the pond.',example_vi: 'Chú vịt vàng bơi lội tung tăng trong ao.' },
    ],
  },

  // ── CHỦ ĐỀ 4: CẢM XÚC CƠ BẢN ───────────
  {
    id: 'lop2_ext_emotions',
    gradeId: 'lop2',
    name_vi: 'Cảm Xúc Của Bé',
    name_en: 'Feelings & Emotions',
    emoji: '😊',
    color: 'from-yellow-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    words: [
      { id: 'lop2_ee_happy',     en: 'Happy',     vi: 'Vui vẻ / Hạnh phúc',emoji: '😊', phonetic: '/ˈhæpi/',    example_en: 'I am happy when I see my good friends.',   example_vi: 'Tôi rất vui vẻ khi gặp lại những người bạn tốt.' },
      { id: 'lop2_ee_sad',       en: 'Sad',       vi: 'Buồn bã',           emoji: '😢', phonetic: '/sæd/',     example_en: 'Do not be sad, everything will be fine.',   example_vi: 'Đừng buồn nhé, mọi chuyện rồi sẽ ổn thôi.' },
      { id: 'lop2_ee_angry',     en: 'Angry',     vi: 'Tức giận',          emoji: '😠', phonetic: '/ˈæŋɡri/',   example_en: 'Take a deep breath when you feel angry.',  example_vi: 'Hãy hít thở sâu khi bạn cảm thấy tức giận.' },
      { id: 'lop2_ee_tired',     en: 'Tired',     vi: 'Mệt mỏi',           emoji: '🥱', phonetic: '/ˈtaɪəd/',   example_en: 'I feel tired after running around.',        example_vi: 'Tôi cảm thấy mệt mỏi sau khi chạy nhảy.' },
      { id: 'lop2_ee_hungry',    en: 'Hungry',    vi: 'Đói bụng',          emoji: '😋', phonetic: '/ˈhʌŋɡri/',  example_en: 'I am hungry, let us eat dinner together.', example_vi: 'Mình đói bụng rồi, chúng mình cùng ăn tối nhé.' },
      { id: 'lop2_ee_thirsty',   en: 'Thirsty',   vi: 'Khát nước',         emoji: '🥤', phonetic: '/ˈθɜːsti/',  example_en: 'Drink clean water when you are thirsty.',   example_vi: 'Hãy uống nước sạch khi bạn thấy khát nhé.' },
      { id: 'lop2_ee_scared',    en: 'Scared',    vi: 'Sợ hãi',            emoji: '😨', phonetic: '/skeəd/',    example_en: 'He was scared of the loud thunder sound.',  example_vi: 'Cậu ấy từng thấy sợ hãi âm thanh sấm sét lớn.' },
      { id: 'lop2_ee_surprised', en: 'Surprised', vi: 'Ngạc nhiên',        emoji: '😲', phonetic: '/səˈpraɪzd/',example_en: 'She was surprised by the nice gift.',       example_vi: 'Cô bé vô cùng ngạc nhiên vì món quà xinh xắn.' },
    ],
  },

  // ── CHỦ ĐỀ 5: THỜI TIẾT & THIÊN NHIÊN ──
  {
    id: 'lop2_ext_weather',
    gradeId: 'lop2',
    name_vi: 'Thời Tiết & Thiên Nhiên',
    name_en: 'Weather & Nature',
    emoji: '🌤️',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'lop2_ew_sunny',  en: 'Sunny',  vi: 'Có nắng',       emoji: '☀️', phonetic: '/ˈsʌni/',  example_en: 'It is a sunny day, let us play outside.',    example_vi: 'Hôm nay là một ngày nắng đẹp, hãy ra ngoài chơi nào.' },
      { id: 'lop2_ew_rainy',  en: 'Rainy',  vi: 'Có mưa',        emoji: '🌧️', phonetic: '/ˈreɪni/', example_en: 'Take an umbrella on a rainy day.',           example_vi: 'Hãy mang theo một chiếc ô vào ngày mưa nhé.' },
      { id: 'lop2_ew_windy',  en: 'Windy',  vi: 'Có gió lớn',    emoji: '💨', phonetic: '/ˈwɪndi/', example_en: 'It is windy, look at the dancing trees.',     example_vi: 'Trời có gió lớn, hãy nhìn những hàng cây đang đung đưa kìa.' },
      { id: 'lop2_ew_cloudy', en: 'Cloudy', vi: 'Nhiều mây',     emoji: '☁️', phonetic: '/ˈklaʊdi/',example_en: 'The sky is cloudy this morning.',             example_vi: 'Bầu trời sáng nay có rất nhiều mây.' },
      { id: 'lop2_ew_hot',    en: 'Hot',    vi: 'Nóng nực',      emoji: '🥵', phonetic: '/hɒt/',    example_en: 'Summer days are very hot and bright.',        example_vi: 'Những ngày mùa hè rất nóng nực và chói chang.' },
      { id: 'lop2_ew_cold',   en: 'Cold',   vi: 'Lạnh buốt',     emoji: '🥶', phonetic: '/kəʊld/',  example_en: 'Wear a warm coat when it is cold.',           example_vi: 'Hãy mặc áo ấm khi trời trở lạnh nhé.' },
      { id: 'lop2_ew_sun',    en: 'Sun',    vi: 'Mặt trời',      emoji: '☀️', phonetic: '/sʌn/',    example_en: 'The warm sun rises in the morning.',          example_vi: 'Mặt trời ấm áp mọc vào buổi sớm mai.' },
      { id: 'lop2_ew_cloud',  en: 'Cloud',  vi: 'Đám mây',       emoji: '☁️', phonetic: '/klaʊd/',  example_en: 'Look at that fluffy white cloud!',            example_vi: 'Hãy nhìn đám mây trắng bồng bềnh kìa!' },
      { id: 'lop2_ew_sky',    en: 'Sky',    vi: 'Bầu trời',      emoji: '🌌', phonetic: '/skaɪ/',   example_en: 'The blue sky looks clear and wide.',          example_vi: 'Bầu trời xanh trông thật trong trẻo và rộng lớn.' },
      { id: 'lop2_ew_star',   en: 'Star',   vi: 'Ngôi sao',      emoji: '⭐', phonetic: '/stɑːr/',  example_en: 'A bright star twinkles in the night sky.',    example_vi: 'Một ngôi sao sáng lấp lánh trên bầu trời đêm.' },
    ],
  },

  // ── CHỦ ĐỀ 6: SỐ ĐẾM TỪ 11 ĐẾN 20 ──────
  {
    id: 'lop2_ext_numbers',
    gradeId: 'lop2',
    name_vi: 'Số Đếm 11 Đến 20',
    name_en: 'Numbers 11 to 20',
    emoji: '🔢',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'lop2_en_eleven',    en: 'Eleven',    vi: 'Số 11 (Mười một)',  emoji: '1️⃣1️⃣', phonetic: '/ɪˈlevn/',   example_en: 'I have eleven colored pencils.',        example_vi: 'Tôi có mười một chiếc bút chì màu.' },
      { id: 'lop2_en_twelve',    en: 'Twelve',    vi: 'Số 12 (Mười hai)',  emoji: '1️⃣2️⃣', phonetic: '/twelv/',    example_en: 'There are twelve months in one year.',  example_vi: 'Có mười hai tháng trong một năm.' },
      { id: 'lop2_en_thirteen',  en: 'Thirteen',  vi: 'Số 13 (Mười ba)',   emoji: '1️⃣3️⃣', phonetic: '/ˌθɜːˈtiːn/', example_en: 'She has thirteen storybooks.',          example_vi: 'Cô bé có mười ba cuốn truyện.' },
      { id: 'lop2_en_fourteen',  en: 'Fourteen',  vi: 'Số 14 (Mười bốn)',  emoji: '1️⃣4️⃣', phonetic: '/ˌfɔːˈtiːn/', example_en: 'Fourteen children play in the yard.',   example_vi: 'Mười bốn bạn nhỏ đang chơi trong sân.' },
      { id: 'lop2_en_fifteen',   en: 'Fifteen',   vi: 'Số 15 (Mười lăm)',  emoji: '1️⃣5️⃣', phonetic: '/ˌfɪfˈtiːn/', example_en: 'The clock shows fifteen minutes past.', example_vi: 'Đồng hồ chỉ quá mười lăm phút.' },
      { id: 'lop2_en_sixteen',   en: 'Sixteen',   vi: 'Số 16 (Mười sáu)',  emoji: '1️⃣6️⃣', phonetic: '/ˌsɪksˈtiːn/',example_en: 'He solved sixteen maths problems.',    example_vi: 'Cậu ấy đã giải xong mười sáu bài toán.' },
      { id: 'lop2_en_seventeen', en: 'Seventeen', vi: 'Số 17 (Mười bảy)',  emoji: '1️⃣7️⃣', phonetic: '/ˌsevnˈtiːn/',example_en: 'Seventeen birds sit on the fence.',     example_vi: 'Mười bảy chú chim đậu trên hàng rào.' },
      { id: 'lop2_en_eighteen',  en: 'Eighteen',  vi: 'Số 18 (Mười tám)',  emoji: '1️⃣8️⃣', phonetic: '/ˌeɪˈtiːn/',  example_en: 'My cousin is eighteen years old.',      example_vi: 'Anh họ tôi mười tám tuổi.' },
      { id: 'lop2_en_nineteen',  en: 'Nineteen',  vi: 'Số 19 (Mười chín)', emoji: '1️⃣9️⃣', phonetic: '/ˌnaɪnˈtiːn/',example_en: 'She has nineteen cute stickers.',        example_vi: 'Cô bé có mười chín chiếc nhãn dán xinh xắn.' },
      { id: 'lop2_en_twenty',    en: 'Twenty',    vi: 'Số 20 (Hai mươi)',  emoji: '2️⃣0️⃣', phonetic: '/ˈtwenti/',  example_en: 'There are twenty students in my class.',example_vi: 'Có hai mươi bạn học sinh trong lớp học của tôi.' },
    ],
  },

  // ── CHỦ ĐỀ 7: ĐỒ DÙNG TRONG GIA ĐÌNH ────
  {
    id: 'lop2_ext_household',
    gradeId: 'lop2',
    name_vi: 'Đồ Dùng Gia Đình',
    name_en: 'Household Items',
    emoji: '🛋️',
    color: 'from-amber-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-teal-100',
    words: [
      { id: 'lop2_eh_clock',      en: 'Clock',      vi: 'Đồng hồ treo tường',emoji: '⏰', phonetic: '/klɒk/',      example_en: 'The round clock hangs on the wall.',      example_vi: 'Chiếc đồng hồ tròn treo trên tường.' },
      { id: 'lop2_eh_lamp',       en: 'Lamp',       vi: 'Đèn ngủ / Đèn học', emoji: '💡', phonetic: '/læmp/',      example_en: 'Turn on the reading lamp, please.',       example_vi: 'Làm ơn bật chiếc đèn học lên nhé.' },
      { id: 'lop2_eh_mirror',     en: 'Mirror',     vi: 'Cái gương',         emoji: '🪞', phonetic: '/ˈmɪrər/',    example_en: 'I see my smile in the shiny mirror.',     example_vi: 'Tôi thấy nụ cười của mình trong tấm gương sáng.' },
      { id: 'lop2_eh_sofa',       en: 'Sofa',       vi: 'Ghế sô-pha',        emoji: '🛋️', phonetic: '/ˈsəʊfə/',    example_en: 'Dad is sitting on the soft sofa.',        example_vi: 'Bố đang ngồi trên chiếc ghế sô-pha êm ái.' },
      { id: 'lop2_eh_bed',        en: 'Bed',        vi: 'Cái giường ngủ',    emoji: '🛏️', phonetic: '/bed/',      example_en: 'The cat is sleeping on the bed.',         example_vi: 'Con mèo đang ngủ trên giường.' },
      { id: 'lop2_eh_pillow',     en: 'Pillow',     vi: 'Cái gối',           emoji: '🛌', phonetic: '/ˈpɪləʊ/',    example_en: 'My soft pillow helps me sleep well.',     example_vi: 'Chiếc gối mềm mại giúp tôi ngủ thật ngon.' },
      { id: 'lop2_eh_television', en: 'Television', vi: 'Ti vi',             emoji: '📺', phonetic: '/ˈtelɪvɪʒn/', example_en: 'We watch cartoons on the television.',    example_vi: 'Chúng mình cùng xem hoạt hình trên ti vi.' },
      { id: 'lop2_eh_door',       en: 'Door',       vi: 'Cửa ra vào',        emoji: '🚪', phonetic: '/dɔːr/',      example_en: 'Please close the front door gently.',     example_vi: 'Xin hãy đóng nhẹ cửa ra vào nhé.' },
      { id: 'lop2_eh_window',     en: 'Window',     vi: 'Cửa sổ',            emoji: '🪟', phonetic: '/ˈwɪndəʊ/',   example_en: 'The sun shines brightly through the window.',example_vi: 'Ánh nắng chiếu sáng rực rỡ qua khung cửa sổ.' },
    ],
  },

  // ── CHỦ ĐỀ 8: TRANG PHỤC THƯỜNG NGÀY ───
  {
    id: 'lop2_ext_clothes',
    gradeId: 'lop2',
    name_vi: 'Trang Phục Thường Ngày',
    name_en: 'Clothes & Dressing',
    emoji: '👗',
    color: 'from-pink-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-purple-100',
    words: [
      { id: 'lop2_ec_shirt',    en: 'Shirt',    vi: 'Áo sơ mi',         emoji: '👔', phonetic: '/ʃɜːt/',     example_en: 'He wears a clean shirt to school.',      example_vi: 'Cậu ấy mặc một chiếc áo sơ mi sạch sẽ đến trường.' },
      { id: 'lop2_ec_tshirt',   en: 'T-shirt',  vi: 'Áo phông / Áo thun',emoji: '👕', phonetic: '/ˈtiː ʃɜːt/',example_en: 'I love wearing my red cotton T-shirt.',    example_vi: 'Tôi rất thích mặc chiếc áo thun cotton đỏ này.' },
      { id: 'lop2_ec_dress',    en: 'Dress',    vi: 'Váy liền / Đầm',   emoji: '👗', phonetic: '/dres/',     example_en: 'She looks pretty in her new dress.',     example_vi: 'Cô bé trông thật xinh xắn trong chiếc váy mới.' },
      { id: 'lop2_ec_skirt',    en: 'Skirt',    vi: 'Chân váy',         emoji: '🩰', phonetic: '/skɜːt/',    example_en: 'Her school uniform has a blue skirt.',   example_vi: 'Đồng phục trường bạn ấy có chân váy màu xanh.' },
      { id: 'lop2_ec_trousers', en: 'Trousers', vi: 'Quần dài',         emoji: '👖', phonetic: '/ˈtraʊzəz/', example_en: 'He put on warm trousers before going out.',example_vi: 'Cậu ấy mặc chiếc quần dài ấm áp trước khi ra ngoài.' },
      { id: 'lop2_ec_shorts',   en: 'Shorts',   vi: 'Quần đùi / Quần ngắn',emoji: '🩳', phonetic: '/ʃɔːts/',  example_en: 'I wear shorts during sports class.',     example_vi: 'Tôi mặc quần soóc trong giờ thể thao.' },
      { id: 'lop2_ec_shoes',    en: 'Shoes',    vi: 'Đôi giày',         emoji: '👟', phonetic: '/ʃuːz/',     example_en: 'Tie your shoes before you run fast.',    example_vi: 'Hãy buộc dây giày trước khi bạn chạy nhanh nhé.' },
      { id: 'lop2_ec_socks',    en: 'Socks',    vi: 'Đôi tất / Vớ',     emoji: '🧦', phonetic: '/sɒks/',     example_en: 'These woolly socks keep my feet warm.',  example_vi: 'Đôi tất len này giữ cho đôi bàn chân tôi luôn ấm.' },
      { id: 'lop2_ec_hat',      en: 'Hat',      vi: 'Cái mũ / Nón',     emoji: '🧢', phonetic: '/hæt/',      example_en: 'Wear a hat when playing under the sun.',  example_vi: 'Hãy đội mũ khi chơi dưới ánh nắng mặt trời nhé.' },
      { id: 'lop2_ec_jacket',   en: 'Jacket',   vi: 'Áo khoác ngắn',    emoji: '🧥', phonetic: '/ˈdʒækɪt/',  example_en: 'Zip up your warm jacket in winter.',     example_vi: 'Hãy kéo khóa chiếc áo khoác ấm vào mùa đông.' },
    ],
  },

  // ── CHỦ ĐỀ 9: PHƯƠNG TIỆN GIAO THÔNG ────
  {
    id: 'lop2_ext_transport',
    gradeId: 'lop2',
    name_vi: 'Phương Tiện Giao Thông',
    name_en: 'Transportation',
    emoji: '🚗',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'lop2_et_car',       en: 'Car',       vi: 'Xe ô tô',          emoji: '🚗', phonetic: '/kɑːr/',       example_en: 'Our family travels in a red car.',        example_vi: 'Gia đình chúng tôi đi du lịch bằng chiếc ô tô màu đỏ.' },
      { id: 'lop2_et_bus',       en: 'Bus',       vi: 'Xe buýt',          emoji: '🚌', phonetic: '/bʌs/',        example_en: 'Students ride the yellow bus to school.',  example_vi: 'Các bạn học sinh đi xe buýt vàng đến trường.' },
      { id: 'lop2_et_bike',      en: 'Bike',      vi: 'Xe đạp',           emoji: '🚲', phonetic: '/baɪk/',       example_en: 'I ride my bike safely on the sidewalk.',  example_vi: 'Tôi đạp xe an toàn trên vỉa hè.' },
      { id: 'lop2_et_motorbike', en: 'Motorbike', vi: 'Xe máy',           emoji: '🛵', phonetic: '/ˈməʊtəbaɪk/', example_en: 'Always wear a helmet on a motorbike.',     example_vi: 'Luôn đội mũ bảo hiểm khi ngồi trên xe máy.' },
      { id: 'lop2_et_train',     en: 'Train',     vi: 'Tàu hỏa',          emoji: '🚂', phonetic: '/treɪn/',      example_en: 'The long train travels very fast.',       example_vi: 'Đoàn tàu hỏa dài chạy rất nhanh.' },
      { id: 'lop2_et_plane',     en: 'Plane',     vi: 'Máy bay',          emoji: '✈️', phonetic: '/pleɪn/',      example_en: 'The silver plane flies above the clouds.',example_vi: 'Chiếc máy bay màu bạc bay trên những đám mây.' },
      { id: 'lop2_et_boat',      en: 'Boat',      vi: 'Thuyền / Ca nô',   emoji: '⛵', phonetic: '/bəʊt/',       example_en: 'The fishermen sail their boat at sunrise.',example_vi: 'Các bác ngư dân chèo thuyền ra khơi lúc bình minh.' },
      { id: 'lop2_et_van',       en: 'Van',       vi: 'Xe bán tải / Xe van',emoji: '🚐', phonetic: '/væn/',      example_en: 'Can you draw a van? – Yes, I can.',       example_vi: 'Bạn có thể vẽ chiếc xe bán tải không? – Có, mình vẽ được.' },
    ],
  },
];
