// =============================================
// VocaKids – Vocabulary Database
// 6 categories × 10 words = 60 words total
// Song ngữ Anh – Việt
// =============================================

import { Category, Word } from '@/types';

export interface GradeLevel {
  id: string;
  label: string;
  description: string;
}

export const GRADE_LEVELS: GradeLevel[] = [
  { id: 'maugiao', label: 'Mẫu Giáo',  description: 'Trẻ 3–5 tuổi' },
  { id: 'lop1',    label: 'Lớp 1',     description: '6–7 tuổi' },
  { id: 'lop2',    label: 'Lớp 2',     description: '7–8 tuổi' },
  { id: 'lop3',    label: 'Lớp 3',     description: '8–9 tuổi' },
  { id: 'lop4',    label: 'Lớp 4',     description: '9–10 tuổi' },
  { id: 'lop5',    label: 'Lớp 5',     description: '10–11 tuổi' },
];

export interface GradeMeta {
  name: string;
  badge: string;
  sub: string;
  age: string;
  gradient: string;
  heroBg: string;
  accent: string;
  border: string;
  icon: string;
  summary: string;
}

export const GRADE_METAS: Record<string, GradeMeta> = {
  maugiao: {
    name: 'Mẫu Giáo',
    badge: 'Mầm non',
    sub: 'Động vật, Trái cây, Màu sắc...',
    age: '3 – 5 tuổi',
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    heroBg: 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600',
    accent: 'bg-pink-100 text-pink-700',
    border: 'border-pink-200',
    icon: '🌸',
    summary: 'Làm quen từ vựng đầu đời qua hình ảnh & âm thanh vui nhộn',
  },
  lop1: {
    name: 'Lớp 1',
    badge: 'Khởi động',
    sub: 'Trường lớp, Đồ chơi, Món ăn...',
    age: '6 – 7 tuổi',
    gradient: 'from-amber-400 via-orange-400 to-amber-500',
    heroBg: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600',
    accent: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200',
    icon: '🌻',
    summary: 'Chuẩn bị hành trang vào lớp 1 tự tin, phát âm chuẩn',
  },
  lop2: {
    name: 'Lớp 2',
    badge: 'Tăng tốc',
    sub: 'Số đếm, Quần áo, Thời tiết, Nhà cửa...',
    age: '7 – 8 tuổi',
    gradient: 'from-lime-400 via-emerald-400 to-teal-500',
    heroBg: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600',
    accent: 'bg-emerald-100 text-emerald-800',
    border: 'border-emerald-200',
    icon: '🌟',
    summary: 'Phát triển phản xạ nghe - đọc câu ngắn tiếng Anh',
  },
  lop3: {
    name: 'Lớp 3',
    badge: 'Mở rộng',
    sub: 'Thể thao, Giao thông, Nghề nghiệp...',
    age: '8 – 9 tuổi',
    gradient: 'from-teal-400 via-cyan-400 to-blue-500',
    heroBg: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600',
    accent: 'bg-teal-100 text-teal-800',
    border: 'border-teal-200',
    icon: '🌿',
    summary: 'Bám sát khung chương trình mới Bộ Giáo Dục & Đào Tạo',
  },
  lop4: {
    name: 'Lớp 4',
    badge: 'SGK Tập 1 & 2',
    sub: '20 Unit đầy đủ Tập 1 & Tập 2',
    age: '9 – 10 tuổi',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
    heroBg: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600',
    accent: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200',
    icon: '🌊',
    summary: 'Toàn bộ 20 bài học chuẩn SGK Tiếng Anh 4 Global Success',
  },
  lop5: {
    name: 'Lớp 5',
    badge: 'SGK Tập 1 & 2',
    sub: '20 Unit đầy đủ Tập 1 & Tập 2',
    age: '10 – 11 tuổi',
    gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
    heroBg: 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600',
    accent: 'bg-violet-100 text-violet-800',
    border: 'border-violet-200',
    icon: '🔮',
    summary: 'Toàn bộ 20 bài học chuẩn SGK Tiếng Anh 5 Global Success',
  },
};

export type CategoryWithGrade = Category & { gradeId: string };

export const CATEGORIES: CategoryWithGrade[] = [
  // ── ANIMALS ──────────────────────────────
  {
    id: 'animals',
    gradeId: 'maugiao',
    name_vi: 'Động Vật',
    name_en: 'Animals',
    emoji: '🐾',
    color: 'from-orange-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-rose-100',
    words: [
      { id: 'cat',      en: 'Cat',      vi: 'Con mèo',    emoji: '🐱', phonetic: '/kæt/',           example_en: 'The cat is sleeping on the sofa.',      example_vi: 'Con mèo đang ngủ trên ghế sofa.' },
      { id: 'dog',      en: 'Dog',      vi: 'Con chó',    emoji: '🐶', phonetic: '/dɒɡ/',            example_en: 'My dog loves to play fetch.',            example_vi: 'Con chó của tôi thích chơi ném bóng.' },
      { id: 'bird',     en: 'Bird',     vi: 'Con chim',   emoji: '🐦', phonetic: '/bɜːrd/',          example_en: 'A bird is singing in the tree.',         example_vi: 'Một con chim đang hót trên cây.' },
      { id: 'fish',     en: 'Fish',     vi: 'Con cá',     emoji: '🐟', phonetic: '/fɪʃ/',            example_en: 'There is a fish in the bowl.',           example_vi: 'Có một con cá trong bình.' },
      { id: 'elephant', en: 'Elephant', vi: 'Con voi',    emoji: '🐘', phonetic: '/ˈɛlɪfənt/',      example_en: 'The elephant has a long trunk.',         example_vi: 'Con voi có cái vòi dài.' },
      { id: 'lion',     en: 'Lion',     vi: 'Con sư tử', emoji: '🦁', phonetic: '/ˈlaɪən/',         example_en: 'The lion is the king of the jungle.',    example_vi: 'Con sư tử là vua của rừng xanh.' },
      { id: 'rabbit',   en: 'Rabbit',   vi: 'Con thỏ',   emoji: '🐰', phonetic: '/ˈræbɪt/',        example_en: 'The rabbit is eating a carrot.',         example_vi: 'Con thỏ đang ăn cà rốt.' },
      { id: 'duck',     en: 'Duck',     vi: 'Con vịt',   emoji: '🦆', phonetic: '/dʌk/',            example_en: 'The duck swims in the pond.',            example_vi: 'Con vịt bơi trong ao.' },
      { id: 'monkey',   en: 'Monkey',   vi: 'Con khỉ',   emoji: '🐒', phonetic: '/ˈmʌŋki/',        example_en: 'The monkey is climbing the tree.',       example_vi: 'Con khỉ đang leo cây.' },
      { id: 'tiger',    en: 'Tiger',    vi: 'Con hổ',    emoji: '🐯', phonetic: '/ˈtaɪɡər/',       example_en: 'The tiger is very fast and powerful.',   example_vi: 'Con hổ rất nhanh và mạnh mẽ.' },
    ],
  },

  // ── FRUITS ───────────────────────────────
  {
    id: 'fruits',
    gradeId: 'maugiao',
    name_vi: 'Trái Cây',
    name_en: 'Fruits',
    emoji: '🍎',
    color: 'from-green-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    words: [
      { id: 'apple',      en: 'Apple',      vi: 'Quả táo',      emoji: '🍎', phonetic: '/ˈæpəl/',       example_en: 'I eat an apple every day.',         example_vi: 'Tôi ăn một quả táo mỗi ngày.' },
      { id: 'banana',     en: 'Banana',     vi: 'Quả chuối',    emoji: '🍌', phonetic: '/bəˈnɑːnə/',    example_en: 'Monkeys love to eat bananas.',      example_vi: 'Khỉ rất thích ăn chuối.' },
      { id: 'orange',     en: 'Orange',     vi: 'Quả cam',      emoji: '🍊', phonetic: '/ˈɒrɪndʒ/',    example_en: 'This orange is very sweet.',        example_vi: 'Quả cam này rất ngọt.' },
      { id: 'strawberry', en: 'Strawberry', vi: 'Quả dâu tây', emoji: '🍓', phonetic: '/ˈstrɔːbəri/', example_en: 'Strawberries are red and sweet.',   example_vi: 'Dâu tây màu đỏ và rất ngọt.' },
      { id: 'grape',      en: 'Grape',      vi: 'Quả nho',      emoji: '🍇', phonetic: '/ɡreɪp/',       example_en: 'I love eating grapes.',             example_vi: 'Tôi thích ăn nho.' },
      { id: 'mango',      en: 'Mango',      vi: 'Quả xoài',     emoji: '🥭', phonetic: '/ˈmæŋɡoʊ/',   example_en: 'The mango is yellow and delicious.',example_vi: 'Quả xoài màu vàng và rất ngon.' },
      { id: 'watermelon', en: 'Watermelon', vi: 'Dưa hấu',      emoji: '🍉', phonetic: '/ˈwɔːtərmelən/', example_en: 'We eat watermelon in summer.', example_vi: 'Chúng ta ăn dưa hấu vào mùa hè.' },
      { id: 'pear',       en: 'Pear',       vi: 'Quả lê',       emoji: '🍐', phonetic: '/pɛr/',         example_en: 'She picked a pear from the tree.',  example_vi: 'Cô ấy hái một quả lê trên cây.' },
      { id: 'cherry',     en: 'Cherry',     vi: 'Quả anh đào', emoji: '🍒', phonetic: '/ˈtʃɛri/',     example_en: 'The cherries are dark red.',         example_vi: 'Quả anh đào có màu đỏ đậm.' },
      { id: 'pineapple',  en: 'Pineapple',  vi: 'Quả dứa',     emoji: '🍍', phonetic: '/ˈpaɪnæpəl/',  example_en: 'Pineapple tastes sweet and sour.',  example_vi: 'Dứa có vị ngọt chua.' },
    ],
  },

  // ── COLORS ───────────────────────────────
  {
    id: 'colors',
    gradeId: 'maugiao',
    name_vi: 'Màu Sắc',
    name_en: 'Colors',
    emoji: '🌈',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'red',    en: 'Red',    vi: 'Màu đỏ',          emoji: '🔴', phonetic: '/rɛd/',         example_en: 'The apple is red.',              example_vi: 'Quả táo màu đỏ.' },
      { id: 'blue',   en: 'Blue',   vi: 'Màu xanh dương', emoji: '🔵', phonetic: '/bluː/',         example_en: 'The sky is blue.',               example_vi: 'Bầu trời màu xanh dương.' },
      { id: 'green',  en: 'Green',  vi: 'Màu xanh lá',    emoji: '🟢', phonetic: '/ɡriːn/',        example_en: 'The grass is green.',            example_vi: 'Cỏ có màu xanh lá.' },
      { id: 'yellow', en: 'Yellow', vi: 'Màu vàng',        emoji: '🟡', phonetic: '/ˈjɛloʊ/',      example_en: 'The sun is yellow.',             example_vi: 'Mặt trời màu vàng.' },
      { id: 'pink',   en: 'Pink',   vi: 'Màu hồng',        emoji: '🩷', phonetic: '/pɪŋk/',         example_en: 'She likes pink flowers.',        example_vi: 'Cô ấy thích hoa màu hồng.' },
      { id: 'purple', en: 'Purple', vi: 'Màu tím',         emoji: '🟣', phonetic: '/ˈpɜːrpəl/',    example_en: 'Grapes are purple.',             example_vi: 'Nho có màu tím.' },
      { id: 'orange_c',en: 'Orange',vi: 'Màu cam',         emoji: '🟠', phonetic: '/ˈɔːrɪndʒ/',   example_en: 'The carrot is orange.',          example_vi: 'Cà rốt có màu cam.' },
      { id: 'white',  en: 'White',  vi: 'Màu trắng',       emoji: '⚪', phonetic: '/waɪt/',         example_en: 'Snow is white.',                 example_vi: 'Tuyết có màu trắng.' },
      { id: 'black',  en: 'Black',  vi: 'Màu đen',         emoji: '⚫', phonetic: '/blæk/',         example_en: 'The night sky is black.',        example_vi: 'Bầu trời đêm màu đen.' },
      { id: 'brown',  en: 'Brown',  vi: 'Màu nâu',         emoji: '🟤', phonetic: '/braʊn/',        example_en: 'The bear is brown.',             example_vi: 'Con gấu có màu nâu.' },
    ],
  },

    // ════════════════════════════════════════
  // LỚP 1 (SGK GLOBAL SUCCESS + MỞ RỘNG)
  // ════════════════════════════════════════

  // ── UNIT 1: IN THE SCHOOL PLAYGROUND ──
  {
    id: 'lop1_unit1',
    gradeId: 'lop1',
    name_vi: 'Unit 1: Trên Sân Trường',
    name_en: 'Unit 1: In the School Playground',
    emoji: '⚽',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l1_u1_ball',           en: 'Ball',          vi: 'Quả bóng',                  emoji: '⚽',   phonetic: '/bɔːl/',          example_en: "Look at the bouncing ball!", example_vi: "Hãy nhìn quả bóng đang nảy kìa!" },
      { id: 'l1_u1_bike',           en: 'Bike',          vi: 'Xe đạp',                    emoji: '🚲',  phonetic: '/baɪk/',          example_en: "I ride my small bike in the yard.", example_vi: "Tôi đạp chiếc xe đạp nhỏ trong sân." },
      { id: 'l1_u1_book',           en: 'Book',          vi: 'Quyển sách',                emoji: '📚',  phonetic: '/bʊk/',           example_en: "Open your English book, please.", example_vi: "Mời các em mở quyển sách tiếng Anh ra." },
    ],
  },

  // ── UNIT 2: IN THE DINING ROOM ──
  {
    id: 'lop1_unit2',
    gradeId: 'lop1',
    name_vi: 'Unit 2: Trong Phòng Ăn',
    name_en: 'Unit 2: In the Dining Room',
    emoji: '🍰',
    color: 'from-orange-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-rose-100',
    words: [
      { id: 'l1_u2_cake',           en: 'Cake',          vi: 'Bánh ngọt',                 emoji: '🍰',  phonetic: '/keɪk/',          example_en: "I eat a sweet piece of cake.", example_vi: "Tôi ăn một miếng bánh ngọt thơm ngon." },
      { id: 'l1_u2_car',            en: 'Car',           vi: 'Ô tô đồ chơi',              emoji: '🚗',  phonetic: '/kɑːr/',          example_en: "He plays with a little toy car.", example_vi: "Cậu ấy chơi với chiếc ô tô đồ chơi nhỏ." },
      { id: 'l1_u2_cat',            en: 'Cat',           vi: 'Con mèo',                   emoji: '🐱',  phonetic: '/kæt/',           example_en: "The soft cat sleeps on the chair.", example_vi: "Chú mèo êm ái đang ngủ trên ghế." },
      { id: 'l1_u2_cup',            en: 'Cup',           vi: 'Cái cốc / cái tách',        emoji: '☕',   phonetic: '/kʌp/',           example_en: "A warm cup of milk is on the table.", example_vi: "Một cốc sữa ấm ở trên bàn." },
    ],
  },

  // ── UNIT 3: AT THE STREET MARKET ──
  {
    id: 'lop1_unit3',
    gradeId: 'lop1',
    name_vi: 'Unit 3: Ở Chợ Đường Phố',
    name_en: 'Unit 3: At the Street Market',
    emoji: '🍎',
    color: 'from-red-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-red-100 to-pink-100',
    words: [
      { id: 'l1_u3_apple',          en: 'Apple',         vi: 'Quả táo',                   emoji: '🍎',  phonetic: '/ˈæpl/',          example_en: "I like eating red apples.", example_vi: "Tôi rất thích ăn những quả táo đỏ." },
      { id: 'l1_u3_bag',            en: 'Bag',           vi: 'Túi xách / Cặp sách',       emoji: '🎒',  phonetic: '/bæɡ/',           example_en: "Put the apples in the bag.", example_vi: "Hãy cho những quả táo vào trong túi." },
      { id: 'l1_u3_can',            en: 'Can',           vi: 'Lon / Vỏ lon',              emoji: '🥫',  phonetic: '/kæn/',           example_en: "There is a cold soda can here.", example_vi: "Có một lon nước ngọt mát lạnh ở đây." },
      { id: 'l1_u3_hat',            en: 'Hat',           vi: 'Cái mũ / Cái nón',          emoji: '👒',  phonetic: '/hæt/',           example_en: "Put on your sunny hat.", example_vi: "Hãy đội chiếc mũ che nắng của bạn lên." },
    ],
  },

  // ── UNIT 4: IN THE BEDROOM ──
  {
    id: 'lop1_unit4',
    gradeId: 'lop1',
    name_vi: 'Unit 4: Trong Phòng Ngủ',
    name_en: 'Unit 4: In the Bedroom',
    emoji: '🛏️',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l1_u4_desk',           en: 'Desk',          vi: 'Bàn học',                   emoji: '🪑',  phonetic: '/desk/',          example_en: "Sit at your study desk.", example_vi: "Hãy ngồi vào bàn học của bạn nhé." },
      { id: 'l1_u4_dog',            en: 'Dog',           vi: 'Con chó',                   emoji: '🐶',  phonetic: '/dɔːɡ/',          example_en: "The friendly dog wags its tail.", example_vi: "Chú chó thân thiện vẫy vẫy chiếc đuôi." },
      { id: 'l1_u4_door',           en: 'Door',          vi: 'Cửa ra vào',                emoji: '🚪',  phonetic: '/dɔːr/',          example_en: "Please open the bedroom door.", example_vi: "Làm ơn hãy mở cửa phòng ngủ ra nhé." },
      { id: 'l1_u4_duck',           en: 'Duck',          vi: 'Con vịt',                   emoji: '🦆',  phonetic: '/dʌk/',           example_en: "The yellow duck quacks happily.", example_vi: "Chú vịt vàng kêu cạp cạp vui vẻ." },
    ],
  },

  // ── UNIT 5: FISH AND CHIP SHOP ──
  {
    id: 'lop1_unit5',
    gradeId: 'lop1',
    name_vi: 'Unit 5: Cửa Hàng Cá & Khoai Tây',
    name_en: 'Unit 5: Fish and Chip Shop',
    emoji: '🍟',
    color: 'from-yellow-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    words: [
      { id: 'l1_u5_chicken',        en: 'Chicken',       vi: 'Thịt gà',                   emoji: '🍗',  phonetic: '/ˈtʃɪkɪn/',       example_en: "Fried chicken is very delicious.", example_vi: "Món gà rán rất thơm ngon." },
      { id: 'l1_u5_chips',          en: 'Chips',         vi: 'Khoai tây chiên',           emoji: '🍟',  phonetic: '/tʃɪps/',         example_en: "Crispy chips are yummy to eat.", example_vi: "Khoai tây chiên giòn rụm ăn rất ngon." },
      { id: 'l1_u5_fish',           en: 'Fish',          vi: 'Con cá / Món cá',           emoji: '🐟',  phonetic: '/fɪʃ/',           example_en: "I have grilled fish for dinner.", example_vi: "Tôi ăn cá nướng cho bữa tối." },
      { id: 'l1_u5_milk',           en: 'Milk',          vi: 'Sữa tươi',                  emoji: '🥛',  phonetic: '/mɪlk/',          example_en: "Drink a glass of fresh milk daily.", example_vi: "Hãy uống một ly sữa tươi mỗi ngày nhé." },
    ],
  },

  // ── UNIT 6: IN THE CLASSROOM ──
  {
    id: 'lop1_unit6',
    gradeId: 'lop1',
    name_vi: 'Unit 6: Trong Lớp Học',
    name_en: 'Unit 6: In the Classroom',
    emoji: '🔔',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l1_u6_bell',           en: 'Bell',          vi: 'Cái chuông',                emoji: '🔔',  phonetic: '/bel/',           example_en: "Listen to the ringing school bell.", example_vi: "Hãy lắng nghe tiếng chuông trường reo vang." },
      { id: 'l1_u6_pen',            en: 'Pen',           vi: 'Bút mực',                   emoji: '🖊️', phonetic: '/pen/',           example_en: "Write your name with this pen.", example_vi: "Hãy viết tên bạn bằng chiếc bút mực này." },
      { id: 'l1_u6_pencil',         en: 'Pencil',        vi: 'Bút chì',                   emoji: '✏️',  phonetic: '/ˈpensl/',        example_en: "Draw a small star with a pencil.", example_vi: "Hãy vẽ một ngôi sao nhỏ bằng bút chì." },
      { id: 'l1_u6_red',            en: 'Red',           vi: 'Màu đỏ',                    emoji: '🔴',  phonetic: '/red/',           example_en: "I love this bright red color.", example_vi: "Tôi rất thích màu đỏ rực rỡ này." },
    ],
  },

  // ── UNIT 7: IN THE GARDEN ──
  {
    id: 'lop1_unit7',
    gradeId: 'lop1',
    name_vi: 'Unit 7: Trong Khu Vườn',
    name_en: 'Unit 7: In the Garden',
    emoji: '🌳',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    words: [
      { id: 'l1_u7_garden',         en: 'Garden',        vi: 'Khu vườn',                  emoji: '🌳',  phonetic: '/ˈɡɑːrdn/',       example_en: "Flowers bloom in our sunny garden.", example_vi: "Hoa nở rực rỡ trong khu vườn ngập nắng của chúng tôi." },
      { id: 'l1_u7_gate',           en: 'Gate',          vi: 'Cái cổng',                  emoji: '⛩️',  phonetic: '/ɡeɪt/',          example_en: "Please close the wooden garden gate.", example_vi: "Làm ơn hãy đóng chiếc cổng vườn bằng gỗ lại nhé." },
      { id: 'l1_u7_girl',           en: 'Girl',          vi: 'Bạn nữ / Cô bé',            emoji: '👧',  phonetic: '/ɡɜːrl/',         example_en: "The smiling girl is waving her hand.", example_vi: "Cô bé mỉm cười đang vẫy tay chào." },
      { id: 'l1_u7_goat',           en: 'Goat',          vi: 'Con dê',                    emoji: '🐐',  phonetic: '/ɡəʊt/',          example_en: "The white goat is eating fresh grass.", example_vi: "Con dê trắng đang ăn cỏ tươi non." },
    ],
  },

  // ── UNIT 8: IN THE PARK ──
  {
    id: 'lop1_unit8',
    gradeId: 'lop1',
    name_vi: 'Unit 8: Trong Công Viên',
    name_en: 'Unit 8: In the Park',
    emoji: '🎠',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l1_u8_hair',           en: 'Hair',          vi: 'Mái tóc',                   emoji: '💇',  phonetic: '/heər/',          example_en: "She has long brown hair.", example_vi: "Cô ấy có mái tóc nâu dài óng ả." },
      { id: 'l1_u8_hand',           en: 'Hand',          vi: 'Bàn tay',                   emoji: '✋',   phonetic: '/hænd/',          example_en: "Clap your hands together.", example_vi: "Hãy vỗ đôi bàn tay vào nhau nào." },
      { id: 'l1_u8_head',           en: 'Head',          vi: 'Cái đầu',                   emoji: '👤',  phonetic: '/hed/',           example_en: "Nod your head up and down.", example_vi: "Hãy gật đầu lên xuống nhé." },
      { id: 'l1_u8_horse',          en: 'Horse',         vi: 'Con ngựa',                  emoji: '🐎',  phonetic: '/hɔːrs/',         example_en: "The horse trots happily in the park.", example_vi: "Chú ngựa chạy lúp xúp vui vẻ trong công viên." },
    ],
  },

  // ── UNIT 9: IN THE SHOP ──
  {
    id: 'lop1_unit9',
    gradeId: 'lop1',
    name_vi: 'Unit 9: Trong Cửa Hàng',
    name_en: 'Unit 9: In the Shop',
    emoji: '🏬',
    color: 'from-indigo-400 to-violet-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-violet-100',
    words: [
      { id: 'l1_u9_clocks',         en: 'Clocks',        vi: 'Những chiếc đồng hồ',       emoji: '⏰',   phonetic: '/klɑːks/',        example_en: "Look at the round wall clocks.", example_vi: "Hãy nhìn những chiếc đồng hồ treo tường tròn xoe kìa." },
      { id: 'l1_u9_locks',          en: 'Locks',         vi: 'Những chiếc khóa',          emoji: '🔒',  phonetic: '/lɑːks/',         example_en: "Shiny metal locks protect the door.", example_vi: "Những chiếc khóa kim loại sáng bóng bảo vệ cánh cửa." },
      { id: 'l1_u9_mops',           en: 'Mops',          vi: 'Những cái chổi lau nhà',    emoji: '🧹',  phonetic: '/mɑːps/',         example_en: "We use clean mops to clean the floor.", example_vi: "Chúng mình dùng những chiếc chổi lau sạch để lau sàn." },
      { id: 'l1_u9_pots',           en: 'Pots',          vi: 'Những chiếc nồi',           emoji: '🍲',  phonetic: '/pɑːts/',         example_en: "Mom keeps cooking pots on the shelf.", example_vi: "Mẹ xếp những chiếc nồi nấu ăn gọn gàng trên giá." },
    ],
  },

  // ── UNIT 10: AT THE ZOO ──
  {
    id: 'lop1_unit10',
    gradeId: 'lop1',
    name_vi: 'Unit 10: Ở Sở Thú',
    name_en: 'Unit 10: At the Zoo',
    emoji: '🐒',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'l1_u10_mango',         en: 'Mango',         vi: 'Quả xoài',                  emoji: '🥭',  phonetic: '/ˈmæŋɡəʊ/',       example_en: "A sweet yellow mango is ripe.", example_vi: "Một quả xoài vàng ngọt đã chín thơm." },
      { id: 'l1_u10_monkey',        en: 'Monkey',        vi: 'Con khỉ',                   emoji: '🐒',  phonetic: '/ˈmʌŋki/',        example_en: "The funny monkey swings in the tree.", example_vi: "Chú khỉ vui nhộn đu đưa trên cành cây." },
      { id: 'l1_u10_mother',        en: 'Mother',        vi: 'Mẹ',                        emoji: '👩',  phonetic: '/ˈmʌðər/',        example_en: "I hold my mother’s warm hand.", example_vi: "Tôi nắm lấy bàn tay ấm áp của mẹ." },
      { id: 'l1_u10_mouse',         en: 'Mouse',         vi: 'Con chuột',                 emoji: '🐭',  phonetic: '/maʊs/',          example_en: "The tiny mouse nibbles some cheese.", example_vi: "Chú chuột nhỏ xíu đang gặm một mẩu phô mai." },
    ],
  },

  // ── UNIT 11: AT THE BUS STOP ──
  {
    id: 'lop1_unit11',
    gradeId: 'lop1',
    name_vi: 'Unit 11: Trạm Xe Buýt',
    name_en: 'Unit 11: At the Bus Stop',
    emoji: '🚌',
    color: 'from-yellow-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-orange-100',
    words: [
      { id: 'l1_u11_bus',           en: 'Bus',           vi: 'Xe buýt',                   emoji: '🚌',  phonetic: '/bʌs/',           example_en: "The big bus stops right here.", example_vi: "Chiếc xe buýt to lớn dừng lại ngay tại đây." },
      { id: 'l1_u11_run',           en: 'Run',           vi: 'Chạy nhanh',                emoji: '🏃',  phonetic: '/rʌn/',           example_en: "Run quickly to catch the school bus.", example_vi: "Hãy chạy thật nhanh để kịp xe buýt trường nào." },
      { id: 'l1_u11_sun',           en: 'Sun',           vi: 'Mặt trời',                  emoji: '☀️',  phonetic: '/sʌn/',           example_en: "The warm sun shines from the sky.", example_vi: "Mặt trời ấm áp tỏa sáng từ trên bầu trời cao." },
      { id: 'l1_u11_truck',         en: 'Truck',         vi: 'Xe tải',                    emoji: '🚚',  phonetic: '/trʌk/',          example_en: "A green truck carries big boxes.", example_vi: "Một chiếc xe tải xanh đang chở các thùng hàng to." },
    ],
  },

  // ── UNIT 12: AT THE LAKE ──
  {
    id: 'lop1_unit12',
    gradeId: 'lop1',
    name_vi: 'Unit 12: Ở Hồ Nước',
    name_en: 'Unit 12: At the Lake',
    emoji: '🌊',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l1_u12_lake',          en: 'Lake',          vi: 'Hồ nước',                   emoji: '🌊',  phonetic: '/leɪk/',          example_en: "The blue lake is quiet and calm.", example_vi: "Mặt hồ nước trong xanh thật yên bình và tĩnh lặng." },
      { id: 'l1_u12_leaf',          en: 'Leaf',          vi: 'Chiếc lá cây',              emoji: '🍃',  phonetic: '/liːf/',          example_en: "A green leaf floats on the water.", example_vi: "Một chiếc lá xanh trôi lững lờ trên mặt nước." },
      { id: 'l1_u12_lemons',        en: 'Lemons',        vi: 'Những quả chanh vàng',      emoji: '🍋',  phonetic: '/ˈlemənz/',       example_en: "Sour yellow lemons make fresh juice.", example_vi: "Những quả chanh vàng chua làm nước ép tươi mát." },
    ],
  },

  // ── UNIT 13: IN THE SCHOOL CANTEEN ──
  {
    id: 'lop1_unit13',
    gradeId: 'lop1',
    name_vi: 'Unit 13: Căn Tin Trường Học',
    name_en: 'Unit 13: In the School Canteen',
    emoji: '🍜',
    color: 'from-orange-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-amber-100',
    words: [
      { id: 'l1_u13_bananas',       en: 'Bananas',       vi: 'Những quả chuối',           emoji: '🍌',  phonetic: '/bəˈnænəz/',      example_en: "Sweet yellow bananas are healthy.", example_vi: "Những quả chuối vàng ngọt ngào rất tốt cho sức khỏe." },
      { id: 'l1_u13_noodles',       en: 'Noodles',       vi: 'Mì / Bún / Phở',            emoji: '🍜',  phonetic: '/ˈnuːdlz/',       example_en: "I eat warm noodles for my lunch.", example_vi: "Tôi ăn một tô mì ấm nóng cho bữa trưa." },
      { id: 'l1_u13_nuts',          en: 'Nuts',          vi: 'Các loại hạt',              emoji: '🥜',  phonetic: '/nʌts/',          example_en: "Crunchy nuts are fun to snack on.", example_vi: "Các loại hạt giòn rụm ăn vặt rất vui." },
    ],
  },

  // ── UNIT 14: IN THE TOY SHOP ──
  {
    id: 'lop1_unit14',
    gradeId: 'lop1',
    name_vi: 'Unit 14: Cửa Hàng Đồ Chơi',
    name_en: 'Unit 14: In the Toy Shop',
    emoji: '🧸',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l1_u14_teddy_bear',    en: 'Teddy bear',    vi: 'Gấu bông',                  emoji: '🧸',  phonetic: '/ˈtedi beər/',    example_en: "I hug my soft teddy bear tightly.", example_vi: "Tôi ôm chặt chú gấu bông mềm mại của mình." },
      { id: 'l1_u14_tiger',         en: 'Tiger',         vi: 'Con hổ',                    emoji: '🐯',  phonetic: '/ˈtaɪɡər/',       example_en: "Look at the strong striped tiger.", example_vi: "Hãy nhìn chú hổ vằn dũng mãnh kìa." },
      { id: 'l1_u14_top',           en: 'Top',           vi: 'Con quay',                  emoji: '🪀',  phonetic: '/tɑːp/',          example_en: "The colorful top spins very fast.", example_vi: "Con quay sặc sỡ xoay tít rất nhanh." },
      { id: 'l1_u14_turtle',        en: 'Turtle',        vi: 'Con rùa',                   emoji: '🐢',  phonetic: '/ˈtɜːrtl/',       example_en: "The green turtle crawls slowly.", example_vi: "Chú rùa xanh bò chầm chậm từng bước." },
    ],
  },

  // ── UNIT 15: AT THE FOOTBALL MATCH ──
  {
    id: 'lop1_unit15',
    gradeId: 'lop1',
    name_vi: 'Unit 15: Trận Đấu Bóng Đá',
    name_en: 'Unit 15: At the Football Match',
    emoji: '⚽',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l1_u15_face',          en: 'Face',          vi: 'Khuôn mặt',                 emoji: '😊',  phonetic: '/feɪs/',          example_en: "Wash your face with clean water.", example_vi: "Hãy rửa khuôn mặt của bạn bằng nước sạch." },
      { id: 'l1_u15_father',        en: 'Father',        vi: 'Bố / Cha',                  emoji: '👨',  phonetic: '/ˈfɑːðər/',       example_en: "My father cheers for our team.", example_vi: "Bố tôi đang cổ vũ cho đội của chúng mình." },
      { id: 'l1_u15_foot',          en: 'Foot',          vi: 'Bàn chân',                  emoji: '🦶',  phonetic: '/fʊt/',           example_en: "Kick the ball with your right foot.", example_vi: "Hãy đá bóng bằng bàn chân phải nhé." },
      { id: 'l1_u15_football',      en: 'Football',      vi: 'Quả bóng đá',               emoji: '⚽',   phonetic: '/ˈfʊtbɔːl/',      example_en: "We play football together after class.", example_vi: "Chúng mình cùng chơi bóng đá sau giờ học." },
    ],
  },

  // ── UNIT 16: AT HOME ──
  {
    id: 'lop1_unit16',
    gradeId: 'lop1',
    name_vi: 'Unit 16: Ở Nhà',
    name_en: 'Unit 16: At Home',
    emoji: '🏡',
    color: 'from-sky-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-indigo-100',
    words: [
      { id: 'l1_u16_wash',          en: 'Wash',          vi: 'Rửa / Giặt',                emoji: '🧼',  phonetic: '/wɑːʃ/',          example_en: "Wash your hands before eating.", example_vi: "Hãy rửa sạch tay trước khi ăn nhé." },
      { id: 'l1_u16_water',         en: 'Water',         vi: 'Nước uống',                 emoji: '💧',  phonetic: '/ˈwɔːtər/',       example_en: "Drink enough fresh water each day.", example_vi: "Hãy uống đủ nước lọc sạch mỗi ngày nhé." },
      { id: 'l1_u16_window',        en: 'Window',        vi: 'Cửa sổ',                    emoji: '🪟',  phonetic: '/ˈwɪndəʊ/',       example_en: "Fresh air comes through the window.", example_vi: "Không khí trong lành ùa vào qua khung cửa sổ." },
    ],
  },

  // ── NUMBERS 1 TO 10 ──
  {
    id: 'lop1_ext_numbers',
    gradeId: 'lop1',
    name_vi: 'Số Đếm (1 Đến 10)',
    name_en: 'Numbers 1 to 10',
    emoji: '🔢',
    color: 'from-amber-400 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'l1_en_zero',           en: 'Zero',          vi: 'Số 0 (Không)',              emoji: '0️⃣', phonetic: '/ˈzɪərəʊ/',       example_en: "Count starting from zero.", example_vi: "Đếm bắt đầu từ số không nào." },
      { id: 'l1_en_one',            en: 'One',           vi: 'Số 1 (Một)',                emoji: '1️⃣', phonetic: '/wʌn/',           example_en: "I have one red apple.", example_vi: "Tôi có một quả táo đỏ." },
      { id: 'l1_en_two',            en: 'Two',           vi: 'Số 2 (Hai)',                emoji: '2️⃣', phonetic: '/tuː/',           example_en: "She has two little kittens.", example_vi: "Cô bé có hai chú mèo con." },
      { id: 'l1_en_three',          en: 'Three',         vi: 'Số 3 (Ba)',                 emoji: '3️⃣', phonetic: '/θriː/',          example_en: "There are three birds in the tree.", example_vi: "Có ba chú chim ở trên cây." },
      { id: 'l1_en_four',           en: 'Four',          vi: 'Số 4 (Bốn)',                emoji: '4️⃣', phonetic: '/fɔːr/',          example_en: "A table has four legs.", example_vi: "Một chiếc bàn có bốn chiếc chân." },
      { id: 'l1_en_five',           en: 'Five',          vi: 'Số 5 (Năm)',                emoji: '5️⃣', phonetic: '/faɪv/',          example_en: "Give me a high five!", example_vi: "Hãy đập tay năm ngón nào!" },
      { id: 'l1_en_six',            en: 'Six',           vi: 'Số 6 (Sáu)',                emoji: '6️⃣', phonetic: '/sɪks/',          example_en: "I am six years old today.", example_vi: "Hôm nay con tròn sáu tuổi." },
      { id: 'l1_en_seven',          en: 'Seven',         vi: 'Số 7 (Bảy)',                emoji: '7️⃣', phonetic: '/ˈsevn/',         example_en: "Seven colors form the rainbow.", example_vi: "Bảy sắc màu tạo nên chiếc cầu vồng." },
      { id: 'l1_en_eight',          en: 'Eight',         vi: 'Số 8 (Tám)',                emoji: '8️⃣', phonetic: '/eɪt/',           example_en: "He has eight crayons in the box.", example_vi: "Cậu ấy có tám chiếc bút sáp màu trong hộp." },
      { id: 'l1_en_nine',           en: 'Nine',          vi: 'Số 9 (Chín)',               emoji: '9️⃣', phonetic: '/naɪn/',          example_en: "Nine balloons float in the sky.", example_vi: "Chín quả bóng bay lơ lửng trên bầu trời." },
      { id: 'l1_en_ten',            en: 'Ten',           vi: 'Số 10 (Mười)',              emoji: '🔟',  phonetic: '/ten/',           example_en: "I count all ten fingers.", example_vi: "Tôi đếm đủ cả mười ngón tay." },
    ],
  },

  // ── COLORS ──
  {
    id: 'lop1_ext_colors',
    gradeId: 'lop1',
    name_vi: 'Màu Sắc Rực Rỡ',
    name_en: 'Colors',
    emoji: '🎨',
    color: 'from-pink-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-purple-100',
    words: [
      { id: 'l1_ec_red',            en: 'Red',           vi: 'Màu đỏ',                    emoji: '🔴',  phonetic: '/red/',           example_en: "The juicy strawberry is red.", example_vi: "Quả dâu tây mọng nước có màu đỏ." },
      { id: 'l1_ec_blue',           en: 'Blue',          vi: 'Màu xanh da trời',          emoji: '🔵',  phonetic: '/bluː/',          example_en: "The wide sea is bright blue.", example_vi: "Biển rộng mênh mông mang màu xanh biếc." },
      { id: 'l1_ec_green',          en: 'Green',         vi: 'Màu xanh lá cây',           emoji: '🟢',  phonetic: '/ɡriːn/',         example_en: "The grassy hill is soft and green.", example_vi: "Ngọn đồi cỏ mềm mại và xanh mướt." },
      { id: 'l1_ec_yellow',         en: 'Yellow',        vi: 'Màu vàng',                  emoji: '🟡',  phonetic: '/ˈjeləʊ/',        example_en: "The warm sun shines yellow.", example_vi: "Mặt trời ấm áp tỏa ánh vàng rực rỡ." },
      { id: 'l1_ec_pink',           en: 'Pink',          vi: 'Màu hồng',                  emoji: '🌸',  phonetic: '/pɪŋk/',          example_en: "She wears a lovely pink ribbon.", example_vi: "Cô bé đeo một chiếc nơ hồng đáng yêu." },
      { id: 'l1_ec_orange',         en: 'Orange',        vi: 'Màu cam',                   emoji: '🟠',  phonetic: '/ˈɔːrɪndʒ/',      example_en: "A fresh orange fruit is bright.", example_vi: "Quả cam tươi có màu sắc tươi sáng." },
      { id: 'l1_ec_purple',         en: 'Purple',        vi: 'Màu tím',                   emoji: '🟣',  phonetic: '/ˈpɜːrpl/',       example_en: "These sweet grapes are purple.", example_vi: "Những quả nho ngọt này có màu tím." },
      { id: 'l1_ec_black',          en: 'Black',         vi: 'Màu đen',                   emoji: '⚫',   phonetic: '/blæk/',          example_en: "The kitten has shiny black fur.", example_vi: "Chú mèo con có bộ lông đen nhánh." },
      { id: 'l1_ec_white',          en: 'White',         vi: 'Màu trắng',                 emoji: '⚪',   phonetic: '/waɪt/',          example_en: "The fluffy cloud is pure white.", example_vi: "Đám mây bồng bềnh mang màu trắng tinh." },
      { id: 'l1_ec_brown',          en: 'Brown',         vi: 'Màu nâu',                   emoji: '🟤',  phonetic: '/braʊn/',         example_en: "The teddy bear has warm brown fur.", example_vi: "Chú gấu bông có bộ lông màu nâu ấm áp." },
    ],
  },

  // ── MY FAMILY ──
  {
    id: 'lop1_ext_family',
    gradeId: 'lop1',
    name_vi: 'Gia Đình Của Bé',
    name_en: 'My Family',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-rose-400 to-orange-400',
    gradient: 'bg-gradient-to-br from-rose-100 to-orange-100',
    words: [
      { id: 'l1_ef_father',         en: 'Father',        vi: 'Bố / Cha',                  emoji: '👨',  phonetic: '/ˈfɑːðər/',       example_en: "My father reads stories to me.", example_vi: "Bố đọc những câu chuyện cho tôi nghe." },
      { id: 'l1_ef_mother',         en: 'Mother',        vi: 'Mẹ',                        emoji: '👩',  phonetic: '/ˈmʌðər/',        example_en: "I love my mother very much.", example_vi: "Tôi yêu mẹ của tôi rất nhiều." },
      { id: 'l1_ef_brother',        en: 'Brother',       vi: 'Anh / Em trai',             emoji: '👦',  phonetic: '/ˈbrʌðər/',       example_en: "My brother plays soccer with me.", example_vi: "Anh trai tôi cùng chơi đá bóng với tôi." },
      { id: 'l1_ef_sister',         en: 'Sister',        vi: 'Chị / Em gái',              emoji: '👧',  phonetic: '/ˈsɪstər/',       example_en: "My sister sings cheerful songs.", example_vi: "Chị gái tôi hát những bài ca vui vẻ." },
      { id: 'l1_ef_baby',           en: 'Baby',          vi: 'Em bé nhỏ',                 emoji: '👶',  phonetic: '/ˈbeɪbi/',        example_en: "The cute baby smiles sweetly.", example_vi: "Em bé dễ thương cười thật ngọt ngào." },
      { id: 'l1_ef_grandfather',    en: 'Grandfather',   vi: 'Ông',                       emoji: '👴',  phonetic: '/ˈɡrænfɑːðər/',   example_en: "Grandfather smiles kindly at me.", example_vi: "Ông mỉm cười hiền từ với tôi." },
      { id: 'l1_ef_grandmother',    en: 'Grandmother',   vi: 'Bà',                        emoji: '👵',  phonetic: '/ˈɡrænmʌðər/',    example_en: "Grandmother bakes warm sweet cookies.", example_vi: "Bà nướng những chiếc bánh quy ấm thơm." },
    ],
  },

  // ── FAMILIAR ANIMALS ──
  {
    id: 'lop1_ext_animals',
    gradeId: 'lop1',
    name_vi: 'Động Vật Quen Thuộc',
    name_en: 'Familiar Animals',
    emoji: '🐾',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l1_ea_dog',            en: 'Dog',           vi: 'Con chó',                   emoji: '🐶',  phonetic: '/dɔːɡ/',          example_en: "The loyal dog barks happily.", example_vi: "Chú chó trung thành sủa vang vui vẻ." },
      { id: 'l1_ea_cat',            en: 'Cat',           vi: 'Con mèo',                   emoji: '🐱',  phonetic: '/kæt/',           example_en: "The soft cat purrs on my lap.", example_vi: "Chú mèo êm ái kêu gừ gừ trong lòng tôi." },
      { id: 'l1_ea_bird',           en: 'Bird',          vi: 'Con chim',                  emoji: '🐦',  phonetic: '/bɜːrd/',         example_en: "A tiny bird sings in the morning.", example_vi: "Một chú chim nhỏ hót líu lo vào buổi sớm." },
      { id: 'l1_ea_fish',           en: 'Fish',          vi: 'Con cá',                    emoji: '🐟',  phonetic: '/fɪʃ/',           example_en: "The gold fish swims in the water.", example_vi: "Chú cá vàng bơi lội tung tăng trong nước." },
      { id: 'l1_ea_duck',           en: 'Duck',          vi: 'Con vịt',                   emoji: '🦆',  phonetic: '/dʌk/',           example_en: "The duck paddles across the pond.", example_vi: "Chú vịt bơi chèo qua chiếc ao làng." },
      { id: 'l1_ea_chicken',        en: 'Chicken',       vi: 'Con gà',                    emoji: '🐔',  phonetic: '/ˈtʃɪkɪn/',       example_en: "The mother chicken looks after chicks.", example_vi: "Gà mẹ ân cần chăm sóc đàn gà con." },
      { id: 'l1_ea_rabbit',         en: 'Rabbit',        vi: 'Con thỏ',                   emoji: '🐰',  phonetic: '/ˈræbɪt/',        example_en: "The fluffy white rabbit hops fast.", example_vi: "Chú thỏ trắng lông xù nhảy thoăn thoắt." },
      { id: 'l1_ea_elephant',       en: 'Elephant',      vi: 'Con voi',                   emoji: '🐘',  phonetic: '/ˈelɪfənt/',      example_en: "The big elephant has two large ears.", example_vi: "Chú voi to lớn có đôi tai thật to." },
      { id: 'l1_ea_monkey',         en: 'Monkey',        vi: 'Con khỉ',                   emoji: '🐒',  phonetic: '/ˈmʌŋki/',        example_en: "The clever monkey loves eating bananas.", example_vi: "Chú khỉ thông minh rất thích ăn chuối." },
      { id: 'l1_ea_tiger',          en: 'Tiger',         vi: 'Con hổ',                    emoji: '🐯',  phonetic: '/ˈtaɪɡər/',       example_en: "The tiger roars proudly in the wild.", example_vi: "Chú hổ gầm vang kiêu hãnh giữa thiên nhiên." },
    ],
  },

  // ── SCHOOL OBJECTS ──
  {
    id: 'lop1_ext_school_items',
    gradeId: 'lop1',
    name_vi: 'Đồ Dùng Học Tập',
    name_en: 'School Objects',
    emoji: '✏️',
    color: 'from-cyan-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-teal-100',
    words: [
      { id: 'l1_es_pen',            en: 'Pen',           vi: 'Bút mực',                   emoji: '🖊️', phonetic: '/pen/',           example_en: "Write neatly with your blue pen.", example_vi: "Hãy viết thật nắn nót bằng chiếc bút mực xanh nhé." },
      { id: 'l1_es_pencil',         en: 'Pencil',        vi: 'Bút chì',                   emoji: '✏️',  phonetic: '/ˈpensl/',        example_en: "Sharpen your pencil before drawing.", example_vi: "Hãy gọt bút chì trước khi vẽ tranh nhé." },
      { id: 'l1_es_ruler',          en: 'Ruler',         vi: 'Thước kẻ',                  emoji: '📏',  phonetic: '/ˈruːlər/',       example_en: "Use a ruler to draw straight lines.", example_vi: "Dùng thước kẻ để vẽ những đường thẳng tắp." },
      { id: 'l1_es_eraser',         en: 'Eraser',        vi: 'Cục tẩy / Gôm',             emoji: '🧼',  phonetic: '/ɪˈreɪsər/',      example_en: "This rubber eraser cleans pencil marks.", example_vi: "Cục tẩy này xóa sạch những vết bút chì." },
      { id: 'l1_es_bag',            en: 'Bag',           vi: 'Cặp sách / Túi',            emoji: '🎒',  phonetic: '/bæɡ/',           example_en: "Pack your school bag neatly.", example_vi: "Hãy sắp xếp cặp sách của bạn thật gọn gàng." },
      { id: 'l1_es_book',           en: 'Book',          vi: 'Quyển sách',                emoji: '📖',  phonetic: '/bʊk/',           example_en: "Open the colorful picture book.", example_vi: "Hãy mở cuốn sách tranh đầy màu sắc ra nhé." },
      { id: 'l1_es_notebook',       en: 'Notebook',      vi: 'Quyển vở ghi',              emoji: '📓',  phonetic: '/ˈnəʊtbʊk/',      example_en: "Write the lesson in your notebook.", example_vi: "Hãy viết bài học vào trong vở của bạn." },
      { id: 'l1_es_crayon',         en: 'Crayon',        vi: 'Bút sáp màu',               emoji: '🖍️', phonetic: '/ˈkreɪɑːn/',      example_en: "Color the sunny picture with crayons.", example_vi: "Hãy tô màu bức tranh rực rỡ bằng bút sáp nhé." },
    ],
  },

  // ── FAVORITE TOYS ──
  {
    id: 'lop1_ext_toys',
    gradeId: 'lop1',
    name_vi: 'Đồ Chơi Yêu Thích',
    name_en: 'Favorite Toys',
    emoji: '🧸',
    color: 'from-purple-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-indigo-100',
    words: [
      { id: 'l1_et_ball',           en: 'Ball',          vi: 'Quả bóng',                  emoji: '⚽',   phonetic: '/bɔːl/',          example_en: "Kick the soccer ball across the grass.", example_vi: "Hãy sút quả bóng qua bãi cỏ xanh nào." },
      { id: 'l1_et_doll',           en: 'Doll',          vi: 'Búp bê',                    emoji: '🪆',  phonetic: '/dɑːl/',          example_en: "She brushes her pretty doll’s hair.", example_vi: "Cô bé chải tóc cho bạn búp bê xinh đẹp." },
      { id: 'l1_et_car',            en: 'Car',           vi: 'Ô tô đồ chơi',              emoji: '🚗',  phonetic: '/kɑːr/',          example_en: "Zoom the red toy car across the floor.", example_vi: "Cho chiếc ô tô đồ chơi đỏ phóng trên sàn." },
      { id: 'l1_et_robot',          en: 'Robot',         vi: 'Người máy',                 emoji: '🤖',  phonetic: '/ˈrəʊbɑːt/',      example_en: "The cool robot flashes bright lights.", example_vi: "Chú người máy ngầu chớp sáng những ánh đèn rực rỡ." },
      { id: 'l1_et_teddy_bear',     en: 'Teddy bear',    vi: 'Gấu bông ấm áp',            emoji: '🧸',  phonetic: '/ˈtedi beər/',    example_en: "I sleep with my soft teddy bear.", example_vi: "Tôi đi ngủ cùng chú gấu bông mềm mại." },
      { id: 'l1_et_kite',           en: 'Kite',          vi: 'Con diều giấy',             emoji: '🪁',  phonetic: '/kaɪt/',          example_en: "The paper kite flies high in the wind.", example_vi: "Chiếc diều giấy bay bổng trong làn gió." },
      { id: 'l1_et_puzzle',         en: 'Puzzle',        vi: 'Trò chơi ghép hình',        emoji: '🧩',  phonetic: '/ˈpʌzl/',         example_en: "Put the puzzle pieces together neatly.", example_vi: "Hãy ghép các mảnh hình lại với nhau thật khớp nhé." },
    ],
  },

  // ── BODY PARTS ──
  {
    id: 'lop1_ext_body',
    gradeId: 'lop1',
    name_vi: 'Bộ Phận Cơ Thể',
    name_en: 'Body Parts',
    emoji: '👂',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l1_eb_head',           en: 'Head',          vi: 'Cái đầu',                   emoji: '👤',  phonetic: '/hed/',           example_en: "Touch your head gently.", example_vi: "Hãy chạm nhẹ vào đầu của bạn nhé." },
      { id: 'l1_eb_face',           en: 'Face',          vi: 'Khuôn mặt',                 emoji: '😊',  phonetic: '/feɪs/',          example_en: "A bright smile lights up her face.", example_vi: "Nụ cười tươi sáng bừng trên khuôn mặt cô bé." },
      { id: 'l1_eb_eye',            en: 'Eye',           vi: 'Đôi mắt',                   emoji: '👀',  phonetic: '/aɪ/',            example_en: "Look around with your bright eyes.", example_vi: "Hãy nhìn ngắm xung quanh với đôi mắt sáng ngời." },
      { id: 'l1_eb_ear',            en: 'Ear',           vi: 'Đôi tai',                   emoji: '👂',  phonetic: '/ɪər/',           example_en: "Listen closely with your ears.", example_vi: "Hãy lắng nghe chăm chú bằng đôi tai của bạn." },
      { id: 'l1_eb_nose',           en: 'Nose',          vi: 'Chiếc mũi',                 emoji: '👃',  phonetic: '/nəʊz/',          example_en: "Smell the sweet flowers with your nose.", example_vi: "Ngửi hương hoa thơm ngát bằng chiếc mũi xinh." },
      { id: 'l1_eb_mouth',          en: 'Mouth',         vi: 'Khuôn miệng',               emoji: '👄',  phonetic: '/maʊθ/',          example_en: "Open your mouth and sing along.", example_vi: "Hãy mở miệng và cùng hát theo nhé." },
      { id: 'l1_eb_hand',           en: 'Hand',          vi: 'Bàn tay',                   emoji: '✋',   phonetic: '/hænd/',          example_en: "Hold my hand as we walk.", example_vi: "Hãy nắm lấy tay tôi khi chúng mình cùng bước đi." },
      { id: 'l1_eb_foot',           en: 'Foot',          vi: 'Bàn chân',                  emoji: '🦶',  phonetic: '/fʊt/',           example_en: "Stamp your feet to the music beat.", example_vi: "Hãy giậm chân theo nhịp điệu bài hát." },
    ],
  },

  // ── FOOD & DRINKS ──
  {
    id: 'lop1_ext_food_drinks',
    gradeId: 'lop1',
    name_vi: 'Đồ Ăn & Thức Uống',
    name_en: 'Food & Drinks',
    emoji: '🍱',
    color: 'from-lime-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-lime-100 to-emerald-100',
    words: [
      { id: 'l1_efd_apple',         en: 'Apple',         vi: 'Quả táo',                   emoji: '🍎',  phonetic: '/ˈæpl/',          example_en: "A crisp red apple is tasty.", example_vi: "Một quả táo đỏ giòn ngọt rất ngon." },
      { id: 'l1_efd_banana',        en: 'Banana',        vi: 'Quả chuối',                 emoji: '🍌',  phonetic: '/bəˈnænə/',       example_en: "Peel a yellow banana carefully.", example_vi: "Hãy bóc vỏ quả chuối vàng cẩn thận nhé." },
      { id: 'l1_efd_milk',          en: 'Milk',          vi: 'Sữa tươi',                  emoji: '🥛',  phonetic: '/mɪlk/',          example_en: "Drink warm milk before bedtime.", example_vi: "Hãy uống sữa ấm trước giờ đi ngủ." },
      { id: 'l1_efd_water',         en: 'Water',         vi: 'Nước lọc',                  emoji: '💧',  phonetic: '/ˈwɔːtər/',       example_en: "Pure water keeps our body healthy.", example_vi: "Nước lọc tinh khiết giúp cơ thể chúng mình khỏe khoắn." },
      { id: 'l1_efd_cake',          en: 'Cake',          vi: 'Bánh ngọt',                 emoji: '🍰',  phonetic: '/keɪk/',          example_en: "Blow out the candles on the cake.", example_vi: "Hãy thổi nến trên chiếc bánh sinh nhật nhé." },
      { id: 'l1_efd_candy',         en: 'Candy',         vi: 'Viên kẹo ngọt',             emoji: '🍬',  phonetic: '/ˈkændi/',        example_en: "Share sweet candy with your best friends.", example_vi: "Hãy chia sẻ kẹo ngọt với những người bạn thân." },
      { id: 'l1_efd_rice',          en: 'Rice',          vi: 'Cơm trắng',                 emoji: '🍚',  phonetic: '/raɪs/',          example_en: "We eat warm white rice for dinner.", example_vi: "Chúng mình ăn cơm trắng ấm dẻo vào bữa tối." },
      { id: 'l1_efd_egg',           en: 'Egg',           vi: 'Quả trứng',                 emoji: '🥚',  phonetic: '/eɡ/',            example_en: "A boiled egg is good for breakfast.", example_vi: "Một quả trứng luộc rất tốt cho bữa sáng." },
    ],
  },

  // ════════════════════════════════════════
  // LỚP 2 (SGK GLOBAL SUCCESS + MỞ RỘNG)
  // ════════════════════════════════════════

  // ── UNIT 1: AT MY BIRTHDAY PARTY ──
  {
    id: 'lop2_unit1',
    gradeId: 'lop2',
    name_vi: 'Unit 1: Tại Bữa Tiệc Sinh Nhật',
    name_en: 'Unit 1: At My Birthday Party',
    emoji: '🍕',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'lop2_u1_pasta',        en: 'Pasta',         vi: 'Mì Ý',                      emoji: '🍝',  phonetic: '/ˈpæstə/',        example_en: "I eat pasta with tomato sauce.", example_vi: "Tôi ăn mì Ý với sốt cà chua." },
      { id: 'lop2_u1_popcorn',      en: 'Popcorn',       vi: 'Bỏng ngô',                  emoji: '🍿',  phonetic: '/ˈpɒpkɔːn/',      example_en: "The popcorn is warm and yummy.", example_vi: "Bỏng ngô ấm nóng và ngon tuyệt." },
      { id: 'lop2_u1_pizza',        en: 'Pizza',         vi: 'Bánh pizza',                emoji: '🍕',  phonetic: '/ˈpiːtsə/',       example_en: "We share a cheese pizza at the party.", example_vi: "Chúng mình cùng chia nhau bánh pizza phô mai ở bữa tiệc." },
    ],
  },

  // ── UNIT 2: IN THE BACKYARD ──
  {
    id: 'lop2_unit2',
    gradeId: 'lop2',
    name_vi: 'Unit 2: Trong Sân Sau Nhà',
    name_en: 'Unit 2: In the Backyard',
    emoji: '🪁',
    color: 'from-lime-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-lime-100 to-emerald-100',
    words: [
      { id: 'lop2_u2_kite',         en: 'Kite',          vi: 'Con diều',                  emoji: '🪁',  phonetic: '/kaɪt/',          example_en: "Is she flying a kite in the backyard?", example_vi: "Cô ấy đang thả diều trong sân sau phải không?" },
      { id: 'lop2_u2_bike',         en: 'Bike',          vi: 'Xe đạp',                    emoji: '🚲',  phonetic: '/baɪk/',          example_en: "I ride my bike every afternoon.", example_vi: "Tôi đạp xe đạp mỗi buổi chiều." },
      { id: 'lop2_u2_kitten',       en: 'Kitten',        vi: 'Mèo con',                   emoji: '🐱',  phonetic: '/ˈkɪtn/',         example_en: "The cute kitten is playing with a ball.", example_vi: "Chú mèo con dễ thương đang chơi với quả bóng." },
    ],
  },

  // ── UNIT 3: AT THE SEASIDE ──
  {
    id: 'lop2_unit3',
    gradeId: 'lop2',
    name_vi: 'Unit 3: Ở Bờ Biển',
    name_en: 'Unit 3: At the Seaside',
    emoji: '🏖️',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'lop2_u3_sail',         en: 'Sail',          vi: 'Cánh buồm',                 emoji: '⛵',   phonetic: '/seɪl/',          example_en: "The white sail moves in the sea wind.", example_vi: "Cánh buồm trắng lướt đi trong gió biển." },
      { id: 'lop2_u3_sand',         en: 'Sand',          vi: 'Bãi cát',                   emoji: '🏖️', phonetic: '/sænd/',          example_en: "The yellow sand is soft and warm.", example_vi: "Bãi cát vàng mềm mại và ấm áp." },
      { id: 'lop2_u3_sea',          en: 'Sea',           vi: 'Biển',                      emoji: '🌊',  phonetic: '/siː/',           example_en: "Let's look at the blue sea!", example_vi: "Hãy cùng nhìn ra biển xanh nào!" },
    ],
  },

  // ── UNIT 4: IN THE COUNTRYSIDE ──
  {
    id: 'lop2_unit4',
    gradeId: 'lop2',
    name_vi: 'Unit 4: Ở Vùng Nông Thôn',
    name_en: 'Unit 4: In the Countryside',
    emoji: '🌈',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'lop2_u4_rainbow',      en: 'Rainbow',       vi: 'Cầu vồng',                  emoji: '🌈',  phonetic: '/ˈreɪnbəʊ/',      example_en: "I can see a colourful rainbow in the sky.", example_vi: "Tôi có thể thấy một chiếc cầu vồng rực rỡ trên bầu trời." },
      { id: 'lop2_u4_river',        en: 'River',         vi: 'Dòng sông',                 emoji: '🏞️', phonetic: '/ˈrɪvər/',        example_en: "The river flows gently through the village.", example_vi: "Dòng sông êm đềm chảy qua ngôi làng." },
      { id: 'lop2_u4_road',         en: 'Road',          vi: 'Con đường',                 emoji: '🛣️', phonetic: '/rəʊd/',          example_en: "The quiet road leads to our farmhouse.", example_vi: "Con đường yên tĩnh dẫn tới trang trại của chúng tôi." },
    ],
  },

  // ── UNIT 5: IN THE CLASSROOM ──
  {
    id: 'lop2_unit5',
    gradeId: 'lop2',
    name_vi: 'Unit 5: Trong Lớp Học',
    name_en: 'Unit 5: In the Classroom',
    emoji: '📐',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'lop2_u5_question',     en: 'Question',      vi: 'Câu hỏi',                   emoji: '❓',   phonetic: '/ˈkwestʃən/',     example_en: "Raise your hand to ask a question.", example_vi: "Hãy giơ tay khi muốn đặt câu hỏi." },
      { id: 'lop2_u5_square',       en: 'Square',        vi: 'Hình vuông',                emoji: '⏹️',  phonetic: '/skweər/',        example_en: "She draws a neat square on the paper.", example_vi: "Bạn ấy vẽ một hình vuông gọn gàng trên giấy." },
      { id: 'lop2_u5_quiz',         en: 'Quiz',          vi: 'Bài kiểm tra / Câu đố vui', emoji: '📝',  phonetic: '/kwɪz/',          example_en: "He is doing a fun English quiz.", example_vi: "Cậu ấy đang làm một bài câu đố tiếng Anh vui nhộn." },
    ],
  },

  // ── UNIT 6: ON THE FARM ──
  {
    id: 'lop2_unit6',
    gradeId: 'lop2',
    name_vi: 'Unit 6: Ở Trang Trại',
    name_en: 'Unit 6: On the Farm',
    emoji: '🦊',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'lop2_u6_box',          en: 'Box',           vi: 'Cái hộp',                   emoji: '📦',  phonetic: '/bɒks/',          example_en: "There is a wooden box on the farm.", example_vi: "Có một chiếc hộp gỗ ở trang trại." },
      { id: 'lop2_u6_fox',          en: 'Fox',           vi: 'Con cáo',                   emoji: '🦊',  phonetic: '/fɒks/',          example_en: "The clever fox is hiding behind the tree.", example_vi: "Con cáo thông minh đang trốn sau gốc cây." },
      { id: 'lop2_u6_ox',           en: 'Ox',            vi: 'Con bò đực',                emoji: '🐂',  phonetic: '/ɒks/',           example_en: "The strong ox is resting in the field.", example_vi: "Con bò đực khỏe mạnh đang nghỉ ngơi trên cánh đồng." },
    ],
  },

  // ── UNIT 7: IN THE KITCHEN ──
  {
    id: 'lop2_unit7',
    gradeId: 'lop2',
    name_vi: 'Unit 7: Trong Căn Bếp',
    name_en: 'Unit 7: In the Kitchen',
    emoji: '🧃',
    color: 'from-orange-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-rose-100',
    words: [
      { id: 'lop2_u7_juice',        en: 'Juice',         vi: 'Nước ép',                   emoji: '🧃',  phonetic: '/dʒuːs/',         example_en: "I like sweet orange juice.", example_vi: "Tôi thích uống nước cam ngọt ngào." },
      { id: 'lop2_u7_jelly',        en: 'Jelly',         vi: 'Thạch trái cây',            emoji: '🍮',  phonetic: '/ˈdʒeli/',        example_en: "The strawberry jelly is sweet and cool.", example_vi: "Món thạch dâu tây ngọt ngào và mát lạnh." },
      { id: 'lop2_u7_jam',          en: 'Jam',           vi: 'Mứt hoa quả',               emoji: '🍓',  phonetic: '/dʒæm/',          example_en: "Pass me the strawberry jam, please.", example_vi: "Làm ơn chuyền cho mình lọ mứt dâu tây với." },
    ],
  },

  // ── UNIT 8: IN THE VILLAGE ──
  {
    id: 'lop2_unit8',
    gradeId: 'lop2',
    name_vi: 'Unit 8: Ở Trong Làng',
    name_en: 'Unit 8: In the Village',
    emoji: '🏡',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    words: [
      { id: 'lop2_u8_village',      en: 'Village',       vi: 'Ngôi làng',                 emoji: '🏡',  phonetic: '/ˈvɪlɪdʒ/',       example_en: "Our village is peaceful and green.", example_vi: "Ngôi làng của chúng tôi rất thanh bình và xanh mát." },
      { id: 'lop2_u8_van',          en: 'Van',           vi: 'Xe bán tải / Xe van',       emoji: '🚐',  phonetic: '/væn/',           example_en: "Can you draw a blue van?", example_vi: "Bạn có thể vẽ một chiếc xe bán tải màu xanh không?" },
      { id: 'lop2_u8_volleyball',   en: 'Volleyball',    vi: 'Môn bóng chuyền',           emoji: '🏐',  phonetic: '/ˈvɒlibɔːl/',     example_en: "The children play volleyball together.", example_vi: "Các bạn nhỏ cùng chơi bóng chuyền với nhau." },
    ],
  },

  // ── UNIT 9: IN THE GROCERY STORE ──
  {
    id: 'lop2_unit9',
    gradeId: 'lop2',
    name_vi: 'Unit 9: Cửa Hàng Tạp Hóa',
    name_en: 'Unit 9: In the Grocery Store',
    emoji: '🛒',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'lop2_u9_yogurt',       en: 'Yogurt',        vi: 'Sữa chua',                  emoji: '🥛',  phonetic: '/ˈjɒɡət/',        example_en: "I love fresh strawberry yogurt.", example_vi: "Tôi rất thích sữa chua dâu tây tươi ngon." },
      { id: 'lop2_u9_yams',         en: 'Yams',          vi: 'Củ khoai / Củ từ',          emoji: '🍠',  phonetic: '/jæmz/',          example_en: "Mother bought some sweet yams today.", example_vi: "Hôm nay mẹ đã mua một vài củ khoai ngọt." },
      { id: 'lop2_u9_yoyos',        en: 'Yo-yos',        vi: 'Con quay Yo-yo',            emoji: '🪀',  phonetic: '/ˈjəʊjəʊz/',      example_en: "He has two colourful yo-yos.", example_vi: "Cậu ấy có hai con quay yo-yo sặc sỡ." },
    ],
  },

  // ── UNIT 10: AT THE ZOO ──
  {
    id: 'lop2_unit10',
    gradeId: 'lop2',
    name_vi: 'Unit 10: Ở Sở Thú',
    name_en: 'Unit 10: At the Zoo',
    emoji: '🦓',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'lop2_u10_zoo',         en: 'Zoo',           vi: 'Sở thú',                    emoji: '🦒',  phonetic: '/zuː/',           example_en: "Do you like visiting the zoo?", example_vi: "Bạn có thích đi thăm sở thú không?" },
      { id: 'lop2_u10_zebu',        en: 'Zebu',          vi: 'Con bò u',                  emoji: '🐂',  phonetic: '/ˈziːbuː/',       example_en: "A zebu has a big hump on its back.", example_vi: "Con bò u có một cái bướu lớn trên lưng." },
      { id: 'lop2_u10_zebra',       en: 'Zebra',         vi: 'Con ngựa vằn',              emoji: '🦓',  phonetic: '/ˈzebrə/',        example_en: "The zebra has black and white stripes.", example_vi: "Con ngựa vằn có những sọc đen và trắng." },
    ],
  },

  // ── UNIT 11: IN THE PLAYGROUND ──
  {
    id: 'lop2_unit11',
    gradeId: 'lop2',
    name_vi: 'Unit 11: Ở Sân Chơi',
    name_en: 'Unit 11: In the Playground',
    emoji: '🛝',
    color: 'from-cyan-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'lop2_u11_sliding',     en: 'Sliding',       vi: 'Đang trượt',                emoji: '🛝',  phonetic: '/ˈslaɪdɪŋ/',      example_en: "The boy is sliding down happily.", example_vi: "Cậu bé đang trượt xuống một cách vui vẻ." },
      { id: 'lop2_u11_riding',      en: 'Riding',        vi: 'Đang đi xe đạp',            emoji: '🚲',  phonetic: '/ˈraɪdɪŋ/',       example_en: "She is riding a new bicycle in the park.", example_vi: "Cô bé đang đạp một chiếc xe đạp mới trong công viên." },
      { id: 'lop2_u11_driving',     en: 'Driving',       vi: 'Đang lái xe',               emoji: '🚗',  phonetic: '/ˈdraɪvɪŋ/',      example_en: "They are driving toy cars in the playground.", example_vi: "Họ đang lái xe ô tô đồ chơi trong sân chơi." },
    ],
  },

  // ── UNIT 12: AT THE CAFÉ ──
  {
    id: 'lop2_unit12',
    gradeId: 'lop2',
    name_vi: 'Unit 12: Ở Quán Cà Phê',
    name_en: 'Unit 12: At the Café',
    emoji: '🍰',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'lop2_u12_grapes',      en: 'Grapes',        vi: 'Những quả nho',             emoji: '🍇',  phonetic: '/ɡreɪps/',        example_en: "These purple grapes are very sweet.", example_vi: "Những quả nho tím này rất ngọt." },
      { id: 'lop2_u12_cake',        en: 'Cake',          vi: 'Bánh ngọt',                 emoji: '🍰',  phonetic: '/keɪk/',          example_en: "The cake is on the table.", example_vi: "Bánh ngọt ở trên bàn." },
      { id: 'lop2_u12_table',       en: 'Table',         vi: 'Cái bàn',                   emoji: '🪑',  phonetic: '/ˈteɪbl/',        example_en: "Sit at the small table, please.", example_vi: "Mời bạn ngồi vào chiếc bàn nhỏ nhé." },
    ],
  },

  // ── UNIT 13: IN THE MATHS CLASS ──
  {
    id: 'lop2_unit13',
    gradeId: 'lop2',
    name_vi: 'Unit 13: Giờ Học Toán',
    name_en: 'Unit 13: In the Maths Class',
    emoji: '🔢',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'lop2_u13_eleven',      en: 'Eleven',        vi: 'Số 11',                     emoji: '1️⃣1️⃣', phonetic: '/ɪˈlevn/',        example_en: "What number is it? – It is eleven.", example_vi: "Đó là số mấy? – Đó là số 11." },
      { id: 'lop2_u13_thirteen',    en: 'Thirteen',      vi: 'Số 13',                     emoji: '1️⃣3️⃣', phonetic: '/ˌθɜːˈtiːn/',     example_en: "There are thirteen pencils in the box.", example_vi: "Có mười ba chiếc bút chì trong hộp." },
      { id: 'lop2_u13_fourteen',    en: 'Fourteen',      vi: 'Số 14',                     emoji: '1️⃣4️⃣', phonetic: '/ˌfɔːˈtiːn/',     example_en: "She counted fourteen little stars.", example_vi: "Cô bé đã đếm được mười bốn ngôi sao nhỏ." },
      { id: 'lop2_u13_fifteen',     en: 'Fifteen',       vi: 'Số 15',                     emoji: '1️⃣5️⃣', phonetic: '/ˌfɪfˈtiːn/',     example_en: "We have fifteen minutes of playtime.", example_vi: "Chúng mình có mười lăm phút giờ ra chơi." },
    ],
  },

  // ── UNIT 14: AT HOME ──
  {
    id: 'lop2_unit14',
    gradeId: 'lop2',
    name_vi: 'Unit 14: Ở Nhà',
    name_en: 'Unit 14: At Home',
    emoji: '👨‍👩‍👦',
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'lop2_u14_brother',     en: 'Brother',       vi: 'Anh / Em trai',             emoji: '👦',  phonetic: '/ˈbrʌðər/',       example_en: "How old is your brother? – He is nineteen.", example_vi: "Anh trai bạn bao nhiêu tuổi? – Anh ấy mười chín tuổi." },
      { id: 'lop2_u14_sister',      en: 'Sister',        vi: 'Chị / Em gái',              emoji: '👧',  phonetic: '/ˈsɪstər/',       example_en: "My sister loves listening to music.", example_vi: "Chị gái tôi rất thích nghe nhạc." },
      { id: 'lop2_u14_grandmother', en: 'Grandmother',   vi: 'Bà',                        emoji: '👵',  phonetic: '/ˈɡrænmʌðər/',    example_en: "My grandmother tells wonderful stories.", example_vi: "Bà tôi kể những câu chuyện tuyệt vời." },
    ],
  },

  // ── UNIT 15: IN THE CLOTHES SHOP ──
  {
    id: 'lop2_unit15',
    gradeId: 'lop2',
    name_vi: 'Unit 15: Cửa Hàng Quần Áo',
    name_en: 'Unit 15: In the Clothes Shop',
    emoji: '👕',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'lop2_u15_shirts',      en: 'Shirts',        vi: 'Những chiếc áo sơ mi',      emoji: '👔',  phonetic: '/ʃɜːts/',         example_en: "These shirts look very nice and clean.", example_vi: "Những chiếc áo sơ mi này trông rất đẹp và sạch sẽ." },
      { id: 'lop2_u15_shoes',       en: 'Shoes',         vi: 'Những đôi giày',            emoji: '👟',  phonetic: '/ʃuːz/',          example_en: "Where are the shoes? – Over there.", example_vi: "Những đôi giày ở đâu? – Ở đằng kia kìa." },
      { id: 'lop2_u15_shorts',      en: 'Shorts',        vi: 'Những chiếc quần đùi',      emoji: '🩳',  phonetic: '/ʃɔːts/',         example_en: "He wears blue shorts in the summer.", example_vi: "Cậu ấy mặc quần đùi màu xanh vào mùa hè." },
    ],
  },

  // ── UNIT 16: AT THE CAMPSITE ──
  {
    id: 'lop2_unit16',
    gradeId: 'lop2',
    name_vi: 'Unit 16: Điểm Cắm Trại',
    name_en: 'Unit 16: At the Campsite',
    emoji: '⛺',
    color: 'from-emerald-500 to-green-600',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'lop2_u16_tent',        en: 'Tent',          vi: 'Cái lều',                   emoji: '⛺',   phonetic: '/tent/',          example_en: "It is in the tent.", example_vi: "Nó ở trong chiếc lều." },
      { id: 'lop2_u16_teapot',      en: 'Teapot',        vi: 'Ấm pha trà',                emoji: '🫖',  phonetic: '/ˈtiːpɒt/',       example_en: "Grandpa pours warm tea from the teapot.", example_vi: "Ông rót trà ấm từ chiếc ấm trà." },
      { id: 'lop2_u16_blanket',     en: 'Blanket',       vi: 'Cái chăn / Mền ấm',         emoji: '🛋️', phonetic: '/ˈblæŋkɪt/',      example_en: "Is the blanket near the tent? – No, it is in the tent.", example_vi: "Cái chăn có ở gần lều không? – Không, nó ở trong lều." },
    ],
  },

  // ── PARTY & SWEET FOOD ──
  {
    id: 'lop2_ext_party',
    gradeId: 'lop2',
    name_vi: 'Bữa Tiệc & Đồ Ngọt',
    name_en: 'Party & Sweet Food',
    emoji: '🎉',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'lop2_ep_birthday',     en: 'Birthday',      vi: 'Sinh nhật',                 emoji: '🎂',  phonetic: '/ˈbɜːθdeɪ/',      example_en: "Today is my seventh birthday!", example_vi: "Hôm nay là sinh nhật lần thứ bảy của mình!" },
      { id: 'lop2_ep_party',        en: 'Party',         vi: 'Bữa tiệc',                  emoji: '🎈',  phonetic: '/ˈpɑːti/',        example_en: "Welcome to our fun birthday party!", example_vi: "Chào mừng các bạn đến với bữa tiệc sinh nhật vui vẻ!" },
      { id: 'lop2_ep_candle',       en: 'Candle',        vi: 'Cây nến',                   emoji: '🕯️', phonetic: '/ˈkændl/',        example_en: "Blow out the candle on the cake.", example_vi: "Hãy thổi tắt cây nến trên bánh nhé." },
      { id: 'lop2_ep_balloon',      en: 'Balloon',       vi: 'Quả bóng bay',              emoji: '🎈',  phonetic: '/bəˈluːn/',       example_en: "The red balloon flies high into the sky.", example_vi: "Quả bóng bay đỏ bay vút lên bầu trời." },
      { id: 'lop2_ep_gift',         en: 'Gift',          vi: 'Món quà',                   emoji: '🎁',  phonetic: '/ɡɪft/',          example_en: "I received a nice gift from my friend.", example_vi: "Tôi nhận được một món quà đẹp từ bạn mình." },
      { id: 'lop2_ep_icecream',     en: 'Ice cream',     vi: 'Kem lạnh',                  emoji: '🍦',  phonetic: '/ˌaɪs ˈkriːm/',   example_en: "I want a delicious chocolate ice cream.", example_vi: "Mình muốn một cây kem sô-cô-la thơm ngon." },
      { id: 'lop2_ep_chocolate',    en: 'Chocolate',     vi: 'Sô-cô-la',                  emoji: '🍫',  phonetic: '/ˈtʃɒklət/',      example_en: "Dark chocolate is sweet and rich.", example_vi: "Sô-cô-la đen ngọt ngào và béo ngậy." },
      { id: 'lop2_ep_candy',        en: 'Candy',         vi: 'Viên kẹo',                  emoji: '🍬',  phonetic: '/ˈkændi/',        example_en: "Don't eat too much candy before bed.", example_vi: "Đừng ăn quá nhiều kẹo trước khi đi ngủ nhé." },
      { id: 'lop2_ep_sweet',        en: 'Sweet',         vi: 'Đồ ngọt / Ngọt ngào',       emoji: '🍭',  phonetic: '/swiːt/',         example_en: "These cookies taste very sweet.", example_vi: "Những chiếc bánh quy này có vị rất ngọt." },
      { id: 'lop2_ep_clown',        en: 'Clown',         vi: 'Chú hề',                    emoji: '🤡',  phonetic: '/klaʊn/',         example_en: "The funny clown makes us laugh.", example_vi: "Chú hề vui tính làm chúng mình bật cười." },
    ],
  },

  // ── SEASIDE & BEACH ──
  {
    id: 'lop2_ext_beach',
    gradeId: 'lop2',
    name_vi: 'Biển & Bờ Biển',
    name_en: 'Seaside & Beach',
    emoji: '🏖️',
    color: 'from-cyan-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-teal-100',
    words: [
      { id: 'lop2_eb_sandcastle',   en: 'Sandcastle',    vi: 'Lâu đài cát',               emoji: '🏰',  phonetic: '/ˈsændkɑːsl/',    example_en: "We build a giant sandcastle together.", example_vi: "Chúng mình cùng nhau xây một lâu đài cát khổng lồ." },
      { id: 'lop2_eb_seashell',     en: 'Seashell',      vi: 'Vỏ sò / Vỏ ốc',             emoji: '🐚',  phonetic: '/ˈsiːʃel/',       example_en: "Look at this pretty pink seashell!", example_vi: "Hãy nhìn chiếc vỏ sò màu hồng xinh xắn này kìa!" },
      { id: 'lop2_eb_wave',         en: 'Wave',          vi: 'Sóng biển',                 emoji: '🌊',  phonetic: '/weɪv/',          example_en: "The ocean waves crash onto the shore.", example_vi: "Những con sóng biển xô vào bờ cát." },
      { id: 'lop2_eb_sunglasses',   en: 'Sunglasses',    vi: 'Kính râm',                  emoji: '🕶️', phonetic: '/ˈsʌnɡlɑːsɪz/',   example_en: "Wear sunglasses to protect your eyes.", example_vi: "Hãy đeo kính râm để bảo vệ mắt nhé." },
      { id: 'lop2_eb_swimsuit',     en: 'Swimsuit',      vi: 'Đồ bơi',                    emoji: '🩱',  phonetic: '/ˈswɪmsuːt/',     example_en: "Put on your swimsuit and let us swim.", example_vi: "Hãy mặc đồ bơi vào và cùng đi bơi nào." },
      { id: 'lop2_eb_towel',        en: 'Towel',         vi: 'Khăn tắm',                  emoji: '🧣',  phonetic: '/ˈtaʊəl/',        example_en: "Dry yourself with a big blue towel.", example_vi: "Hãy lau khô người bằng chiếc khăn tắm to màu xanh nhé." },
      { id: 'lop2_eb_seagull',      en: 'Seagull',       vi: 'Chim hải âu',               emoji: '🕊️', phonetic: '/ˈsiːɡʌl/',       example_en: "A white seagull flies above the waves.", example_vi: "Một chú chim hải âu trắng bay lượn trên những ngọn sóng." },
      { id: 'lop2_eb_picnic',       en: 'Picnic',        vi: 'Chuyến dã ngoại',           emoji: '🧺',  phonetic: '/ˈpɪknɪk/',       example_en: "We have a seaside picnic on sunny days.", example_vi: "Chúng mình có chuyến dã ngoại bên bờ biển vào ngày nắng đẹp." },
    ],
  },

  // ── FARM & COUNTRY ANIMALS ──
  {
    id: 'lop2_ext_farm',
    gradeId: 'lop2',
    name_vi: 'Trang Trại & Động Vật',
    name_en: 'Farm & Country Animals',
    emoji: '🌾',
    color: 'from-amber-400 to-green-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-green-100',
    words: [
      { id: 'lop2_ef_farm',         en: 'Farm',          vi: 'Trang trại',                emoji: '🚜',  phonetic: '/fɑːm/',          example_en: "My uncle works on a large vegetable farm.", example_vi: "Bác tôi làm việc tại một trang trại rau rộng lớn." },
      { id: 'lop2_ef_barn',         en: 'Barn',          vi: 'Nhà kho nông trại',         emoji: '🏚️', phonetic: '/bɑːn/',          example_en: "The animals sleep safely inside the barn.", example_vi: "Các con vật ngủ an toàn bên trong nhà kho." },
      { id: 'lop2_ef_field',        en: 'Field',         vi: 'Cánh đồng',                 emoji: '🌾',  phonetic: '/fiːld/',         example_en: "Green grass grows all over the field.", example_vi: "Cỏ xanh mọc khắp cánh đồng." },
      { id: 'lop2_ef_cow',          en: 'Cow',           vi: 'Con bò sữa',                emoji: '🐄',  phonetic: '/kaʊ/',           example_en: "The spotted cow gives us fresh milk.", example_vi: "Con bò khoang cho chúng mình sữa tươi thơm ngon." },
      { id: 'lop2_ef_sheep',        en: 'Sheep',         vi: 'Con cừu',                   emoji: '🐑',  phonetic: '/ʃiːp/',          example_en: "The fluffy white sheep is eating grass.", example_vi: "Chú cừu trắng lông xù đang thong thả ăn cỏ." },
      { id: 'lop2_ef_goat',         en: 'Goat',          vi: 'Con dê',                    emoji: '🐐',  phonetic: '/ɡəʊt/',          example_en: "The little goat climbs up the rocky hill.", example_vi: "Chú dê nhỏ leo thoăn thoắt lên ngọn đồi đá." },
      { id: 'lop2_ef_horse',        en: 'Horse',         vi: 'Con ngựa',                  emoji: '🐎',  phonetic: '/hɔːs/',          example_en: "The brown horse runs fast across the pasture.", example_vi: "Chú ngựa nâu phi nhanh qua đồng cỏ." },
      { id: 'lop2_ef_pig',          en: 'Pig',           vi: 'Con heo / Con lợn',         emoji: '🐖',  phonetic: '/pɪɡ/',           example_en: "The chubby pink pig loves playing in the mud.", example_vi: "Chú lợn hồng mập mạp rất thích nghịch bùn." },
      { id: 'lop2_ef_rooster',      en: 'Rooster',       vi: 'Con gà trống',              emoji: '🐓',  phonetic: '/ˈruːstər/',      example_en: "The rooster crows loudly every early morning.", example_vi: "Chú gà trống gáy vang vào mỗi sớm mai." },
      { id: 'lop2_ef_duck',         en: 'Duck',          vi: 'Con vịt',                   emoji: '🦆',  phonetic: '/dʌk/',           example_en: "The yellow duck swims cheerfully in the pond.", example_vi: "Chú vịt vàng bơi lội tung tăng trong ao." },
    ],
  },

  // ── FEELINGS & EMOTIONS ──
  {
    id: 'lop2_ext_emotions',
    gradeId: 'lop2',
    name_vi: 'Cảm Xúc Của Bé',
    name_en: 'Feelings & Emotions',
    emoji: '😊',
    color: 'from-yellow-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    words: [
      { id: 'lop2_ee_happy',        en: 'Happy',         vi: 'Vui vẻ / Hạnh phúc',        emoji: '😊',  phonetic: '/ˈhæpi/',         example_en: "I am happy when I see my good friends.", example_vi: "Tôi rất vui vẻ khi gặp lại những người bạn tốt." },
      { id: 'lop2_ee_sad',          en: 'Sad',           vi: 'Buồn bã',                   emoji: '😢',  phonetic: '/sæd/',           example_en: "Do not be sad, everything will be fine.", example_vi: "Đừng buồn nhé, mọi chuyện rồi sẽ ổn thôi." },
      { id: 'lop2_ee_angry',        en: 'Angry',         vi: 'Tức giận',                  emoji: '😠',  phonetic: '/ˈæŋɡri/',        example_en: "Take a deep breath when you feel angry.", example_vi: "Hãy hít thở sâu khi bạn cảm thấy tức giận." },
      { id: 'lop2_ee_tired',        en: 'Tired',         vi: 'Mệt mỏi',                   emoji: '🥱',  phonetic: '/ˈtaɪəd/',        example_en: "I feel tired after running around.", example_vi: "Tôi cảm thấy mệt mỏi sau khi chạy nhảy." },
      { id: 'lop2_ee_hungry',       en: 'Hungry',        vi: 'Đói bụng',                  emoji: '😋',  phonetic: '/ˈhʌŋɡri/',       example_en: "I am hungry, let us eat dinner together.", example_vi: "Mình đói bụng rồi, chúng mình cùng ăn tối nhé." },
      { id: 'lop2_ee_thirsty',      en: 'Thirsty',       vi: 'Khát nước',                 emoji: '🥤',  phonetic: '/ˈθɜːsti/',       example_en: "Drink clean water when you are thirsty.", example_vi: "Hãy uống nước sạch khi bạn thấy khát nhé." },
      { id: 'lop2_ee_scared',       en: 'Scared',        vi: 'Sợ hãi',                    emoji: '😨',  phonetic: '/skeəd/',         example_en: "He was scared of the loud thunder sound.", example_vi: "Cậu ấy từng thấy sợ hãi âm thanh sấm sét lớn." },
      { id: 'lop2_ee_surprised',    en: 'Surprised',     vi: 'Ngạc nhiên',                emoji: '😲',  phonetic: '/səˈpraɪzd/',     example_en: "She was surprised by the nice gift.", example_vi: "Cô bé vô cùng ngạc nhiên vì món quà xinh xắn." },
    ],
  },

  // ── WEATHER & NATURE ──
  {
    id: 'lop2_ext_weather',
    gradeId: 'lop2',
    name_vi: 'Thời Tiết & Thiên Nhiên',
    name_en: 'Weather & Nature',
    emoji: '🌤️',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'lop2_ew_sunny',        en: 'Sunny',         vi: 'Có nắng',                   emoji: '☀️',  phonetic: '/ˈsʌni/',         example_en: "It is a sunny day, let us play outside.", example_vi: "Hôm nay là một ngày nắng đẹp, hãy ra ngoài chơi nào." },
      { id: 'lop2_ew_rainy',        en: 'Rainy',         vi: 'Có mưa',                    emoji: '🌧️', phonetic: '/ˈreɪni/',        example_en: "Take an umbrella on a rainy day.", example_vi: "Hãy mang theo một chiếc ô vào ngày mưa nhé." },
      { id: 'lop2_ew_windy',        en: 'Windy',         vi: 'Có gió lớn',                emoji: '💨',  phonetic: '/ˈwɪndi/',        example_en: "It is windy, look at the dancing trees.", example_vi: "Trời có gió lớn, hãy nhìn những hàng cây đang đung đưa kìa." },
      { id: 'lop2_ew_cloudy',       en: 'Cloudy',        vi: 'Nhiều mây',                 emoji: '☁️',  phonetic: '/ˈklaʊdi/',       example_en: "The sky is cloudy this morning.", example_vi: "Bầu trời sáng nay có rất nhiều mây." },
      { id: 'lop2_ew_hot',          en: 'Hot',           vi: 'Nóng nực',                  emoji: '🥵',  phonetic: '/hɒt/',           example_en: "Summer days are very hot and bright.", example_vi: "Những ngày mùa hè rất nóng nực và chói chang." },
      { id: 'lop2_ew_cold',         en: 'Cold',          vi: 'Lạnh buốt',                 emoji: '🥶',  phonetic: '/kəʊld/',         example_en: "Wear a warm coat when it is cold.", example_vi: "Hãy mặc áo ấm khi trời trở lạnh nhé." },
      { id: 'lop2_ew_sun',          en: 'Sun',           vi: 'Mặt trời',                  emoji: '☀️',  phonetic: '/sʌn/',           example_en: "The warm sun rises in the morning.", example_vi: "Mặt trời ấm áp mọc vào buổi sớm mai." },
      { id: 'lop2_ew_cloud',        en: 'Cloud',         vi: 'Đám mây',                   emoji: '☁️',  phonetic: '/klaʊd/',         example_en: "Look at that fluffy white cloud!", example_vi: "Hãy nhìn đám mây trắng bồng bềnh kìa!" },
      { id: 'lop2_ew_sky',          en: 'Sky',           vi: 'Bầu trời',                  emoji: '🌌',  phonetic: '/skaɪ/',          example_en: "The blue sky looks clear and wide.", example_vi: "Bầu trời xanh trông thật trong trẻo và rộng lớn." },
      { id: 'lop2_ew_star',         en: 'Star',          vi: 'Ngôi sao',                  emoji: '⭐',   phonetic: '/stɑːr/',         example_en: "A bright star twinkles in the night sky.", example_vi: "Một ngôi sao sáng lấp lánh trên bầu trời đêm." },
    ],
  },

  // ── NUMBERS 11 TO 20 ──
  {
    id: 'lop2_ext_numbers',
    gradeId: 'lop2',
    name_vi: 'Số Đếm 11 Đến 20',
    name_en: 'Numbers 11 to 20',
    emoji: '🔢',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'lop2_en_eleven',       en: 'Eleven',        vi: 'Số 11 (Mười một)',          emoji: '1️⃣1️⃣', phonetic: '/ɪˈlevn/',        example_en: "I have eleven colored pencils.", example_vi: "Tôi có mười một chiếc bút chì màu." },
      { id: 'lop2_en_twelve',       en: 'Twelve',        vi: 'Số 12 (Mười hai)',          emoji: '1️⃣2️⃣', phonetic: '/twelv/',         example_en: "There are twelve months in one year.", example_vi: "Có mười hai tháng trong một năm." },
      { id: 'lop2_en_thirteen',     en: 'Thirteen',      vi: 'Số 13 (Mười ba)',           emoji: '1️⃣3️⃣', phonetic: '/ˌθɜːˈtiːn/',     example_en: "She has thirteen storybooks.", example_vi: "Cô bé có mười ba cuốn truyện." },
      { id: 'lop2_en_fourteen',     en: 'Fourteen',      vi: 'Số 14 (Mười bốn)',          emoji: '1️⃣4️⃣', phonetic: '/ˌfɔːˈtiːn/',     example_en: "Fourteen children play in the yard.", example_vi: "Mười bốn bạn nhỏ đang chơi trong sân." },
      { id: 'lop2_en_fifteen',      en: 'Fifteen',       vi: 'Số 15 (Mười lăm)',          emoji: '1️⃣5️⃣', phonetic: '/ˌfɪfˈtiːn/',     example_en: "The clock shows fifteen minutes past.", example_vi: "Đồng hồ chỉ quá mười lăm phút." },
      { id: 'lop2_en_sixteen',      en: 'Sixteen',       vi: 'Số 16 (Mười sáu)',          emoji: '1️⃣6️⃣', phonetic: '/ˌsɪksˈtiːn/',    example_en: "He solved sixteen maths problems.", example_vi: "Cậu ấy đã giải xong mười sáu bài toán." },
      { id: 'lop2_en_seventeen',    en: 'Seventeen',     vi: 'Số 17 (Mười bảy)',          emoji: '1️⃣7️⃣', phonetic: '/ˌsevnˈtiːn/',    example_en: "Seventeen birds sit on the fence.", example_vi: "Mười bảy chú chim đậu trên hàng rào." },
      { id: 'lop2_en_eighteen',     en: 'Eighteen',      vi: 'Số 18 (Mười tám)',          emoji: '1️⃣8️⃣', phonetic: '/ˌeɪˈtiːn/',      example_en: "My cousin is eighteen years old.", example_vi: "Anh họ tôi mười tám tuổi." },
      { id: 'lop2_en_nineteen',     en: 'Nineteen',      vi: 'Số 19 (Mười chín)',         emoji: '1️⃣9️⃣', phonetic: '/ˌnaɪnˈtiːn/',    example_en: "She has nineteen cute stickers.", example_vi: "Cô bé có mười chín chiếc nhãn dán xinh xắn." },
      { id: 'lop2_en_twenty',       en: 'Twenty',        vi: 'Số 20 (Hai mươi)',          emoji: '2️⃣0️⃣', phonetic: '/ˈtwenti/',       example_en: "There are twenty students in my class.", example_vi: "Có hai mươi bạn học sinh trong lớp học của tôi." },
    ],
  },

  // ── HOUSEHOLD ITEMS ──
  {
    id: 'lop2_ext_household',
    gradeId: 'lop2',
    name_vi: 'Đồ Dùng Gia Đình',
    name_en: 'Household Items',
    emoji: '🛋️',
    color: 'from-amber-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-teal-100',
    words: [
      { id: 'lop2_eh_clock',        en: 'Clock',         vi: 'Đồng hồ treo tường',        emoji: '⏰',   phonetic: '/klɒk/',          example_en: "The round clock hangs on the wall.", example_vi: "Chiếc đồng hồ tròn treo trên tường." },
      { id: 'lop2_eh_lamp',         en: 'Lamp',          vi: 'Đèn ngủ / Đèn học',         emoji: '💡',  phonetic: '/læmp/',          example_en: "Turn on the reading lamp, please.", example_vi: "Làm ơn bật chiếc đèn học lên nhé." },
      { id: 'lop2_eh_mirror',       en: 'Mirror',        vi: 'Cái gương',                 emoji: '🪞',  phonetic: '/ˈmɪrər/',        example_en: "I see my smile in the shiny mirror.", example_vi: "Tôi thấy nụ cười của mình trong tấm gương sáng." },
      { id: 'lop2_eh_sofa',         en: 'Sofa',          vi: 'Ghế sô-pha',                emoji: '🛋️', phonetic: '/ˈsəʊfə/',        example_en: "Dad is sitting on the soft sofa.", example_vi: "Bố đang ngồi trên chiếc ghế sô-pha êm ái." },
      { id: 'lop2_eh_bed',          en: 'Bed',           vi: 'Cái giường ngủ',            emoji: '🛏️', phonetic: '/bed/',           example_en: "The cat is sleeping on the bed.", example_vi: "Con mèo đang ngủ trên giường." },
      { id: 'lop2_eh_pillow',       en: 'Pillow',        vi: 'Cái gối',                   emoji: '🛌',  phonetic: '/ˈpɪləʊ/',        example_en: "My soft pillow helps me sleep well.", example_vi: "Chiếc gối mềm mại giúp tôi ngủ thật ngon." },
      { id: 'lop2_eh_television',   en: 'Television',    vi: 'Ti vi',                     emoji: '📺',  phonetic: '/ˈtelɪvɪʒn/',     example_en: "We watch cartoons on the television.", example_vi: "Chúng mình cùng xem hoạt hình trên ti vi." },
      { id: 'lop2_eh_door',         en: 'Door',          vi: 'Cửa ra vào',                emoji: '🚪',  phonetic: '/dɔːr/',          example_en: "Please close the front door gently.", example_vi: "Xin hãy đóng nhẹ cửa ra vào nhé." },
      { id: 'lop2_eh_window',       en: 'Window',        vi: 'Cửa sổ',                    emoji: '🪟',  phonetic: '/ˈwɪndəʊ/',       example_en: "The sun shines brightly through the window.", example_vi: "Ánh nắng chiếu sáng rực rỡ qua khung cửa sổ." },
    ],
  },

  // ── CLOTHES & DRESSING ──
  {
    id: 'lop2_ext_clothes',
    gradeId: 'lop2',
    name_vi: 'Trang Phục Thường Ngày',
    name_en: 'Clothes & Dressing',
    emoji: '👗',
    color: 'from-pink-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-purple-100',
    words: [
      { id: 'lop2_ec_shirt',        en: 'Shirt',         vi: 'Áo sơ mi',                  emoji: '👔',  phonetic: '/ʃɜːt/',          example_en: "He wears a clean shirt to school.", example_vi: "Cậu ấy mặc một chiếc áo sơ mi sạch sẽ đến trường." },
      { id: 'lop2_ec_tshirt',       en: 'T-shirt',       vi: 'Áo phông / Áo thun',        emoji: '👕',  phonetic: '/ˈtiː ʃɜːt/',     example_en: "I love wearing my red cotton T-shirt.", example_vi: "Tôi rất thích mặc chiếc áo thun cotton đỏ này." },
      { id: 'lop2_ec_dress',        en: 'Dress',         vi: 'Váy liền / Đầm',            emoji: '👗',  phonetic: '/dres/',          example_en: "She looks pretty in her new dress.", example_vi: "Cô bé trông thật xinh xắn trong chiếc váy mới." },
      { id: 'lop2_ec_skirt',        en: 'Skirt',         vi: 'Chân váy',                  emoji: '🩰',  phonetic: '/skɜːt/',         example_en: "Her school uniform has a blue skirt.", example_vi: "Đồng phục trường bạn ấy có chân váy màu xanh." },
      { id: 'lop2_ec_trousers',     en: 'Trousers',      vi: 'Quần dài',                  emoji: '👖',  phonetic: '/ˈtraʊzəz/',      example_en: "He put on warm trousers before going out.", example_vi: "Cậu ấy mặc chiếc quần dài ấm áp trước khi ra ngoài." },
      { id: 'lop2_ec_shorts',       en: 'Shorts',        vi: 'Quần đùi / Quần ngắn',      emoji: '🩳',  phonetic: '/ʃɔːts/',         example_en: "I wear shorts during sports class.", example_vi: "Tôi mặc quần soóc trong giờ thể thao." },
      { id: 'lop2_ec_shoes',        en: 'Shoes',         vi: 'Đôi giày',                  emoji: '👟',  phonetic: '/ʃuːz/',          example_en: "Tie your shoes before you run fast.", example_vi: "Hãy buộc dây giày trước khi bạn chạy nhanh nhé." },
      { id: 'lop2_ec_socks',        en: 'Socks',         vi: 'Đôi tất / Vớ',              emoji: '🧦',  phonetic: '/sɒks/',          example_en: "These woolly socks keep my feet warm.", example_vi: "Đôi tất len này giữ cho đôi bàn chân tôi luôn ấm." },
      { id: 'lop2_ec_hat',          en: 'Hat',           vi: 'Cái mũ / Nón',              emoji: '🧢',  phonetic: '/hæt/',           example_en: "Wear a hat when playing under the sun.", example_vi: "Hãy đội mũ khi chơi dưới ánh nắng mặt trời nhé." },
      { id: 'lop2_ec_jacket',       en: 'Jacket',        vi: 'Áo khoác ngắn',             emoji: '🧥',  phonetic: '/ˈdʒækɪt/',       example_en: "Zip up your warm jacket in winter.", example_vi: "Hãy kéo khóa chiếc áo khoác ấm vào mùa đông." },
    ],
  },

  // ── TRANSPORTATION ──
  {
    id: 'lop2_ext_transport',
    gradeId: 'lop2',
    name_vi: 'Phương Tiện Giao Thông',
    name_en: 'Transportation',
    emoji: '🚗',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'lop2_et_car',          en: 'Car',           vi: 'Xe ô tô',                   emoji: '🚗',  phonetic: '/kɑːr/',          example_en: "Our family travels in a red car.", example_vi: "Gia đình chúng tôi đi du lịch bằng chiếc ô tô màu đỏ." },
      { id: 'lop2_et_bus',          en: 'Bus',           vi: 'Xe buýt',                   emoji: '🚌',  phonetic: '/bʌs/',           example_en: "Students ride the yellow bus to school.", example_vi: "Các bạn học sinh đi xe buýt vàng đến trường." },
      { id: 'lop2_et_bike',         en: 'Bike',          vi: 'Xe đạp',                    emoji: '🚲',  phonetic: '/baɪk/',          example_en: "I ride my bike safely on the sidewalk.", example_vi: "Tôi đạp xe an toàn trên vỉa hè." },
      { id: 'lop2_et_motorbike',    en: 'Motorbike',     vi: 'Xe máy',                    emoji: '🛵',  phonetic: '/ˈməʊtəbaɪk/',    example_en: "Always wear a helmet on a motorbike.", example_vi: "Luôn đội mũ bảo hiểm khi ngồi trên xe máy." },
      { id: 'lop2_et_train',        en: 'Train',         vi: 'Tàu hỏa',                   emoji: '🚂',  phonetic: '/treɪn/',         example_en: "The long train travels very fast.", example_vi: "Đoàn tàu hỏa dài chạy rất nhanh." },
      { id: 'lop2_et_plane',        en: 'Plane',         vi: 'Máy bay',                   emoji: '✈️',  phonetic: '/pleɪn/',         example_en: "The silver plane flies above the clouds.", example_vi: "Chiếc máy bay màu bạc bay trên những đám mây." },
      { id: 'lop2_et_boat',         en: 'Boat',          vi: 'Thuyền / Ca nô',            emoji: '⛵',   phonetic: '/bəʊt/',          example_en: "The fishermen sail their boat at sunrise.", example_vi: "Các bác ngư dân chèo thuyền ra khơi lúc bình minh." },
      { id: 'lop2_et_van',          en: 'Van',           vi: 'Xe bán tải / Xe van',       emoji: '🚐',  phonetic: '/væn/',           example_en: "Can you draw a van? – Yes, I can.", example_vi: "Bạn có thể vẽ chiếc xe bán tải không? – Có, mình vẽ được." },
    ],
  },

    // ════════════════════════════════════════
  // LỚP 3 (SGK GLOBAL SUCCESS + CAMBRIDGE MỞ RỘNG - 31 UNITS)
  // ════════════════════════════════════════

  // ── STARTER: NUMBERS ──
  {
    id: 'lop3_starter',
    gradeId: 'lop3',
    name_vi: 'Starter: Khởi Động Số Đếm',
    name_en: 'Starter: Numbers',
    emoji: '🔢',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l3_s1_one',                 en: "One",               vi: "số 1",                              emoji: "1️⃣",   phonetic: "/wʌn/",               example_en: "I have one younger sister.", example_vi: "Tôi có một người em gái." },
      { id: 'l3_s1_two',                 en: "Two",               vi: "số 2",                              emoji: "2️⃣",   phonetic: "/tuː/",               example_en: "She has two lovely pets.", example_vi: "Cô bé có hai con thú cưng đáng yêu." },
      { id: 'l3_s1_three',               en: "Three",             vi: "số 3",                              emoji: "3️⃣",   phonetic: "/θriː/",              example_en: "There are three pens on the desk.", example_vi: "Có ba chiếc bút trên bàn học." },
      { id: 'l3_s1_four',                en: "Four",              vi: "số 4",                              emoji: "4️⃣",   phonetic: "/fɔːr/",              example_en: "A rectangle has four straight sides.", example_vi: "Hình chữ nhật có bốn cạnh thẳng." },
      { id: 'l3_s1_five',                en: "Five",              vi: "số 5",                              emoji: "5️⃣",   phonetic: "/faɪv/",              example_en: "We have five English classes a week.", example_vi: "Chúng mình có năm tiết tiếng Anh mỗi tuần." },
      { id: 'l3_s1_six',                 en: "Six",               vi: "số 6",                              emoji: "6️⃣",   phonetic: "/sɪks/",              example_en: "The clock shows six in the morning.", example_vi: "Đồng hồ chỉ sáu giờ sáng." },
      { id: 'l3_s1_seven',               en: "Seven",             vi: "số 7",                              emoji: "7️⃣",   phonetic: "/ˈsev.ən/",           example_en: "There are seven days in a week.", example_vi: "Có bảy ngày trong một tuần." },
      { id: 'l3_s1_eight',               en: "Eight",             vi: "số 8",                              emoji: "8️⃣",   phonetic: "/eɪt/",               example_en: "I am eight years old now.", example_vi: "Bây giờ mình tám tuổi." },
      { id: 'l3_s1_nine',                en: "Nine",              vi: "số 9",                              emoji: "9️⃣",   phonetic: "/naɪn/",              example_en: "She has nine colorful stickers.", example_vi: "Cô bé có chín chiếc nhãn dán xinh xắn." },
      { id: 'l3_s1_ten',                 en: "Ten",               vi: "số 10",                             emoji: "🔟",    phonetic: "/ten/",               example_en: "He scored ten points on the test.", example_vi: "Cậu ấy đạt mười điểm trong bài kiểm tra." },
    ],
  },

  // ── UNIT 1: HELLO ──
  {
    id: 'lop3_unit1',
    gradeId: 'lop3',
    name_vi: 'Unit 1: Xin Chào',
    name_en: 'Unit 1: Hello',
    emoji: '👋',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l3_s2_hello',               en: "Hello",             vi: "xin chào",                          emoji: "👋",    phonetic: "/həˈloʊ/",            example_en: "Hello! My name is Nam.", example_vi: "Xin chào! Mình tên là Nam." },
      { id: 'l3_s2_hi',                  en: "Hi",                vi: "chào",                              emoji: "🙋",    phonetic: "/haɪ/",               example_en: "Hi Mary! How are you today?", example_vi: "Chào Mary! Hôm nay bạn khỏe không?" },
      { id: 'l3_s2_bye',                 en: "Bye",               vi: "tạm biệt",                          emoji: "👋",    phonetic: "/baɪ/",               example_en: "Bye! See you tomorrow.", example_vi: "Tạm biệt! Hẹn gặp lại bạn ngày mai nhé." },
      { id: 'l3_s2_goodbye',             en: "Goodbye",           vi: "tạm biệt",                          emoji: "👋",    phonetic: "/ˌɡʊdˈbaɪ/",          example_en: "Goodbye teacher, have a nice day.", example_vi: "Tạm biệt cô giáo, chúc cô một ngày tốt lành." },
      { id: 'l3_s2_fine',                en: "Fine",              vi: "khỏe, tốt",                         emoji: "😊",    phonetic: "/faɪn/",              example_en: "I am fine, thank you very much.", example_vi: "Mình khỏe, cảm ơn bạn rất nhiều." },
      { id: 'l3_s2_thank_you',           en: "Thank you",         vi: "cảm ơn bạn",                        emoji: "🙏",    phonetic: "/ˈθæŋk ˌjuː/",        example_en: "Thank you for helping me.", example_vi: "Cảm ơn bạn đã giúp đỡ mình." },
      { id: 'l3_s2_how',                 en: "How",               vi: "như thế nào",                       emoji: "❓",     phonetic: "/haʊ/",               example_en: "How are you doing today?", example_vi: "Hôm nay bạn thế nào rồi?" },
    ],
  },

  // ── UNIT 2: OUR NAMES ──
  {
    id: 'lop3_unit2',
    gradeId: 'lop3',
    name_vi: 'Unit 2: Tên Của Chúng Mình',
    name_en: 'Unit 2: Our Names',
    emoji: '🏷️',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l3_s3_name',                en: "Name",              vi: "tên",                               emoji: "🏷️",   phonetic: "/neɪm/",              example_en: "What is your name? – My name is Linh.", example_vi: "Tên bạn là gì? – Tên mình là Linh." },
      { id: 'l3_s3_old',                 en: "Old",               vi: "tuổi, cũ",                          emoji: "🎂",    phonetic: "/oʊld/",              example_en: "How old are you? – I am eight years old.", example_vi: "Bạn bao nhiêu tuổi? – Mình tám tuổi." },
      { id: 'l3_s3_seven',               en: "Seven",             vi: "số 7",                              emoji: "7️⃣",   phonetic: "/ˈsev.ən/",           example_en: "There are seven days in a week.", example_vi: "Có bảy ngày trong một tuần." },
      { id: 'l3_s3_eight',               en: "Eight",             vi: "số 8",                              emoji: "8️⃣",   phonetic: "/eɪt/",               example_en: "I am eight years old now.", example_vi: "Bây giờ mình tám tuổi." },
      { id: 'l3_s3_nine',                en: "Nine",              vi: "số 9",                              emoji: "9️⃣",   phonetic: "/naɪn/",              example_en: "She has nine colorful stickers.", example_vi: "Cô bé có chín chiếc nhãn dán xinh xắn." },
      { id: 'l3_s3_ten',                 en: "Ten",               vi: "số 10",                             emoji: "🔟",    phonetic: "/ten/",               example_en: "He scored ten points on the test.", example_vi: "Cậu ấy đạt mười điểm trong bài kiểm tra." },
    ],
  },

  // ── UNIT 3: OUR FRIENDS ──
  {
    id: 'lop3_unit3',
    gradeId: 'lop3',
    name_vi: 'Unit 3: Bạn Bè Của Chúng Mình',
    name_en: 'Unit 3: Our Friends',
    emoji: '🤝',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l3_s4_friend',              en: "Friend",            vi: "bạn bè",                            emoji: "🤝",    phonetic: "/frend/",             example_en: "Peter is my best friend at school.", example_vi: "Peter là bạn thân nhất của tôi ở trường." },
      { id: 'l3_s4_teacher',             en: "Teacher",           vi: "giáo viên",                         emoji: "👩‍🏫", phonetic: "/ˈtiː.tʃɚ/",          example_en: "Our English teacher is very patient.", example_vi: "Giáo viên tiếng Anh của chúng mình rất kiên nhẫn." },
      { id: 'l3_s4_mr',                  en: "Mr",                vi: "thầy / quý ông",                    emoji: "👨‍💼", phonetic: "/ˈmɪs.tɚ/",           example_en: "Mr Loc is our favorite teacher.", example_vi: "Thầy Lộc là thầy giáo yêu thích của chúng tôi." },
      { id: 'l3_s4_ms',                  en: "Ms",                vi: "cô / quý bà",                       emoji: "👩‍💼", phonetic: "/mɪz/",               example_en: "Ms Hoa teaches us music.", example_vi: "Cô Hoa dạy chúng mình môn âm nhạc." },
      { id: 'l3_s4_this',                en: "This",              vi: "đây, cái này",                      emoji: "👉",    phonetic: "/ðɪs/",               example_en: "This is my friend Mai.", example_vi: "Đây là bạn Mai của mình." },
      { id: 'l3_s4_that',                en: "That",              vi: "kia, cái kia",                      emoji: "👉",    phonetic: "/ðæt/",               example_en: "That is our school playground.", example_vi: "Kia là sân trường của chúng mình." },
      { id: 'l3_s4_yes',                 en: "Yes",               vi: "vâng, đúng",                        emoji: "✅",     phonetic: "/jes/",               example_en: "Yes, it is my school bag.", example_vi: "Vâng, đúng là cặp sách của mình rồi." },
      { id: 'l3_s4_no',                  en: "No",                vi: "không",                             emoji: "❌",     phonetic: "/noʊ/",               example_en: "No, it is not my pencil.", example_vi: "Không, đó không phải là bút chì của mình." },
    ],
  },

  // ── UNIT 4: OUR BODIES ──
  {
    id: 'lop3_unit4',
    gradeId: 'lop3',
    name_vi: 'Unit 4: Cơ Thể Của Chúng Mình',
    name_en: 'Unit 4: Our Bodies',
    emoji: '👤',
    color: 'from-purple-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    words: [
      { id: 'l3_s5_ear',                 en: "Ear",               vi: "cái tai",                           emoji: "👂",    phonetic: "/ɪr/",                example_en: "Touch your ears gently.", example_vi: "Hãy chạm nhẹ vào đôi tai của bạn nhé." },
      { id: 'l3_s5_eye',                 en: "Eye",               vi: "con mắt",                           emoji: "👁️",   phonetic: "/aɪ/",                example_en: "Close your eyes and make a wish.", example_vi: "Hãy nhắm mắt lại và ước một điều ước." },
      { id: 'l3_s5_face',                en: "Face",              vi: "khuôn mặt",                         emoji: "😊",    phonetic: "/feɪs/",              example_en: "Wash your face every morning.", example_vi: "Hãy rửa mặt vào mỗi buổi sáng nhé." },
      { id: 'l3_s5_hair',                en: "Hair",              vi: "mái tóc",                           emoji: "💇",    phonetic: "/her/",               example_en: "She has neat black hair.", example_vi: "Cô bé có mái tóc đen gọn gàng." },
      { id: 'l3_s5_hand',                en: "Hand",              vi: "bàn tay",                           emoji: "✋",     phonetic: "/hænd/",              example_en: "Wash your hands before lunch.", example_vi: "Hãy rửa tay sạch sẽ trước bữa trưa." },
      { id: 'l3_s5_mouth',               en: "Mouth",             vi: "cái miệng",                         emoji: "👄",    phonetic: "/maʊθ/",              example_en: "Open your mouth and say Ah.", example_vi: "Hãy mở miệng ra và nói A nhé." },
      { id: 'l3_s5_nose',                en: "Nose",              vi: "cái mũi",                           emoji: "👃",    phonetic: "/noʊz/",              example_en: "Touch your nose with your finger.", example_vi: "Hãy chạm ngón tay vào chiếc mũi của bạn." },
      { id: 'l3_s5_open',                en: "Open",              vi: "mở",                                emoji: "👐",    phonetic: "/ˈoʊ.pən/",           example_en: "Open your English workbook.", example_vi: "Hãy mở vở bài tập tiếng Anh ra nhé." },
      { id: 'l3_s5_touch',               en: "Touch",             vi: "chạm vào",                          emoji: "👆",    phonetic: "/tʌtʃ/",              example_en: "Touch your toes if you can.", example_vi: "Hãy chạm vào các ngón chân nếu bạn có thể." },
    ],
  },

  // ── UNIT 5: MY HOBBIES ──
  {
    id: 'lop3_unit5',
    gradeId: 'lop3',
    name_vi: 'Unit 5: Sở Thích Của Tôi',
    name_en: 'Unit 5: My Hobbies',
    emoji: '🎨',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l3_s6_cooking',             en: "Cooking",           vi: "nấu ăn",                            emoji: "🍳",    phonetic: "/ˈkʊk.ɪŋ/",           example_en: "My father enjoys cooking tasty food.", example_vi: "Bố tôi rất thích nấu những món ăn ngon." },
      { id: 'l3_s6_dancing',             en: "Dancing",           vi: "nhảy múa",                          emoji: "💃",    phonetic: "/ˈdæn.sɪŋ/",          example_en: "She is good at dancing gracefully.", example_vi: "Cô ấy nhảy múa rất duyên dáng." },
      { id: 'l3_s6_drawing',             en: "Drawing",           vi: "vẽ tranh",                          emoji: "🎨",    phonetic: "/ˈdrɑː.ɪŋ/",          example_en: "I like drawing colorful animals.", example_vi: "Tôi thích vẽ những con vật sặc sỡ." },
      { id: 'l3_s6_painting',            en: "Painting",          vi: "tô màu / vẽ màu",                   emoji: "🖌️",   phonetic: "/ˈpeɪn.tɪŋ/",         example_en: "He is painting a pretty flower picture.", example_vi: "Cậu ấy đang vẽ màu một bức tranh hoa đẹp." },
      { id: 'l3_s6_running',             en: "Running",           vi: "chạy bộ",                           emoji: "🏃",    phonetic: "/ˈrʌn.ɪŋ/",           example_en: "Running in the park is healthy.", example_vi: "Chạy bộ trong công viên rất tốt cho sức khỏe." },
      { id: 'l3_s6_singing',             en: "Singing",           vi: "ca hát",                            emoji: "🎤",    phonetic: "/ˈsɪŋ.ɪŋ/",           example_en: "We love singing English songs together.", example_vi: "Chúng mình thích cùng nhau hát các bài hát tiếng Anh." },
      { id: 'l3_s6_swimming',            en: "Swimming",          vi: "bơi lội",                           emoji: "🏊",    phonetic: "/ˈswɪm.ɪŋ/",          example_en: "Swimming keeps us fit and cool.", example_vi: "Bơi lội giúp chúng mình khỏe mạnh và mát mẻ." },
      { id: 'l3_s6_walking',             en: "Walking",           vi: "đi bộ",                             emoji: "🚶",    phonetic: "/ˈwɑː.kɪŋ/",          example_en: "Grandpa likes walking in the garden.", example_vi: "Ông thích đi bộ dạo trong vườn." },
    ],
  },

  // ── UNIT 6: OUR SCHOOL ──
  {
    id: 'lop3_unit6',
    gradeId: 'lop3',
    name_vi: 'Unit 6: Trường Học Của Chúng Mình',
    name_en: 'Unit 6: Our School',
    emoji: '🏫',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l3_s7_art_room',            en: "Art room",          vi: "phòng mỹ thuật",                    emoji: "🎨",    phonetic: "/ˈɑːrt ˌruːm/",       example_en: "We draw pictures in the art room.", example_vi: "Chúng mình vẽ tranh trong phòng mỹ thuật." },
      { id: 'l3_s7_classroom',           en: "Classroom",         vi: "phòng học",                         emoji: "🏫",    phonetic: "/ˈklæs.ruːm/",        example_en: "Our classroom is bright and clean.", example_vi: "Lớp học của chúng mình rất sáng sủa và sạch đẹp." },
      { id: 'l3_s7_computer_room',       en: "Computer room",     vi: "phòng máy tính",                    emoji: "💻",    phonetic: "/kəmˈpjuː.t̬ɚ ˌruːm/", example_en: "We practice typing in the computer room.", example_vi: "Chúng mình luyện gõ phím trong phòng máy tính." },
      { id: 'l3_s7_gym',                 en: "Gym",               vi: "phòng thể dục",                     emoji: "🏋️",   phonetic: "/dʒɪm/",              example_en: "Students exercise in the school gym.", example_vi: "Các bạn học sinh tập thể dục trong phòng tập thể chất." },
      { id: 'l3_s7_library',             en: "Library",           vi: "thư viện",                          emoji: "📚",    phonetic: "/ˈlaɪ.brer.i/",       example_en: "Read quiet storybooks in the library.", example_vi: "Hãy đọc truyện thật yên tĩnh trong thư viện." },
      { id: 'l3_s7_music_room',          en: "Music room",        vi: "phòng âm nhạc",                     emoji: "🎵",    phonetic: "/ˈmjuː.zɪk ˌruːm/",   example_en: "We sing songs in the music room.", example_vi: "Chúng mình hát các bài ca trong phòng âm nhạc." },
      { id: 'l3_s7_playground',          en: "Playground",        vi: "sân trường",                        emoji: "🛝",    phonetic: "/ˈpleɪ.ɡraʊnd/",      example_en: "Children play games in the playground.", example_vi: "Các bạn nhỏ chơi trò chơi trên sân trường." },
      { id: 'l3_s7_school',              en: "School",            vi: "trường học",                        emoji: "🏫",    phonetic: "/skuːl/",             example_en: "I love going to my primary school.", example_vi: "Tôi rất yêu quý ngôi trường tiểu học của mình." },
    ],
  },

  // ── UNIT 7: CLASSROOM INSTRUCTIONS ──
  {
    id: 'lop3_unit7',
    gradeId: 'lop3',
    name_vi: 'Unit 7: Khẩu Lệnh Trong Lớp',
    name_en: 'Unit 7: Classroom Instructions',
    emoji: '📢',
    color: 'from-teal-400 to-green-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-green-100',
    words: [
      { id: 'l3_s8_close',               en: "Close",             vi: "đóng lại",                          emoji: "🚪",    phonetic: "/kloʊz/",             example_en: "Close your books, please.", example_vi: "Làm ơn hãy gấp sách lại nhé." },
      { id: 'l3_s8_come_in',             en: "Come in",           vi: "đi vào",                            emoji: "🚶",    phonetic: "/kʌm ɪn/",            example_en: "May I come in, teacher? – Yes, you can.", example_vi: "Em xin phép vào lớp ạ? – Được, em vào đi." },
      { id: 'l3_s8_go_out',              en: "Go out",            vi: "đi ra ngoài",                       emoji: "🚪",    phonetic: "/ɡoʊ aʊt/",           example_en: "May I go out for water, please?", example_vi: "Em xin phép ra ngoài uống nước được không ạ?" },
      { id: 'l3_s8_sit_down',            en: "Sit down",          vi: "ngồi xuống",                        emoji: "🪑",    phonetic: "/sɪt daʊn/",          example_en: "Please sit down at your desk.", example_vi: "Xin mời các em ngồi xuống bàn học." },
      { id: 'l3_s8_speak',               en: "Speak",             vi: "nói",                               emoji: "🗣️",   phonetic: "/spiːk/",             example_en: "Speak English clearly, please.", example_vi: "Làm ơn hãy nói tiếng Anh rõ ràng nhé." },
      { id: 'l3_s8_stand_up',            en: "Stand up",          vi: "đứng dậy",                          emoji: "🧍",    phonetic: "/stænd ʌp/",          example_en: "Stand up and stretch your arms.", example_vi: "Hãy đứng dậy và vươn vai nào." },
    ],
  },

  // ── UNIT 8: MY SCHOOL THINGS ──
  {
    id: 'lop3_unit8',
    gradeId: 'lop3',
    name_vi: 'Unit 8: Đồ Dùng Học Tập Của Tôi',
    name_en: 'Unit 8: My School Things',
    emoji: '🎒',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-100 to-emerald-100',
    words: [
      { id: 'l3_s9_book',                en: "Book",              vi: "quyển sách",                        emoji: "📖",    phonetic: "/bʊk/",               example_en: "This is a nice book.", example_vi: "Đây là quyển sách." },
      { id: 'l3_s9_eraser',              en: "Eraser",            vi: "cục tẩy",                           emoji: "🧼",    phonetic: "/ɪˈreɪ.sɚ/",          example_en: "Use an eraser to fix your drawing.", example_vi: "Dùng cục tẩy để sửa lại nét vẽ của bạn nhé." },
      { id: 'l3_s9_notebook',            en: "Notebook",          vi: "vở ghi",                            emoji: "📓",    phonetic: "/ˈnoʊt.bʊk/",         example_en: "This is a nice notebook.", example_vi: "Đây là vở ghi." },
      { id: 'l3_s9_pen',                 en: "Pen",               vi: "bút mực",                           emoji: "🖊️",   phonetic: "/pen/",               example_en: "This is a nice pen.", example_vi: "Đây là bút mực." },
      { id: 'l3_s9_pencil',              en: "Pencil",            vi: "bút chì",                           emoji: "✏️",    phonetic: "/ˈpen.səl/",          example_en: "This is a nice pencil.", example_vi: "Đây là bút chì." },
      { id: 'l3_s9_pencil_case',         en: "Pencil case",       vi: "hộp bút",                           emoji: "👝",    phonetic: "/ˈpen.səl ˌkeɪs/",    example_en: "My pencil case holds colorful pens.", example_vi: "Hộp bút của tôi đựng những chiếc bút sặc sỡ." },
      { id: 'l3_s9_ruler',               en: "Ruler",             vi: "thước kẻ",                          emoji: "📏",    phonetic: "/ˈruː.lɚ/",           example_en: "This is a nice ruler.", example_vi: "Đây là thước kẻ." },
      { id: 'l3_s9_school_bag',          en: "School bag",        vi: "cặp sách",                          emoji: "🎒",    phonetic: "/ˈskuːl.bæɡ/",        example_en: "Put your books inside your school bag.", example_vi: "Hãy cất sách vào trong cặp đi học nhé." },
    ],
  },

  // ── UNIT 9: COLOURS ──
  {
    id: 'lop3_unit9',
    gradeId: 'lop3',
    name_vi: 'Unit 9: Màu Sắc',
    name_en: 'Unit 9: Colours',
    emoji: '🎨',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l3_s10_black',              en: "Black",             vi: "màu đen",                           emoji: "⚫",     phonetic: "/blæk/",              example_en: "This is a nice black.", example_vi: "Đây là màu đen." },
      { id: 'l3_s10_blue',               en: "Blue",              vi: "màu xanh dương",                    emoji: "🔵",    phonetic: "/bluː/",              example_en: "This is a nice blue.", example_vi: "Đây là màu xanh dương." },
      { id: 'l3_s10_brown',              en: "Brown",             vi: "màu nâu",                           emoji: "🟤",    phonetic: "/braʊn/",             example_en: "This is a nice brown.", example_vi: "Đây là màu nâu." },
      { id: 'l3_s10_colour',             en: "Colour",            vi: "màu sắc",                           emoji: "🎨",    phonetic: "/ˈkʌl.ɚ/",            example_en: "This is a nice colour.", example_vi: "Đây là màu sắc." },
      { id: 'l3_s10_green',              en: "Green",             vi: "màu xanh lá",                       emoji: "🟢",    phonetic: "/ɡriːn/",             example_en: "This is a nice green.", example_vi: "Đây là màu xanh lá." },
      { id: 'l3_s10_orange',             en: "Orange",            vi: "màu cam",                           emoji: "🟠",    phonetic: "/ˈɔːr.ɪndʒ/",         example_en: "This is a nice orange.", example_vi: "Đây là màu cam." },
      { id: 'l3_s10_red',                en: "Red",               vi: "màu đỏ",                            emoji: "🔴",    phonetic: "/red/",               example_en: "This is a nice red.", example_vi: "Đây là màu đỏ." },
      { id: 'l3_s10_white',              en: "White",             vi: "màu trắng",                         emoji: "⚪",     phonetic: "/waɪt/",              example_en: "This is a nice white.", example_vi: "Đây là màu trắng." },
      { id: 'l3_s10_yellow',             en: "Yellow",            vi: "màu vàng",                          emoji: "🟡",    phonetic: "/ˈjel.oʊ/",           example_en: "This is a nice yellow.", example_vi: "Đây là màu vàng." },
    ],
  },

  // ── UNIT 10: BREAK TIME ACTIVITIES ──
  {
    id: 'lop3_unit10',
    gradeId: 'lop3',
    name_vi: 'Unit 10: Hoạt Động Giờ Ra Chơi',
    name_en: 'Unit 10: Break Time Activities',
    emoji: '⚽',
    color: 'from-orange-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-rose-100',
    words: [
      { id: 'l3_s11_break_time',         en: "Break time",        vi: "giờ giải lao",                      emoji: "⏰",     phonetic: "/ˈbreɪk ˌtaɪm/",      example_en: "We have fun during break time.", example_vi: "Chúng mình vui chơi thoải mái trong giờ giải lao." },
      { id: 'l3_s11_chat',               en: "Chat",              vi: "trò chuyện",                        emoji: "💬",    phonetic: "/tʃæt/",              example_en: "I chat with my friends under the tree.", example_vi: "Tôi trò chuyện với bạn bè dưới tán cây." },
      { id: 'l3_s11_do_word_puzzles',    en: "Do word puzzles",   vi: "giải đố chữ",                       emoji: "🧩",    phonetic: "/duː wɝːd ˈpʌz.əlz/", example_en: "They like to do word puzzles together.", example_vi: "Các bạn ấy thích cùng nhau giải đố chữ." },
      { id: 'l3_s11_play_badminton',     en: "Play badminton",    vi: "chơi cầu lông",                     emoji: "🏸",    phonetic: "/pleɪ ˈbæd.mɪn.tən/", example_en: "We play badminton in the gym.", example_vi: "Chúng mình chơi cầu lông trong nhà tập thể thao." },
      { id: 'l3_s11_play_basketball',    en: "Play basketball",   vi: "chơi bóng rổ",                      emoji: "🏀",    phonetic: "/pleɪ ˈbæs.kət.bɑːl/", example_en: "He can play basketball very well.", example_vi: "Cậu ấy chơi bóng rổ rất cừ khôi." },
      { id: 'l3_s11_play_chess',         en: "Play chess",        vi: "chơi cờ",                           emoji: "♟️",    phonetic: "/pleɪ tʃes/",         example_en: "Dad taught me how to play chess.", example_vi: "Bố đã dạy tôi cách chơi cờ vua." },
      { id: 'l3_s11_play_football',      en: "Play football",     vi: "chơi đá bóng",                      emoji: "⚽",     phonetic: "/pleɪ ˈfʊt.bɑːl/",    example_en: "Boys play football on the green pitch.", example_vi: "Các bạn nam đá bóng trên sân cỏ xanh." },
      { id: 'l3_s11_play_table_tennis',  en: "Play table tennis", vi: "chơi bóng bàn",                     emoji: "🏓",    phonetic: "/pleɪ ˈteɪ.bəl ˌten.ɪs/", example_en: "Let's play table tennis after school.", example_vi: "Chúng mình cùng chơi bóng bàn sau giờ học nhé." },
      { id: 'l3_s11_play_volleyball',    en: "Play volleyball",   vi: "chơi bóng chuyền",                  emoji: "🏐",    phonetic: "/pleɪ ˈvɑː.li.bɑːl/", example_en: "They play volleyball in the yard.", example_vi: "Họ chơi bóng chuyền trong sân trường." },
    ],
  },

  // ── UNIT 11: MY FAMILY ──
  {
    id: 'lop3_unit11',
    gradeId: 'lop3',
    name_vi: 'Unit 11: Gia Đình Của Tôi',
    name_en: 'Unit 11: My Family',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l3_s12_brother',            en: "Brother",           vi: "anh / em trai",                     emoji: "👦",    phonetic: "/ˈbrʌð.ɚ/",           example_en: "This is a nice brother.", example_vi: "Đây là anh / em trai." },
      { id: 'l3_s12_father',             en: "Father",            vi: "bố",                                emoji: "👨",    phonetic: "/ˈfɑː.ðɚ/",           example_en: "This is a nice father.", example_vi: "Đây là bố." },
      { id: 'l3_s12_mother',             en: "Mother",            vi: "mẹ",                                emoji: "👩",    phonetic: "/ˈmʌð.ɚ/",            example_en: "This is a nice mother.", example_vi: "Đây là mẹ." },
      { id: 'l3_s12_sister',             en: "Sister",            vi: "chị / em gái",                      emoji: "👧",    phonetic: "/ˈsɪs.tɚ/",           example_en: "This is a nice sister.", example_vi: "Đây là chị / em gái." },
      { id: 'l3_s12_sure',               en: "Sure",              vi: "chắc chắn",                         emoji: "👌",    phonetic: "/ʃʊr/",               example_en: "This is a nice sure.", example_vi: "Đây là chắc chắn." },
      { id: 'l3_s12_eleven',             en: "Eleven",            vi: "11",                                emoji: "1️⃣1️⃣", phonetic: "/ɪˈlev.ən/",          example_en: "There are eleven players on the field.", example_vi: "Có mười một cầu thủ trên sân." },
      { id: 'l3_s12_twelve',             en: "Twelve",            vi: "12",                                emoji: "1️⃣2️⃣", phonetic: "/twelv/",             example_en: "Twelve months make one year.", example_vi: "Mười hai tháng tạo thành một năm." },
      { id: 'l3_s12_thirteen',           en: "Thirteen",          vi: "13",                                emoji: "1️⃣3️⃣", phonetic: "/ˌθɝːˈtiːn/",         example_en: "My cousin is thirteen years old.", example_vi: "Anh họ tôi mười ba tuổi." },
      { id: 'l3_s12_fourteen',           en: "Fourteen",          vi: "14",                                emoji: "1️⃣4️⃣", phonetic: "/ˌfɔːrˈtiːn/",        example_en: "She read fourteen story books.", example_vi: "Cô bé đã đọc mười bốn cuốn truyện." },
      { id: 'l3_s12_fifteen',            en: "Fifteen",           vi: "15",                                emoji: "1️⃣5️⃣", phonetic: "/ˌfɪfˈtiːn/",         example_en: "Fifteen minutes of recess is fun.", example_vi: "Mười lăm phút ra chơi thật vui vẻ." },
      { id: 'l3_s12_sixteen',            en: "Sixteen",           vi: "16",                                emoji: "1️⃣6️⃣", phonetic: "/ˌsɪkˈstiːn/",        example_en: "He solved sixteen puzzle pieces.", example_vi: "Cậu ấy đã ghép được mười sáu mảnh ghép." },
      { id: 'l3_s12_seventeen',          en: "Seventeen",         vi: "17",                                emoji: "1️⃣7️⃣", phonetic: "/ˌsev.ənˈtiːn/",      example_en: "Seventeen flowers bloom today.", example_vi: "Mười bảy bông hoa nở rộ hôm nay." },
      { id: 'l3_s12_eighteen',           en: "Eighteen",          vi: "18",                                emoji: "1️⃣8️⃣", phonetic: "/ˌeɪˈtiːn/",          example_en: "There are eighteen birds on the fence.", example_vi: "Có mười tám chú chim trên hàng rào." },
      { id: 'l3_s12_nineteen',           en: "Nineteen",          vi: "19",                                emoji: "1️⃣9️⃣", phonetic: "/ˌnaɪnˈtiːn/",        example_en: "She has nineteen shiny marbles.", example_vi: "Cô bé có mười chín viên bi sáng lấp lánh." },
      { id: 'l3_s12_twenty',             en: "Twenty",            vi: "20",                                emoji: "2️⃣0️⃣", phonetic: "/ˈtwen.ti/",          example_en: "Twenty students study in our class.", example_vi: "Có hai mươi bạn học sinh trong lớp chúng tôi." },
    ],
  },

  // ── UNIT 12: JOBS ──
  {
    id: 'lop3_unit12',
    gradeId: 'lop3',
    name_vi: 'Unit 12: Nghề Nghiệp',
    name_en: 'Unit 12: Jobs',
    emoji: '💼',
    color: 'from-cyan-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l3_s13_cook',               en: "Cook",              vi: "đầu bếp",                           emoji: "👨‍🍳", phonetic: "/kʊk/",               example_en: "This is a nice cook.", example_vi: "Đây là đầu bếp." },
      { id: 'l3_s13_doctor',             en: "Doctor",            vi: "bác sĩ",                            emoji: "👨‍⚕️", phonetic: "/ˈdɑːk.tɚ/",          example_en: "The caring doctor helps sick people.", example_vi: "Bác sĩ chu đáo tận tình giúp đỡ người ốm." },
      { id: 'l3_s13_driver',             en: "Driver",            vi: "tài xế",                            emoji: "🚗",    phonetic: "/ˈdraɪ.vɚ/",          example_en: "The bus driver drives safely.", example_vi: "Bác tài xế xe buýt lái xe rất an toàn." },
      { id: 'l3_s13_farmer',             en: "Farmer",            vi: "nông dân",                          emoji: "👨‍🌾", phonetic: "/ˈfɑːr.mɚ/",          example_en: "The hard-working farmer grows rice.", example_vi: "Bác nông dân chăm chỉ trồng lúa." },
      { id: 'l3_s13_job',                en: "Job",               vi: "nghề nghiệp",                       emoji: "💼",    phonetic: "/dʒɑːb/",             example_en: "This is a nice job.", example_vi: "Đây là nghề nghiệp." },
      { id: 'l3_s13_nurse',              en: "Nurse",             vi: "y tá",                              emoji: "👩‍⚕️", phonetic: "/nɝːs/",              example_en: "The kind nurse looks after patients.", example_vi: "Cô y tá tốt bụng chăm sóc cho các bệnh nhân." },
      { id: 'l3_s13_singer',             en: "Singer",            vi: "ca sĩ",                             emoji: "🎤",    phonetic: "/ˈsɪŋ.ɚ/",            example_en: "The famous singer has a sweet voice.", example_vi: "Ca sĩ nổi tiếng có một giọng hát ngọt ngào." },
      { id: 'l3_s13_teacher',            en: "Teacher",           vi: "giáo viên",                         emoji: "👩‍🏫", phonetic: "/ˈtiː.tʃɚ/",          example_en: "Our English teacher is very patient.", example_vi: "Giáo viên tiếng Anh của chúng mình rất kiên nhẫn." },
      { id: 'l3_s13_worker',             en: "Worker",            vi: "công nhân",                         emoji: "👷",    phonetic: "/ˈwɝː.kɚ/",           example_en: "My uncle is a factory worker.", example_vi: "Chú tôi là một công nhân nhà máy." },
    ],
  },

  // ── UNIT 13: MY HOUSE ──
  {
    id: 'lop3_unit13',
    gradeId: 'lop3',
    name_vi: 'Unit 13: Ngôi Nhà Của Tôi',
    name_en: 'Unit 13: My House',
    emoji: '🏡',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l3_s14_bathroom',           en: "Bathroom",          vi: "phòng tắm",                         emoji: "🛁",    phonetic: "/ˈbæθ.ruːm/",         example_en: "This is a nice bathroom.", example_vi: "Đây là phòng tắm." },
      { id: 'l3_s14_bedroom',            en: "Bedroom",           vi: "phòng ngủ",                         emoji: "🛏️",   phonetic: "/ˈbed.ruːm/",         example_en: "This is a nice bedroom.", example_vi: "Đây là phòng ngủ." },
      { id: 'l3_s14_chair',              en: "Chair",             vi: "cái ghế",                           emoji: "🪑",    phonetic: "/tʃer/",              example_en: "This is a nice chair.", example_vi: "Đây là cái ghế." },
      { id: 'l3_s14_house',              en: "House",             vi: "ngôi nhà",                          emoji: "🏡",    phonetic: "/haʊs/",              example_en: "This is a nice house.", example_vi: "Đây là ngôi nhà." },
      { id: 'l3_s14_kitchen',            en: "Kitchen",           vi: "nhà bếp",                           emoji: "🍳",    phonetic: "/ˈkɪtʃ.ən/",          example_en: "This is a nice kitchen.", example_vi: "Đây là nhà bếp." },
      { id: 'l3_s14_lamp',               en: "Lamp",              vi: "đèn",                               emoji: "💡",    phonetic: "/læmp/",              example_en: "This is a nice lamp.", example_vi: "Đây là đèn." },
      { id: 'l3_s14_living_room',        en: "Living room",       vi: "phòng khách",                       emoji: "🛋️",   phonetic: "/ˈlɪv.ɪŋ ˌruːm/",     example_en: "This is a nice living room.", example_vi: "Đây là phòng khách." },
      { id: 'l3_s14_table',              en: "Table",             vi: "cái bàn",                           emoji: "🪑",    phonetic: "/ˈteɪ.bəl/",          example_en: "This is a nice table.", example_vi: "Đây là cái bàn." },
      { id: 'l3_s14_in',                 en: "In",                vi: "ở trong",                           emoji: "📥",    phonetic: "/ɪn/",                example_en: "This is a nice in.", example_vi: "Đây là ở trong." },
      { id: 'l3_s14_on',                 en: "On",                vi: "ở trên",                            emoji: "🔝",    phonetic: "/ɑːn/",               example_en: "This is a nice on.", example_vi: "Đây là ở trên." },
      { id: 'l3_s14_here',               en: "Here",              vi: "ở đây",                             emoji: "📍",    phonetic: "/hɪr/",               example_en: "This is a nice here.", example_vi: "Đây là ở đây." },
      { id: 'l3_s14_there',              en: "There",             vi: "ở đó",                              emoji: "👉",    phonetic: "/ðer/",               example_en: "This is a nice there.", example_vi: "Đây là ở đó." },
    ],
  },

  // ── UNIT 14: MY BEDROOM ──
  {
    id: 'lop3_unit14',
    gradeId: 'lop3',
    name_vi: 'Unit 14: Phòng Ngủ Của Tôi',
    name_en: 'Unit 14: My Bedroom',
    emoji: '🛏️',
    color: 'from-indigo-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l3_s15_bed',                en: "Bed",               vi: "cái giường",                        emoji: "🛏️",   phonetic: "/bed/",               example_en: "This is a nice bed.", example_vi: "Đây là cái giường." },
      { id: 'l3_s15_big',                en: "Big",               vi: "to, lớn",                           emoji: "🐘",    phonetic: "/bɪɡ/",               example_en: "This is a nice big.", example_vi: "Đây là to, lớn." },
      { id: 'l3_s15_desk',               en: "Desk",              vi: "bàn học",                           emoji: "🪑",    phonetic: "/desk/",              example_en: "This is a nice desk.", example_vi: "Đây là bàn học." },
      { id: 'l3_s15_door',               en: "Door",              vi: "cửa ra vào",                        emoji: "🚪",    phonetic: "/dɔːr/",              example_en: "This is a nice door.", example_vi: "Đây là cửa ra vào." },
      { id: 'l3_s15_new',                en: "New",               vi: "mới",                               emoji: "✨",     phonetic: "/nuː/",               example_en: "This is a nice new.", example_vi: "Đây là mới." },
      { id: 'l3_s15_old',                en: "Old",               vi: "cũ",                                emoji: "🎂",    phonetic: "/oʊld/",              example_en: "How old are you? – I am eight years old.", example_vi: "Bạn bao nhiêu tuổi? – Mình tám tuổi." },
      { id: 'l3_s15_room',               en: "Room",              vi: "phòng",                             emoji: "🚪",    phonetic: "/ruːm/",              example_en: "This is a nice room.", example_vi: "Đây là phòng." },
      { id: 'l3_s15_small',              en: "Small",             vi: "nhỏ",                               emoji: "🐭",    phonetic: "/smɑːl/",             example_en: "This is a nice small.", example_vi: "Đây là nhỏ." },
      { id: 'l3_s15_window',             en: "Window",            vi: "cửa sổ",                            emoji: "🪟",    phonetic: "/ˈwɪn.doʊ/",          example_en: "This is a nice window.", example_vi: "Đây là cửa sổ." },
    ],
  },

  // ── UNIT 15: AT THE DINING TABLE ──
  {
    id: 'lop3_unit15',
    gradeId: 'lop3',
    name_vi: 'Unit 15: Trên Bàn Ăn',
    name_en: 'Unit 15: At the Dining Table',
    emoji: '🍽️',
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    words: [
      { id: 'l3_s16_bean',               en: "Bean",              vi: "hạt đậu",                           emoji: "🫘",    phonetic: "/biːn/",              example_en: "This is a nice bean.", example_vi: "Đây là hạt đậu." },
      { id: 'l3_s16_bread',              en: "Bread",             vi: "bánh mì",                           emoji: "🍞",    phonetic: "/bred/",              example_en: "This is a nice bread.", example_vi: "Đây là bánh mì." },
      { id: 'l3_s16_chicken',            en: "Chicken",           vi: "thịt gà",                           emoji: "🍗",    phonetic: "/ˈtʃɪk.ɪn/",          example_en: "This is a nice chicken.", example_vi: "Đây là thịt gà." },
      { id: 'l3_s16_egg',                en: "Egg",               vi: "quả trứng",                         emoji: "🥚",    phonetic: "/eɡ/",                example_en: "This is a nice egg.", example_vi: "Đây là quả trứng." },
      { id: 'l3_s16_fish',               en: "Fish",              vi: "cá",                                emoji: "🐟",    phonetic: "/fɪʃ/",               example_en: "This is a nice fish.", example_vi: "Đây là cá." },
      { id: 'l3_s16_juice',              en: "Juice",             vi: "nước ép",                           emoji: "🧃",    phonetic: "/dʒuːs/",             example_en: "This is a nice juice.", example_vi: "Đây là nước ép." },
      { id: 'l3_s16_meat',               en: "Meat",              vi: "thịt",                              emoji: "🥩",    phonetic: "/miːt/",              example_en: "This is a nice meat.", example_vi: "Đây là thịt." },
      { id: 'l3_s16_milk',               en: "Milk",              vi: "sữa",                               emoji: "🥛",    phonetic: "/mɪlk/",              example_en: "This is a nice milk.", example_vi: "Đây là sữa." },
      { id: 'l3_s16_rice',               en: "Rice",              vi: "cơm / gạo",                         emoji: "🍚",    phonetic: "/raɪs/",              example_en: "This is a nice rice.", example_vi: "Đây là cơm / gạo." },
      { id: 'l3_s16_water',              en: "Water",             vi: "nước uống",                         emoji: "💧",    phonetic: "/ˈwɑː.t̬ɚ/",          example_en: "This is a nice water.", example_vi: "Đây là nước uống." },
    ],
  },

  // ── UNIT 16: MY PETS ──
  {
    id: 'lop3_unit16',
    gradeId: 'lop3',
    name_vi: 'Unit 16: Thú Cưng Của Tôi',
    name_en: 'Unit 16: My Pets',
    emoji: '🐶',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l3_s17_bird',               en: "Bird",              vi: "con chim",                          emoji: "🐦",    phonetic: "/bɝːd/",              example_en: "This is a nice bird.", example_vi: "Đây là con chim." },
      { id: 'l3_s17_cat',                en: "Cat",               vi: "con mèo",                           emoji: "🐱",    phonetic: "/kæt/",               example_en: "This is a nice cat.", example_vi: "Đây là con mèo." },
      { id: 'l3_s17_dog',                en: "Dog",               vi: "con chó",                           emoji: "🐶",    phonetic: "/dɑːɡ/",              example_en: "This is a nice dog.", example_vi: "Đây là con chó." },
      { id: 'l3_s17_goldfish',           en: "Goldfish",          vi: "cá vàng",                           emoji: "🐠",    phonetic: "/ˈɡoʊld.fɪʃ/",        example_en: "This is a nice goldfish.", example_vi: "Đây là cá vàng." },
      { id: 'l3_s17_parrot',             en: "Parrot",            vi: "con vẹt",                           emoji: "🦜",    phonetic: "/ˈpær.ət/",           example_en: "This is a nice parrot.", example_vi: "Đây là con vẹt." },
      { id: 'l3_s17_rabbit',             en: "Rabbit",            vi: "con thỏ",                           emoji: "🐰",    phonetic: "/ˈræb.ɪt/",           example_en: "This is a nice rabbit.", example_vi: "Đây là con thỏ." },
      { id: 'l3_s17_many',               en: "Many",              vi: "nhiều",                             emoji: "🔢",    phonetic: "/ˈmen.i/",            example_en: "This is a nice many.", example_vi: "Đây là nhiều." },
      { id: 'l3_s17_some',               en: "Some",              vi: "một vài",                           emoji: "🥣",    phonetic: "/sʌm/",               example_en: "This is a nice some.", example_vi: "Đây là một vài." },
    ],
  },

  // ── UNIT 17: OUR TOYS ──
  {
    id: 'lop3_unit17',
    gradeId: 'lop3',
    name_vi: 'Unit 17: Đồ Chơi Của Chúng Mình',
    name_en: 'Unit 17: Our Toys',
    emoji: '🧸',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l3_s18_bus',                en: "Bus",               vi: "xe buýt",                           emoji: "🚌",    phonetic: "/bʌs/",               example_en: "This is a nice bus.", example_vi: "Đây là xe buýt." },
      { id: 'l3_s18_car',                en: "Car",               vi: "ô tô",                              emoji: "🚗",    phonetic: "/kɑːr/",              example_en: "This is a nice car.", example_vi: "Đây là ô tô." },
      { id: 'l3_s18_kite',               en: "Kite",              vi: "con diều",                          emoji: "🪁",    phonetic: "/kaɪt/",              example_en: "This is a nice kite.", example_vi: "Đây là con diều." },
      { id: 'l3_s18_plane',              en: "Plane",             vi: "máy bay",                           emoji: "✈️",    phonetic: "/pleɪn/",             example_en: "This is a nice plane.", example_vi: "Đây là máy bay." },
      { id: 'l3_s18_ship',               en: "Ship",              vi: "tàu thủy",                          emoji: "🚢",    phonetic: "/ʃɪp/",               example_en: "This is a nice ship.", example_vi: "Đây là tàu thủy." },
      { id: 'l3_s18_teddy_bear',         en: "Teddy bear",        vi: "gấu bông",                          emoji: "🧸",    phonetic: "/ˈted.i ˌber/",       example_en: "This is a nice teddy bear.", example_vi: "Đây là gấu bông." },
      { id: 'l3_s18_toy',                en: "Toy",               vi: "đồ chơi",                           emoji: "🧸",    phonetic: "/tɔɪ/",               example_en: "This is a nice toy.", example_vi: "Đây là đồ chơi." },
      { id: 'l3_s18_train',              en: "Train",             vi: "tàu hỏa",                           emoji: "🚂",    phonetic: "/treɪn/",             example_en: "This is a nice train.", example_vi: "Đây là tàu hỏa." },
      { id: 'l3_s18_truck',              en: "Truck",             vi: "xe tải",                            emoji: "🚚",    phonetic: "/trʌk/",              example_en: "This is a nice truck.", example_vi: "Đây là xe tải." },
    ],
  },

  // ── UNIT 18: PLAYING AND DOING ──
  {
    id: 'lop3_unit18',
    gradeId: 'lop3',
    name_vi: 'Unit 18: Vui Chơi & Hoạt Động',
    name_en: 'Unit 18: Playing and Doing',
    emoji: '🎮',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l3_s19_dancing',            en: "Dancing",           vi: "đang nhảy múa",                     emoji: "💃",    phonetic: "/ˈdæn.sɪŋ/",          example_en: "She is good at dancing gracefully.", example_vi: "Cô ấy nhảy múa rất duyên dáng." },
      { id: 'l3_s19_drawing_a_picture',  en: "Drawing a picture", vi: "đang vẽ tranh",                     emoji: "🎨",    phonetic: "/ˈdrɑː.ɪŋ ə ˈpɪk.tʃɚ/", example_en: "She is drawing a picture of her house.", example_vi: "Cô bé đang vẽ một bức tranh về ngôi nhà của mình." },
      { id: 'l3_s19_listening_to_music', en: "Listening to music", vi: "đang nghe nhạc",                    emoji: "🎧",    phonetic: "/ˈlɪs.ən.ɪŋ tuː ˈmjuː.zɪk/", example_en: "He is listening to cheerful music.", example_vi: "Cậu ấy đang lắng nghe những điệu nhạc vui tươi." },
      { id: 'l3_s19_playing_basketball', en: "Playing basketball", vi: "đang chơi bóng rổ",                 emoji: "🏀",    phonetic: "/ˈpleɪ.ɪŋ ˈbæs.kət.bɑːl/", example_en: "They are playing basketball in the yard.", example_vi: "Họ đang chơi bóng rổ ngoài sân." },
      { id: 'l3_s19_reading',            en: "Reading",           vi: "đang đọc sách",                     emoji: "📖",    phonetic: "/ˈriː.dɪŋ/",          example_en: "I am reading an exciting comic book.", example_vi: "Tôi đang đọc một cuốn truyện tranh hấp dẫn." },
      { id: 'l3_s19_singing',            en: "Singing",           vi: "đang hát",                          emoji: "🎤",    phonetic: "/ˈsɪŋ.ɪŋ/",           example_en: "We love singing English songs together.", example_vi: "Chúng mình thích cùng nhau hát các bài hát tiếng Anh." },
      { id: 'l3_s19_watching_tv',        en: "Watching TV",       vi: "đang xem ti-vi",                    emoji: "📺",    phonetic: "/ˈwɑːtʃ.ɪŋ ˌtiːˈviː/", example_en: "We are watching TV together in the evening.", example_vi: "Chúng mình cùng xem ti-vi vào buổi tối." },
      { id: 'l3_s19_writing',            en: "Writing",           vi: "đang viết",                         emoji: "✍️",    phonetic: "/ˈraɪ.t̬ɪŋ/",         example_en: "He is writing a letter to his pen pal.", example_vi: "Cậu ấy đang viết một bức thư gửi bạn qua thư." },
    ],
  },

  // ── UNIT 19: OUTDOOR ACTIVITIES ──
  {
    id: 'lop3_unit19',
    gradeId: 'lop3',
    name_vi: 'Unit 19: Hoạt Động Ngoài Trời',
    name_en: 'Unit 19: Outdoor Activities',
    emoji: '🚴',
    color: 'from-lime-400 to-green-500',
    gradient: 'bg-gradient-to-br from-lime-100 to-green-100',
    words: [
      { id: 'l3_s20_cycling',            en: "Cycling",           vi: "đi xe đạp",                         emoji: "🚴",    phonetic: "/ˈsaɪ.klɪŋ/",         example_en: "This is a nice cycling.", example_vi: "Đây là đi xe đạp." },
      { id: 'l3_s20_flying_a_kite',      en: "Flying a kite",     vi: "thả diều",                          emoji: "🪁",    phonetic: "/ˈflaɪ.ɪŋ ə kaɪt/",   example_en: "The boys are flying a kite in the field.", example_vi: "Các bạn nam đang thả diều trên cánh đồng." },
      { id: 'l3_s20_painting',           en: "Painting",          vi: "tô màu / vẽ",                       emoji: "🖌️",   phonetic: "/ˈpeɪn.tɪŋ/",         example_en: "He is painting a pretty flower picture.", example_vi: "Cậu ấy đang vẽ màu một bức tranh hoa đẹp." },
      { id: 'l3_s20_playing_badminton',  en: "Playing badminton", vi: "chơi cầu lông",                     emoji: "🏸",    phonetic: "/ˈpleɪ.ɪŋ ˈbæd.mɪn.tən/", example_en: "This is a nice playing badminton.", example_vi: "Đây là chơi cầu lông." },
      { id: 'l3_s20_running',            en: "Running",           vi: "chạy bộ",                           emoji: "🏃",    phonetic: "/ˈrʌn.ɪŋ/",           example_en: "Running in the park is healthy.", example_vi: "Chạy bộ trong công viên rất tốt cho sức khỏe." },
      { id: 'l3_s20_skating',            en: "Skating",           vi: "trượt patin",                       emoji: "🛼",    phonetic: "/ˈskeɪ.t̬ɪŋ/",        example_en: "She enjoys skating around the park.", example_vi: "Cô bé thích trượt patin vòng quanh công viên." },
      { id: 'l3_s20_skipping',           en: "Skipping",          vi: "nhảy dây",                          emoji: "🪢",    phonetic: "/ˈskɪp.ɪŋ/",          example_en: "Girls are skipping rope happily.", example_vi: "Các bạn nữ đang nhảy dây thật vui vẻ." },
      { id: 'l3_s20_walking',            en: "Walking",           vi: "đi bộ",                             emoji: "🚶",    phonetic: "/ˈwɑː.kɪŋ/",          example_en: "Grandpa likes walking in the garden.", example_vi: "Ông thích đi bộ dạo trong vườn." },
    ],
  },

  // ── UNIT 20: AT THE ZOO ──
  {
    id: 'lop3_unit20',
    gradeId: 'lop3',
    name_vi: 'Unit 20: Ở Sở Thú',
    name_en: 'Unit 20: At the Zoo',
    emoji: '🦁',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'l3_s21_climbing',           en: "Climbing",          vi: "leo trèo",                          emoji: "🧗",    phonetic: "/ˈklaɪ.mɪŋ/",         example_en: "The monkey is climbing up the tall tree.", example_vi: "Chú khỉ đang leo thoăn thoắt lên cây cao." },
      { id: 'l3_s21_counting',           en: "Counting",          vi: "đếm",                               emoji: "🔢",    phonetic: "/ˈkaʊn.t̬ɪŋ/",        example_en: "She is counting apples in the basket.", example_vi: "Cô bé đang đếm những quả táo trong giỏ." },
      { id: 'l3_s21_elephant',           en: "Elephant",          vi: "con voi",                           emoji: "🐘",    phonetic: "/ˈel.ə.fənt/",        example_en: "This is a nice elephant.", example_vi: "Đây là con voi." },
      { id: 'l3_s21_horse',              en: "Horse",             vi: "con ngựa",                          emoji: "🐎",    phonetic: "/hɔːrs/",             example_en: "This is a nice horse.", example_vi: "Đây là con ngựa." },
      { id: 'l3_s21_monkey',             en: "Monkey",            vi: "con khỉ",                           emoji: "🐒",    phonetic: "/ˈmʌŋ.ki/",           example_en: "This is a nice monkey.", example_vi: "Đây là con khỉ." },
      { id: 'l3_s21_peacock',            en: "Peacock",           vi: "con công",                          emoji: "🦚",    phonetic: "/ˈpiː.kɑːk/",         example_en: "The peacock displays its gorgeous feathers.", example_vi: "Con công xòe bộ lông tuyệt đẹp của mình." },
      { id: 'l3_s21_swinging',           en: "Swinging",          vi: "đu quay / đung đung",               emoji: "🐒",    phonetic: "/ˈswɪŋ.ɪŋ/",          example_en: "The baby monkey is swinging on the vine.", example_vi: "Chú khỉ con đang đu đưa trên dây leo." },
      { id: 'l3_s21_tiger',              en: "Tiger",             vi: "con hổ",                            emoji: "🐯",    phonetic: "/ˈtaɪ.ɡɚ/",           example_en: "This is a nice tiger.", example_vi: "Đây là con hổ." },
    ],
  },

  // ── SCHOOL & CLASSROOM PLUS ──
  {
    id: 'lop3_ext_school',
    gradeId: 'lop3',
    name_vi: 'Lớp Học & Dụng Cụ Mở Rộng',
    name_en: 'School & Classroom Plus',
    emoji: '📐',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l3_s22_board',              en: "Board",             vi: "bảng viết",                         emoji: "📋",    phonetic: "/bɔːrd/",             example_en: "This is a nice board.", example_vi: "Đây là bảng viết." },
      { id: 'l3_s22_bookcase',           en: "Bookcase",          vi: "giá sách",                          emoji: "📚",    phonetic: "/ˈbʊk.keɪs/",         example_en: "This is a nice bookcase.", example_vi: "Đây là giá sách." },
      { id: 'l3_s22_crayon',             en: "Crayon",            vi: "bút sáp màu",                       emoji: "🖍️",   phonetic: "/ˈkreɪ.ɑːn/",         example_en: "This is a nice crayon.", example_vi: "Đây là bút sáp màu." },
      { id: 'l3_s22_cupboard',           en: "Cupboard",          vi: "tủ đựng đồ",                        emoji: "🗄️",   phonetic: "/ˈkʌb.ɚd/",           example_en: "This is a nice cupboard.", example_vi: "Đây là tủ đựng đồ." },
      { id: 'l3_s22_map',                en: "Map",               vi: "bản đồ",                            emoji: "🗺️",   phonetic: "/mæp/",               example_en: "This is a nice map.", example_vi: "Đây là bản đồ." },
      { id: 'l3_s22_paper',              en: "Paper",             vi: "tờ giấy",                           emoji: "📄",    phonetic: "/ˈpeɪ.pɚ/",           example_en: "This is a nice paper.", example_vi: "Đây là tờ giấy." },
      { id: 'l3_s22_poster',             en: "Poster",            vi: "tấm áp phích / tranh treo tường",   emoji: "🖼️",   phonetic: "/ˈpoʊ.stɚ/",          example_en: "This is a nice poster.", example_vi: "Đây là tấm áp phích / tranh treo tường." },
      { id: 'l3_s22_rubber',             en: "Rubber",            vi: "cục tẩy (Anh-Anh)",                 emoji: "🧼",    phonetic: "/ˈrʌb.ɚ/",            example_en: "This is a nice rubber.", example_vi: "Đây là cục tẩy (anh-anh)." },
      { id: 'l3_s22_scissors',           en: "Scissors",          vi: "cái kéo",                           emoji: "✂️",    phonetic: "/ˈsɪz.ɚz/",           example_en: "This is a nice scissors.", example_vi: "Đây là cái kéo." },
      { id: 'l3_s22_sharpener',          en: "Sharpener",         vi: "gọt bút chì",                       emoji: "✏️",    phonetic: "/ˈʃɑːr.pən.ɚ/",       example_en: "This is a nice sharpener.", example_vi: "Đây là gọt bút chì." },
    ],
  },

  // ── EXTENDED FAMILY ──
  {
    id: 'lop3_ext_family',
    gradeId: 'lop3',
    name_vi: 'Đại Gia Đình & Người Thân',
    name_en: 'Extended Family',
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l3_s23_grandfather',        en: "Grandfather",       vi: "ông",                               emoji: "👴",    phonetic: "/ˈɡræn.fɑː.ðɚ/",      example_en: "This is a nice grandfather.", example_vi: "Đây là ông." },
      { id: 'l3_s23_grandmother',        en: "Grandmother",       vi: "bà",                                emoji: "👵",    phonetic: "/ˈɡræn.mʌð.ɚ/",       example_en: "This is a nice grandmother.", example_vi: "Đây là bà." },
      { id: 'l3_s23_grandparents',       en: "Grandparents",      vi: "ông bà",                            emoji: "👵👴",  phonetic: "/ˈɡræn.per.ənts/",    example_en: "This is a nice grandparents.", example_vi: "Đây là ông bà." },
      { id: 'l3_s23_uncle',              en: "Uncle",             vi: "chú, bác, cậu",                     emoji: "👨",    phonetic: "/ˈʌŋ.kəl/",           example_en: "This is a nice uncle.", example_vi: "Đây là chú, bác, cậu." },
      { id: 'l3_s23_aunt',               en: "Aunt",              vi: "cô, dì, bác gái",                   emoji: "👩",    phonetic: "/ænt/",               example_en: "This is a nice aunt.", example_vi: "Đây là cô, dì, bác gái." },
      { id: 'l3_s23_cousin',             en: "Cousin",            vi: "anh chị em họ",                     emoji: "🧑",    phonetic: "/ˈkʌz.ən/",           example_en: "This is a nice cousin.", example_vi: "Đây là anh chị em họ." },
      { id: 'l3_s23_parents',            en: "Parents",           vi: "bố mẹ",                             emoji: "👩👨",  phonetic: "/ˈper.ənts/",         example_en: "This is a nice parents.", example_vi: "Đây là bố mẹ." },
      { id: 'l3_s23_baby',               en: "Baby",              vi: "em bé",                             emoji: "👶",    phonetic: "/ˈbeɪ.bi/",           example_en: "This is a nice baby.", example_vi: "Đây là em bé." },
    ],
  },

  // ── HOUSE & FURNITURE ──
  {
    id: 'lop3_ext_furniture',
    gradeId: 'lop3',
    name_vi: 'Ngôi Nhà & Nội Thất',
    name_en: 'House & Furniture',
    emoji: '🛋️',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l3_s24_garden',             en: "Garden",            vi: "khu vườn",                          emoji: "🌳",    phonetic: "/ˈɡɑːr.dən/",         example_en: "This is a nice garden.", example_vi: "Đây là khu vườn." },
      { id: 'l3_s24_hall',               en: "Hall",              vi: "hành lang / sảnh",                  emoji: "🏛️",   phonetic: "/hɑːl/",              example_en: "This is a nice hall.", example_vi: "Đây là hành lang / sảnh." },
      { id: 'l3_s24_balcony',            en: "Balcony",           vi: "ban công",                          emoji: "🏢",    phonetic: "/ˈbæl.kə.ni/",        example_en: "This is a nice balcony.", example_vi: "Đây là ban công." },
      { id: 'l3_s24_clock',              en: "Clock",             vi: "đồng hồ treo tường",                emoji: "⏰",     phonetic: "/klɑːk/",             example_en: "This is a nice clock.", example_vi: "Đây là đồng hồ treo tường." },
      { id: 'l3_s24_mirror',             en: "Mirror",            vi: "cái gương",                         emoji: "🪞",    phonetic: "/ˈmɪr.ɚ/",            example_en: "This is a nice mirror.", example_vi: "Đây là cái gương." },
      { id: 'l3_s24_sofa',               en: "Sofa",              vi: "ghế sofa",                          emoji: "🛋️",   phonetic: "/ˈsoʊ.fə/",           example_en: "This is a nice sofa.", example_vi: "Đây là ghế sofa." },
      { id: 'l3_s24_armchair',           en: "Armchair",          vi: "ghế bành",                          emoji: "🪑",    phonetic: "/ˈɑːrm.tʃer/",        example_en: "This is a nice armchair.", example_vi: "Đây là ghế bành." },
      { id: 'l3_s24_carpet',             en: "Carpet",            vi: "thảm trải sàn",                     emoji: "🧶",    phonetic: "/ˈkɑːr.pət/",         example_en: "This is a nice carpet.", example_vi: "Đây là thảm trải sàn." },
      { id: 'l3_s24_picture',            en: "Picture",           vi: "bức tranh",                         emoji: "🖼️",   phonetic: "/ˈpɪk.tʃɚ/",          example_en: "This is a nice picture.", example_vi: "Đây là bức tranh." },
      { id: 'l3_s24_television',         en: "Television",        vi: "chiếc ti-vi",                       emoji: "📺",    phonetic: "/ˈtel.ə.vɪʒ.ən/",     example_en: "This is a nice television.", example_vi: "Đây là chiếc ti-vi." },
    ],
  },

  // ── FOOD & DRINKS PLUS ──
  {
    id: 'lop3_ext_food',
    gradeId: 'lop3',
    name_vi: 'Món Ngon & Đồ Uống Mở Rộng',
    name_en: 'Food & Drinks Plus',
    emoji: '🍔',
    color: 'from-orange-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-amber-100',
    words: [
      { id: 'l3_s25_apple',              en: "Apple",             vi: "quả táo",                           emoji: "🍎",    phonetic: "/ˈæp.əl/",            example_en: "This is a nice apple.", example_vi: "Đây là quả táo." },
      { id: 'l3_s25_banana',             en: "Banana",            vi: "quả chuối",                         emoji: "🍌",    phonetic: "/bəˈnæn.ə/",          example_en: "This is a nice banana.", example_vi: "Đây là quả chuối." },
      { id: 'l3_s25_burger',             en: "Burger",            vi: "bánh kẹp",                          emoji: "🍔",    phonetic: "/ˈbɝː.ɡɚ/",           example_en: "This is a nice burger.", example_vi: "Đây là bánh kẹp." },
      { id: 'l3_s25_cake',               en: "Cake",              vi: "bánh ngọt",                         emoji: "🍔",    phonetic: "/keɪk/",              example_en: "This is a nice cake.", example_vi: "Đây là bánh ngọt." },
      { id: 'l3_s25_candy',              en: "Candy",             vi: "kẹo",                               emoji: "🍬",    phonetic: "/ˈkæn.di/",           example_en: "This is a nice candy.", example_vi: "Đây là kẹo." },
      { id: 'l3_s25_lemonade',           en: "Lemonade",          vi: "nước chanh",                        emoji: "🍋",    phonetic: "/ˌlem.əˈneɪd/",       example_en: "This is a nice lemonade.", example_vi: "Đây là nước chanh." },
      { id: 'l3_s25_mango',              en: "Mango",             vi: "quả xoài",                          emoji: "🥭",    phonetic: "/ˈmæŋ.ɡoʊ/",          example_en: "This is a nice mango.", example_vi: "Đây là quả xoài." },
      { id: 'l3_s25_orange',             en: "Orange",            vi: "quả cam",                           emoji: "🟠",    phonetic: "/ˈɔːr.ɪndʒ/",         example_en: "This is a nice orange.", example_vi: "Đây là quả cam." },
      { id: 'l3_s25_sausage',            en: "Sausage",           vi: "xúc xích",                          emoji: "🌭",    phonetic: "/ˈsɑː.sɪdʒ/",         example_en: "This is a nice sausage.", example_vi: "Đây là xúc xích." },
      { id: 'l3_s25_watermelon',         en: "Watermelon",        vi: "dưa hấu",                           emoji: "🍉",    phonetic: "/ˈwɑː.t̬ɚˌmel.ən/",   example_en: "This is a nice watermelon.", example_vi: "Đây là dưa hấu." },
    ],
  },

  // ── ANIMALS & NATURE ──
  {
    id: 'lop3_ext_animals',
    gradeId: 'lop3',
    name_vi: 'Thế Giới Động Vật Hoang Dã',
    name_en: 'Animals & Nature',
    emoji: '🦒',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l3_s26_bear',               en: "Bear",              vi: "con gấu",                           emoji: "🐻",    phonetic: "/ber/",               example_en: "This is a nice bear.", example_vi: "Đây là con gấu." },
      { id: 'l3_s26_crocodile',          en: "Crocodile",         vi: "con cá sấu",                        emoji: "🐊",    phonetic: "/ˈkrɑː.kə.daɪl/",     example_en: "This is a nice crocodile.", example_vi: "Đây là con cá sấu." },
      { id: 'l3_s26_duck',               en: "Duck",              vi: "con vịt",                           emoji: "🦆",    phonetic: "/dʌk/",               example_en: "This is a nice duck.", example_vi: "Đây là con vịt." },
      { id: 'l3_s26_frog',               en: "Frog",              vi: "con ếch",                           emoji: "🐸",    phonetic: "/frɑːɡ/",             example_en: "This is a nice frog.", example_vi: "Đây là con ếch." },
      { id: 'l3_s26_giraffe',            en: "Giraffe",           vi: "hươu cao cổ",                       emoji: "🦒",    phonetic: "/dʒɪˈræf/",           example_en: "This is a nice giraffe.", example_vi: "Đây là hươu cao cổ." },
      { id: 'l3_s26_hippo',              en: "Hippo",             vi: "con hà mã",                         emoji: "🦛",    phonetic: "/ˈhɪp.oʊ/",           example_en: "This is a nice hippo.", example_vi: "Đây là con hà mã." },
      { id: 'l3_s26_lizard',             en: "Lizard",            vi: "con thằn lằn",                      emoji: "🦎",    phonetic: "/ˈlɪz.ɚd/",           example_en: "This is a nice lizard.", example_vi: "Đây là con thằn lằn." },
      { id: 'l3_s26_mouse',              en: "Mouse",             vi: "con chuột",                         emoji: "🐭",    phonetic: "/maʊs/",              example_en: "This is a nice mouse.", example_vi: "Đây là con chuột." },
      { id: 'l3_s26_sheep',              en: "Sheep",             vi: "con cừu",                           emoji: "🐑",    phonetic: "/ʃiːp/",              example_en: "This is a nice sheep.", example_vi: "Đây là con cừu." },
      { id: 'l3_s26_spider',             en: "Spider",            vi: "con nhện",                          emoji: "🕷️",   phonetic: "/ˈspaɪ.dɚ/",          example_en: "This is a nice spider.", example_vi: "Đây là con nhện." },
    ],
  },

  // ── CLOTHES & ACCESSORIES ──
  {
    id: 'lop3_ext_clothes',
    gradeId: 'lop3',
    name_vi: 'Trang Phục & Phụ Kiện',
    name_en: 'Clothes & Accessories',
    emoji: '👗',
    color: 'from-purple-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    words: [
      { id: 'l3_s27_clothes',            en: "Clothes",           vi: "quần áo",                           emoji: "👗",    phonetic: "/kloʊðz/",            example_en: "This is a nice clothes.", example_vi: "Đây là quần áo." },
      { id: 'l3_s27_dress',              en: "Dress",             vi: "váy liền",                          emoji: "👗",    phonetic: "/dres/",              example_en: "This is a nice dress.", example_vi: "Đây là váy liền." },
      { id: 'l3_s27_hat',                en: "Hat",               vi: "cái mũ / nón",                      emoji: "👒",    phonetic: "/hæt/",               example_en: "This is a nice hat.", example_vi: "Đây là cái mũ / nón." },
      { id: 'l3_s27_jacket',             en: "Jacket",            vi: "áo khoác ngắn",                     emoji: "🧥",    phonetic: "/ˈdʒæk.ɪt/",          example_en: "This is a nice jacket.", example_vi: "Đây là áo khoác ngắn." },
      { id: 'l3_s27_jeans',              en: "Jeans",             vi: "quần bò / jean",                    emoji: "👖",    phonetic: "/dʒiːnz/",            example_en: "This is a nice jeans.", example_vi: "Đây là quần bò / jean." },
      { id: 'l3_s27_shirt',              en: "Shirt",             vi: "áo sơ mi",                          emoji: "👔",    phonetic: "/ʃɝːt/",              example_en: "This is a nice shirt.", example_vi: "Đây là áo sơ mi." },
      { id: 'l3_s27_shoes',              en: "Shoes",             vi: "đôi giày",                          emoji: "👟",    phonetic: "/ʃuːz/",              example_en: "This is a nice shoes.", example_vi: "Đây là đôi giày." },
      { id: 'l3_s27_skirt',              en: "Skirt",             vi: "chân váy",                          emoji: "🩰",    phonetic: "/skɝːt/",             example_en: "This is a nice skirt.", example_vi: "Đây là chân váy." },
      { id: 'l3_s27_socks',              en: "Socks",             vi: "đôi tất / vớ",                      emoji: "🧦",    phonetic: "/sɑːks/",             example_en: "This is a nice socks.", example_vi: "Đây là đôi tất / vớ." },
      { id: 'l3_s27_trousers',           en: "Trousers",          vi: "quần dài",                          emoji: "👖",    phonetic: "/ˈtraʊ.zɚz/",         example_en: "This is a nice trousers.", example_vi: "Đây là quần dài." },
    ],
  },

  // ── WEATHER & SEASONS ──
  {
    id: 'lop3_ext_weather',
    gradeId: 'lop3',
    name_vi: 'Thời Tiết & Bốn Mùa',
    name_en: 'Weather & Seasons',
    emoji: '🌤️',
    color: 'from-sky-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-cyan-100',
    words: [
      { id: 'l3_s28_weather',            en: "Weather",           vi: "thời tiết",                         emoji: "🌤️",   phonetic: "/ˈweð.ɚ/",            example_en: "This is a nice weather.", example_vi: "Đây là thời tiết." },
      { id: 'l3_s28_sunny',              en: "Sunny",             vi: "có nắng",                           emoji: "☀️",    phonetic: "/ˈsʌn.i/",            example_en: "This is a nice sunny.", example_vi: "Đây là có nắng." },
      { id: 'l3_s28_rainy',              en: "Rainy",             vi: "có mưa",                            emoji: "🌧️",   phonetic: "/ˈreɪ.ni/",           example_en: "This is a nice rainy.", example_vi: "Đây là có mưa." },
      { id: 'l3_s28_windy',              en: "Windy",             vi: "có gió",                            emoji: "💨",    phonetic: "/ˈwɪn.di/",           example_en: "This is a nice windy.", example_vi: "Đây là có gió." },
      { id: 'l3_s28_cloudy',             en: "Cloudy",            vi: "nhiều mây",                         emoji: "☁️",    phonetic: "/ˈklaʊ.di/",          example_en: "This is a nice cloudy.", example_vi: "Đây là nhiều mây." },
      { id: 'l3_s28_cold',               en: "Cold",              vi: "lạnh",                              emoji: "🥶",    phonetic: "/koʊld/",             example_en: "This is a nice cold.", example_vi: "Đây là lạnh." },
      { id: 'l3_s28_hot',                en: "Hot",               vi: "nóng",                              emoji: "🥵",    phonetic: "/hɑːt/",              example_en: "This is a nice hot.", example_vi: "Đây là nóng." },
      { id: 'l3_s28_spring',             en: "Spring",            vi: "mùa xuân",                          emoji: "🌸",    phonetic: "/sprɪŋ/",             example_en: "This is a nice spring.", example_vi: "Đây là mùa xuân." },
      { id: 'l3_s28_summer',             en: "Summer",            vi: "mùa hè",                            emoji: "☀️",    phonetic: "/ˈsʌm.ɚ/",            example_en: "This is a nice summer.", example_vi: "Đây là mùa hè." },
      { id: 'l3_s28_winter',             en: "Winter",            vi: "mùa đông",                          emoji: "❄️",    phonetic: "/ˈwɪn.t̬ɚ/",          example_en: "This is a nice winter.", example_vi: "Đây là mùa đông." },
    ],
  },

  // ── TRANSPORTATION PLUS ──
  {
    id: 'lop3_ext_transport',
    gradeId: 'lop3',
    name_vi: 'Phương Tiện Giao Thông Mở Rộng',
    name_en: 'Transportation Plus',
    emoji: '🚁',
    color: 'from-cyan-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-teal-100',
    words: [
      { id: 'l3_s29_bicycle',            en: "Bicycle",           vi: "xe đạp",                            emoji: "🚲",    phonetic: "/ˈbaɪ.sə.kəl/",       example_en: "This is a nice bicycle.", example_vi: "Đây là xe đạp." },
      { id: 'l3_s29_motorbike',          en: "Motorbike",         vi: "xe máy",                            emoji: "🛵",    phonetic: "/ˈmoʊ.t̬ɚ.baɪk/",     example_en: "This is a nice motorbike.", example_vi: "Đây là xe máy." },
      { id: 'l3_s29_helicopter',         en: "Helicopter",        vi: "máy bay trực thăng",                emoji: "🚁",    phonetic: "/ˈhel.əˌkɑːp.tɚ/",    example_en: "This is a nice helicopter.", example_vi: "Đây là máy bay trực thăng." },
      { id: 'l3_s29_boat',               en: "Boat",              vi: "con thuyền",                        emoji: "⛵",     phonetic: "/boʊt/",              example_en: "This is a nice boat.", example_vi: "Đây là con thuyền." },
      { id: 'l3_s29_taxi',               en: "Taxi",              vi: "xe taxi",                           emoji: "🚕",    phonetic: "/ˈtæk.si/",           example_en: "This is a nice taxi.", example_vi: "Đây là xe taxi." },
      { id: 'l3_s29_lorry',              en: "Lorry",             vi: "xe tải lớn",                        emoji: "🚛",    phonetic: "/ˈlɔːr.i/",           example_en: "This is a nice lorry.", example_vi: "Đây là xe tải lớn." },
      { id: 'l3_s29_station',            en: "Station",           vi: "nhà ga / bến xe",                   emoji: "🚉",    phonetic: "/ˈsteɪ.ʃən/",         example_en: "This is a nice station.", example_vi: "Đây là nhà ga / bến xe." },
    ],
  },

  // ── EMOTIONS & DESCRIPTIONS ──
  {
    id: 'lop3_ext_emotions',
    gradeId: 'lop3',
    name_vi: 'Cảm Xúc & Tính Cách',
    name_en: 'Emotions & Descriptions',
    emoji: '💖',
    color: 'from-amber-400 to-rose-400',
    gradient: 'bg-gradient-to-br from-amber-100 to-rose-100',
    words: [
      { id: 'l3_s30_happy',              en: "Happy",             vi: "vui vẻ",                            emoji: "😊",    phonetic: "/ˈhæp.i/",            example_en: "This is a nice happy.", example_vi: "Đây là vui vẻ." },
      { id: 'l3_s30_sad',                en: "Sad",               vi: "buồn vần",                          emoji: "😢",    phonetic: "/sæd/",               example_en: "This is a nice sad.", example_vi: "Đây là buồn vần." },
      { id: 'l3_s30_angry',              en: "Angry",             vi: "giận dữ",                           emoji: "😠",    phonetic: "/ˈæŋ.ɡri/",           example_en: "This is a nice angry.", example_vi: "Đây là giận dữ." },
      { id: 'l3_s30_tired',              en: "Tired",             vi: "mệt mỏi",                           emoji: "🥱",    phonetic: "/ˈtaɪɚd/",            example_en: "This is a nice tired.", example_vi: "Đây là mệt mỏi." },
      { id: 'l3_s30_hungry',             en: "Hungry",            vi: "đói bụng",                          emoji: "😋",    phonetic: "/ˈhʌŋ.ɡri/",          example_en: "This is a nice hungry.", example_vi: "Đây là đói bụng." },
      { id: 'l3_s30_thirsty',            en: "Thirsty",           vi: "khát nước",                         emoji: "🥤",    phonetic: "/ˈθɝː.sti/",          example_en: "This is a nice thirsty.", example_vi: "Đây là khát nước." },
      { id: 'l3_s30_clever',             en: "Clever",            vi: "thông minh",                        emoji: "🧠",    phonetic: "/ˈklev.ɚ/",           example_en: "This is a nice clever.", example_vi: "Đây là thông minh." },
      { id: 'l3_s30_friendly',           en: "Friendly",          vi: "thân thiện",                        emoji: "🤝",    phonetic: "/ˈfrend.li/",         example_en: "This is a nice friendly.", example_vi: "Đây là thân thiện." },
      { id: 'l3_s30_funny',              en: "Funny",             vi: "hài hước",                          emoji: "😄",    phonetic: "/ˈfʌn.i/",            example_en: "This is a nice funny.", example_vi: "Đây là hài hước." },
      { id: 'l3_s30_kind',               en: "Kind",              vi: "tốt bụng",                          emoji: "❤️",    phonetic: "/kaɪnd/",             example_en: "This is a nice kind.", example_vi: "Đây là tốt bụng." },
    ],
  },

  // ── DAILY COMMUNICATION ──
  {
    id: 'lop3_ext_daily',
    gradeId: 'lop3',
    name_vi: 'Giao Tiếp Hằng Ngày Lớp 3',
    name_en: 'Daily Communication',
    emoji: '💬',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l3_s31_good_morning',       en: "Good morning!",     vi: "Chào buổi sáng!",                   emoji: "🌅",    phonetic: "/ˌɡʊd ˈmɔːr.nɪŋ/",    example_en: "Good morning! Have a wonderful day at school.", example_vi: "Chào buổi sáng! Chúc bạn một ngày tuyệt vời ở trường." },
      { id: 'l3_s31_good_afternoon',     en: "Good afternoon!",   vi: "Chào buổi chiều!",                  emoji: "☀️",    phonetic: "/ˌɡʊd ˌæf.tɚˈnuːn/",  example_en: "Good afternoon teacher and classmates!", example_vi: "Chào buổi chiều cô giáo và cả lớp!" },
      { id: 'l3_s31_good_evening',       en: "Good evening!",     vi: "Chào buổi tối!",                    emoji: "🌆",    phonetic: "/ˌɡʊd ˈiːv.nɪŋ/",     example_en: "Good evening mom and dad!", example_vi: "Con chào buổi tối bố mẹ!" },
      { id: 'l3_s31_nice_to_meet_you',   en: "Nice to meet you.", vi: "Rất vui được gặp bạn.",             emoji: "🤝",    phonetic: "/naɪs tuː miːt juː/", example_en: "Nice to meet you! My name is Mai.", example_vi: "Rất vui được gặp bạn! Mình tên là Mai." },
      { id: 'l3_s31_here_you_are',       en: "Here you are.",     vi: "Của bạn đây.",                      emoji: "🎁",    phonetic: "/hɪr juː ɑːr/",       example_en: "Here you are, enjoy your sweet cake.", example_vi: "Của bạn đây, chúc bạn thưởng thức bánh ngon nhé." },
      { id: 'l3_s31_you_re_welcome',     en: "You're welcome.",   vi: "Không có gì (đáp lại lời cảm ơn).", emoji: "😊",    phonetic: "/jʊr ˈwel.kəm/",      example_en: "You're welcome! Happy to help.", example_vi: "Không có chi đâu! Rất vui được giúp bạn." },
      { id: 'l3_s31_pardon',             en: "Pardon?",           vi: "Bạn nói lại được không?",           emoji: "👂",    phonetic: "/ˈpɑːr.dən/",         example_en: "Pardon? Could you please repeat that?", example_vi: "Dạ bạn nói lại được không? Bạn có thể nhắc lại không?" },
      { id: 'l3_s31_see_you_later',      en: "See you later!",    vi: "Hẹn gặp lại sau!",                  emoji: "👋",    phonetic: "/siː juː ˈleɪ.t̬ɚ/",  example_en: "See you later! Have a safe trip home.", example_vi: "Hẹn gặp lại sau nhé! Chúc bạn về nhà an toàn." },
    ],
  },

    // ════════════════════════════════════════
  // LỚP 4 (SGK GLOBAL SUCCESS + MOVERS MỞ RỘNG + CHỦ ĐỀ VIỆT NAM - 36 CHỦ ĐỀ)
  // ════════════════════════════════════════

  // ── UNIT 1: MY FRIENDS ──
  {
    id: 'lop4_c1_unit_1_my_friends',
    gradeId: 'lop4',
    name_vi: "UNIT 1: MY FRIENDS",
    name_en: "UNIT 1: MY FRIENDS",
    emoji: '🌊',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l4_s1_1_america',           en: "America",             vi: "nước Mỹ",                           emoji: "🇺🇸",  phonetic: "/əˈmerɪkə/",          example_en: "We learn about america in English class.", example_vi: "Chúng mình học về nước mỹ trong giờ tiếng Anh." },
      { id: 'l4_s1_2_australia',         en: "Australia",           vi: "nước Úc",                           emoji: "🇦🇺",  phonetic: "/ɒˈstreɪliə/",        example_en: "We learn about australia in English class.", example_vi: "Chúng mình học về nước úc trong giờ tiếng Anh." },
      { id: 'l4_s1_3_britain',           en: "Britain",             vi: "nước Anh",                          emoji: "🇬🇧",  phonetic: "/ˈbrɪtn/",            example_en: "We learn about britain in English class.", example_vi: "Chúng mình học về nước anh trong giờ tiếng Anh." },
      { id: 'l4_s1_4_japan',             en: "Japan",               vi: "nước Nhật Bản",                     emoji: "🇯🇵",  phonetic: "/dʒəˈpæn/",           example_en: "We learn about japan in English class.", example_vi: "Chúng mình học về nước nhật bản trong giờ tiếng Anh." },
      { id: 'l4_s1_5_malaysia',          en: "Malaysia",            vi: "nước Ma-lai-xi-a",                  emoji: "🇲🇾",  phonetic: "/məˈleɪʒə/",          example_en: "We learn about malaysia in English class.", example_vi: "Chúng mình học về nước ma-lai-xi-a trong giờ tiếng Anh." },
      { id: 'l4_s1_6_singapore',         en: "Singapore",           vi: "nước Xinh-ga-po",                   emoji: "🇸🇬",  phonetic: "/ˌsɪŋəˈpɔːr/",        example_en: "We learn about singapore in English class.", example_vi: "Chúng mình học về nước xinh-ga-po trong giờ tiếng Anh." },
      { id: 'l4_s1_7_thailand',          en: "Thailand",            vi: "nước Thái Lan",                     emoji: "🇹🇭",  phonetic: "/ˈtaɪlænd/",          example_en: "We learn about thailand in English class.", example_vi: "Chúng mình học về nước thái lan trong giờ tiếng Anh." },
      { id: 'l4_s1_8_viet_nam',          en: "Viet Nam",            vi: "nước Việt Nam",                     emoji: "🇻🇳",  phonetic: "/ˌvjet ˈnæm/",        example_en: "We learn about viet nam in English class.", example_vi: "Chúng mình học về nước việt nam trong giờ tiếng Anh." },
      { id: 'l4_s1_9_where_are_you_from', en: "Where are you from? – I'm from Viet Nam.", vi: "Bạn từ đâu đến? – Tôi đến từ Việt Nam.", emoji: "🇻🇳",  phonetic: "",                    example_en: "We learn about where are you from? – i'm from viet nam. in English class.", example_vi: "Chúng mình học về bạn từ đâu đến? – tôi đến từ việt nam. trong giờ tiếng Anh." },
      { id: 'l4_s1_10_where_s_he',       en: "Where's he",          vi: "",                                  emoji: "🌊",    phonetic: "/she from? – He's/She's from Japan. (Anh ấy/Cô ấy từ đâu đến? – Anh ấy/Cô ấy đến từ Nhật Bản.)", example_en: "We learn about where's he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 2: TIME AND DAILY ROUTINES ──
  {
    id: 'lop4_c2_unit_2_time_and_dail',
    gradeId: 'lop4',
    name_vi: "UNIT 2: TIME AND DAILY ROUTINES",
    name_en: "UNIT 2: TIME AND DAILY ROUTINES",
    emoji: '🌊',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l4_s2_1_at',                en: "At",                  vi: "vào lúc (dùng trước giờ)",          emoji: "🌊",    phonetic: "/æt/",                example_en: "We learn about at in English class.", example_vi: "Chúng mình học về vào lúc (dùng trước giờ) trong giờ tiếng Anh." },
      { id: 'l4_s2_2_fifteen',           en: "Fifteen",             vi: "15 (phút)",                         emoji: "🌊",    phonetic: "/ˌfɪfˈtiːn/",         example_en: "We learn about fifteen in English class.", example_vi: "Chúng mình học về 15 (phút) trong giờ tiếng Anh." },
      { id: 'l4_s2_3_forty_five',        en: "Forty-five",          vi: "45 (phút)",                         emoji: "🌊",    phonetic: "/ˌfɔːti ˈfaɪv/",      example_en: "We learn about forty-five in English class.", example_vi: "Chúng mình học về 45 (phút) trong giờ tiếng Anh." },
      { id: 'l4_s2_4_o_clock',           en: "O'clock",             vi: "giờ đúng",                          emoji: "🌊",    phonetic: "/əˈklɒk/",            example_en: "We learn about o'clock in English class.", example_vi: "Chúng mình học về giờ đúng trong giờ tiếng Anh." },
      { id: 'l4_s2_5_thirty',            en: "Thirty",              vi: "30 (phút)",                         emoji: "🌊",    phonetic: "/ˈθɜːti/",            example_en: "We learn about thirty in English class.", example_vi: "Chúng mình học về 30 (phút) trong giờ tiếng Anh." },
      { id: 'l4_s2_6_get_up',            en: "Get up",              vi: "thức dậy",                          emoji: "🌊",    phonetic: "/ɡet ʌp/",            example_en: "We learn about get up in English class.", example_vi: "Chúng mình học về thức dậy trong giờ tiếng Anh." },
      { id: 'l4_s2_7_go_to_bed',         en: "Go to bed",           vi: "đi ngủ",                            emoji: "🌊",    phonetic: "/ɡəʊ tə bed/",        example_en: "Students go to bed on weekdays.", example_vi: "Các bạn học sinh đi ngủ vào các ngày trong tuần." },
      { id: 'l4_s2_8_go_to_school',      en: "Go to school",        vi: "đi học",                            emoji: "🌊",    phonetic: "/ɡəʊ tə skuːl/",      example_en: "Students go to school on weekdays.", example_vi: "Các bạn học sinh đi học vào các ngày trong tuần." },
      { id: 'l4_s2_9_have_breakfast',    en: "Have breakfast",      vi: "ăn sáng",                           emoji: "🌊",    phonetic: "/hæv ˈbrekfəst/",     example_en: "We learn about have breakfast in English class.", example_vi: "Chúng mình học về ăn sáng trong giờ tiếng Anh." },
      { id: 'l4_s2_10_what_time_is_it_it', en: "What time is it? – It's six o'clock", vi: "",                                  emoji: "🌊",    phonetic: "/ six fifteen. (Mấy giờ rồi? – 6 giờ / 6 giờ 15 phút.)", example_en: "What time does the lesson start?", example_vi: "Mấy giờ thì tiết học bắt đầu?" },
      { id: 'l4_s2_11_what_time_do_you_g', en: "What time do you get up? – I get up at six o'clock.", vi: "Bạn thức dậy lúc mấy giờ? – Tôi thức dậy lúc 6 giờ.", emoji: "🌊",    phonetic: "",                    example_en: "What time does the lesson start?", example_vi: "Mấy giờ thì tiết học bắt đầu?" },
    ],
  },

  // ── UNIT 3: MY WEEK ──
  {
    id: 'lop4_c3_unit_3_my_week',
    gradeId: 'lop4',
    name_vi: "UNIT 3: MY WEEK",
    name_en: "UNIT 3: MY WEEK",
    emoji: '🌊',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l4_s3_1_monday',            en: "Monday",              vi: "Thứ Hai",                           emoji: "📅",    phonetic: "/ˈmʌndeɪ/",           example_en: "We learn about monday in English class.", example_vi: "Chúng mình học về thứ hai trong giờ tiếng Anh." },
      { id: 'l4_s3_2_tuesday',           en: "Tuesday",             vi: "Thứ Ba",                            emoji: "📅",    phonetic: "/ˈtjuːzdeɪ/",         example_en: "We learn about tuesday in English class.", example_vi: "Chúng mình học về thứ ba trong giờ tiếng Anh." },
      { id: 'l4_s3_3_wednesday',         en: "Wednesday",           vi: "Thứ Tư",                            emoji: "📅",    phonetic: "/ˈwenzdeɪ/",          example_en: "We learn about wednesday in English class.", example_vi: "Chúng mình học về thứ tư trong giờ tiếng Anh." },
      { id: 'l4_s3_4_thursday',          en: "Thursday",            vi: "Thứ Năm",                           emoji: "📅",    phonetic: "/ˈθɜːzdeɪ/",          example_en: "We learn about thursday in English class.", example_vi: "Chúng mình học về thứ năm trong giờ tiếng Anh." },
      { id: 'l4_s3_5_friday',            en: "Friday",              vi: "Thứ Sáu",                           emoji: "📅",    phonetic: "/ˈfraɪdeɪ/",          example_en: "We learn about friday in English class.", example_vi: "Chúng mình học về thứ sáu trong giờ tiếng Anh." },
      { id: 'l4_s3_6_saturday',          en: "Saturday",            vi: "Thứ Bảy",                           emoji: "📅",    phonetic: "/ˈsætədeɪ/",          example_en: "We learn about saturday in English class.", example_vi: "Chúng mình học về thứ bảy trong giờ tiếng Anh." },
      { id: 'l4_s3_7_sunday',            en: "Sunday",              vi: "Chủ Nhật",                          emoji: "📅",    phonetic: "/ˈsʌndeɪ/",           example_en: "We learn about sunday in English class.", example_vi: "Chúng mình học về chủ nhật trong giờ tiếng Anh." },
      { id: 'l4_s3_8_do_housework',      en: "Do housework",        vi: "làm việc nhà",                      emoji: "🏠",    phonetic: "/duː ˈhaʊswɜːk/",     example_en: "We learn about do housework in English class.", example_vi: "Chúng mình học về làm việc nhà trong giờ tiếng Anh." },
      { id: 'l4_s3_9_listen_to_music',   en: "Listen to music",     vi: "nghe nhạc",                         emoji: "🌊",    phonetic: "/ˈlɪsn tə ˈmjuːzɪk/", example_en: "We learn about listen to music in English class.", example_vi: "Chúng mình học về nghe nhạc trong giờ tiếng Anh." },
      { id: 'l4_s3_10_study_at_school',  en: "Study at school",     vi: "học ở trường",                      emoji: "🌊",    phonetic: "/ˈstʌdi æt skuːl/",   example_en: "We learn about study at school in English class.", example_vi: "Chúng mình học về học ở trường trong giờ tiếng Anh." },
      { id: 'l4_s3_11_what_day_is_it_tod', en: "What day is it today? – It's Monday.", vi: "Hôm nay là thứ mấy? – Hôm nay là Thứ Hai.", emoji: "📅",    phonetic: "",                    example_en: "We learn about what day is it today? – it's monday. in English class.", example_vi: "Chúng mình học về hôm nay là thứ mấy? – hôm nay là thứ hai. trong giờ tiếng Anh." },
      { id: 'l4_s3_12_what_do_you_do_on_', en: "What do you do on Mondays? – I study at school in the morning.", vi: "Bạn làm gì vào các ngày Thứ Hai? – Tôi học ở trường vào buổi sáng.", emoji: "📅",    phonetic: "",                    example_en: "We learn about what do you do on mondays? – i study at school in the morning. in English class.", example_vi: "Chúng mình học về bạn làm gì vào các ngày thứ hai? – tôi học ở trường vào buổi sáng. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 4: MY BIRTHDAY PARTY ──
  {
    id: 'lop4_c4_unit_4_my_birthday_p',
    gradeId: 'lop4',
    name_vi: "UNIT 4: MY BIRTHDAY PARTY",
    name_en: "UNIT 4: MY BIRTHDAY PARTY",
    emoji: '🌊',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'l4_s4_1_january',           en: "January",             vi: "Tháng 1",                           emoji: "🗓️",   phonetic: "/ˈdʒænjuəri/",        example_en: "We learn about january in English class.", example_vi: "Chúng mình học về tháng 1 trong giờ tiếng Anh." },
      { id: 'l4_s4_2_february',          en: "February",            vi: "Tháng 2",                           emoji: "🗓️",   phonetic: "/ˈfebruəri/",         example_en: "We learn about february in English class.", example_vi: "Chúng mình học về tháng 2 trong giờ tiếng Anh." },
      { id: 'l4_s4_3_march',             en: "March",               vi: "Tháng 3",                           emoji: "🗓️",   phonetic: "/mɑːtʃ/",             example_en: "We learn about march in English class.", example_vi: "Chúng mình học về tháng 3 trong giờ tiếng Anh." },
      { id: 'l4_s4_4_april',             en: "April",               vi: "Tháng 4",                           emoji: "🗓️",   phonetic: "/ˈeɪprəl/",           example_en: "We learn about april in English class.", example_vi: "Chúng mình học về tháng 4 trong giờ tiếng Anh." },
      { id: 'l4_s4_5_birthday',          en: "Birthday",            vi: "ngày sinh nhật",                    emoji: "🌊",    phonetic: "/ˈbɜːθdeɪ/",          example_en: "We learn about birthday in English class.", example_vi: "Chúng mình học về ngày sinh nhật trong giờ tiếng Anh." },
      { id: 'l4_s4_6_chips',             en: "Chips",               vi: "khoai tây chiên",                   emoji: "🌊",    phonetic: "/tʃɪps/",             example_en: "We learn about chips in English class.", example_vi: "Chúng mình học về khoai tây chiên trong giờ tiếng Anh." },
      { id: 'l4_s4_7_grapes',            en: "Grapes",              vi: "những quả nho",                     emoji: "🌊",    phonetic: "/ɡreɪps/",            example_en: "We learn about grapes in English class.", example_vi: "Chúng mình học về những quả nho trong giờ tiếng Anh." },
      { id: 'l4_s4_8_jam',               en: "Jam",                 vi: "mứt",                               emoji: "🌊",    phonetic: "/dʒæm/",              example_en: "We learn about jam in English class.", example_vi: "Chúng mình học về mứt trong giờ tiếng Anh." },
      { id: 'l4_s4_9_juice',             en: "Juice",               vi: "nước ép",                           emoji: "🌊",    phonetic: "/dʒuːs/",             example_en: "We learn about juice in English class.", example_vi: "Chúng mình học về nước ép trong giờ tiếng Anh." },
      { id: 'l4_s4_10_lemonade',         en: "Lemonade",            vi: "nước chanh",                        emoji: "🌊",    phonetic: "/ˌleməˈneɪd/",        example_en: "We learn about lemonade in English class.", example_vi: "Chúng mình học về nước chanh trong giờ tiếng Anh." },
      { id: 'l4_s4_11_party',            en: "Party",               vi: "bữa tiệc",                          emoji: "🌊",    phonetic: "/ˈpɑːti/",            example_en: "We learn about party in English class.", example_vi: "Chúng mình học về bữa tiệc trong giờ tiếng Anh." },
      { id: 'l4_s4_12_water',            en: "Water",               vi: "nước lọc",                          emoji: "🌊",    phonetic: "/ˈwɔːtə/",            example_en: "We learn about water in English class.", example_vi: "Chúng mình học về nước lọc trong giờ tiếng Anh." },
      { id: 'l4_s4_13_when_s_your_birthd', en: "When's your birthday? – It's in April.", vi: "Khi nào là sinh nhật bạn? – Vào tháng Bảy.", emoji: "🗓️",   phonetic: "",                    example_en: "We learn about when's your birthday? – it's in april. in English class.", example_vi: "Chúng mình học về khi nào là sinh nhật bạn? – vào tháng bảy. trong giờ tiếng Anh." },
      { id: 'l4_s4_14_what_do_you_want_t', en: "What do you want to eat", vi: "",                                  emoji: "🌊",    phonetic: "/ drink? – I want some chips / lemonade. (Bạn muốn ăn/uống gì? – Tôi muốn một ít khoai tây chiên / nước chanh.)", example_en: "We learn about what do you want to eat in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 5: THINGS WE CAN DO ──
  {
    id: 'lop4_c5_unit_5_things_we_can',
    gradeId: 'lop4',
    name_vi: "UNIT 5: THINGS WE CAN DO",
    name_en: "UNIT 5: THINGS WE CAN DO",
    emoji: '🌊',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l4_s5_1_can',               en: "Can",                 vi: "có thể",                            emoji: "🌊",    phonetic: "/kæn/",               example_en: "We learn about can in English class.", example_vi: "Chúng mình học về có thể trong giờ tiếng Anh." },
      { id: 'l4_s5_2_cook',              en: "Cook",                vi: "nấu ăn",                            emoji: "👨‍🍳", phonetic: "/kʊk/",               example_en: "We learn about cook in English class.", example_vi: "Chúng mình học về nấu ăn trong giờ tiếng Anh." },
      { id: 'l4_s5_3_draw',              en: "Draw",                vi: "vẽ",                                emoji: "🎨",    phonetic: "/drɔː/",              example_en: "We learn about draw in English class.", example_vi: "Chúng mình học về vẽ trong giờ tiếng Anh." },
      { id: 'l4_s5_4_play_the_guitar',   en: "Play the guitar",     vi: "chơi đàn ghi-ta",                   emoji: "🎸",    phonetic: "/pleɪ ðə ɡɪˈtɑː/",    example_en: "He practices to play the guitar every evening.", example_vi: "Cậu ấy tập chơi đàn ghi-ta vào mỗi buổi tối." },
      { id: 'l4_s5_5_play_the_piano',    en: "Play the piano",      vi: "chơi đàn pi-a-nô",                  emoji: "🎹",    phonetic: "/pleɪ ðə piˈænəʊ/",   example_en: "He practices to play the piano every evening.", example_vi: "Cậu ấy tập chơi đàn pi-a-nô vào mỗi buổi tối." },
      { id: 'l4_s5_6_ride_a_bike',       en: "Ride a bike",         vi: "đi xe đạp",                         emoji: "🚲",    phonetic: "/raɪd ə baɪk/",       example_en: "We learn about ride a bike in English class.", example_vi: "Chúng mình học về đi xe đạp trong giờ tiếng Anh." },
      { id: 'l4_s5_7_ride_a_horse',      en: "Ride a horse",        vi: "cưỡi ngựa",                         emoji: "🐎",    phonetic: "/raɪd ə hɔːs/",       example_en: "We learn about ride a horse in English class.", example_vi: "Chúng mình học về cưỡi ngựa trong giờ tiếng Anh." },
      { id: 'l4_s5_8_roller_skate',      en: "Roller skate",        vi: "trượt pa-tanh",                     emoji: "🛼",    phonetic: "/ˈrəʊlə skeɪt/",      example_en: "We learn about roller skate in English class.", example_vi: "Chúng mình học về trượt pa-tanh trong giờ tiếng Anh." },
      { id: 'l4_s5_9_swim',              en: "Swim",                vi: "bơi",                               emoji: "🏊",    phonetic: "/swɪm/",              example_en: "We learn about swim in English class.", example_vi: "Chúng mình học về bơi trong giờ tiếng Anh." },
      { id: 'l4_s5_10_but',              en: "But",                 vi: "nhưng",                             emoji: "🌊",    phonetic: "/bʌt/",               example_en: "We learn about but in English class.", example_vi: "Chúng mình học về nhưng trong giờ tiếng Anh." },
      { id: 'l4_s5_11_can_you_play_the_p', en: "Can you play the piano? – Yes, I can.", vi: "",                                  emoji: "🎹",    phonetic: "/ No, I can't. (Bạn có thể chơi đàn piano không? – Có, tôi có thể. / Không, tôi không thể.)", example_en: "We learn about can you play the piano? – yes, i can. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s5_12_can_he',           en: "Can he",              vi: "",                                  emoji: "🌊",    phonetic: "/she ride a horse? – Yes, he/she can. / No, he/she can't. (Anh ấy/Cô ấy có thể cưỡi ngựa không? – Có. / Không.)", example_en: "We learn about can he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 6: OUR SCHOOL FACILITIES ──
  {
    id: 'lop4_c6_unit_6_our_school_fa',
    gradeId: 'lop4',
    name_vi: "UNIT 6: OUR SCHOOL FACILITIES",
    name_en: "UNIT 6: OUR SCHOOL FACILITIES",
    emoji: '🌊',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'l4_s6_1_city',              en: "City",                vi: "thành phố",                         emoji: "🏙️",   phonetic: "/ˈsɪti/",             example_en: "We learn about city in English class.", example_vi: "Chúng mình học về thành phố trong giờ tiếng Anh." },
      { id: 'l4_s6_2_mountains',         en: "Mountains",           vi: "vùng núi",                          emoji: "⛰️",    phonetic: "/ˈmaʊntɪnz/",         example_en: "We learn about mountains in English class.", example_vi: "Chúng mình học về vùng núi trong giờ tiếng Anh." },
      { id: 'l4_s6_3_town',              en: "Town",                vi: "thị trấn",                          emoji: "🏘️",   phonetic: "/taʊn/",              example_en: "We learn about town in English class.", example_vi: "Chúng mình học về thị trấn trong giờ tiếng Anh." },
      { id: 'l4_s6_4_village',           en: "Village",             vi: "ngôi làng",                         emoji: "🏡",    phonetic: "/ˈvɪlɪdʒ/",           example_en: "We learn about village in English class.", example_vi: "Chúng mình học về ngôi làng trong giờ tiếng Anh." },
      { id: 'l4_s6_5_building',          en: "Building",            vi: "tòa nhà",                           emoji: "🏢",    phonetic: "/ˈbɪldɪŋ/",           example_en: "We learn about building in English class.", example_vi: "Chúng mình học về tòa nhà trong giờ tiếng Anh." },
      { id: 'l4_s6_6_computer_room',     en: "Computer room",       vi: "phòng máy tính",                    emoji: "🌊",    phonetic: "/kəmˈpjuːtə ruːm/",   example_en: "We learn about computer room in English class.", example_vi: "Chúng mình học về phòng máy tính trong giờ tiếng Anh." },
      { id: 'l4_s6_7_garden',            en: "Garden",              vi: "khu vườn",                          emoji: "🌊",    phonetic: "/ˈɡɑːdn/",            example_en: "We learn about garden in English class.", example_vi: "Chúng mình học về khu vườn trong giờ tiếng Anh." },
      { id: 'l4_s6_8_playground',        en: "Playground",          vi: "sân chơi",                          emoji: "🌊",    phonetic: "/ˈpleɪɡraʊnd/",       example_en: "We learn about playground in English class.", example_vi: "Chúng mình học về sân chơi trong giờ tiếng Anh." },
      { id: 'l4_s6_9_where_s_your_schoo', en: "Where's your school? – It's in the mountains.", vi: "Trường của bạn ở đâu? – Ở vùng núi.", emoji: "⛰️",    phonetic: "",                    example_en: "We learn about where's your school? – it's in the mountains. in English class.", example_vi: "Chúng mình học về trường của bạn ở đâu? – ở vùng núi. trong giờ tiếng Anh." },
      { id: 'l4_s6_10_how_many_playgroun', en: "How many playgrounds are there at your school? – There is one.", vi: "",                                  emoji: "🌊",    phonetic: "/ There are two. (Có bao nhiêu sân chơi ở trường bạn? – Có một / Có hai.)", example_en: "We learn about how many playgrounds are there at your school? – there is one. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 7: OUR TIMETABLES ──
  {
    id: 'lop4_c7_unit_7_our_timetable',
    gradeId: 'lop4',
    name_vi: "UNIT 7: OUR TIMETABLES",
    name_en: "UNIT 7: OUR TIMETABLES",
    emoji: '🌊',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l4_s7_1_art',               en: "Art",                 vi: "môn Mỹ thuật",                      emoji: "🌊",    phonetic: "/ɑːt/",               example_en: "We learn about art in English class.", example_vi: "Chúng mình học về môn mỹ thuật trong giờ tiếng Anh." },
      { id: 'l4_s7_2_english',           en: "English",             vi: "môn Tiếng Anh",                     emoji: "🇬🇧",  phonetic: "/ˈɪŋɡlɪʃ/",           example_en: "We learn about english in English class.", example_vi: "Chúng mình học về môn tiếng anh trong giờ tiếng Anh." },
      { id: 'l4_s7_3_history_and_geogra', en: "History and geography", vi: "môn Lịch sử và Địa lí",             emoji: "🌊",    phonetic: "/ˈhɪstri ænd dʒiˈɒɡrəfi/", example_en: "We learn about history and geography in English class.", example_vi: "Chúng mình học về môn lịch sử và địa lí trong giờ tiếng Anh." },
      { id: 'l4_s7_4_maths',             en: "Maths",               vi: "môn Toán",                          emoji: "🌊",    phonetic: "/mæθs/",              example_en: "We learn about maths in English class.", example_vi: "Chúng mình học về môn toán trong giờ tiếng Anh." },
      { id: 'l4_s7_5_music',             en: "Music",               vi: "môn Âm nhạc",                       emoji: "🌊",    phonetic: "/ˈmjuːzɪk/",          example_en: "We learn about music in English class.", example_vi: "Chúng mình học về môn âm nhạc trong giờ tiếng Anh." },
      { id: 'l4_s7_6_science',           en: "Science",             vi: "môn Khoa học",                      emoji: "🌊",    phonetic: "/ˈsaɪəns/",           example_en: "We learn about science in English class.", example_vi: "Chúng mình học về môn khoa học trong giờ tiếng Anh." },
      { id: 'l4_s7_7_vietnamese',        en: "Vietnamese",          vi: "môn Tiếng Việt",                    emoji: "🇻🇳",  phonetic: "/ˌvjetnəˈmiːz/",      example_en: "We learn about vietnamese in English class.", example_vi: "Chúng mình học về môn tiếng việt trong giờ tiếng Anh." },
      { id: 'l4_s7_8_what_subjects_do_y', en: "What subjects do you have today? – I have English and maths.", vi: "Hôm nay bạn có những môn học nào? – Tôi có môn Tiếng Anh và môn Toán.", emoji: "🇬🇧",  phonetic: "",                    example_en: "We learn about what subjects do you have today? – i have english and maths. in English class.", example_vi: "Chúng mình học về hôm nay bạn có những môn học nào? – tôi có môn tiếng anh và môn toán. trong giờ tiếng Anh." },
      { id: 'l4_s7_9_when_do_you_have_s', en: "When do you have science? – I have it on Wednesdays.", vi: "Khi nào bạn có môn Khoa học? – Tôi có vào các ngày Thứ Tư.", emoji: "📅",    phonetic: "",                    example_en: "We learn about when do you have science? – i have it on wednesdays. in English class.", example_vi: "Chúng mình học về khi nào bạn có môn khoa học? – tôi có vào các ngày thứ tư. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 8: MY FAVOURITE SUBJECTS ──
  {
    id: 'lop4_c8_unit_8_my_favourite_',
    gradeId: 'lop4',
    name_vi: "UNIT 8: MY FAVOURITE SUBJECTS",
    name_en: "UNIT 8: MY FAVOURITE SUBJECTS",
    emoji: '🌊',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l4_s8_1_it',                en: "IT",                  vi: "môn Tin học",                       emoji: "🌊",    phonetic: "/ˌaɪ ˈtiː/",          example_en: "We learn about it in English class.", example_vi: "Chúng mình học về môn tin học trong giờ tiếng Anh." },
      { id: 'l4_s8_2_pe',                en: "PE",                  vi: "môn Giáo dục thể chất",             emoji: "🌊",    phonetic: "/ˌpiː ˈiː/",          example_en: "We learn about pe in English class.", example_vi: "Chúng mình học về môn giáo dục thể chất trong giờ tiếng Anh." },
      { id: 'l4_s8_3_english_teacher',   en: "English teacher",     vi: "giáo viên Tiếng Anh",               emoji: "🇬🇧",  phonetic: "/ˈɪŋɡlɪʃ ˈtiːtʃə/",   example_en: "We learn about english teacher in English class.", example_vi: "Chúng mình học về giáo viên tiếng anh trong giờ tiếng Anh." },
      { id: 'l4_s8_4_painter',           en: "Painter",             vi: "họa sĩ",                            emoji: "🌊",    phonetic: "/ˈpeɪntə/",           example_en: "We learn about painter in English class.", example_vi: "Chúng mình học về họa sĩ trong giờ tiếng Anh." },
      { id: 'l4_s8_5_maths_teacher',     en: "Maths teacher",       vi: "giáo viên Toán",                    emoji: "🌊",    phonetic: "/mæθs ˈtiːtʃə/",      example_en: "We learn about maths teacher in English class.", example_vi: "Chúng mình học về giáo viên toán trong giờ tiếng Anh." },
      { id: 'l4_s8_6_because',           en: "Because",             vi: "bởi vì",                            emoji: "🌊",    phonetic: "/bɪˈkɒz/",            example_en: "We learn about because in English class.", example_vi: "Chúng mình học về bởi vì trong giờ tiếng Anh." },
      { id: 'l4_s8_7_why',               en: "Why",                 vi: "tại sao",                           emoji: "🌊",    phonetic: "/waɪ/",               example_en: "We learn about why in English class.", example_vi: "Chúng mình học về tại sao trong giờ tiếng Anh." },
      { id: 'l4_s8_8_what_s_your_favour', en: "What's your favourite subject? – It's IT.", vi: "Môn học yêu thích của bạn là gì? – Đó là môn Tin học.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about what's your favourite subject? – it's it. in English class.", example_vi: "Chúng mình học về môn học yêu thích của bạn là gì? – đó là môn tin học. trong giờ tiếng Anh." },
      { id: 'l4_s8_9_why_do_you_like_en', en: "Why do you like English? – Because I want to be an English teacher.", vi: "Tại sao bạn thích môn Tiếng Anh? – Bởi vì tôi muốn trở thành giáo viên Tiếng Anh.", emoji: "🇬🇧",  phonetic: "",                    example_en: "We learn about why do you like english? – because i want to be an english teacher. in English class.", example_vi: "Chúng mình học về tại sao bạn thích môn tiếng anh? – bởi vì tôi muốn trở thành giáo viên tiếng anh. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 9: OUR SPORTS DAY ──
  {
    id: 'lop4_c9_unit_9_our_sports_da',
    gradeId: 'lop4',
    name_vi: "UNIT 9: OUR SPORTS DAY",
    name_en: "UNIT 9: OUR SPORTS DAY",
    emoji: '🌊',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l4_s9_1_may',               en: "May",                 vi: "Tháng 5",                           emoji: "🗓️",   phonetic: "/meɪ/",               example_en: "We learn about may in English class.", example_vi: "Chúng mình học về tháng 5 trong giờ tiếng Anh." },
      { id: 'l4_s9_2_june',              en: "June",                vi: "Tháng 6",                           emoji: "🗓️",   phonetic: "/dʒuːn/",             example_en: "We learn about june in English class.", example_vi: "Chúng mình học về tháng 6 trong giờ tiếng Anh." },
      { id: 'l4_s9_3_july',              en: "July",                vi: "Tháng 7",                           emoji: "🗓️",   phonetic: "/dʒuˈlaɪ/",           example_en: "We learn about july in English class.", example_vi: "Chúng mình học về tháng 7 trong giờ tiếng Anh." },
      { id: 'l4_s9_4_august',            en: "August",              vi: "Tháng 8",                           emoji: "🗓️",   phonetic: "/ˈɔːɡəst/",           example_en: "We learn about august in English class.", example_vi: "Chúng mình học về tháng 8 trong giờ tiếng Anh." },
      { id: 'l4_s9_5_september',         en: "September",           vi: "Tháng 9",                           emoji: "🗓️",   phonetic: "/sepˈtembə/",         example_en: "We learn about september in English class.", example_vi: "Chúng mình học về tháng 9 trong giờ tiếng Anh." },
      { id: 'l4_s9_6_october',           en: "October",             vi: "Tháng 10",                          emoji: "🗓️",   phonetic: "/ɒkˈtəʊbə/",          example_en: "We learn about october in English class.", example_vi: "Chúng mình học về tháng 10 trong giờ tiếng Anh." },
      { id: 'l4_s9_7_november',          en: "November",            vi: "Tháng 11",                          emoji: "🗓️",   phonetic: "/nəʊˈvembə/",         example_en: "We learn about november in English class.", example_vi: "Chúng mình học về tháng 11 trong giờ tiếng Anh." },
      { id: 'l4_s9_8_december',          en: "December",            vi: "Tháng 12",                          emoji: "🗓️",   phonetic: "/dɪˈsembə/",          example_en: "We learn about december in English class.", example_vi: "Chúng mình học về tháng 12 trong giờ tiếng Anh." },
      { id: 'l4_s9_9_sports_day',        en: "Sports day",          vi: "ngày hội thể thao",                 emoji: "🌊",    phonetic: "/ˈspɔːts deɪ/",       example_en: "We learn about sports day in English class.", example_vi: "Chúng mình học về ngày hội thể thao trong giờ tiếng Anh." },
      { id: 'l4_s9_10_is_your_sports_day', en: "Is your sports day in May? – Yes, it is.", vi: "",                                  emoji: "🗓️",   phonetic: "/ No, it isn't. It's in June. (Ngày hội thể thao của trường bạn có vào tháng 5 không? – Có. / Không, nó vào tháng 6.)", example_en: "We learn about is your sports day in may? – yes, it is. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s9_11_when_s_your_sports', en: "When's your sports day? – It's in October.", vi: "Khi nào là ngày hội thể thao của trường bạn? – Vào tháng 10.", emoji: "🗓️",   phonetic: "",                    example_en: "We learn about when's your sports day? – it's in october. in English class.", example_vi: "Chúng mình học về khi nào là ngày hội thể thao của trường bạn? – vào tháng 10. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 10: OUR SUMMER HOLIDAYS ──
  {
    id: 'lop4_c10_unit_10_our_summer_h',
    gradeId: 'lop4',
    name_vi: "UNIT 10: OUR SUMMER HOLIDAYS",
    name_en: "UNIT 10: OUR SUMMER HOLIDAYS",
    emoji: '🌊',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l4_s10_1_beach',            en: "Beach",               vi: "bãi biển",                          emoji: "🌊",    phonetic: "/biːtʃ/",             example_en: "We learn about beach in English class.", example_vi: "Chúng mình học về bãi biển trong giờ tiếng Anh." },
      { id: 'l4_s10_2_campsite',         en: "Campsite",            vi: "địa điểm cắm trại",                 emoji: "🌊",    phonetic: "/ˈkæmpsaɪt/",         example_en: "We learn about campsite in English class.", example_vi: "Chúng mình học về địa điểm cắm trại trong giờ tiếng Anh." },
      { id: 'l4_s10_3_countryside',      en: "Countryside",         vi: "vùng nông thôn",                    emoji: "🌊",    phonetic: "/ˈkʌntrisaɪd/",       example_en: "We learn about countryside in English class.", example_vi: "Chúng mình học về vùng nông thôn trong giờ tiếng Anh." },
      { id: 'l4_s10_4_bangkok',          en: "Bangkok",             vi: "Băng Cốc",                          emoji: "🌊",    phonetic: "/ˈbæŋkɒk/",           example_en: "We learn about bangkok in English class.", example_vi: "Chúng mình học về băng cốc trong giờ tiếng Anh." },
      { id: 'l4_s10_5_london',           en: "London",              vi: "Luân Đôn",                          emoji: "🌊",    phonetic: "/ˈlʌndən/",           example_en: "We learn about london in English class.", example_vi: "Chúng mình học về luân đôn trong giờ tiếng Anh." },
      { id: 'l4_s10_6_sydney',           en: "Sydney",              vi: "Xít-ni",                            emoji: "🌊",    phonetic: "/ˈsɪdni/",            example_en: "We learn about sydney in English class.", example_vi: "Chúng mình học về xít-ni trong giờ tiếng Anh." },
      { id: 'l4_s10_7_tokyo',            en: "Tokyo",               vi: "Tô-ky-ô",                           emoji: "🌊",    phonetic: "/ˈtəʊkiəʊ/",          example_en: "We learn about tokyo in English class.", example_vi: "Chúng mình học về tô-ky-ô trong giờ tiếng Anh." },
      { id: 'l4_s10_8_last',             en: "Last",                vi: "vừa qua, trước",                    emoji: "🌊",    phonetic: "/lɑːst/",             example_en: "We learn about last in English class.", example_vi: "Chúng mình học về vừa qua, trước trong giờ tiếng Anh." },
      { id: 'l4_s10_9_yesterday',        en: "Yesterday",           vi: "ngày hôm qua",                      emoji: "🌊",    phonetic: "/ˈjestədeɪ/",         example_en: "We learn about yesterday in English class.", example_vi: "Chúng mình học về ngày hôm qua trong giờ tiếng Anh." },
      { id: 'l4_s10_10_were_you_at_the_ca', en: "Were you at the campsite last weekend? – Yes, I was.", vi: "",                                  emoji: "🌊",    phonetic: "/ No, I wasn't. (Tuần trước bạn có ở địa điểm cắm trại không? – Có. / Không.)", example_en: "We learn about were you at the campsite last weekend? – yes, i was. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s10_11_where_were_you_las', en: "Where were you last summer? – I was in Tokyo.", vi: "Mùa hè năm ngoái bạn đã ở đâu? – Tôi đã ở Tô-ky-ô.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about where were you last summer? – i was in tokyo. in English class.", example_vi: "Chúng mình học về mùa hè năm ngoái bạn đã ở đâu? – tôi đã ở tô-ky-ô. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 11: MY HOME ──
  {
    id: 'lop4_c11_unit_11_my_home',
    gradeId: 'lop4',
    name_vi: "UNIT 11: MY HOME",
    name_en: "UNIT 11: MY HOME",
    emoji: '🌊',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l4_s11_1_road',             en: "Road",                vi: "con đường",                         emoji: "🌊",    phonetic: "/rəʊd/",              example_en: "We learn about road in English class.", example_vi: "Chúng mình học về con đường trong giờ tiếng Anh." },
      { id: 'l4_s11_2_street',           en: "Street",              vi: "đường phố",                         emoji: "🌊",    phonetic: "/striːt/",            example_en: "We learn about street in English class.", example_vi: "Chúng mình học về đường phố trong giờ tiếng Anh." },
      { id: 'l4_s11_3_big',              en: "Big",                 vi: "to, lớn",                           emoji: "🌊",    phonetic: "/bɪɡ/",               example_en: "We learn about big in English class.", example_vi: "Chúng mình học về to, lớn trong giờ tiếng Anh." },
      { id: 'l4_s11_4_busy',             en: "Busy",                vi: "bận rộn, nhộn nhịp",                emoji: "🌊",    phonetic: "/ˈbɪzi/",             example_en: "We learn about busy in English class.", example_vi: "Chúng mình học về bận rộn, nhộn nhịp trong giờ tiếng Anh." },
      { id: 'l4_s11_5_live',             en: "Live",                vi: "sống",                              emoji: "🌊",    phonetic: "/lɪv/",               example_en: "We learn about live in English class.", example_vi: "Chúng mình học về sống trong giờ tiếng Anh." },
      { id: 'l4_s11_6_noisy',            en: "Noisy",               vi: "ồn ào",                             emoji: "🌊",    phonetic: "/ˈnɔɪzi/",            example_en: "We learn about noisy in English class.", example_vi: "Chúng mình học về ồn ào trong giờ tiếng Anh." },
      { id: 'l4_s11_7_quiet',            en: "Quiet",               vi: "yên tĩnh",                          emoji: "🌊",    phonetic: "/ˈkwaɪət/",           example_en: "We learn about quiet in English class.", example_vi: "Chúng mình học về yên tĩnh trong giờ tiếng Anh." },
      { id: 'l4_s11_8_where_do_you_live_', en: "Where do you live? – I live in Le Loi Street.", vi: "",                                  emoji: "🌊",    phonetic: "/ I live at 81 Quang Trung Road. (Bạn sống ở đâu? – Tôi sống ở phố Lê Lợi. / Tôi sống ở số 81 đường Quang Trung.)", example_en: "We learn about where do you live? – i live in le loi street. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s11_9_what_s_the_street_', en: "What's the street like? – It's a busy street.", vi: "Con phố đó như thế nào? – Nó là một con phố nhộn nhịp.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about what's the street like? – it's a busy street. in English class.", example_vi: "Chúng mình học về con phố đó như thế nào? – nó là một con phố nhộn nhịp. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 12: JOBS ──
  {
    id: 'lop4_c12_unit_12_jobs',
    gradeId: 'lop4',
    name_vi: "UNIT 12: JOBS",
    name_en: "UNIT 12: JOBS",
    emoji: '🌊',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'l4_s12_1_actor',            en: "Actor",               vi: "diễn viên (nam)",                   emoji: "🌊",    phonetic: "/ˈæktə/",             example_en: "We learn about actor in English class.", example_vi: "Chúng mình học về diễn viên (nam) trong giờ tiếng Anh." },
      { id: 'l4_s12_2_farmer',           en: "Farmer",              vi: "nông dân",                          emoji: "🌊",    phonetic: "/ˈfɑːmə/",            example_en: "We learn about farmer in English class.", example_vi: "Chúng mình học về nông dân trong giờ tiếng Anh." },
      { id: 'l4_s12_3_nurse',            en: "Nurse",               vi: "y tá",                              emoji: "🌊",    phonetic: "/nɜːs/",              example_en: "We learn about nurse in English class.", example_vi: "Chúng mình học về y tá trong giờ tiếng Anh." },
      { id: 'l4_s12_4_office_worker',    en: "Office worker",       vi: "nhân viên văn phòng",               emoji: "🌊",    phonetic: "/ˈɒfɪs ˈwɜːkə/",      example_en: "We learn about office worker in English class.", example_vi: "Chúng mình học về nhân viên văn phòng trong giờ tiếng Anh." },
      { id: 'l4_s12_5_policeman',        en: "Policeman",           vi: "cảnh sát",                          emoji: "🌊",    phonetic: "/pəˈliːsmən/",        example_en: "We learn about policeman in English class.", example_vi: "Chúng mình học về cảnh sát trong giờ tiếng Anh." },
      { id: 'l4_s12_6_factory',          en: "Factory",             vi: "nhà máy",                           emoji: "🌊",    phonetic: "/ˈfæktri/",           example_en: "We learn about factory in English class.", example_vi: "Chúng mình học về nhà máy trong giờ tiếng Anh." },
      { id: 'l4_s12_7_farm',             en: "Farm",                vi: "trang trại",                        emoji: "🌊",    phonetic: "/fɑːm/",              example_en: "We learn about farm in English class.", example_vi: "Chúng mình học về trang trại trong giờ tiếng Anh." },
      { id: 'l4_s12_8_hospital',         en: "Hospital",            vi: "bệnh viện",                         emoji: "🏥",    phonetic: "/ˈhɒspɪtl/",          example_en: "We learn about hospital in English class.", example_vi: "Chúng mình học về bệnh viện trong giờ tiếng Anh." },
      { id: 'l4_s12_9_nursing_home',     en: "Nursing home",        vi: "viện dưỡng lão",                    emoji: "🌊",    phonetic: "/ˈnɜːsɪŋ həʊm/",      example_en: "We learn about nursing home in English class.", example_vi: "Chúng mình học về viện dưỡng lão trong giờ tiếng Anh." },
      { id: 'l4_s12_10_what_does_he',    en: "What does he",        vi: "",                                  emoji: "🌊",    phonetic: "/she do? – He's/She's a nurse. (Anh ấy/Cô ấy làm nghề gì? – Cô ấy là y tá.)", example_en: "We learn about what does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s12_11_where_does_he',   en: "Where does he",       vi: "",                                  emoji: "🌊",    phonetic: "/she work? – She works at a nursing home. (Cô ấy làm việc ở đâu? – Cô ấy làm việc ở viện dưỡng lão.)", example_en: "We learn about where does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 13: APPEARANCE ──
  {
    id: 'lop4_c13_unit_13_appearance',
    gradeId: 'lop4',
    name_vi: "UNIT 13: APPEARANCE",
    name_en: "UNIT 13: APPEARANCE",
    emoji: '🌊',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l4_s13_1_big',              en: "Big",                 vi: "to, lớn",                           emoji: "🌊",    phonetic: "/bɪɡ/",               example_en: "We learn about big in English class.", example_vi: "Chúng mình học về to, lớn trong giờ tiếng Anh." },
      { id: 'l4_s13_2_short',            en: "Short",               vi: "thấp, ngắn",                        emoji: "🌊",    phonetic: "/ʃɔːt/",              example_en: "We learn about short in English class.", example_vi: "Chúng mình học về thấp, ngắn trong giờ tiếng Anh." },
      { id: 'l4_s13_3_slim',             en: "Slim",                vi: "mảnh mai",                          emoji: "🌊",    phonetic: "/slɪm/",              example_en: "We learn about slim in English class.", example_vi: "Chúng mình học về mảnh mai trong giờ tiếng Anh." },
      { id: 'l4_s13_4_tall',             en: "Tall",                vi: "cao",                               emoji: "🌊",    phonetic: "/tɔːl/",              example_en: "We learn about tall in English class.", example_vi: "Chúng mình học về cao trong giờ tiếng Anh." },
      { id: 'l4_s13_5_eye',              en: "Eye",                 vi: "mắt",                               emoji: "🌊",    phonetic: "/aɪ/",                example_en: "We learn about eye in English class.", example_vi: "Chúng mình học về mắt trong giờ tiếng Anh." },
      { id: 'l4_s13_6_face',             en: "Face",                vi: "khuôn mặt",                         emoji: "🌊",    phonetic: "/feɪs/",              example_en: "We learn about face in English class.", example_vi: "Chúng mình học về khuôn mặt trong giờ tiếng Anh." },
      { id: 'l4_s13_7_hair',             en: "Hair",                vi: "tóc",                               emoji: "🌊",    phonetic: "/heə/",               example_en: "We learn about hair in English class.", example_vi: "Chúng mình học về tóc trong giờ tiếng Anh." },
      { id: 'l4_s13_8_long',             en: "Long",                vi: "dài",                               emoji: "🌊",    phonetic: "/lɒŋ/",               example_en: "We learn about long in English class.", example_vi: "Chúng mình học về dài trong giờ tiếng Anh." },
      { id: 'l4_s13_9_round',            en: "Round",               vi: "tròn",                              emoji: "🌊",    phonetic: "/raʊnd/",             example_en: "We learn about round in English class.", example_vi: "Chúng mình học về tròn trong giờ tiếng Anh." },
      { id: 'l4_s13_10_what_does_he',    en: "What does he",        vi: "",                                  emoji: "🌊",    phonetic: "/she look like? – He's tall and slim. / She has long hair and a round face. (Anh ấy/Cô ấy trông như thế nào? – Anh ấy cao và mảnh mai. / Cô ấy có mái tóc dài và khuôn mặt tròn.)", example_en: "We learn about what does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 14: DAILY ACTIVITIES ──
  {
    id: 'lop4_c14_unit_14_daily_activi',
    gradeId: 'lop4',
    name_vi: "UNIT 14: DAILY ACTIVITIES",
    name_en: "UNIT 14: DAILY ACTIVITIES",
    emoji: '🌊',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'l4_s14_1_at_noon',          en: "At noon",             vi: "vào buổi trưa",                     emoji: "🌊",    phonetic: "/æt nuːn/",           example_en: "We learn about at noon in English class.", example_vi: "Chúng mình học về vào buổi trưa trong giờ tiếng Anh." },
      { id: 'l4_s14_2_in_the_morning',   en: "In the morning",      vi: "vào buổi sáng",                     emoji: "🌊",    phonetic: "/in ðə ˈmɔːnɪŋ/",     example_en: "We learn about in the morning in English class.", example_vi: "Chúng mình học về vào buổi sáng trong giờ tiếng Anh." },
      { id: 'l4_s14_3_in_the_afternoon', en: "In the afternoon",    vi: "vào buổi chiều",                    emoji: "🌊",    phonetic: "/in ðə ˌɑːftəˈnuːn/", example_en: "We learn about in the afternoon in English class.", example_vi: "Chúng mình học về vào buổi chiều trong giờ tiếng Anh." },
      { id: 'l4_s14_4_in_the_evening',   en: "In the evening",      vi: "vào buổi tối",                      emoji: "🌊",    phonetic: "/in ðə ˈiːvnɪŋ/",     example_en: "We learn about in the evening in English class.", example_vi: "Chúng mình học về vào buổi tối trong giờ tiếng Anh." },
      { id: 'l4_s14_5_clean_the_floor',  en: "Clean the floor",     vi: "lau sàn nhà",                       emoji: "🌊",    phonetic: "/kliːn ðə flɔː/",     example_en: "We learn about clean the floor in English class.", example_vi: "Chúng mình học về lau sàn nhà trong giờ tiếng Anh." },
      { id: 'l4_s14_6_help_with_the_cook', en: "Help with the cooking", vi: "giúp nấu ăn",                       emoji: "👨‍🍳", phonetic: "/help wɪð ðə ˈkʊkɪŋ/", example_en: "We learn about help with the cooking in English class.", example_vi: "Chúng mình học về giúp nấu ăn trong giờ tiếng Anh." },
      { id: 'l4_s14_7_wash_the_clothes', en: "Wash the clothes",    vi: "giặt quần áo",                      emoji: "🌊",    phonetic: "/wɒʃ ðə kləʊðz/",     example_en: "We learn about wash the clothes in English class.", example_vi: "Chúng mình học về giặt quần áo trong giờ tiếng Anh." },
      { id: 'l4_s14_8_wash_the_dishes',  en: "Wash the dishes",     vi: "rửa bát đĩa",                       emoji: "🌊",    phonetic: "/wɒʃ ðə dɪʃɪz/",      example_en: "We learn about wash the dishes in English class.", example_vi: "Chúng mình học về rửa bát đĩa trong giờ tiếng Anh." },
      { id: 'l4_s14_9_when_do_you_watch_', en: "When do you watch TV? – I watch TV in the evening.", vi: "Khi nào bạn xem TV? – Tôi xem TV vào buổi tối.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about when do you watch tv? – i watch tv in the evening. in English class.", example_vi: "Chúng mình học về khi nào bạn xem tv? – tôi xem tv vào buổi tối. trong giờ tiếng Anh." },
      { id: 'l4_s14_10_what_do_you_do_in_', en: "What do you do in the morning? – I clean the floor.", vi: "Bạn làm gì vào buổi sáng? – Tôi lau sàn nhà.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about what do you do in the morning? – i clean the floor. in English class.", example_vi: "Chúng mình học về bạn làm gì vào buổi sáng? – tôi lau sàn nhà. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 15: MY FAMILY'S WEEKENDS ──
  {
    id: 'lop4_c15_unit_15_my_family_s_',
    gradeId: 'lop4',
    name_vi: "UNIT 15: MY FAMILY'S WEEKENDS",
    name_en: "UNIT 15: MY FAMILY'S WEEKENDS",
    emoji: '🌊',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l4_s15_1_cinema',           en: "Cinema",              vi: "rạp chiếu phim",                    emoji: "🌊",    phonetic: "/ˈsɪnəmə/",           example_en: "We learn about cinema in English class.", example_vi: "Chúng mình học về rạp chiếu phim trong giờ tiếng Anh." },
      { id: 'l4_s15_2_shopping_centre',  en: "Shopping centre",     vi: "trung tâm mua sắm",                 emoji: "🌊",    phonetic: "/ˈʃɒpɪŋ ˈsentə/",     example_en: "We learn about shopping centre in English class.", example_vi: "Chúng mình học về trung tâm mua sắm trong giờ tiếng Anh." },
      { id: 'l4_s15_3_sports_centre',    en: "Sports centre",       vi: "trung tâm thể thao",                emoji: "🌊",    phonetic: "/ˈspɔːts ˈsentə/",    example_en: "We learn about sports centre in English class.", example_vi: "Chúng mình học về trung tâm thể thao trong giờ tiếng Anh." },
      { id: 'l4_s15_4_swimming_pool',    en: "Swimming pool",       vi: "bể bơi",                            emoji: "🏊",    phonetic: "/ˈswɪmɪŋ puːl/",      example_en: "We learn about swimming pool in English class.", example_vi: "Chúng mình học về bể bơi trong giờ tiếng Anh." },
      { id: 'l4_s15_5_cook_meals',       en: "Cook meals",          vi: "nấu các bữa ăn",                    emoji: "👨‍🍳", phonetic: "/kʊk miːlz/",         example_en: "We learn about cook meals in English class.", example_vi: "Chúng mình học về nấu các bữa ăn trong giờ tiếng Anh." },
      { id: 'l4_s15_6_do_yoga',          en: "Do yoga",             vi: "tập yoga",                          emoji: "🌊",    phonetic: "/duː ˈjəʊɡə/",        example_en: "We learn about do yoga in English class.", example_vi: "Chúng mình học về tập yoga trong giờ tiếng Anh." },
      { id: 'l4_s15_7_play_tennis',      en: "Play tennis",         vi: "chơi quần vợt",                     emoji: "🌊",    phonetic: "/pleɪ ˈtenɪs/",       example_en: "We like to play tennis after school.", example_vi: "Chúng mình thích chơi quần vợt sau giờ học." },
      { id: 'l4_s15_8_watch_films',      en: "Watch films",         vi: "xem phim",                          emoji: "🌊",    phonetic: "/wɒtʃ fɪlmz/",        example_en: "We learn about watch films in English class.", example_vi: "Chúng mình học về xem phim trong giờ tiếng Anh." },
      { id: 'l4_s15_9_where_does_he',    en: "Where does he",       vi: "",                                  emoji: "🌊",    phonetic: "/she go on Saturdays? – He/She goes to the sports centre. (Anh ấy/Cô ấy đi đâu vào các ngày Thứ Bảy? – Anh ấy/Cô ấy đi đến trung tâm thể thao.)", example_en: "We learn about where does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s15_10_what_does_he',    en: "What does he",        vi: "",                                  emoji: "🌊",    phonetic: "/she do on Sundays? – He/She plays tennis. (Anh ấy/Cô ấy làm gì vào các ngày Chủ Nhật? – Anh ấy/Cô ấy chơi quần vợt.)", example_en: "We learn about what does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 16: WEATHER ──
  {
    id: 'lop4_c16_unit_16_weather',
    gradeId: 'lop4',
    name_vi: "UNIT 16: WEATHER",
    name_en: "UNIT 16: WEATHER",
    emoji: '🌊',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l4_s16_1_cloudy',           en: "Cloudy",              vi: "có mây",                            emoji: "🌊",    phonetic: "/ˈklaʊdi/",           example_en: "We learn about cloudy in English class.", example_vi: "Chúng mình học về có mây trong giờ tiếng Anh." },
      { id: 'l4_s16_2_rainy',            en: "Rainy",               vi: "có mưa",                            emoji: "🌊",    phonetic: "/ˈreɪni/",            example_en: "We learn about rainy in English class.", example_vi: "Chúng mình học về có mưa trong giờ tiếng Anh." },
      { id: 'l4_s16_3_sunny',            en: "Sunny",               vi: "có nắng",                           emoji: "🌊",    phonetic: "/ˈsʌni/",             example_en: "We learn about sunny in English class.", example_vi: "Chúng mình học về có nắng trong giờ tiếng Anh." },
      { id: 'l4_s16_4_weather',          en: "Weather",             vi: "thời tiết",                         emoji: "🌊",    phonetic: "/ˈweðə/",             example_en: "We learn about weather in English class.", example_vi: "Chúng mình học về thời tiết trong giờ tiếng Anh." },
      { id: 'l4_s16_5_windy',            en: "Windy",               vi: "có gió",                            emoji: "🌊",    phonetic: "/ˈwɪndi/",            example_en: "We learn about windy in English class.", example_vi: "Chúng mình học về có gió trong giờ tiếng Anh." },
      { id: 'l4_s16_6_bakery',           en: "Bakery",              vi: "hiệu bánh mì",                      emoji: "🌊",    phonetic: "/ˈbeɪkəri/",          example_en: "We learn about bakery in English class.", example_vi: "Chúng mình học về hiệu bánh mì trong giờ tiếng Anh." },
      { id: 'l4_s16_7_bookshop',         en: "Bookshop",            vi: "hiệu sách",                         emoji: "🌊",    phonetic: "/ˈbʊkʃɒp/",           example_en: "We learn about bookshop in English class.", example_vi: "Chúng mình học về hiệu sách trong giờ tiếng Anh." },
      { id: 'l4_s16_8_food_stall',       en: "Food stall",          vi: "quầy ăn",                           emoji: "🌊",    phonetic: "/fuːd stɔːl/",        example_en: "We learn about food stall in English class.", example_vi: "Chúng mình học về quầy ăn trong giờ tiếng Anh." },
      { id: 'l4_s16_9_water_park',       en: "Water park",          vi: "công viên nước",                    emoji: "🌊",    phonetic: "/ˈwɔːtə pɑːk/",       example_en: "We learn about water park in English class.", example_vi: "Chúng mình học về công viên nước trong giờ tiếng Anh." },
      { id: 'l4_s16_10_what_was_the_weath', en: "What was the weather like last weekend? – It was sunny.", vi: "Thời tiết cuối tuần trước như thế nào? – Trời có nắng.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about what was the weather like last weekend? – it was sunny. in English class.", example_vi: "Chúng mình học về thời tiết cuối tuần trước như thế nào? – trời có nắng. trong giờ tiếng Anh." },
      { id: 'l4_s16_11_do_you_want_to_go_', en: "Do you want to go to the water park? – Great! Let's go.", vi: "",                                  emoji: "🌊",    phonetic: "/ Sorry, I can't. (Bạn có muốn đi công viên nước không? – Tuyệt quá! Chúng ta cùng đi nào. / Xin lỗi, mình không thể.)", example_en: "We learn about do you want to go to the water park? – great! let's go. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 17: IN THE CITY ──
  {
    id: 'lop4_c17_unit_17_in_the_city',
    gradeId: 'lop4',
    name_vi: "UNIT 17: IN THE CITY",
    name_en: "UNIT 17: IN THE CITY",
    emoji: '🏙️',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l4_s17_1_get',              en: "Get",                 vi: "đến",                               emoji: "🏙️",   phonetic: "/ɡet/",               example_en: "We learn about get in English class.", example_vi: "Chúng mình học về đến trong giờ tiếng Anh." },
      { id: 'l4_s17_2_go_straight',      en: "Go straight",         vi: "đi thẳng",                          emoji: "🏙️",   phonetic: "/ɡəʊ streɪt/",        example_en: "We learn about go straight in English class.", example_vi: "Chúng mình học về đi thẳng trong giờ tiếng Anh." },
      { id: 'l4_s17_3_left',             en: "Left",                vi: "bên trái",                          emoji: "🏙️",   phonetic: "/left/",              example_en: "We learn about left in English class.", example_vi: "Chúng mình học về bên trái trong giờ tiếng Anh." },
      { id: 'l4_s17_4_right',            en: "Right",               vi: "bên phải",                          emoji: "🏙️",   phonetic: "/raɪt/",              example_en: "We learn about right in English class.", example_vi: "Chúng mình học về bên phải trong giờ tiếng Anh." },
      { id: 'l4_s17_5_stop',             en: "Stop",                vi: "dừng lại",                          emoji: "🏙️",   phonetic: "/stɒp/",              example_en: "We learn about stop in English class.", example_vi: "Chúng mình học về dừng lại trong giờ tiếng Anh." },
      { id: 'l4_s17_6_turn',             en: "Turn",                vi: "rẽ",                                emoji: "🏙️",   phonetic: "/tɜːn/",              example_en: "We learn about turn in English class.", example_vi: "Chúng mình học về rẽ trong giờ tiếng Anh." },
      { id: 'l4_s17_7_turn_left',        en: "Turn left",           vi: "rẽ trái",                           emoji: "🏙️",   phonetic: "/tɜːn left/",         example_en: "We learn about turn left in English class.", example_vi: "Chúng mình học về rẽ trái trong giờ tiếng Anh." },
      { id: 'l4_s17_8_turn_right',       en: "Turn right",          vi: "rẽ phải",                           emoji: "🏙️",   phonetic: "/tɜːn raɪt/",         example_en: "We learn about turn right in English class.", example_vi: "Chúng mình học về rẽ phải trong giờ tiếng Anh." },
      { id: 'l4_s17_9_turn_round',       en: "Turn round",          vi: "quay lại",                          emoji: "🏙️",   phonetic: "/tɜːn raʊnd/",        example_en: "We learn about turn round in English class.", example_vi: "Chúng mình học về quay lại trong giờ tiếng Anh." },
      { id: 'l4_s17_10_what_does_it_say_i', en: "What does it say? – It says 'stop'.", vi: "Biển báo ghi gì? – Nó ghi 'dừng lại'.", emoji: "🏙️",   phonetic: "",                    example_en: "We learn about what does it say? – it says 'stop'. in English class.", example_vi: "Chúng mình học về biển báo ghi gì? – nó ghi 'dừng lại'. trong giờ tiếng Anh." },
      { id: 'l4_s17_11_how_can_i_get_to_t', en: "How can I get to the bookshop? – Go straight and turn left.", vi: "Làm sao tôi có thể đến hiệu sách? – Đi thẳng và rẽ trái.", emoji: "🏙️",   phonetic: "",                    example_en: "We learn about how can i get to the bookshop? – go straight and turn left. in English class.", example_vi: "Chúng mình học về làm sao tôi có thể đến hiệu sách? – đi thẳng và rẽ trái. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 18: AT THE SHOPPING CENTRE ──
  {
    id: 'lop4_c18_unit_18_at_the_shopp',
    gradeId: 'lop4',
    name_vi: "UNIT 18: AT THE SHOPPING CENTRE",
    name_en: "UNIT 18: AT THE SHOPPING CENTRE",
    emoji: '🌊',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l4_s18_1_behind',           en: "Behind",              vi: "phía sau",                          emoji: "🌊",    phonetic: "/bɪˈhaɪnd/",          example_en: "We learn about behind in English class.", example_vi: "Chúng mình học về phía sau trong giờ tiếng Anh." },
      { id: 'l4_s18_2_between',          en: "Between",             vi: "ở giữa",                            emoji: "🌊",    phonetic: "/bɪˈtwiːn/",          example_en: "We learn about between in English class.", example_vi: "Chúng mình học về ở giữa trong giờ tiếng Anh." },
      { id: 'l4_s18_3_near',             en: "Near",                vi: "ở gần",                             emoji: "🌊",    phonetic: "/nɪə/",               example_en: "We learn about near in English class.", example_vi: "Chúng mình học về ở gần trong giờ tiếng Anh." },
      { id: 'l4_s18_4_opposite',         en: "Opposite",            vi: "đối diện",                          emoji: "🌊",    phonetic: "/ˈɒpəzɪt/",           example_en: "We learn about opposite in English class.", example_vi: "Chúng mình học về đối diện trong giờ tiếng Anh." },
      { id: 'l4_s18_5_gift_shop',        en: "Gift shop",           vi: "cửa hàng quà tặng",                 emoji: "🌊",    phonetic: "/ˈɡɪft ʃɒp/",         example_en: "We learn about gift shop in English class.", example_vi: "Chúng mình học về cửa hàng quà tặng trong giờ tiếng Anh." },
      { id: 'l4_s18_6_skirt',            en: "Skirt",               vi: "chân váy",                          emoji: "🩰",    phonetic: "/skɜːt/",             example_en: "We learn about skirt in English class.", example_vi: "Chúng mình học về chân váy trong giờ tiếng Anh." },
      { id: 'l4_s18_7_t_shirt',          en: "T-shirt",             vi: "áo thun",                           emoji: "👕",    phonetic: "/ˈtiː ʃɜːt/",         example_en: "We learn about t-shirt in English class.", example_vi: "Chúng mình học về áo thun trong giờ tiếng Anh." },
      { id: 'l4_s18_8_dong',             en: "Dong",                vi: "đồng (tiền)",                       emoji: "🌊",    phonetic: "/dɒŋ/",               example_en: "We learn about dong in English class.", example_vi: "Chúng mình học về đồng (tiền) trong giờ tiếng Anh." },
      { id: 'l4_s18_9_thousand',         en: "Thousand",            vi: "nghìn",                             emoji: "🌊",    phonetic: "/ˈθaʊznd/",           example_en: "We learn about thousand in English class.", example_vi: "Chúng mình học về nghìn trong giờ tiếng Anh." },
      { id: 'l4_s18_10_where_s_the_booksh', en: "Where's the bookshop? – It's near the gift shop.", vi: "Hiệu sách ở đâu? – Nó ở gần cửa hàng quà tặng.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about where's the bookshop? – it's near the gift shop. in English class.", example_vi: "Chúng mình học về hiệu sách ở đâu? – nó ở gần cửa hàng quà tặng. trong giờ tiếng Anh." },
      { id: 'l4_s18_11_how_much_is_the_t_', en: "How much is the T-shirt? – It's fifty thousand dong.", vi: "Chiếc áo thun này giá bao nhiêu? – Giá 50.000 đồng.", emoji: "👕",    phonetic: "",                    example_en: "How much is this red T-shirt?", example_vi: "Chiếc áo thun đỏ này giá bao nhiêu?" },
    ],
  },

  // ── UNIT 19: THE ANIMAL WORLD ──
  {
    id: 'lop4_c19_unit_19_the_animal_w',
    gradeId: 'lop4',
    name_vi: "UNIT 19: THE ANIMAL WORLD",
    name_en: "UNIT 19: THE ANIMAL WORLD",
    emoji: '🌊',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l4_s19_1_crocodile',        en: "Crocodile",           vi: "con cá sấu",                        emoji: "🐊",    phonetic: "/ˈkrɒkədaɪl/",        example_en: "We learn about crocodile in English class.", example_vi: "Chúng mình học về con cá sấu trong giờ tiếng Anh." },
      { id: 'l4_s19_2_giraffe',          en: "Giraffe",             vi: "con hươu cao cổ",                   emoji: "🦒",    phonetic: "/dʒəˈrɑːf/",          example_en: "We learn about giraffe in English class.", example_vi: "Chúng mình học về con hươu cao cổ trong giờ tiếng Anh." },
      { id: 'l4_s19_3_hippo',            en: "Hippo",               vi: "con hà mã",                         emoji: "🦛",    phonetic: "/ˈhɪpəʊ/",            example_en: "We learn about hippo in English class.", example_vi: "Chúng mình học về con hà mã trong giờ tiếng Anh." },
      { id: 'l4_s19_4_lion',             en: "Lion",                vi: "con sư tử",                         emoji: "🦁",    phonetic: "/ˈlaɪən/",            example_en: "We learn about lion in English class.", example_vi: "Chúng mình học về con sư tử trong giờ tiếng Anh." },
      { id: 'l4_s19_5_dance_beautifully', en: "Dance beautifully",   vi: "múa đẹp",                           emoji: "🌊",    phonetic: "/dɑːns ˈbjuːtɪfli/",  example_en: "We learn about dance beautifully in English class.", example_vi: "Chúng mình học về múa đẹp trong giờ tiếng Anh." },
      { id: 'l4_s19_6_roar_loudly',      en: "Roar loudly",         vi: "gầm to",                            emoji: "🌊",    phonetic: "/rɔː ˈlaʊdli/",       example_en: "We learn about roar loudly in English class.", example_vi: "Chúng mình học về gầm to trong giờ tiếng Anh." },
      { id: 'l4_s19_7_run_quickly',      en: "Run quickly",         vi: "chạy nhanh",                        emoji: "🌊",    phonetic: "/rʌn ˈkwɪkli/",       example_en: "We learn about run quickly in English class.", example_vi: "Chúng mình học về chạy nhanh trong giờ tiếng Anh." },
      { id: 'l4_s19_8_sing_merrily',     en: "Sing merrily",        vi: "hát vui vẻ",                        emoji: "🌊",    phonetic: "/sɪŋ ˈmerəli/",       example_en: "We learn about sing merrily in English class.", example_vi: "Chúng mình học về hát vui vẻ trong giờ tiếng Anh." },
      { id: 'l4_s19_9_what_are_these_ani', en: "What are these animals? – They're giraffes.", vi: "Những con vật này là con gì? – Chúng là hươu cao cổ.", emoji: "🦒",    phonetic: "",                    example_en: "We learn about what are these animals? – they're giraffes. in English class.", example_vi: "Chúng mình học về những con vật này là con gì? – chúng là hươu cao cổ. trong giờ tiếng Anh." },
      { id: 'l4_s19_10_why_do_you_like_pe', en: "Why do you like peacocks? – Because they dance beautifully.", vi: "Tại sao bạn thích chim công? – Bởi vì chúng múa rất đẹp.", emoji: "🦚",    phonetic: "",                    example_en: "We learn about why do you like peacocks? – because they dance beautifully. in English class.", example_vi: "Chúng mình học về tại sao bạn thích chim công? – bởi vì chúng múa rất đẹp. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 20: AT SUMMER CAMP ──
  {
    id: 'lop4_c20_unit_20_at_summer_ca',
    gradeId: 'lop4',
    name_vi: "UNIT 20: AT SUMMER CAMP",
    name_en: "UNIT 20: AT SUMMER CAMP",
    emoji: '🌊',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'l4_s20_1_build_a_campfire', en: "Build a campfire",    vi: "đốt lửa trại",                      emoji: "🌊",    phonetic: "/bɪld ə ˈkæmpfaɪə/",  example_en: "We learn about build a campfire in English class.", example_vi: "Chúng mình học về đốt lửa trại trong giờ tiếng Anh." },
      { id: 'l4_s20_2_dance_around_the_c', en: "Dance around the campfire", vi: "nhảy múa quanh lửa trại",           emoji: "🌊",    phonetic: "/dɑːns əˈraʊnd ðə ˈkæmpfaɪə/", example_en: "We learn about dance around the campfire in English class.", example_vi: "Chúng mình học về nhảy múa quanh lửa trại trong giờ tiếng Anh." },
      { id: 'l4_s20_3_play_card_games',  en: "Play card games",     vi: "chơi bài",                          emoji: "🌊",    phonetic: "/pleɪ kɑːd ɡeɪmz/",   example_en: "We like to play card games after school.", example_vi: "Chúng mình thích chơi bài sau giờ học." },
      { id: 'l4_s20_4_play_tug_of_war',  en: "Play tug of war",     vi: "chơi kéo co",                       emoji: "🌊",    phonetic: "/pleɪ tʌɡ əv wɔː/",   example_en: "We like to play tug of war after school.", example_vi: "Chúng mình thích chơi kéo co sau giờ học." },
      { id: 'l4_s20_5_put_up_a_tent',    en: "Put up a tent",       vi: "dựng lều",                          emoji: "🌊",    phonetic: "/pʊt ʌp ə tent/",     example_en: "We learn about put up a tent in English class.", example_vi: "Chúng mình học về dựng lều trong giờ tiếng Anh." },
      { id: 'l4_s20_6_sing_songs',       en: "Sing songs",          vi: "hát các bài hát",                   emoji: "🌊",    phonetic: "/sɪŋ sɒŋz/",          example_en: "We learn about sing songs in English class.", example_vi: "Chúng mình học về hát các bài hát trong giờ tiếng Anh." },
      { id: 'l4_s20_7_take_a_photo',     en: "Take a photo",        vi: "chụp ảnh",                          emoji: "🍜",    phonetic: "/teɪk ə ˈfəʊtəʊ/",    example_en: "We learn about take a photo in English class.", example_vi: "Chúng mình học về chụp ảnh trong giờ tiếng Anh." },
      { id: 'l4_s20_8_tell_a_story',     en: "Tell a story",        vi: "kể chuyện",                         emoji: "🌊",    phonetic: "/tel ə ˈstɔːri/",     example_en: "We learn about tell a story in English class.", example_vi: "Chúng mình học về kể chuyện trong giờ tiếng Anh." },
      { id: 'l4_s20_9_what_s_he',        en: "What's he",           vi: "",                                  emoji: "🌊",    phonetic: "/she doing? – He's/She's putting up a tent. (Anh ấy/Cô ấy đang làm gì? – Anh ấy/Cô ấy đang dựng lều.)", example_en: "We learn about what's he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l4_s20_10_what_are_they_doin', en: "What are they doing? – They're playing card games.", vi: "Họ đang làm gì? – Họ đang chơi bài.", emoji: "🌊",    phonetic: "",                    example_en: "We learn about what are they doing? – they're playing card games. in English class.", example_vi: "Chúng mình học về họ đang làm gì? – họ đang chơi bài. trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 1: TRANG PHỤC & THỜI TRANG (CLOTHING & ACCESSORIES) ──
  {
    id: 'lop4_c21_ch_1_trang_ph_c_th_i',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 1: TRANG PHỤC & THỜI TRANG (CLOTHING & ACCESSORIES)",
    name_en: "CHỦ ĐỀ 1: TRANG PHỤC & THỜI TRANG (CLOTHING & ACCESSORIES)",
    emoji: '🌊',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l4_s21_1_coat',             en: "Coat",                vi: "áo khoác dáng dài",                 emoji: "🧥",    phonetic: "/kəʊt/",              example_en: "We learn about coat in English class.", example_vi: "Chúng mình học về áo khoác dáng dài trong giờ tiếng Anh." },
      { id: 'l4_s21_2_jacket',           en: "Jacket",              vi: "áo khoác ngắn",                     emoji: "🧥",    phonetic: "/ˈdʒækɪt/",           example_en: "We learn about jacket in English class.", example_vi: "Chúng mình học về áo khoác ngắn trong giờ tiếng Anh." },
      { id: 'l4_s21_3_sweater',          en: "Sweater",             vi: "áo len",                            emoji: "🧶",    phonetic: "/ˈswetə/",            example_en: "We learn about sweater in English class.", example_vi: "Chúng mình học về áo len trong giờ tiếng Anh." },
      { id: 'l4_s21_4_boots',            en: "Boots",               vi: "đôi ủng / đôi bốt",                 emoji: "👢",    phonetic: "/buːts/",             example_en: "We learn about boots in English class.", example_vi: "Chúng mình học về đôi ủng / đôi bốt trong giờ tiếng Anh." },
      { id: 'l4_s21_5_scarf',            en: "Scarf",               vi: "khăn quàng cổ",                     emoji: "🧣",    phonetic: "/skɑːf/",             example_en: "We learn about scarf in English class.", example_vi: "Chúng mình học về khăn quàng cổ trong giờ tiếng Anh." },
      { id: 'l4_s21_6_gloves',           en: "Gloves",              vi: "đôi găng tay",                      emoji: "🧤",    phonetic: "/ɡlʌvz/",             example_en: "We learn about gloves in English class.", example_vi: "Chúng mình học về đôi găng tay trong giờ tiếng Anh." },
      { id: 'l4_s21_7_belt',             en: "Belt",                vi: "thắt lưng",                         emoji: "🥋",    phonetic: "/belt/",              example_en: "We learn about belt in English class.", example_vi: "Chúng mình học về thắt lưng trong giờ tiếng Anh." },
      { id: 'l4_s21_8_raincoat',         en: "Raincoat",            vi: "áo mưa",                            emoji: "🧥",    phonetic: "/ˈreɪnkəʊt/",         example_en: "We learn about raincoat in English class.", example_vi: "Chúng mình học về áo mưa trong giờ tiếng Anh." },
      { id: 'l4_s21_9_cap',              en: "Cap",                 vi: "mũ lưỡi trai",                      emoji: "🧢",    phonetic: "/kæp/",               example_en: "We learn about cap in English class.", example_vi: "Chúng mình học về mũ lưỡi trai trong giờ tiếng Anh." },
      { id: 'l4_s21_10_glasses',         en: "Glasses",             vi: "kính mắt",                          emoji: "👓",    phonetic: "/ˈɡlɑːsɪz/",          example_en: "We learn about glasses in English class.", example_vi: "Chúng mình học về kính mắt trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 2: THỰC PHẨM & ĐỒ UỐNG NÂNG CAO (ADVANCED FOOD & DRINKS) ──
  {
    id: 'lop4_c22_ch_2_th_c_ph_m_u_ng_',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 2: THỰC PHẨM & ĐỒ UỐNG NÂNG CAO (ADVANCED FOOD & DRINKS)",
    name_en: "CHỦ ĐỀ 2: THỰC PHẨM & ĐỒ UỐNG NÂNG CAO (ADVANCED FOOD & DRINKS)",
    emoji: '🌊',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'l4_s22_1_sandwich',         en: "Sandwich",            vi: "bánh mì kẹp",                       emoji: "🌊",    phonetic: "/ˈsænwɪdʒ/",          example_en: "We learn about sandwich in English class.", example_vi: "Chúng mình học về bánh mì kẹp trong giờ tiếng Anh." },
      { id: 'l4_s22_2_pancake',          en: "Pancake",             vi: "bánh kếp",                          emoji: "🌊",    phonetic: "/ˈpænkeɪk/",          example_en: "We learn about pancake in English class.", example_vi: "Chúng mình học về bánh kếp trong giờ tiếng Anh." },
      { id: 'l4_s22_3_sausage',          en: "Sausage",             vi: "xúc xích",                          emoji: "🌊",    phonetic: "/ˈsɒsɪdʒ/",           example_en: "We learn about sausage in English class.", example_vi: "Chúng mình học về xúc xích trong giờ tiếng Anh." },
      { id: 'l4_s22_4_soup',             en: "Soup",                vi: "món súp / canh",                    emoji: "🌊",    phonetic: "/suːp/",              example_en: "We learn about soup in English class.", example_vi: "Chúng mình học về món súp / canh trong giờ tiếng Anh." },
      { id: 'l4_s22_5_salad',            en: "Salad",               vi: "món rau trộn / xa-lát",             emoji: "🌊",    phonetic: "/ˈsæləd/",            example_en: "We learn about salad in English class.", example_vi: "Chúng mình học về món rau trộn / xa-lát trong giờ tiếng Anh." },
      { id: 'l4_s22_6_butter',           en: "Butter",              vi: "bơ",                                emoji: "🌊",    phonetic: "/ˈbʌtə/",             example_en: "We learn about butter in English class.", example_vi: "Chúng mình học về bơ trong giờ tiếng Anh." },
      { id: 'l4_s22_7_cheese',           en: "Cheese",              vi: "phô mai",                           emoji: "🌊",    phonetic: "/tʃiːz/",             example_en: "We learn about cheese in English class.", example_vi: "Chúng mình học về phô mai trong giờ tiếng Anh." },
      { id: 'l4_s22_8_cereal',           en: "Cereal",              vi: "ngũ cốc",                           emoji: "🌊",    phonetic: "/ˈsɪəriəl/",          example_en: "We learn about cereal in English class.", example_vi: "Chúng mình học về ngũ cốc trong giờ tiếng Anh." },
      { id: 'l4_s22_9_hot_chocolate',    en: "Hot chocolate",       vi: "ca-cao nóng",                       emoji: "🌊",    phonetic: "/hɒt ˈtʃɒklət/",      example_en: "We learn about hot chocolate in English class.", example_vi: "Chúng mình học về ca-cao nóng trong giờ tiếng Anh." },
      { id: 'l4_s22_10_tea',             en: "Tea",                 vi: "trà",                               emoji: "🌊",    phonetic: "/tiː/",               example_en: "We learn about tea in English class.", example_vi: "Chúng mình học về trà trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 3: CÁC QUỐC GIA & QUỐC TỊCH (COUNTRIES & NATIONALITIES) ──
  {
    id: 'lop4_c23_ch_3_c_c_qu_c_gia_qu',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 3: CÁC QUỐC GIA & QUỐC TỊCH (COUNTRIES & NATIONALITIES)",
    name_en: "CHỦ ĐỀ 3: CÁC QUỐC GIA & QUỐC TỊCH (COUNTRIES & NATIONALITIES)",
    emoji: '🌊',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l4_s23_1_vietnam',          en: "Vietnam",             vi: "Nước Việt Nam",                     emoji: "🇻🇳",  phonetic: "/ˌvjet ˈnæm/",        example_en: "We learn about vietnam in English class.", example_vi: "Chúng mình học về nước việt nam trong giờ tiếng Anh." },
      { id: 'l4_s23_2_vietnamese',       en: "Vietnamese",          vi: "Người / Tiếng Việt",                emoji: "🇻🇳",  phonetic: "/ˌvjetnəˈmiːz/",      example_en: "We learn about vietnamese in English class.", example_vi: "Chúng mình học về người / tiếng việt trong giờ tiếng Anh." },
      { id: 'l4_s23_3_england',          en: "England",             vi: "Nước Anh",                          emoji: "🌊",    phonetic: "/ˈɪŋɡlənd/",          example_en: "We learn about england in English class.", example_vi: "Chúng mình học về nước anh trong giờ tiếng Anh." },
      { id: 'l4_s23_4_english',          en: "English",             vi: "Người / Tiếng Anh",                 emoji: "🇬🇧",  phonetic: "/ˈɪŋɡlɪʃ/",           example_en: "We learn about english in English class.", example_vi: "Chúng mình học về người / tiếng anh trong giờ tiếng Anh." },
      { id: 'l4_s23_5_america',          en: "America",             vi: "Nước Mỹ",                           emoji: "🇺🇸",  phonetic: "/əˈmerɪkə/",          example_en: "We learn about america in English class.", example_vi: "Chúng mình học về nước mỹ trong giờ tiếng Anh." },
      { id: 'l4_s23_6_american',         en: "American",            vi: "Người Mỹ",                          emoji: "🇺🇸",  phonetic: "/əˈmerɪkən/",         example_en: "We learn about american in English class.", example_vi: "Chúng mình học về người mỹ trong giờ tiếng Anh." },
      { id: 'l4_s23_7_japan',            en: "Japan",               vi: "Nước Nhật Bản",                     emoji: "🇯🇵",  phonetic: "/dʒəˈpæn/",           example_en: "We learn about japan in English class.", example_vi: "Chúng mình học về nước nhật bản trong giờ tiếng Anh." },
      { id: 'l4_s23_8_japanese',         en: "Japanese",            vi: "Người / Tiếng Nhật",                emoji: "🇯🇵",  phonetic: "/ˌdʒæpəˈniːz/",       example_en: "We learn about japanese in English class.", example_vi: "Chúng mình học về người / tiếng nhật trong giờ tiếng Anh." },
      { id: 'l4_s23_9_china',            en: "China",               vi: "Nước Trung Quốc",                   emoji: "🇨🇳",  phonetic: "/ˈtʃaɪnə/",           example_en: "We learn about china in English class.", example_vi: "Chúng mình học về nước trung quốc trong giờ tiếng Anh." },
      { id: 'l4_s23_10_chinese',         en: "Chinese",             vi: "Người / Tiếng Trung",               emoji: "🇨🇳",  phonetic: "/ˌtʃaɪˈniːz/",        example_en: "We learn about chinese in English class.", example_vi: "Chúng mình học về người / tiếng trung trong giờ tiếng Anh." },
      { id: 'l4_s23_11_korea',           en: "Korea",               vi: "Nước Hàn Quốc",                     emoji: "🇰🇷",  phonetic: "/kəˈriːə/",           example_en: "We learn about korea in English class.", example_vi: "Chúng mình học về nước hàn quốc trong giờ tiếng Anh." },
      { id: 'l4_s23_12_korean',          en: "Korean",              vi: "Người / Tiếng Hàn",                 emoji: "🇰🇷",  phonetic: "/kəˈriːən/",          example_en: "We learn about korean in English class.", example_vi: "Chúng mình học về người / tiếng hàn trong giờ tiếng Anh." },
      { id: 'l4_s23_13_france',          en: "France",              vi: "Nước Pháp",                         emoji: "🇫🇷",  phonetic: "/frɑːns/",            example_en: "We learn about france in English class.", example_vi: "Chúng mình học về nước pháp trong giờ tiếng Anh." },
      { id: 'l4_s23_14_french',          en: "French",              vi: "Người / Tiếng Pháp",                emoji: "🇫🇷",  phonetic: "/frentʃ/",            example_en: "We learn about french in English class.", example_vi: "Chúng mình học về người / tiếng pháp trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 4: ĐỊA ĐIỂM TRONG THÀNH PHỐ (PLACES IN TOWN) ──
  {
    id: 'lop4_c24_ch_4_a_i_m_trong_th_',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 4: ĐỊA ĐIỂM TRONG THÀNH PHỐ (PLACES IN TOWN)",
    name_en: "CHỦ ĐỀ 4: ĐỊA ĐIỂM TRONG THÀNH PHỐ (PLACES IN TOWN)",
    emoji: '🏘️',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l4_s24_1_post_office',      en: "Post office",         vi: "bưu điện",                          emoji: "🏘️",   phonetic: "/ˈpəʊst ɒfɪs/",       example_en: "We learn about post office in English class.", example_vi: "Chúng mình học về bưu điện trong giờ tiếng Anh." },
      { id: 'l4_s24_2_supermarket',      en: "Supermarket",         vi: "siêu thị",                          emoji: "🏘️",   phonetic: "/ˈsuːpəmɑːkɪt/",      example_en: "We learn about supermarket in English class.", example_vi: "Chúng mình học về siêu thị trong giờ tiếng Anh." },
      { id: 'l4_s24_3_pharmacy',         en: "Pharmacy",            vi: "hiệu thuốc",                        emoji: "🏘️",   phonetic: "/ˈfɑːməsi/",          example_en: "We learn about pharmacy in English class.", example_vi: "Chúng mình học về hiệu thuốc trong giờ tiếng Anh." },
      { id: 'l4_s24_4_bus_stop',         en: "Bus stop",            vi: "điểm dừng xe buýt",                 emoji: "🏘️",   phonetic: "/ˈbʌs stɒp/",         example_en: "We learn about bus stop in English class.", example_vi: "Chúng mình học về điểm dừng xe buýt trong giờ tiếng Anh." },
      { id: 'l4_s24_5_train_station',    en: "Train station",       vi: "nhà ga tàu hỏa",                    emoji: "🏘️",   phonetic: "/ˈtreɪn steɪʃn/",     example_en: "We learn about train station in English class.", example_vi: "Chúng mình học về nhà ga tàu hỏa trong giờ tiếng Anh." },
      { id: 'l4_s24_6_museum',           en: "Museum",              vi: "bảo tàng",                          emoji: "🏘️",   phonetic: "/mjuˈziːəm/",         example_en: "We learn about museum in English class.", example_vi: "Chúng mình học về bảo tàng trong giờ tiếng Anh." },
      { id: 'l4_s24_7_zoo',              en: "Zoo",                 vi: "sở thú",                            emoji: "🏘️",   phonetic: "/zuː/",               example_en: "We learn about zoo in English class.", example_vi: "Chúng mình học về sở thú trong giờ tiếng Anh." },
      { id: 'l4_s24_8_park',             en: "Park",                vi: "công viên",                         emoji: "🏘️",   phonetic: "/pɑːk/",              example_en: "We learn about park in English class.", example_vi: "Chúng mình học về công viên trong giờ tiếng Anh." },
      { id: 'l4_s24_9_library',          en: "Library",             vi: "thư viện",                          emoji: "🏘️",   phonetic: "/ˈlaɪbrəri/",         example_en: "We learn about library in English class.", example_vi: "Chúng mình học về thư viện trong giờ tiếng Anh." },
      { id: 'l4_s24_10_cinema',          en: "Cinema",              vi: "rạp chiếu phim",                    emoji: "🏘️",   phonetic: "/ˈsɪnəmə/",           example_en: "We learn about cinema in English class.", example_vi: "Chúng mình học về rạp chiếu phim trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 5: MÔN HỌC & THIẾT BỊ HỌC TẬP (SUBJECTS & SCHOOL ITEMS) ──
  {
    id: 'lop4_c25_ch_5_m_n_h_c_thi_t_b',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 5: MÔN HỌC & THIẾT BỊ HỌC TẬP (SUBJECTS & SCHOOL ITEMS)",
    name_en: "CHỦ ĐỀ 5: MÔN HỌC & THIẾT BỊ HỌC TẬP (SUBJECTS & SCHOOL ITEMS)",
    emoji: '🌊',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l4_s25_1_geography',        en: "Geography",           vi: "môn Địa lí",                        emoji: "🌊",    phonetic: "/dʒiˈɒɡrəfi/",        example_en: "We learn about geography in English class.", example_vi: "Chúng mình học về môn địa lí trong giờ tiếng Anh." },
      { id: 'l4_s25_2_history',          en: "History",             vi: "môn Lịch sử",                       emoji: "🌊",    phonetic: "/ˈhɪstri/",           example_en: "We learn about history in English class.", example_vi: "Chúng mình học về môn lịch sử trong giờ tiếng Anh." },
      { id: 'l4_s25_3_literature',       en: "Literature",          vi: "môn Ngữ văn",                       emoji: "🌊",    phonetic: "/ˈlɪtrətʃə/",         example_en: "We learn about literature in English class.", example_vi: "Chúng mình học về môn ngữ văn trong giờ tiếng Anh." },
      { id: 'l4_s25_4_computer',         en: "Computer",            vi: "máy tính",                          emoji: "🌊",    phonetic: "/kəmˈpjuːtə/",        example_en: "We learn about computer in English class.", example_vi: "Chúng mình học về máy tính trong giờ tiếng Anh." },
      { id: 'l4_s25_5_projector',        en: "Projector",           vi: "máy chiếu",                         emoji: "🌊",    phonetic: "/prəˈdʒektə/",        example_en: "We learn about projector in English class.", example_vi: "Chúng mình học về máy chiếu trong giờ tiếng Anh." },
      { id: 'l4_s25_6_notebook',         en: "Notebook",            vi: "vở ghi",                            emoji: "🌊",    phonetic: "/ˈnəʊtbʊk/",          example_en: "We learn about notebook in English class.", example_vi: "Chúng mình học về vở ghi trong giờ tiếng Anh." },
      { id: 'l4_s25_7_dictionary',       en: "Dictionary",          vi: "từ điển",                           emoji: "🌊",    phonetic: "/ˈdɪkʃənri/",         example_en: "We learn about dictionary in English class.", example_vi: "Chúng mình học về từ điển trong giờ tiếng Anh." },
      { id: 'l4_s25_8_backpack',         en: "Backpack",            vi: "ba-lô",                             emoji: "🌊",    phonetic: "/ˈbækpæk/",           example_en: "We learn about backpack in English class.", example_vi: "Chúng mình học về ba-lô trong giờ tiếng Anh." },
      { id: 'l4_s25_9_textbook',         en: "Textbook",            vi: "sách giáo khoa",                    emoji: "🌊",    phonetic: "/ˈtekstbʊk/",         example_en: "We learn about textbook in English class.", example_vi: "Chúng mình học về sách giáo khoa trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 6: SỨC KHỎE & BỆNH TẬT CƠ BẢN (HEALTH & ILLNESSES) ──
  {
    id: 'lop4_c26_ch_6_s_c_kh_e_b_nh_t',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 6: SỨC KHỎE & BỆNH TẬT CƠ BẢN (HEALTH & ILLNESSES)",
    name_en: "CHỦ ĐỀ 6: SỨC KHỎE & BỆNH TẬT CƠ BẢN (HEALTH & ILLNESSES)",
    emoji: '🌊',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l4_s26_1_fever',            en: "Fever",               vi: "cơn sốt",                           emoji: "🤒",    phonetic: "/ˈfiːvə/",            example_en: "We learn about fever in English class.", example_vi: "Chúng mình học về cơn sốt trong giờ tiếng Anh." },
      { id: 'l4_s26_2_cough',            en: "Cough",               vi: "cái ho / bị ho",                    emoji: "😷",    phonetic: "/kɒf/",               example_en: "We learn about cough in English class.", example_vi: "Chúng mình học về cái ho / bị ho trong giờ tiếng Anh." },
      { id: 'l4_s26_3_cold',             en: "Cold",                vi: "cảm lạnh",                          emoji: "🤧",    phonetic: "/kəʊld/",             example_en: "We learn about cold in English class.", example_vi: "Chúng mình học về cảm lạnh trong giờ tiếng Anh." },
      { id: 'l4_s26_4_headache',         en: "Headache",            vi: "đau đầu",                           emoji: "🤕",    phonetic: "/ˈhedeɪk/",           example_en: "We learn about headache in English class.", example_vi: "Chúng mình học về đau đầu trong giờ tiếng Anh." },
      { id: 'l4_s26_5_toothache',        en: "Toothache",           vi: "đau răng",                          emoji: "🦷",    phonetic: "/ˈtuːθeɪk/",          example_en: "We learn about toothache in English class.", example_vi: "Chúng mình học về đau răng trong giờ tiếng Anh." },
      { id: 'l4_s26_6_stomach_ache',     en: "Stomach ache",        vi: "đau dạ dày / đau bụng",             emoji: "🤢",    phonetic: "/ˈstʌmək eɪk/",       example_en: "We learn about stomach ache in English class.", example_vi: "Chúng mình học về đau dạ dày / đau bụng trong giờ tiếng Anh." },
      { id: 'l4_s26_7_doctor',           en: "Doctor",              vi: "bác sĩ",                            emoji: "🌊",    phonetic: "/ˈdɒktə/",            example_en: "We learn about doctor in English class.", example_vi: "Chúng mình học về bác sĩ trong giờ tiếng Anh." },
      { id: 'l4_s26_8_medicine',         en: "Medicine",            vi: "thuốc",                             emoji: "💊",    phonetic: "/ˈmedsn/",            example_en: "We learn about medicine in English class.", example_vi: "Chúng mình học về thuốc trong giờ tiếng Anh." },
      { id: 'l4_s26_9_rest',             en: "Rest",                vi: "nghỉ ngơi",                         emoji: "🌊",    phonetic: "/rest/",              example_en: "We learn about rest in English class.", example_vi: "Chúng mình học về nghỉ ngơi trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 7: ĐỘNG VẬT HOÀNG DÃ & MÔI TRƯỜNG SỐNG (WILD ANIMALS & HABITATS) ──
  {
    id: 'lop4_c27_ch_7_ng_v_t_ho_ng_d_',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 7: ĐỘNG VẬT HOÀNG DÃ & MÔI TRƯỜNG SỐNG (WILD ANIMALS & HABITATS)",
    name_en: "CHỦ ĐỀ 7: ĐỘNG VẬT HOÀNG DÃ & MÔI TRƯỜNG SỐNG (WILD ANIMALS & HABITATS)",
    emoji: '🌊',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l4_s27_1_dolphin',          en: "Dolphin",             vi: "con cá heo",                        emoji: "🐬",    phonetic: "/ˈdɒlfɪn/",           example_en: "We learn about dolphin in English class.", example_vi: "Chúng mình học về con cá heo trong giờ tiếng Anh." },
      { id: 'l4_s27_2_whale',            en: "Whale",               vi: "con cá voi",                        emoji: "🐋",    phonetic: "/weɪl/",              example_en: "We learn about whale in English class.", example_vi: "Chúng mình học về con cá voi trong giờ tiếng Anh." },
      { id: 'l4_s27_3_shark',            en: "Shark",               vi: "con cá mập",                        emoji: "🦈",    phonetic: "/ʃɑːk/",              example_en: "We learn about shark in English class.", example_vi: "Chúng mình học về con cá mập trong giờ tiếng Anh." },
      { id: 'l4_s27_4_kangaroo',         en: "Kangaroo",            vi: "con chuột túi",                     emoji: "🦘",    phonetic: "/ˌkæŋɡəˈruː/",        example_en: "We learn about kangaroo in English class.", example_vi: "Chúng mình học về con chuột túi trong giờ tiếng Anh." },
      { id: 'l4_s27_5_panda',            en: "Panda",               vi: "con gấu trúc",                      emoji: "🐼",    phonetic: "/ˈpændə/",            example_en: "We learn about panda in English class.", example_vi: "Chúng mình học về con gấu trúc trong giờ tiếng Anh." },
      { id: 'l4_s27_6_tiger',            en: "Tiger",               vi: "con hổ",                            emoji: "🐯",    phonetic: "/ˈtaɪɡə/",            example_en: "We learn about tiger in English class.", example_vi: "Chúng mình học về con hổ trong giờ tiếng Anh." },
      { id: 'l4_s27_7_lion',             en: "Lion",                vi: "con sư tử",                         emoji: "🦁",    phonetic: "/ˈlaɪən/",            example_en: "We learn about lion in English class.", example_vi: "Chúng mình học về con sư tử trong giờ tiếng Anh." },
      { id: 'l4_s27_8_forest',           en: "Forest",              vi: "khu rừng",                          emoji: "🌊",    phonetic: "/ˈfɒrɪst/",           example_en: "We learn about forest in English class.", example_vi: "Chúng mình học về khu rừng trong giờ tiếng Anh." },
      { id: 'l4_s27_9_ocean',            en: "Ocean",               vi: "đại dương",                         emoji: "🌊",    phonetic: "/ˈəʊʃn/",             example_en: "We learn about ocean in English class.", example_vi: "Chúng mình học về đại dương trong giờ tiếng Anh." },
      { id: 'l4_s27_10_jungle',          en: "Jungle",              vi: "rừng rậm",                          emoji: "🌊",    phonetic: "/ˈdʒʌŋɡl/",           example_en: "We learn about jungle in English class.", example_vi: "Chúng mình học về rừng rậm trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 8: TÍNH CÁCH & NGOẠI HÌNH (ADJECTIVES FOR APPEARANCE & PERSONALITY) ──
  {
    id: 'lop4_c28_ch_8_t_nh_c_ch_ngo_i',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 8: TÍNH CÁCH & NGOẠI HÌNH (ADJECTIVES FOR APPEARANCE & PERSONALITY)",
    name_en: "CHỦ ĐỀ 8: TÍNH CÁCH & NGOẠI HÌNH (ADJECTIVES FOR APPEARANCE & PERSONALITY)",
    emoji: '🌊',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'l4_s28_1_handsome',         en: "Handsome",            vi: "đẹp trai",                          emoji: "🌊",    phonetic: "/ˈhænsəm/",           example_en: "We learn about handsome in English class.", example_vi: "Chúng mình học về đẹp trai trong giờ tiếng Anh." },
      { id: 'l4_s28_2_pretty',           en: "Pretty",              vi: "xinh xắn",                          emoji: "🌊",    phonetic: "/ˈprɪti/",            example_en: "We learn about pretty in English class.", example_vi: "Chúng mình học về xinh xắn trong giờ tiếng Anh." },
      { id: 'l4_s28_3_energetic',        en: "Energetic",           vi: "năng động, giàu năng lượng",        emoji: "🌊",    phonetic: "/ˌenəˈdʒetɪk/",       example_en: "We learn about energetic in English class.", example_vi: "Chúng mình học về năng động, giàu năng lượng trong giờ tiếng Anh." },
      { id: 'l4_s28_4_hard_working',     en: "Hard-working",        vi: "chăm chỉ",                          emoji: "👑",    phonetic: "/ˌhɑːd ˈwɜːkɪŋ/",     example_en: "We learn about hard-working in English class.", example_vi: "Chúng mình học về chăm chỉ trong giờ tiếng Anh." },
      { id: 'l4_s28_5_polite',           en: "Polite",              vi: "lịch sự",                           emoji: "🌊",    phonetic: "/pəˈlaɪt/",           example_en: "We learn about polite in English class.", example_vi: "Chúng mình học về lịch sự trong giờ tiếng Anh." },
      { id: 'l4_s28_6_brave',            en: "Brave",               vi: "dũng cảm",                          emoji: "🌊",    phonetic: "/breɪv/",             example_en: "We learn about brave in English class.", example_vi: "Chúng mình học về dũng cảm trong giờ tiếng Anh." },
      { id: 'l4_s28_7_strong',           en: "Strong",              vi: "khỏe mạnh",                         emoji: "🌊",    phonetic: "/strɒŋ/",             example_en: "We learn about strong in English class.", example_vi: "Chúng mình học về khỏe mạnh trong giờ tiếng Anh." },
      { id: 'l4_s28_8_quiet',            en: "Quiet",               vi: "trầm tính / yên tĩnh",              emoji: "🌊",    phonetic: "/ˈkwaɪət/",           example_en: "We learn about quiet in English class.", example_vi: "Chúng mình học về trầm tính / yên tĩnh trong giờ tiếng Anh." },
      { id: 'l4_s28_9_funny',            en: "Funny",               vi: "hài hước",                          emoji: "🌊",    phonetic: "/ˈfʌni/",             example_en: "We learn about funny in English class.", example_vi: "Chúng mình học về hài hước trong giờ tiếng Anh." },
      { id: 'l4_s28_10_kind',            en: "Kind",                vi: "tốt bụng",                          emoji: "🌊",    phonetic: "/kaɪnd/",             example_en: "We learn about kind in English class.", example_vi: "Chúng mình học về tốt bụng trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 9: THỜI GIAN, NGÀY & THÁNG (TIME & CALENDAR) ──
  {
    id: 'lop4_c29_ch_9_th_i_gian_ng_y_',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 9: THỜI GIAN, NGÀY & THÁNG (TIME & CALENDAR)",
    name_en: "CHỦ ĐỀ 9: THỜI GIAN, NGÀY & THÁNG (TIME & CALENDAR)",
    emoji: '🌊',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'l4_s29_1_quarter_past',     en: "Quarter past",        vi: "hơn 15 phút",                       emoji: "🌊",    phonetic: "/ˈkwɔːtə pɑːst/",     example_en: "We learn about quarter past in English class.", example_vi: "Chúng mình học về hơn 15 phút trong giờ tiếng Anh." },
      { id: 'l4_s29_2_quarter_to',       en: "Quarter to",          vi: "kém 15 phút",                       emoji: "🌊",    phonetic: "/ˈkwɔːtə tə/",        example_en: "We learn about quarter to in English class.", example_vi: "Chúng mình học về kém 15 phút trong giờ tiếng Anh." },
      { id: 'l4_s29_3_half_past',        en: "Half past",           vi: "30 phút (giờ rưỡi)",                emoji: "🌊",    phonetic: "/hɑːf pɑːst/",        example_en: "We learn about half past in English class.", example_vi: "Chúng mình học về 30 phút (giờ rưỡi) trong giờ tiếng Anh." },
      { id: 'l4_s29_4_midnight',         en: "Midnight",            vi: "giữa đêm (12h đêm)",                emoji: "🌊",    phonetic: "/ˈmɪdnaɪt/",          example_en: "We learn about midnight in English class.", example_vi: "Chúng mình học về giữa đêm (12h đêm) trong giờ tiếng Anh." },
      { id: 'l4_s29_5_weekend',          en: "Weekend",             vi: "cuối tuần",                         emoji: "🌊",    phonetic: "/ˌwiːkˈend/",         example_en: "We learn about weekend in English class.", example_vi: "Chúng mình học về cuối tuần trong giờ tiếng Anh." },
      { id: 'l4_s29_6_weekday',          en: "Weekday",             vi: "ngày trong tuần (từ Thứ 2 đến Thứ 6)", emoji: "🌊",    phonetic: "/ˈwiːkdeɪ/",          example_en: "We learn about weekday in English class.", example_vi: "Chúng mình học về ngày trong tuần (từ thứ 2 đến thứ 6) trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 10: MẪU CÂU GIAO TIẾP HẰNG NGÀY LỚP 4 ──
  {
    id: 'lop4_c30_ch_10_m_u_c_u_giao_t',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 10: MẪU CÂU GIAO TIẾP HẰNG NGÀY LỚP 4",
    name_en: "CHỦ ĐỀ 10: MẪU CÂU GIAO TIẾP HẰNG NGÀY LỚP 4",
    emoji: '🌊',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'l4_s30_1_excuse_me_xin_l_i_', en: "Excuse me! (Xin lỗi cho mình hỏi", vi: "",                                  emoji: "🌊",    phonetic: "/ Làm phiền bạn!)",   example_en: "Excuse me! Can you help me?", example_vi: "Xin lỗi cho mình hỏi! Bạn có thể giúp mình không?" },
      { id: 'l4_s30_2_how_much_is_it',   en: "How much is it?",     vi: "Cái này giá bao nhiêu?",            emoji: "🌊",    phonetic: "",                    example_en: "How much is this red T-shirt?", example_vi: "Chiếc áo thun đỏ này giá bao nhiêu?" },
      { id: 'l4_s30_3_what_time_is_it',  en: "What time is it?",    vi: "Mấy giờ rồi?",                      emoji: "🌊",    phonetic: "",                    example_en: "What time does the lesson start?", example_vi: "Mấy giờ thì tiết học bắt đầu?" },
      { id: 'l4_s30_4_i_m_looking_for',  en: "I'm looking for...",  vi: "Tôi đang tìm kiếm...",              emoji: "👑",    phonetic: "",                    example_en: "I am looking for the city library.", example_vi: "Tôi đang tìm kiếm thư viện thành phố." },
      { id: 'l4_s30_5_would_you_like_som', en: "Would you like some...?", vi: "Bạn có muốn dùng một ít... không?", emoji: "🌊",    phonetic: "",                    example_en: "Would you like some fresh orange juice?", example_vi: "Bạn có muốn dùng một ít nước cam tươi không?" },
      { id: 'l4_s30_6_nice_to_see_you_ag', en: "Nice to see you again!", vi: "Rất vui được gặp lại bạn!",         emoji: "🌊",    phonetic: "",                    example_en: "Nice to see you again at school!", example_vi: "Rất vui được gặp lại bạn ở trường!" },
    ],
  },

  // ── CHỦ ĐỀ 1: DANH LAM THẮNG CẢNH & ĐỊA DANH NỔI TIẾNG (FAMOUS PLACES IN VIETNAM) ──
  {
    id: 'lop4_c31_ch_1_danh_lam_th_ng_',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 1: DANH LAM THẮNG CẢNH & ĐỊA DANH NỔI TIẾNG (FAMOUS PLACES IN VIETNAM)",
    name_en: "CHỦ ĐỀ 1: DANH LAM THẮNG CẢNH & ĐỊA DANH NỔI TIẾNG (FAMOUS PLACES IN VIETNAM)",
    emoji: '🇻🇳',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l4_s31_1_ha_long_bay',      en: "Ha Long Bay",         vi: "Vịnh Hạ Long",                      emoji: "🏞️",   phonetic: "/hɑː lɒŋ beɪ/",       example_en: "We learn about ha long bay in English class.", example_vi: "Chúng mình học về vịnh hạ long trong giờ tiếng Anh." },
      { id: 'l4_s31_2_hoan_kiem_lake',   en: "Hoan Kiem Lake",      vi: "Hồ Hoàn Kiếm",                      emoji: "🐢",    phonetic: "/hoʊɑːn kjem leɪk/",  example_en: "We learn about hoan kiem lake in English class.", example_vi: "Chúng mình học về hồ hoàn kiếm trong giờ tiếng Anh." },
      { id: 'l4_s31_3_one_pillar_pagoda', en: "One Pillar Pagoda",   vi: "Chùa Một Cột",                      emoji: "🛕",    phonetic: "/wʌn ˈpɪlə pəˈɡəʊdə/", example_en: "We learn about one pillar pagoda in English class.", example_vi: "Chúng mình học về chùa một cột trong giờ tiếng Anh." },
      { id: 'l4_s31_4_imperial_citadel_o', en: "Imperial Citadel of Thang Long", vi: "Hoàng thành Thăng Long",            emoji: "🇻🇳",  phonetic: "/ɪmˈpɪəriəl ˈsɪtədəl əv θæŋ lɒŋ/", example_en: "We learn about imperial citadel of thang long in English class.", example_vi: "Chúng mình học về hoàng thành thăng long trong giờ tiếng Anh." },
      { id: 'l4_s31_5_hoi_an_ancient_tow', en: "Hoi An Ancient Town", vi: "Phố cổ Hội An",                     emoji: "🏘️",   phonetic: "/hɔɪ ɑːn ˈeɪnʃənt taʊn/", example_en: "We learn about hoi an ancient town in English class.", example_vi: "Chúng mình học về phố cổ hội an trong giờ tiếng Anh." },
      { id: 'l4_s31_6_hue_citadel',      en: "Hue Citadel",         vi: "Cố đô Huế",                         emoji: "🇻🇳",  phonetic: "/hueɪ ˈsɪtədəl/",     example_en: "We learn about hue citadel in English class.", example_vi: "Chúng mình học về cố đô huế trong giờ tiếng Anh." },
      { id: 'l4_s31_7_phong_nha_cave',   en: "Phong Nha Cave",      vi: "Động Phong Nha",                    emoji: "🍜",    phonetic: "/fɒŋ ɲə keɪv/",       example_en: "We learn about phong nha cave in English class.", example_vi: "Chúng mình học về động phong nha trong giờ tiếng Anh." },
      { id: 'l4_s31_8_phu_quoc_island',  en: "Phu Quoc Island",     vi: "Đảo Phú Quốc",                      emoji: "🏝️",   phonetic: "/fuː kwɒk ˈaɪlənd/",  example_en: "We learn about phu quoc island in English class.", example_vi: "Chúng mình học về đảo phú quốc trong giờ tiếng Anh." },
      { id: 'l4_s31_9_ben_thanh_market', en: "Ben Thanh Market",    vi: "Chợ Bến Thành",                     emoji: "🇻🇳",  phonetic: "/ben tæŋ ˈmɑːkɪt/",   example_en: "We learn about ben thanh market in English class.", example_vi: "Chúng mình học về chợ bến thành trong giờ tiếng Anh." },
      { id: 'l4_s31_10_ba_na_hills',     en: "Ba Na Hills",         vi: "Bà Nà Hills",                       emoji: "🌁",    phonetic: "/bɑː nɑː hɪlz/",      example_en: "We learn about ba na hills in English class.", example_vi: "Chúng mình học về bà nà hills trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 2: ẨM THỰC & MÓN ĂN TRUYỀN THỐNG VIỆT NAM (VIETNAMESE FOOD & DRINKS) ──
  {
    id: 'lop4_c32_ch_2_m_th_c_m_n_n_tr',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 2: ẨM THỰC & MÓN ĂN TRUYỀN THỐNG VIỆT NAM (VIETNAMESE FOOD & DRINKS)",
    name_en: "CHỦ ĐỀ 2: ẨM THỰC & MÓN ĂN TRUYỀN THỐNG VIỆT NAM (VIETNAMESE FOOD & DRINKS)",
    emoji: '🇻🇳',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l4_s32_1_pho',              en: "Pho",                 vi: "phở (món ăn truyền thống Việt Nam)", emoji: "🍜",    phonetic: "/fɜː/",               example_en: "We learn about pho in English class.", example_vi: "Chúng mình học về phở (món ăn truyền thống việt nam) trong giờ tiếng Anh." },
      { id: 'l4_s32_2_banh_mi',          en: "Banh mi",             vi: "bánh mì Việt Nam",                  emoji: "🥖",    phonetic: "/bæn miː/",           example_en: "We learn about banh mi in English class.", example_vi: "Chúng mình học về bánh mì việt nam trong giờ tiếng Anh." },
      { id: 'l4_s32_3_banh_chung',       en: "Banh chung",          vi: "bánh chưng",                        emoji: "🍱",    phonetic: "/bæn tʃʊŋ/",          example_en: "We learn about banh chung in English class.", example_vi: "Chúng mình học về bánh chưng trong giờ tiếng Anh." },
      { id: 'l4_s32_4_spring_roll',      en: "Spring roll",         vi: "nem rán / chả giò",                 emoji: "🥟",    phonetic: "/sprɪŋ rəʊl/",        example_en: "We learn about spring roll in English class.", example_vi: "Chúng mình học về nem rán / chả giò trong giờ tiếng Anh." },
      { id: 'l4_s32_5_sticky_rice',      en: "Sticky rice",         vi: "xôi",                               emoji: "🍚",    phonetic: "/ˈstɪki raɪs/",       example_en: "We learn about sticky rice in English class.", example_vi: "Chúng mình học về xôi trong giờ tiếng Anh." },
      { id: 'l4_s32_6_noodle_soup',      en: "Noodle soup",         vi: "bún / phở",                         emoji: "🇻🇳",  phonetic: "/ˈnuːdl suːp/",       example_en: "We learn about noodle soup in English class.", example_vi: "Chúng mình học về bún / phở trong giờ tiếng Anh." },
      { id: 'l4_s32_7_fish_sauce',       en: "Fish sauce",          vi: "nước mắm",                          emoji: "🇻🇳",  phonetic: "/fɪʃ sɔːs/",          example_en: "We learn about fish sauce in English class.", example_vi: "Chúng mình học về nước mắm trong giờ tiếng Anh." },
      { id: 'l4_s32_8_iced_coffee',      en: "Iced coffee",         vi: "cà phê đá",                         emoji: "☕",     phonetic: "/aɪst ˈkɒfi/",        example_en: "We learn about iced coffee in English class.", example_vi: "Chúng mình học về cà phê đá trong giờ tiếng Anh." },
      { id: 'l4_s32_9_sugar_cane_juice', en: "Sugar cane juice",    vi: "nước mía",                          emoji: "🇻🇳",  phonetic: "/ˈʃʊɡə keɪn dʒuːs/",  example_en: "We learn about sugar cane juice in English class.", example_vi: "Chúng mình học về nước mía trong giờ tiếng Anh." },
      { id: 'l4_s32_10_milk_tea',        en: "Milk tea",            vi: "trà sữa",                           emoji: "🧋",    phonetic: "/mɪlk tiː/",          example_en: "We learn about milk tea in English class.", example_vi: "Chúng mình học về trà sữa trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 3: NGÀY LỄ, TẾT & VĂN HÓA DÂN GIAN (HOLIDAYS & CULTURE) ──
  {
    id: 'lop4_c33_ch_3_ng_y_l_t_t_v_n_',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 3: NGÀY LỄ, TẾT & VĂN HÓA DÂN GIAN (HOLIDAYS & CULTURE)",
    name_en: "CHỦ ĐỀ 3: NGÀY LỄ, TẾT & VĂN HÓA DÂN GIAN (HOLIDAYS & CULTURE)",
    emoji: '🌊',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l4_s33_1_tet_holiday',      en: "Tet holiday",         vi: "Tết Nguyên Đán",                    emoji: "🧧",    phonetic: "/ Lunar New Year /tet ˈhɒlədeɪ / ˈluːnə njuː jɪə/", example_en: "We learn about tet holiday in English class.", example_vi: "Chúng mình học về tết nguyên đán trong giờ tiếng Anh." },
      { id: 'l4_s33_2_mid_autumn_festiva', en: "Mid-Autumn Festival", vi: "Tết Trung thu",                     emoji: "🌊",    phonetic: "/mɪd ˈɔːtəm ˈfestɪvl/", example_en: "We learn about mid-autumn festival in English class.", example_vi: "Chúng mình học về tết trung thu trong giờ tiếng Anh." },
      { id: 'l4_s33_3_teachers_day',     en: "Teachers' Day",       vi: "Ngày Nhà giáo Việt Nam (20/11)",    emoji: "🌊",    phonetic: "/ˈtiːtʃəz deɪ/",      example_en: "We learn about teachers' day in English class.", example_vi: "Chúng mình học về ngày nhà giáo việt nam (20/11) trong giờ tiếng Anh." },
      { id: 'l4_s33_4_children_s_day',   en: "Children's Day",      vi: "Ngày Quốc tế Thiếu nhi (1/6)",      emoji: "🌊",    phonetic: "/ˈtʃɪldrənz deɪ/",    example_en: "We learn about children's day in English class.", example_vi: "Chúng mình học về ngày quốc tế thiếu nhi (1/6) trong giờ tiếng Anh." },
      { id: 'l4_s33_5_peach_blossom',    en: "Peach blossom",       vi: "hoa đào",                           emoji: "🌸",    phonetic: "/piːtʃ ˈblɒsəm/",     example_en: "We learn about peach blossom in English class.", example_vi: "Chúng mình học về hoa đào trong giờ tiếng Anh." },
      { id: 'l4_s33_6_apricot_blossom',  en: "Apricot blossom",     vi: "hoa mai",                           emoji: "🌼",    phonetic: "/ˈeɪprɪkɒt ˈblɒsəm/", example_en: "We learn about apricot blossom in English class.", example_vi: "Chúng mình học về hoa mai trong giờ tiếng Anh." },
      { id: 'l4_s33_7_lucky_money',      en: "Lucky money",         vi: "tiền lì xì / tiền mừng tuổi",       emoji: "🧧",    phonetic: "/ˈlʌki ˈmʌni/",       example_en: "We learn about lucky money in English class.", example_vi: "Chúng mình học về tiền lì xì / tiền mừng tuổi trong giờ tiếng Anh." },
      { id: 'l4_s33_8_lantern',          en: "Lantern",             vi: "đèn lồng",                          emoji: "🏮",    phonetic: "/ˈlæntən/",           example_en: "We learn about lantern in English class.", example_vi: "Chúng mình học về đèn lồng trong giờ tiếng Anh." },
      { id: 'l4_s33_9_dragon_dance',     en: "Dragon dance",        vi: "múa lân / múa rồng",                emoji: "🐉",    phonetic: "/ˈdræɡən dɑːns/",     example_en: "We learn about dragon dance in English class.", example_vi: "Chúng mình học về múa lân / múa rồng trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 4: TRÒ CHƠI DÂN GIAN VIỆT NAM (TRADITIONAL GAMES) ──
  {
    id: 'lop4_c34_ch_4_tr_ch_i_d_n_gia',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 4: TRÒ CHƠI DÂN GIAN VIỆT NAM (TRADITIONAL GAMES)",
    name_en: "CHỦ ĐỀ 4: TRÒ CHƠI DÂN GIAN VIỆT NAM (TRADITIONAL GAMES)",
    emoji: '🌊',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l4_s34_1_tug_of_war',       en: "Tug of war",          vi: "trò chơi kéo co",                   emoji: "🌊",    phonetic: "/tʌɡ əv wɔː/",        example_en: "We learn about tug of war in English class.", example_vi: "Chúng mình học về trò chơi kéo co trong giờ tiếng Anh." },
      { id: 'l4_s34_2_blind_man_s_buff', en: "Blind man's buff",    vi: "trò chơi bịt mắt bắt dê",           emoji: "🌊",    phonetic: "/blaɪnd mænz bʌf/",   example_en: "We learn about blind man's buff in English class.", example_vi: "Chúng mình học về trò chơi bịt mắt bắt dê trong giờ tiếng Anh." },
      { id: 'l4_s34_3_hide_and_seek',    en: "Hide and seek",       vi: "trò chơi trốn tìm",                 emoji: "🌊",    phonetic: "/haɪd ænd siːk/",     example_en: "We learn about hide and seek in English class.", example_vi: "Chúng mình học về trò chơi trốn tìm trong giờ tiếng Anh." },
      { id: 'l4_s34_4_bamboo_dancing',   en: "Bamboo dancing",      vi: "múa sạp",                           emoji: "🌊",    phonetic: "/bæmˈbuː ˈdɑːnsɪŋ/",  example_en: "We learn about bamboo dancing in English class.", example_vi: "Chúng mình học về múa sạp trong giờ tiếng Anh." },
      { id: 'l4_s34_5_dragon_snake_game', en: "Dragon-snake game",   vi: "trò chơi rồng rắn lên mây",         emoji: "🐲",    phonetic: "/ˈdræɡən sneɪk ɡeɪm/", example_en: "We learn about dragon-snake game in English class.", example_vi: "Chúng mình học về trò chơi rồng rắn lên mây trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 5: TRƯỜNG HỌC, TRANG PHỤC & ĐỜI SỐNG (SCHOOL LIFE & COSTUMES) ──
  {
    id: 'lop4_c35_ch_5_tr_ng_h_c_trang',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 5: TRƯỜNG HỌC, TRANG PHỤC & ĐỜI SỐNG (SCHOOL LIFE & COSTUMES)",
    name_en: "CHỦ ĐỀ 5: TRƯỜNG HỌC, TRANG PHỤC & ĐỜI SỐNG (SCHOOL LIFE & COSTUMES)",
    emoji: '🌊',
    color: 'from-indigo-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-purple-100',
    words: [
      { id: 'l4_s35_1_red_scarf',        en: "Red scarf",           vi: "khăn quàng đỏ",                     emoji: "🧣",    phonetic: "/red skɑːf/",         example_en: "We learn about red scarf in English class.", example_vi: "Chúng mình học về khăn quàng đỏ trong giờ tiếng Anh." },
      { id: 'l4_s35_2_school_uniform',   en: "School uniform",      vi: "đồng phục học sinh",                emoji: "🌊",    phonetic: "/skuːl ˈjuːnɪfɔːm/",  example_en: "We learn about school uniform in English class.", example_vi: "Chúng mình học về đồng phục học sinh trong giờ tiếng Anh." },
      { id: 'l4_s35_3_ao_dai',           en: "Ao dai",              vi: "áo dài truyền thống",               emoji: "🌊",    phonetic: "/ˈaʊ daɪ/",           example_en: "We learn about ao dai in English class.", example_vi: "Chúng mình học về áo dài truyền thống trong giờ tiếng Anh." },
      { id: 'l4_s35_4_conical_hat',      en: "Conical hat",         vi: "nón lá",                            emoji: "🌊",    phonetic: "/ non la /ˈkɒnɪkl hæt/", example_en: "We learn about conical hat in English class.", example_vi: "Chúng mình học về nón lá trong giờ tiếng Anh." },
      { id: 'l4_s35_5_flag_raising_cerem', en: "Flag raising ceremony", vi: "lễ chào cờ",                        emoji: "🌊",    phonetic: "/flæɡ ˈreɪzɪŋ ˈserəməni/", example_en: "We learn about flag raising ceremony in English class.", example_vi: "Chúng mình học về lễ chào cờ trong giờ tiếng Anh." },
      { id: 'l4_s35_6_young_pioneer',    en: "Young Pioneer",       vi: "Đội viên Thiếu niên Tiền phong",    emoji: "🌊",    phonetic: "/jʌŋ ˌpaɪəˈnɪə/",     example_en: "We learn about young pioneer in English class.", example_vi: "Chúng mình học về đội viên thiếu niên tiền phong trong giờ tiếng Anh." },
    ],
  },

  // ── CHỦ ĐỀ 6: THIÊN NHIÊN, NÔNG THÔN & BIỂU TƯỢNG (NATURE & SYMBOLS OF VIETNAM) ──
  {
    id: 'lop4_c36_ch_6_thi_n_nhi_n_n_n',
    gradeId: 'lop4',
    name_vi: "CHỦ ĐỀ 6: THIÊN NHIÊN, NÔNG THÔN & BIỂU TƯỢNG (NATURE & SYMBOLS OF VIETNAM)",
    name_en: "CHỦ ĐỀ 6: THIÊN NHIÊN, NÔNG THÔN & BIỂU TƯỢNG (NATURE & SYMBOLS OF VIETNAM)",
    emoji: '🇻🇳',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'l4_s36_1_paddy_field',      en: "Paddy field",         vi: "cánh đồng lúa",                     emoji: "🇻🇳",  phonetic: "/ rice field /ˈpædi fiːld/", example_en: "We learn about paddy field in English class.", example_vi: "Chúng mình học về cánh đồng lúa trong giờ tiếng Anh." },
      { id: 'l4_s36_2_water_buffalo',    en: "Water buffalo",       vi: "con trâu nước",                     emoji: "🇻🇳",  phonetic: "/ˈwɔːtə ˈbʌfələʊ/",   example_en: "We learn about water buffalo in English class.", example_vi: "Chúng mình học về con trâu nước trong giờ tiếng Anh." },
      { id: 'l4_s36_3_bamboo',           en: "Bamboo",              vi: "cây tre",                           emoji: "🇻🇳",  phonetic: "/bæmˈbuː/",           example_en: "We learn about bamboo in English class.", example_vi: "Chúng mình học về cây tre trong giờ tiếng Anh." },
      { id: 'l4_s36_4_lotus',            en: "Lotus",               vi: "hoa sen (quốc hoa Việt Nam)",       emoji: "🇻🇳",  phonetic: "/ˈləʊtəs/",           example_en: "We learn about lotus in English class.", example_vi: "Chúng mình học về hoa sen (quốc hoa việt nam) trong giờ tiếng Anh." },
      { id: 'l4_s36_5_floating_market',  en: "Floating market",     vi: "chợ nổi (Miền Tây)",                emoji: "🇻🇳",  phonetic: "/ˈfləʊtɪŋ ˈmɑːkɪt/",  example_en: "We learn about floating market in English class.", example_vi: "Chúng mình học về chợ nổi (miền tây) trong giờ tiếng Anh." },
      { id: 'l4_s36_6_bamboo_flute',     en: "Bamboo flute",        vi: "sáo trúc",                          emoji: "🇻🇳",  phonetic: "/bæmˈbuː fluːt/",     example_en: "We learn about bamboo flute in English class.", example_vi: "Chúng mình học về sáo trúc trong giờ tiếng Anh." },
    ],
  },

  // ════════════════════════════════════════
  // LỚP 5 (SGK GLOBAL SUCCESS + 4 CHỦ ĐIỂM MỞ RỘNG - 30 CHỦ ĐỀ)
  // ════════════════════════════════════════

  // ── UNIT 1: ALL ABOUT ME! ──
  {
    id: 'lop5_c1_unit_1_all_about_me',
    gradeId: 'lop5',
    name_vi: "UNIT 1: ALL ABOUT ME!",
    name_en: "UNIT 1: ALL ABOUT ME!",
    emoji: '🔮',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'l5_s1_1_city',              en: "City",                vi: "thành phố",                         emoji: "🏙️",   phonetic: "/ˈsɪti/",             example_en: "We learn about city in English class.", example_vi: "Chúng mình học về thành phố trong giờ tiếng Anh." },
      { id: 'l5_s1_2_class',             en: "Class",               vi: "lớp học",                           emoji: "🔮",    phonetic: "/klɑːs/",             example_en: "We learn about class in English class.", example_vi: "Chúng mình học về lớp học trong giờ tiếng Anh." },
      { id: 'l5_s1_3_countryside',       en: "Countryside",         vi: "vùng nông thôn",                    emoji: "🔮",    phonetic: "/ˈkʌntrisaɪd/",       example_en: "We learn about countryside in English class.", example_vi: "Chúng mình học về vùng nông thôn trong giờ tiếng Anh." },
      { id: 'l5_s1_4_dolphin',           en: "Dolphin",             vi: "con cá heo",                        emoji: "🐬",    phonetic: "/ˈdɒlfɪn/",           example_en: "We learn about dolphin in English class.", example_vi: "Chúng mình học về con cá heo trong giờ tiếng Anh." },
      { id: 'l5_s1_5_pink',              en: "Pink",                vi: "màu hồng",                          emoji: "🔮",    phonetic: "/pɪŋk/",              example_en: "We learn about pink in English class.", example_vi: "Chúng mình học về màu hồng trong giờ tiếng Anh." },
      { id: 'l5_s1_6_sandwich',          en: "Sandwich",            vi: "bánh mì kẹp",                       emoji: "🔮",    phonetic: "/ˈsænwɪdʒ/",          example_en: "We learn about sandwich in English class.", example_vi: "Chúng mình học về bánh mì kẹp trong giờ tiếng Anh." },
      { id: 'l5_s1_7_table_tennis',      en: "Table tennis",        vi: "môn bóng bàn",                      emoji: "🔮",    phonetic: "/ˈteɪbl ˈtenɪs/",     example_en: "We learn about table tennis in English class.", example_vi: "Chúng mình học về môn bóng bàn trong giờ tiếng Anh." },
      { id: 'l5_s1_8_can_you_tell_me_ab', en: "Can you tell me about yourself? – I'm in Class 5A.", vi: "",                                  emoji: "🔮",    phonetic: "/ I live in the countryside. (Bạn có thể giới thiệu về bản thân không? – Mình học lớp 5A. / Mình sống ở nông thôn.)", example_en: "We learn about can you tell me about yourself? – i'm in class 5a. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s1_9_what_s_your_favour', en: "What's your favourite sport", vi: "",                                  emoji: "🔮",    phonetic: "/ food? – It's table tennis / sandwich. (Môn thể thao / món ăn yêu thích của bạn là gì? – Là bóng bàn / bánh mì kẹp.)", example_en: "We learn about what's your favourite sport in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 2: OUR HOMES ──
  {
    id: 'lop5_c2_unit_2_our_homes',
    gradeId: 'lop5',
    name_vi: "UNIT 2: OUR HOMES",
    name_en: "UNIT 2: OUR HOMES",
    emoji: '🔮',
    color: 'from-purple-400 to-fuchsia-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-fuchsia-100',
    words: [
      { id: 'l5_s2_1_building',          en: "Building",            vi: "tòa nhà",                           emoji: "🏢",    phonetic: "/ˈbɪldɪŋ/",           example_en: "We learn about building in English class.", example_vi: "Chúng mình học về tòa nhà trong giờ tiếng Anh." },
      { id: 'l5_s2_2_flat',              en: "Flat",                vi: "căn hộ",                            emoji: "🏬",    phonetic: "/flæt/",              example_en: "We learn about flat in English class.", example_vi: "Chúng mình học về căn hộ trong giờ tiếng Anh." },
      { id: 'l5_s2_3_house',             en: "House",               vi: "ngôi nhà",                          emoji: "🏠",    phonetic: "/haʊs/",              example_en: "We learn about house in English class.", example_vi: "Chúng mình học về ngôi nhà trong giờ tiếng Anh." },
      { id: 'l5_s2_4_tower',             en: "Tower",               vi: "tòa tháp",                          emoji: "🗼",    phonetic: "/ˈtaʊə/",             example_en: "We learn about tower in English class.", example_vi: "Chúng mình học về tòa tháp trong giờ tiếng Anh." },
      { id: 'l5_s2_5_twenty_three_23',   en: "Twenty-three (23)",   vi: "23",                                emoji: "🔮",    phonetic: "/ˌtwenti ˈθriː/",     example_en: "We learn about twenty-three (23) in English class.", example_vi: "Chúng mình học về 23 trong giờ tiếng Anh." },
      { id: 'l5_s2_6_thirty_eight_38',   en: "Thirty-eight (38)",   vi: "38",                                emoji: "🔮",    phonetic: "/ˌθɜːti ˈeɪt/",       example_en: "We learn about thirty-eight (38) in English class.", example_vi: "Chúng mình học về 38 trong giờ tiếng Anh." },
      { id: 'l5_s2_7_ninety_three_93',   en: "Ninety-three (93)",   vi: "93",                                emoji: "🔮",    phonetic: "/ˌnaɪnti ˈθriː/",     example_en: "We learn about ninety-three (93) in English class.", example_vi: "Chúng mình học về 93 trong giờ tiếng Anh." },
      { id: 'l5_s2_8_one_hundred_and_si', en: "One hundred and sixteen (116)", vi: "116",                               emoji: "🔮",    phonetic: "/wʌn ˈhʌndrəd ænd ˌsɪksˈtiːn/", example_en: "We learn about one hundred and sixteen (116) in English class.", example_vi: "Chúng mình học về 116 trong giờ tiếng Anh." },
      { id: 'l5_s2_9_do_you_live_in_thi', en: "Do you live in this flat", vi: "",                                  emoji: "🏬",    phonetic: "/ tower? – Yes, I do. / No, I don't. (Bạn có sống ở căn hộ / tòa tháp này không? – Có, mình có. / Không, mình không.)", example_en: "We learn about do you live in this flat in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s2_10_what_s_your_addres', en: "What's your address? – It's Flat 16, Green Tower.", vi: "Địa chỉ của bạn là gì? – Là căn hộ số 16, tòa tháp Green Tower.", emoji: "🏬",    phonetic: "",                    example_en: "We learn about what's your address? – it's flat 16, green tower. in English class.", example_vi: "Chúng mình học về địa chỉ của bạn là gì? – là căn hộ số 16, tòa tháp green tower. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 3: MY FOREIGN FRIENDS ──
  {
    id: 'lop5_c3_unit_3_my_foreign_fr',
    gradeId: 'lop5',
    name_vi: "UNIT 3: MY FOREIGN FRIENDS",
    name_en: "UNIT 3: MY FOREIGN FRIENDS",
    emoji: '🔮',
    color: 'from-fuchsia-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
    words: [
      { id: 'l5_s3_1_american',          en: "American",            vi: "người / thuộc về nước Mỹ",          emoji: "🇺🇸",  phonetic: "/əˈmerɪkən/",         example_en: "We learn about american in English class.", example_vi: "Chúng mình học về người / thuộc về nước mỹ trong giờ tiếng Anh." },
      { id: 'l5_s3_2_australian',        en: "Australian",          vi: "người / thuộc về nước Úc",          emoji: "🇦🇺",  phonetic: "/ɒˈstreɪliən/",       example_en: "We learn about australian in English class.", example_vi: "Chúng mình học về người / thuộc về nước úc trong giờ tiếng Anh." },
      { id: 'l5_s3_3_japanese',          en: "Japanese",            vi: "người / thuộc về Nhật Bản",         emoji: "🇯🇵",  phonetic: "/ˌdʒæpəˈniːz/",       example_en: "We learn about japanese in English class.", example_vi: "Chúng mình học về người / thuộc về nhật bản trong giờ tiếng Anh." },
      { id: 'l5_s3_4_malaysian',         en: "Malaysian",           vi: "người / thuộc về Ma-lai-xi-a",      emoji: "🇲🇾",  phonetic: "/məˈleɪʒn/",          example_en: "We learn about malaysian in English class.", example_vi: "Chúng mình học về người / thuộc về ma-lai-xi-a trong giờ tiếng Anh." },
      { id: 'l5_s3_5_active',            en: "Active",              vi: "năng động, hăng hái",               emoji: "🔮",    phonetic: "/ˈæktɪv/",            example_en: "We learn about active in English class.", example_vi: "Chúng mình học về năng động, hăng hái trong giờ tiếng Anh." },
      { id: 'l5_s3_6_clever',            en: "Clever",              vi: "thông minh, lanh lợi",              emoji: "🔮",    phonetic: "/ˈklevə/",            example_en: "We learn about clever in English class.", example_vi: "Chúng mình học về thông minh, lanh lợi trong giờ tiếng Anh." },
      { id: 'l5_s3_7_friendly',          en: "Friendly",            vi: "thân thiện",                        emoji: "🔮",    phonetic: "/ˈfrendli/",          example_en: "We learn about friendly in English class.", example_vi: "Chúng mình học về thân thiện trong giờ tiếng Anh." },
      { id: 'l5_s3_8_helpful',           en: "Helpful",             vi: "tốt bụng, hay giúp đỡ",             emoji: "🔮",    phonetic: "/ˈhelpfl/",           example_en: "We learn about helpful in English class.", example_vi: "Chúng mình học về tốt bụng, hay giúp đỡ trong giờ tiếng Anh." },
      { id: 'l5_s3_9_what_nationality_i', en: "What nationality is he", vi: "",                                  emoji: "🔮",    phonetic: "/she? – He's/She's American / Australian. (Anh ấy/Cô ấy mang quốc tịch gì? – Anh ấy/Cô ấy là người Mỹ / người Úc.)", example_en: "We learn about what nationality is he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s3_10_what_s_he',        en: "What's he",           vi: "",                                  emoji: "🔮",    phonetic: "/she like? – He's/She's clever and helpful. (Anh ấy/Cô ấy là người như thế nào? – Anh ấy/Cô ấy thông minh và hay giúp đỡ người khác.)", example_en: "We learn about what's he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 4: OUR FREE-TIME ACTIVITIES ──
  {
    id: 'lop5_c4_unit_4_our_free_time',
    gradeId: 'lop5',
    name_vi: "UNIT 4: OUR FREE-TIME ACTIVITIES",
    name_en: "UNIT 4: OUR FREE-TIME ACTIVITIES",
    emoji: '🔮',
    color: 'from-indigo-400 to-violet-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-violet-100',
    words: [
      { id: 'l5_s4_1_go_for_a_walk',     en: "Go for a walk",       vi: "đi dạo bộ",                         emoji: "🔮",    phonetic: "/ɡəʊ fər ə wɔːk/",    example_en: "We learn about go for a walk in English class.", example_vi: "Chúng mình học về đi dạo bộ trong giờ tiếng Anh." },
      { id: 'l5_s4_2_play_the_violin',   en: "Play the violin",     vi: "chơi đàn vi-ô-lông",                emoji: "🔮",    phonetic: "/pleɪ ðə ˌvaɪəˈlɪn/", example_en: "He practices to play the violin every evening.", example_vi: "Cậu ấy tập chơi đàn vi-ô-lông vào mỗi buổi tối." },
      { id: 'l5_s4_3_surf_the_internet', en: "Surf the Internet",   vi: "lướt mạng Internet",                emoji: "🔮",    phonetic: "/sɜːf ðər ˈɪntənet/", example_en: "I surf the Internet to find information.", example_vi: "Tôi lướt mạng Internet để tìm kiếm thông tin." },
      { id: 'l5_s4_4_water_the_flowers', en: "Water the flowers",   vi: "tưới hoa",                          emoji: "🔮",    phonetic: "/ˈwɔːtə ðə ˈflaʊəz/", example_en: "She helps grandma water the flowers.", example_vi: "Cô bé giúp bà tưới hoa trong vườn." },
      { id: 'l5_s4_5_always',            en: "Always",              vi: "luôn luôn",                         emoji: "🔮",    phonetic: "/ˈɔːlweɪz/",          example_en: "We learn about always in English class.", example_vi: "Chúng mình học về luôn luôn trong giờ tiếng Anh." },
      { id: 'l5_s4_6_often',             en: "Often",               vi: "thường xuyên",                      emoji: "🔮",    phonetic: "/ˈɒfn/",              example_en: "We learn about often in English class.", example_vi: "Chúng mình học về thường xuyên trong giờ tiếng Anh." },
      { id: 'l5_s4_7_sometimes',         en: "Sometimes",           vi: "thỉnh thoảng",                      emoji: "🔮",    phonetic: "/ˈsʌmtaɪmz/",         example_en: "We learn about sometimes in English class.", example_vi: "Chúng mình học về thỉnh thoảng trong giờ tiếng Anh." },
      { id: 'l5_s4_8_usually',           en: "Usually",             vi: "thường thường",                     emoji: "🔮",    phonetic: "/ˈjuːʒuəli/",         example_en: "We learn about usually in English class.", example_vi: "Chúng mình học về thường thường trong giờ tiếng Anh." },
      { id: 'l5_s4_9_what_do_you_like_d', en: "What do you like doing in your free time? – I like surfing the Internet.", vi: "Bạn thích làm gì vào thời gian rảnh? – Mình thích lướt mạng Internet.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what do you like doing in your free time? – i like surfing the internet. in English class.", example_vi: "Chúng mình học về bạn thích làm gì vào thời gian rảnh? – mình thích lướt mạng internet. trong giờ tiếng Anh." },
      { id: 'l5_s4_10_what_do_you_do_at_', en: "What do you do at the weekend? – I usually water the flowers.", vi: "Bạn làm gì vào cuối tuần? – Mình thường tưới hoa.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what do you do at the weekend? – i usually water the flowers. in English class.", example_vi: "Chúng mình học về bạn làm gì vào cuối tuần? – mình thường tưới hoa. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 5: MY FUTURE JOB ──
  {
    id: 'lop5_c5_unit_5_my_future_job',
    gradeId: 'lop5',
    name_vi: "UNIT 5: MY FUTURE JOB",
    name_en: "UNIT 5: MY FUTURE JOB",
    emoji: '🔮',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l5_s5_1_firefighter',       en: "Firefighter",         vi: "lính cứu hỏa",                      emoji: "🧑‍🚒", phonetic: "/ˈfaɪəfaɪtə/",        example_en: "We learn about firefighter in English class.", example_vi: "Chúng mình học về lính cứu hỏa trong giờ tiếng Anh." },
      { id: 'l5_s5_2_gardener',          en: "Gardener",            vi: "người làm vườn",                    emoji: "🧑‍🌾", phonetic: "/ˈɡɑːdnə/",           example_en: "We learn about gardener in English class.", example_vi: "Chúng mình học về người làm vườn trong giờ tiếng Anh." },
      { id: 'l5_s5_3_reporter',          en: "Reporter",            vi: "phóng viên",                        emoji: "🎤",    phonetic: "/rɪˈpɔːtə/",          example_en: "We learn about reporter in English class.", example_vi: "Chúng mình học về phóng viên trong giờ tiếng Anh." },
      { id: 'l5_s5_4_writer',            en: "Writer",              vi: "nhà văn",                           emoji: "✍️",    phonetic: "/ˈraɪtə/",            example_en: "We learn about writer in English class.", example_vi: "Chúng mình học về nhà văn trong giờ tiếng Anh." },
      { id: 'l5_s5_5_grow_flowers',      en: "Grow flowers",        vi: "trồng hoa",                         emoji: "🔮",    phonetic: "/ɡrəʊ ˈflaʊəz/",      example_en: "We learn about grow flowers in English class.", example_vi: "Chúng mình học về trồng hoa trong giờ tiếng Anh." },
      { id: 'l5_s5_6_report_the_news',   en: "Report the news",     vi: "đưa tin tức",                       emoji: "🔮",    phonetic: "/rɪˈpɔːt ðə njuːz/",  example_en: "We learn about report the news in English class.", example_vi: "Chúng mình học về đưa tin tức trong giờ tiếng Anh." },
      { id: 'l5_s5_7_teach_children',    en: "Teach children",      vi: "dạy trẻ em",                        emoji: "🔮",    phonetic: "/tiːtʃ ˈtʃɪldrən/",   example_en: "We learn about teach children in English class.", example_vi: "Chúng mình học về dạy trẻ em trong giờ tiếng Anh." },
      { id: 'l5_s5_8_write_stories',     en: "Write stories",       vi: "viết truyện",                       emoji: "🔮",    phonetic: "/raɪt ˈstɔːriz/",     example_en: "We learn about write stories in English class.", example_vi: "Chúng mình học về viết truyện trong giờ tiếng Anh." },
      { id: 'l5_s5_9_what_would_you_lik', en: "What would you like to be in the future? – I'd like to be a reporter.", vi: "Bạn muốn làm nghề gì trong tương lai? – Mình muốn trở thành một phóng viên.", emoji: "🎤",    phonetic: "",                    example_en: "Would you like some fresh orange juice?", example_vi: "Bạn có muốn dùng một ít nước cam tươi không?" },
      { id: 'l5_s5_10_why_would_you_like', en: "Why would you like to be a reporter? – Because I'd like to report the news.", vi: "Tại sao bạn muốn làm phóng viên? – Bởi vì mình muốn đưa tin tức.", emoji: "🎤",    phonetic: "",                    example_en: "Would you like some fresh orange juice?", example_vi: "Bạn có muốn dùng một ít nước cam tươi không?" },
    ],
  },

  // ── UNIT 6: OUR SCHOOL ROOMS ──
  {
    id: 'lop5_c6_unit_6_our_school_ro',
    gradeId: 'lop5',
    name_vi: "UNIT 6: OUR SCHOOL ROOMS",
    name_en: "UNIT 6: OUR SCHOOL ROOMS",
    emoji: '🔮',
    color: 'from-rose-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-orange-100',
    words: [
      { id: 'l5_s6_1_first_floor',       en: "First floor",         vi: "tầng một",                          emoji: "🔮",    phonetic: "/ˌfɜːst ˈflɔː/",      example_en: "We learn about first floor in English class.", example_vi: "Chúng mình học về tầng một trong giờ tiếng Anh." },
      { id: 'l5_s6_2_ground_floor',      en: "Ground floor",        vi: "tầng trệt",                         emoji: "🔮",    phonetic: "/ˌɡraʊnd ˈflɔː/",     example_en: "We learn about ground floor in English class.", example_vi: "Chúng mình học về tầng trệt trong giờ tiếng Anh." },
      { id: 'l5_s6_3_second_floor',      en: "Second floor",        vi: "tầng hai",                          emoji: "🔮",    phonetic: "/ˌsekənd ˈflɔː/",     example_en: "We learn about second floor in English class.", example_vi: "Chúng mình học về tầng hai trong giờ tiếng Anh." },
      { id: 'l5_s6_4_third_floor',       en: "Third floor",         vi: "tầng ba",                           emoji: "🔮",    phonetic: "/ˌθɜːd ˈflɔː/",       example_en: "We learn about third floor in English class.", example_vi: "Chúng mình học về tầng ba trong giờ tiếng Anh." },
      { id: 'l5_s6_5_go_along',          en: "Go along",            vi: "đi dọc theo",                       emoji: "🔮",    phonetic: "/ɡəʊ əˈlɒŋ/",         example_en: "We learn about go along in English class.", example_vi: "Chúng mình học về đi dọc theo trong giờ tiếng Anh." },
      { id: 'l5_s6_6_go_downstairs',     en: "Go downstairs",       vi: "đi xuống tầng",                     emoji: "🔮",    phonetic: "/ɡəʊ ˌdaʊnˈsteəz/",   example_en: "We learn about go downstairs in English class.", example_vi: "Chúng mình học về đi xuống tầng trong giờ tiếng Anh." },
      { id: 'l5_s6_7_go_past',           en: "Go past",             vi: "đi qua",                            emoji: "🔮",    phonetic: "/ɡəʊ pɑːst/",         example_en: "We learn about go past in English class.", example_vi: "Chúng mình học về đi qua trong giờ tiếng Anh." },
      { id: 'l5_s6_8_go_upstairs',       en: "Go upstairs",         vi: "đi lên tầng",                       emoji: "🔮",    phonetic: "/ɡəʊ ˌʌpˈsteəz/",     example_en: "We learn about go upstairs in English class.", example_vi: "Chúng mình học về đi lên tầng trong giờ tiếng Anh." },
      { id: 'l5_s6_9_where_s_the_comput', en: "Where's the computer room? – It's on the second floor.", vi: "Phòng máy tính ở đâu? – Nó ở tầng hai.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about where's the computer room? – it's on the second floor. in English class.", example_vi: "Chúng mình học về phòng máy tính ở đâu? – nó ở tầng hai. trong giờ tiếng Anh." },
      { id: 'l5_s6_10_could_you_tell_me_', en: "Could you tell me the way to the art room, please? – Go upstairs and turn left.", vi: "Bạn có thể chỉ đường cho mình đến phòng mỹ thuật không? – Đi lên tầng và rẽ trái.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about could you tell me the way to the art room, please? – go upstairs and turn left. in English class.", example_vi: "Chúng mình học về bạn có thể chỉ đường cho mình đến phòng mỹ thuật không? – đi lên tầng và rẽ trái. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 7: OUR FAVOURITE SCHOOL ACTIVITIES ──
  {
    id: 'lop5_c7_unit_7_our_favourite',
    gradeId: 'lop5',
    name_vi: "UNIT 7: OUR FAVOURITE SCHOOL ACTIVITIES",
    name_en: "UNIT 7: OUR FAVOURITE SCHOOL ACTIVITIES",
    emoji: '🔮',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l5_s7_1_do_projects',       en: "Do projects",         vi: "làm bài tập dự án",                 emoji: "🔮",    phonetic: "/duː ˈprɒdʒekts/",    example_en: "We learn about do projects in English class.", example_vi: "Chúng mình học về làm bài tập dự án trong giờ tiếng Anh." },
      { id: 'l5_s7_2_play_games',        en: "Play games",          vi: "chơi trò chơi",                     emoji: "🔮",    phonetic: "/pleɪ ɡeɪmz/",        example_en: "We like to play games after school.", example_vi: "Chúng mình thích chơi trò chơi sau giờ học." },
      { id: 'l5_s7_3_read_books',        en: "Read books",          vi: "đọc sách",                          emoji: "🔮",    phonetic: "/riːd bʊks/",         example_en: "We learn about read books in English class.", example_vi: "Chúng mình học về đọc sách trong giờ tiếng Anh." },
      { id: 'l5_s7_4_solve_maths_proble', en: "Solve maths problems", vi: "giải bài tập toán",                 emoji: "🔮",    phonetic: "/sɒlv mæθs ˈprɒbləmz/", example_en: "We learn about solve maths problems in English class.", example_vi: "Chúng mình học về giải bài tập toán trong giờ tiếng Anh." },
      { id: 'l5_s7_5_fun',               en: "Fun",                 vi: "vui thích, thú vị",                 emoji: "🔮",    phonetic: "/fʌn/",               example_en: "We learn about fun in English class.", example_vi: "Chúng mình học về vui thích, thú vị trong giờ tiếng Anh." },
      { id: 'l5_s7_6_good_for_group_wor', en: "Good for group work", vi: "tốt cho làm việc nhóm",             emoji: "🔮",    phonetic: "/ɡʊd fər ɡruːp wɜːk/", example_en: "We learn about good for group work in English class.", example_vi: "Chúng mình học về tốt cho làm việc nhóm trong giờ tiếng Anh." },
      { id: 'l5_s7_7_interesting',       en: "Interesting",         vi: "thú vị, bổ ích",                    emoji: "🔮",    phonetic: "/ˈɪntrestɪŋ/",        example_en: "We learn about interesting in English class.", example_vi: "Chúng mình học về thú vị, bổ ích trong giờ tiếng Anh." },
      { id: 'l5_s7_8_useful',            en: "Useful",              vi: "hữu ích",                           emoji: "🔮",    phonetic: "/ˈjuːsfl/",           example_en: "We learn about useful in English class.", example_vi: "Chúng mình học về hữu ích trong giờ tiếng Anh." },
      { id: 'l5_s7_9_what_school_activi', en: "What school activity does he", vi: "",                                  emoji: "🔮",    phonetic: "/she like? – He/She likes solving maths problems. (Hoạt động trường học mà anh ấy/cô ấy thích là gì? – Anh ấy/Cô ấy thích giải bài tập toán.)", example_en: "We learn about what school activity does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s7_10_why_does_he',      en: "Why does he",         vi: "",                                  emoji: "🔮",    phonetic: "/she like doing projects? – Because he/she thinks it's good for group work. (Tại sao anh ấy/cô ấy thích làm dự án? – Bởi vì anh ấy/cô ấy nghĩ nó tốt cho làm việc nhóm.)", example_en: "We learn about why does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 8: IN OUR CLASSROOM ──
  {
    id: 'lop5_c8_unit_8_in_our_classr',
    gradeId: 'lop5',
    name_vi: "UNIT 8: IN OUR CLASSROOM",
    name_en: "UNIT 8: IN OUR CLASSROOM",
    emoji: '🔮',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l5_s8_1_above',             en: "Above",               vi: "ở phía trên",                       emoji: "🔮",    phonetic: "/əˈbʌv/",             example_en: "We learn about above in English class.", example_vi: "Chúng mình học về ở phía trên trong giờ tiếng Anh." },
      { id: 'l5_s8_2_beside',            en: "Beside",              vi: "bên cạnh",                          emoji: "🔮",    phonetic: "/bɪˈsaɪd/",           example_en: "We learn about beside in English class.", example_vi: "Chúng mình học về bên cạnh trong giờ tiếng Anh." },
      { id: 'l5_s8_3_in_front_of',       en: "In front of",         vi: "ở phía trước",                      emoji: "🔮",    phonetic: "/ɪn frʌnt əv/",       example_en: "We learn about in front of in English class.", example_vi: "Chúng mình học về ở phía trước trong giờ tiếng Anh." },
      { id: 'l5_s8_4_under',             en: "Under",               vi: "ở phía dưới",                       emoji: "🔮",    phonetic: "/ˈʌndə/",             example_en: "We learn about under in English class.", example_vi: "Chúng mình học về ở phía dưới trong giờ tiếng Anh." },
      { id: 'l5_s8_5_crayon',            en: "Crayon",              vi: "bút sáp màu",                       emoji: "🔮",    phonetic: "/ˈkreɪən/",           example_en: "We learn about crayon in English class.", example_vi: "Chúng mình học về bút sáp màu trong giờ tiếng Anh." },
      { id: 'l5_s8_6_glue_stick',        en: "Glue stick",          vi: "keo / hồ dán",                      emoji: "🔮",    phonetic: "/ˈɡluː stɪk/",        example_en: "We learn about glue stick in English class.", example_vi: "Chúng mình học về keo / hồ dán trong giờ tiếng Anh." },
      { id: 'l5_s8_7_pencil_sharpener',  en: "Pencil sharpener",    vi: "gọt bút chì",                       emoji: "🔮",    phonetic: "/ˈpensl ˈʃɑːpnə/",    example_en: "We learn about pencil sharpener in English class.", example_vi: "Chúng mình học về gọt bút chì trong giờ tiếng Anh." },
      { id: 'l5_s8_8_set_square',        en: "Set square",          vi: "thước ê-ke",                        emoji: "🔮",    phonetic: "/ˈset skweə/",        example_en: "We learn about set square in English class.", example_vi: "Chúng mình học về thước ê-ke trong giờ tiếng Anh." },
      { id: 'l5_s8_9_where_are_the_glue', en: "Where are the glue sticks? – They're under the desk.", vi: "Những thỏi keo dán ở đâu? – Chúng ở dưới bàn học.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about where are the glue sticks? – they're under the desk. in English class.", example_vi: "Chúng mình học về những thỏi keo dán ở đâu? – chúng ở dưới bàn học. trong giờ tiếng Anh." },
      { id: 'l5_s8_10_whose_pencil_sharp', en: "Whose pencil sharpener is this? – It's Mary's.", vi: "Cái gọt bút chì này của ai? – Đó là của Mary.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about whose pencil sharpener is this? – it's mary's. in English class.", example_vi: "Chúng mình học về cái gọt bút chì này của ai? – đó là của mary. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 9: OUR OUTDOOR ACTIVITIES ──
  {
    id: 'lop5_c9_unit_9_our_outdoor_a',
    gradeId: 'lop5',
    name_vi: "UNIT 9: OUR OUTDOOR ACTIVITIES",
    name_en: "UNIT 9: OUR OUTDOOR ACTIVITIES",
    emoji: '🔮',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'l5_s9_1_aquarium',          en: "Aquarium",            vi: "thủy cung",                         emoji: "🔮",    phonetic: "/əˈkweəriəm/",        example_en: "We learn about aquarium in English class.", example_vi: "Chúng mình học về thủy cung trong giờ tiếng Anh." },
      { id: 'l5_s9_2_campsite',          en: "Campsite",            vi: "địa điểm cắm trại",                 emoji: "🔮",    phonetic: "/ˈkæmpsaɪt/",         example_en: "We learn about campsite in English class.", example_vi: "Chúng mình học về địa điểm cắm trại trong giờ tiếng Anh." },
      { id: 'l5_s9_3_funfair',           en: "Funfair",             vi: "hội chợ giải trí",                  emoji: "🔮",    phonetic: "/ˈfʌnfeə/",           example_en: "We learn about funfair in English class.", example_vi: "Chúng mình học về hội chợ giải trí trong giờ tiếng Anh." },
      { id: 'l5_s9_4_theatre',           en: "Theatre",             vi: "nhà hát",                           emoji: "🔮",    phonetic: "/ˈθɪətə/",            example_en: "We learn about theatre in English class.", example_vi: "Chúng mình học về nhà hát trong giờ tiếng Anh." },
      { id: 'l5_s9_5_dance_around_the_c', en: "Dance around the campfire", vi: "nhảy múa quanh lửa trại",           emoji: "🔮",    phonetic: "/dɑːns əˈraʊnd ðə ˈkæmpfaɪə/", example_en: "We learn about dance around the campfire in English class.", example_vi: "Chúng mình học về nhảy múa quanh lửa trại trong giờ tiếng Anh." },
      { id: 'l5_s9_6_listen_to_music',   en: "Listen to music",     vi: "nghe nhạc",                         emoji: "🔮",    phonetic: "/ˈlɪsn tə ˈmjuːzɪk/", example_en: "We learn about listen to music in English class.", example_vi: "Chúng mình học về nghe nhạc trong giờ tiếng Anh." },
      { id: 'l5_s9_7_play_chess',        en: "Play chess",          vi: "chơi cờ",                           emoji: "🔮",    phonetic: "/pleɪ tʃes/",         example_en: "We like to play chess after school.", example_vi: "Chúng mình thích chơi cờ sau giờ học." },
      { id: 'l5_s9_8_watch_the_fish',    en: "Watch the fish",      vi: "xem cá",                            emoji: "🔮",    phonetic: "/wɒtʃ ðə fɪʃ/",       example_en: "We learn about watch the fish in English class.", example_vi: "Chúng mình học về xem cá trong giờ tiếng Anh." },
      { id: 'l5_s9_9_were_you_at_the_ca', en: "Were you at the campsite yesterday? – Yes, we were.", vi: "",                                  emoji: "🔮",    phonetic: "/ No, we weren't. (Hôm qua các bạn có ở địa điểm cắm trại không? – Có. / Không.)", example_en: "We learn about were you at the campsite yesterday? – yes, we were. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s9_10_what_did_you_do_ye', en: "What did you do yesterday? – We danced around the campfire.", vi: "Hôm qua các bạn đã làm gì? – Chúng mình đã nhảy múa quanh lửa trại.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what did you do yesterday? – we danced around the campfire. in English class.", example_vi: "Chúng mình học về hôm qua các bạn đã làm gì? – chúng mình đã nhảy múa quanh lửa trại. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 10: OUR SCHOOL TRIP ──
  {
    id: 'lop5_c10_unit_10_our_school_t',
    gradeId: 'lop5',
    name_vi: "UNIT 10: OUR SCHOOL TRIP",
    name_en: "UNIT 10: OUR SCHOOL TRIP",
    emoji: '🔮',
    color: 'from-purple-400 to-fuchsia-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-fuchsia-100',
    words: [
      { id: 'l5_s10_1_ba_na_hills',      en: "Ba Na Hills",         vi: "Bà Nà Hills",                       emoji: "🌁",    phonetic: "/bɑː nɑː hɪlz/",      example_en: "We learn about ba na hills in English class.", example_vi: "Chúng mình học về bà nà hills trong giờ tiếng Anh." },
      { id: 'l5_s10_2_bai_dinh_pagoda',  en: "Bai Dinh Pagoda",     vi: "Chùa Bái Đính",                     emoji: "🔮",    phonetic: "/baɪ dɪn pəˈɡəʊdə/",  example_en: "We learn about bai dinh pagoda in English class.", example_vi: "Chúng mình học về chùa bái đính trong giờ tiếng Anh." },
      { id: 'l5_s10_3_hoan_kiem_lake',   en: "Hoan Kiem Lake",      vi: "Hồ Hoàn Kiếm",                      emoji: "🐢",    phonetic: "/hoʊɑːn kjem leɪk/",  example_en: "We learn about hoan kiem lake in English class.", example_vi: "Chúng mình học về hồ hoàn kiếm trong giờ tiếng Anh." },
      { id: 'l5_s10_4_suoi_tien_theme_pa', en: "Suoi Tien Theme Park", vi: "Công viên Suối Tiên",               emoji: "🔮",    phonetic: "/suəi tiən θiːm pɑːk/", example_en: "We learn about suoi tien theme park in English class.", example_vi: "Chúng mình học về công viên suối tiên trong giờ tiếng Anh." },
      { id: 'l5_s10_5_plant_trees',      en: "Plant trees",         vi: "trồng cây",                         emoji: "🔮",    phonetic: "/plɑːnt triːz/",      example_en: "We learn about plant trees in English class.", example_vi: "Chúng mình học về trồng cây trong giờ tiếng Anh." },
      { id: 'l5_s10_6_play_games',       en: "Play games",          vi: "chơi trò chơi",                     emoji: "🔮",    phonetic: "/pleɪ ɡeɪmz/",        example_en: "We like to play games after school.", example_vi: "Chúng mình thích chơi trò chơi sau giờ học." },
      { id: 'l5_s10_7_visit_the_old_buil', en: "Visit the old buildings", vi: "thăm các tòa nhà cổ",               emoji: "🏢",    phonetic: "/ˈvɪzɪt ði əʊld ˈbɪldɪŋz/", example_en: "We learn about visit the old buildings in English class.", example_vi: "Chúng mình học về thăm các tòa nhà cổ trong giờ tiếng Anh." },
      { id: 'l5_s10_8_walk_around_the_la', en: "Walk around the lake", vi: "đi dạo quanh hồ",                   emoji: "🔮",    phonetic: "/wɔːk əˈraʊnd ðə leɪk/", example_en: "We learn about walk around the lake in English class.", example_vi: "Chúng mình học về đi dạo quanh hồ trong giờ tiếng Anh." },
      { id: 'l5_s10_9_did_they_go_to_hoa', en: "Did they go to Hoan Kiem Lake? – Yes, they did.", vi: "",                                  emoji: "🐢",    phonetic: "/ No, they didn't. (Họ có đã đi Hồ Hoàn Kiếm không? – Có. / Không.)", example_en: "We learn about did they go to hoan kiem lake? – yes, they did. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s10_10_what_did_they_do_t', en: "What did they do there? – They walked around the lake.", vi: "Họ đã làm gì ở đó? – Họ đã đi dạo quanh hồ.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what did they do there? – they walked around the lake. in English class.", example_vi: "Chúng mình học về họ đã làm gì ở đó? – họ đã đi dạo quanh hồ. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 11: FAMILY TIME ──
  {
    id: 'lop5_c11_unit_11_family_time',
    gradeId: 'lop5',
    name_vi: "UNIT 11: FAMILY TIME",
    name_en: "UNIT 11: FAMILY TIME",
    emoji: '🔮',
    color: 'from-fuchsia-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
    words: [
      { id: 'l5_s11_1_rhythm',           en: "Rhythm",              vi: "'When did you 'go to 'London?, 'What did they 'do in 'Finland?", emoji: "🔮",    phonetic: "",                    example_en: "We learn about rhythm in English class.", example_vi: "Chúng mình học về 'when did you 'go to 'london?, 'what did they 'do in 'finland? trong giờ tiếng Anh." },
      { id: 'l5_s11_2_buy_souvenirs',    en: "Buy souvenirs",       vi: "mua quà lưu niệm",                  emoji: "🔮",    phonetic: "/baɪ ˌsuːvəˈnɪəz/",   example_en: "We learn about buy souvenirs in English class.", example_vi: "Chúng mình học về mua quà lưu niệm trong giờ tiếng Anh." },
      { id: 'l5_s11_3_collect_seashells', en: "Collect seashells",   vi: "nhặt vỏ sò / vỏ ốc",                emoji: "🔮",    phonetic: "/kəˈlekt ˈsiːʃelz/",  example_en: "We learn about collect seashells in English class.", example_vi: "Chúng mình học về nhặt vỏ sò / vỏ ốc trong giờ tiếng Anh." },
      { id: 'l5_s11_4_eat_seafood',      en: "Eat seafood",         vi: "ăn hải sản",                        emoji: "🔮",    phonetic: "/iːt ˈsiːfuːd/",      example_en: "We learn about eat seafood in English class.", example_vi: "Chúng mình học về ăn hải sản trong giờ tiếng Anh." },
      { id: 'l5_s11_5_see_some_interesti', en: "See some interesting places", vi: "tham quan các địa điểm thú vị",     emoji: "🔮",    phonetic: "/siː səm ˈɪntrestɪŋ ˈpleɪsɪz/", example_en: "We learn about see some interesting places in English class.", example_vi: "Chúng mình học về tham quan các địa điểm thú vị trong giờ tiếng Anh." },
      { id: 'l5_s11_6_take_a_boat_trip_a', en: "Take a boat trip around the bay", vi: "đi thuyền quanh vịnh",              emoji: "🔮",    phonetic: "/teɪk ə bəʊt trɪp əˈraʊnd ðə beɪ/", example_en: "We learn about take a boat trip around the bay in English class.", example_vi: "Chúng mình học về đi thuyền quanh vịnh trong giờ tiếng Anh." },
      { id: 'l5_s11_7_walk_on_the_beach', en: "Walk on the beach",   vi: "đi dạo trên bờ biển",               emoji: "🔮",    phonetic: "/wɔːk ɒn ðə biːtʃ/",  example_en: "We learn about walk on the beach in English class.", example_vi: "Chúng mình học về đi dạo trên bờ biển trong giờ tiếng Anh." },
      { id: 'l5_s11_8_did_you_eat_seafoo', en: "Did you eat seafood in Da Nang? – Yes, I did.", vi: "",                                  emoji: "🔮",    phonetic: "/ No, I didn't. (Bạn có ăn hải sản ở Đà Nẵng không? – Có. / Không.)", example_en: "We learn about did you eat seafood in da nang? – yes, i did. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s11_9_what_did_your_fami', en: "What did your family do in Ha Long Bay? – We took a boat trip around the bay.", vi: "Gia đình bạn đã làm gì ở Vịnh Hạ Long? – Chúng mình đã đi thuyền quanh vịnh.", emoji: "🏞️",   phonetic: "",                    example_en: "We learn about what did your family do in ha long bay? – we took a boat trip around the bay. in English class.", example_vi: "Chúng mình học về gia đình bạn đã làm gì ở vịnh hạ long? – chúng mình đã đi thuyền quanh vịnh. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 12: OUR TET HOLIDAY ──
  {
    id: 'lop5_c12_unit_12_our_tet_holi',
    gradeId: 'lop5',
    name_vi: "UNIT 12: OUR TET HOLIDAY",
    name_en: "UNIT 12: OUR TET HOLIDAY",
    emoji: '🧧',
    color: 'from-indigo-400 to-violet-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-violet-100',
    words: [
      { id: 'l5_s12_1_rhythm',           en: "Rhythm",              vi: "I'll 'do the 'shopping for 'Tet., We'll 'decorate our 'house with 'flowers.", emoji: "🧧",    phonetic: "",                    example_en: "We learn about rhythm in English class.", example_vi: "Chúng mình học về i'll 'do the 'shopping for 'tet., we'll 'decorate our 'house with 'flowers. trong giờ tiếng Anh." },
      { id: 'l5_s12_2_buy_roses',        en: "Buy roses",           vi: "mua hoa hồng",                      emoji: "🧧",    phonetic: "/baɪ rəʊzɪz/",        example_en: "We learn about buy roses in English class.", example_vi: "Chúng mình học về mua hoa hồng trong giờ tiếng Anh." },
      { id: 'l5_s12_3_buy_a_branch_of_pe', en: "Buy a branch of peach blossoms", vi: "mua cành đào",                      emoji: "🌸",    phonetic: "/baɪ ə brɑːntʃ əv piːtʃ ˈblɒsəmz/", example_en: "We learn about buy a branch of peach blossoms in English class.", example_vi: "Chúng mình học về mua cành đào trong giờ tiếng Anh." },
      { id: 'l5_s12_4_decorate_the_house', en: "Decorate the house",  vi: "trang trí nhà cửa",                 emoji: "🏠",    phonetic: "/ˈdekəreɪt ðə haʊs/", example_en: "We learn about decorate the house in English class.", example_vi: "Chúng mình học về trang trí nhà cửa trong giờ tiếng Anh." },
      { id: 'l5_s12_5_do_the_shopping',  en: "Do the shopping",     vi: "đi sắm sửa / mua sắm",              emoji: "🧧",    phonetic: "/duː ðə ˈʃɒpɪŋ/",     example_en: "We learn about do the shopping in English class.", example_vi: "Chúng mình học về đi sắm sửa / mua sắm trong giờ tiếng Anh." },
      { id: 'l5_s12_6_make_banh_chung',  en: "Make banh chung",     vi: "gói bánh chưng",                    emoji: "🍱",    phonetic: "/meɪk bæn tʃʊŋ/",     example_en: "We learn about make banh chung in English class.", example_vi: "Chúng mình học về gói bánh chưng trong giờ tiếng Anh." },
      { id: 'l5_s12_7_make_spring_rolls', en: "Make spring rolls",   vi: "làm nem rán / chả giò",             emoji: "🥟",    phonetic: "/meɪk sprɪŋ rəʊlz/",  example_en: "We learn about make spring rolls in English class.", example_vi: "Chúng mình học về làm nem rán / chả giò trong giờ tiếng Anh." },
      { id: 'l5_s12_8_fireworks_show',   en: "Fireworks show",      vi: "màn bắn pháo hoa",                  emoji: "🧧",    phonetic: "/ˈfaɪəwɜːks ʃəʊ/",    example_en: "We learn about fireworks show in English class.", example_vi: "Chúng mình học về màn bắn pháo hoa trong giờ tiếng Anh." },
      { id: 'l5_s12_9_flower_festival',  en: "Flower festival",     vi: "lễ hội hoa",                        emoji: "🧧",    phonetic: "/ˈflaʊə ˈfestɪvl/",   example_en: "We learn about flower festival in English class.", example_vi: "Chúng mình học về lễ hội hoa trong giờ tiếng Anh." },
      { id: 'l5_s12_10_new_year_party',  en: "New Year party",      vi: "bữa tiệc năm mới",                  emoji: "🧧",    phonetic: "/njuː jɪə ˈpɑːti/",   example_en: "We learn about new year party in English class.", example_vi: "Chúng mình học về bữa tiệc năm mới trong giờ tiếng Anh." },
      { id: 'l5_s12_11_will_you_decorate_', en: "Will you decorate the house for Tet? – Yes, I will.", vi: "",                                  emoji: "🏠",    phonetic: "/ No, I won't. I'll buy roses. (Bạn sẽ trang trí nhà cửa đón Tết chứ? – Có. / Không, mình sẽ đi mua hoa hồng.)", example_en: "We learn about will you decorate the house for tet? – yes, i will. in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s12_12_where_will_you_go_', en: "Where will you go at Tet? – I'll go to the flower festival.", vi: "Bạn sẽ đi đâu dịp Tết? – Mình sẽ đi lễ hội hoa.", emoji: "🧧",    phonetic: "",                    example_en: "We learn about where will you go at tet? – i'll go to the flower festival. in English class.", example_vi: "Chúng mình học về bạn sẽ đi đâu dịp tết? – mình sẽ đi lễ hội hoa. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 13: OUR SPECIAL DAYS ──
  {
    id: 'lop5_c13_unit_13_our_special_',
    gradeId: 'lop5',
    name_vi: "UNIT 13: OUR SPECIAL DAYS",
    name_en: "UNIT 13: OUR SPECIAL DAYS",
    emoji: '🔮',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l5_s13_1_at_mid_autumn_fest', en: "At Mid-Autumn Festival", vi: "vào Tết Trung thu",                 emoji: "🔮",    phonetic: "/æt mɪd ˈɔːtəm ˈfestɪvl/", example_en: "We learn about at mid-autumn festival in English class.", example_vi: "Chúng mình học về vào tết trung thu trong giờ tiếng Anh." },
      { id: 'l5_s13_2_on_children_s_day', en: "On Children's Day",   vi: "vào Ngày Quốc tế Thiếu nhi",        emoji: "🔮",    phonetic: "/ɒn ˈtʃɪldrənz deɪ/", example_en: "We learn about on children's day in English class.", example_vi: "Chúng mình học về vào ngày quốc tế thiếu nhi trong giờ tiếng Anh." },
      { id: 'l5_s13_3_on_sports_day',    en: "On Sports Day",       vi: "vào Ngày Hội thể thao",             emoji: "🔮",    phonetic: "/ɒn ˈspɔːts deɪ/",    example_en: "We learn about on sports day in English class.", example_vi: "Chúng mình học về vào ngày hội thể thao trong giờ tiếng Anh." },
      { id: 'l5_s13_4_on_teachers_day',  en: "On Teachers' Day",    vi: "vào Ngày Nhà giáo",                 emoji: "🔮",    phonetic: "/ɒn ˈtiːtʃəz deɪ/",   example_en: "We learn about on teachers' day in English class.", example_vi: "Chúng mình học về vào ngày nhà giáo trong giờ tiếng Anh." },
      { id: 'l5_s13_5_apple_juice',      en: "Apple juice",         vi: "nước ép táo",                       emoji: "🔮",    phonetic: "/ˈæpl dʒuːs/",        example_en: "We learn about apple juice in English class.", example_vi: "Chúng mình học về nước ép táo trong giờ tiếng Anh." },
      { id: 'l5_s13_6_burgers',          en: "Burgers",             vi: "bánh burger",                       emoji: "🔮",    phonetic: "/ˈbɜːɡəz/",           example_en: "We learn about burgers in English class.", example_vi: "Chúng mình học về bánh burger trong giờ tiếng Anh." },
      { id: 'l5_s13_7_milk_tea',         en: "Milk tea",            vi: "trà sữa",                           emoji: "🧋",    phonetic: "/mɪlk tiː/",          example_en: "We learn about milk tea in English class.", example_vi: "Chúng mình học về trà sữa trong giờ tiếng Anh." },
      { id: 'l5_s13_8_pizza',            en: "Pizza",               vi: "bánh pizza",                        emoji: "🔮",    phonetic: "/ˈpiːtsə/",           example_en: "We learn about pizza in English class.", example_vi: "Chúng mình học về bánh pizza trong giờ tiếng Anh." },
      { id: 'l5_s13_9_what_will_you_do_o', en: "What will you do on Children's Day? – We'll sing and dance.", vi: "Các bạn sẽ làm gì vào Ngày Quốc tế Thiếu nhi? – Chúng mình sẽ hát và múa.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what will you do on children's day? – we'll sing and dance. in English class.", example_vi: "Chúng mình học về các bạn sẽ làm gì vào ngày quốc tế thiếu nhi? – chúng mình sẽ hát và múa. trong giờ tiếng Anh." },
      { id: 'l5_s13_10_what_food_and_drin', en: "What food and drinks will you have at the party? – We'll have pizza and milk tea.", vi: "Các bạn sẽ có đồ ăn đồ uống gì trong bữa tiệc? – Chúng mình sẽ có bánh pizza và trà sữa.", emoji: "🧋",    phonetic: "",                    example_en: "We learn about what food and drinks will you have at the party? – we'll have pizza and milk tea. in English class.", example_vi: "Chúng mình học về các bạn sẽ có đồ ăn đồ uống gì trong bữa tiệc? – chúng mình sẽ có bánh pizza và trà sữa. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 14: STAYING HEALTHY ──
  {
    id: 'lop5_c14_unit_14_staying_heal',
    gradeId: 'lop5',
    name_vi: "UNIT 14: STAYING HEALTHY",
    name_en: "UNIT 14: STAYING HEALTHY",
    emoji: '🔮',
    color: 'from-rose-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-orange-100',
    words: [
      { id: 'l5_s14_1_do_morning_exercis', en: "Do morning exercise", vi: "tập thể dục buổi sáng",             emoji: "🔮",    phonetic: "/duː ˈmɔːnɪŋ ˈeksəsaɪz/", example_en: "We learn about do morning exercise in English class.", example_vi: "Chúng mình học về tập thể dục buổi sáng trong giờ tiếng Anh." },
      { id: 'l5_s14_2_do_yoga',          en: "Do yoga",             vi: "tập yoga",                          emoji: "🔮",    phonetic: "/duː ˈjəʊɡə/",        example_en: "We learn about do yoga in English class.", example_vi: "Chúng mình học về tập yoga trong giờ tiếng Anh." },
      { id: 'l5_s14_3_drink_fresh_juice', en: "Drink fresh juice",   vi: "uống nước ép tươi",                 emoji: "🔮",    phonetic: "/drɪŋk freʃ dʒuːs/",  example_en: "We learn about drink fresh juice in English class.", example_vi: "Chúng mình học về uống nước ép tươi trong giờ tiếng Anh." },
      { id: 'l5_s14_4_eat_healthy_food', en: "Eat healthy food",    vi: "ăn thực phẩm lành mạnh",            emoji: "🔮",    phonetic: "/iːt ˈhelθi fuːd/",   example_en: "We learn about eat healthy food in English class.", example_vi: "Chúng mình học về ăn thực phẩm lành mạnh trong giờ tiếng Anh." },
      { id: 'l5_s14_5_eat_vegetables',   en: "Eat vegetables",      vi: "ăn rau củ",                         emoji: "🔮",    phonetic: "/iːt ˈvedʒtəblz/",    example_en: "We learn about eat vegetables in English class.", example_vi: "Chúng mình học về ăn rau củ trong giờ tiếng Anh." },
      { id: 'l5_s14_6_play_sports',      en: "Play sports",         vi: "chơi thể thao",                     emoji: "🔮",    phonetic: "/pleɪ spɔːts/",       example_en: "We like to play sports after school.", example_vi: "Chúng mình thích chơi thể thao sau giờ học." },
      { id: 'l5_s14_7_every_day',        en: "Every day",           vi: "mỗi ngày",                          emoji: "🔮",    phonetic: "/ˈevri deɪ/",         example_en: "We learn about every day in English class.", example_vi: "Chúng mình học về mỗi ngày trong giờ tiếng Anh." },
      { id: 'l5_s14_8_once_a_week',      en: "Once a week",         vi: "một lần một tuần",                  emoji: "🔮",    phonetic: "/wʌns ə wiːk/",       example_en: "We learn about once a week in English class.", example_vi: "Chúng mình học về một lần một tuần trong giờ tiếng Anh." },
      { id: 'l5_s14_9_twice_a_week',     en: "Twice a week",        vi: "hai lần một tuần",                  emoji: "🔮",    phonetic: "/twaɪs ə wiːk/",      example_en: "We learn about twice a week in English class.", example_vi: "Chúng mình học về hai lần một tuần trong giờ tiếng Anh." },
      { id: 'l5_s14_10_three_times_a_week', en: "Three times a week",  vi: "ba lần một tuần",                   emoji: "🔮",    phonetic: "/θriː taɪmz ə wiːk/", example_en: "We learn about three times a week in English class.", example_vi: "Chúng mình học về ba lần một tuần trong giờ tiếng Anh." },
      { id: 'l5_s14_11_how_does_he',     en: "How does he",         vi: "",                                  emoji: "🔮",    phonetic: "/she stay healthy? – He/She does yoga every day. (Anh ấy/Cô ấy giữ gìn sức khỏe bằng cách nào? – Anh ấy/Cô ấy tập yoga mỗi ngày.)", example_en: "We learn about how does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
      { id: 'l5_s14_12_how_often_does_he', en: "How often does he",   vi: "",                                  emoji: "🔮",    phonetic: "/she play sports? – He/She plays sports three times a week. (Anh ấy/Cô ấy chơi thể thao với tần suất như thế nào? – Anh ấy/Cô ấy chơi thể thao 3 lần một tuần.)", example_en: "We learn about how often does he in English class.", example_vi: "Chúng mình học về  trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 15: OUR HEALTH ──
  {
    id: 'lop5_c15_unit_15_our_health',
    gradeId: 'lop5',
    name_vi: "UNIT 15: OUR HEALTH",
    name_en: "UNIT 15: OUR HEALTH",
    emoji: '🔮',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l5_s15_1_headache',         en: "Headache",            vi: "đau đầu",                           emoji: "🤕",    phonetic: "/ˈhedeɪk/",           example_en: "We learn about headache in English class.", example_vi: "Chúng mình học về đau đầu trong giờ tiếng Anh." },
      { id: 'l5_s15_2_sore_throat',      en: "Sore throat",         vi: "đau họng",                          emoji: "🔮",    phonetic: "/sɔː θrəʊt/",         example_en: "We learn about sore throat in English class.", example_vi: "Chúng mình học về đau họng trong giờ tiếng Anh." },
      { id: 'l5_s15_3_stomach_ache',     en: "Stomach ache",        vi: "đau dạ dày / đau bụng",             emoji: "🤢",    phonetic: "/ˈstʌmək eɪk/",       example_en: "We learn about stomach ache in English class.", example_vi: "Chúng mình học về đau dạ dày / đau bụng trong giờ tiếng Anh." },
      { id: 'l5_s15_4_toothache',        en: "Toothache",           vi: "đau răng",                          emoji: "🦷",    phonetic: "/ˈtuːθeɪk/",          example_en: "We learn about toothache in English class.", example_vi: "Chúng mình học về đau răng trong giờ tiếng Anh." },
      { id: 'l5_s15_5_drink_warm_water', en: "Drink warm water",    vi: "uống nước ấm",                      emoji: "🔮",    phonetic: "/drɪŋk wɔːm ˈwɔːtə/", example_en: "We learn about drink warm water in English class.", example_vi: "Chúng mình học về uống nước ấm trong giờ tiếng Anh." },
      { id: 'l5_s15_6_go_to_the_dentist', en: "Go to the dentist",   vi: "đi khám nha sĩ",                    emoji: "🧑‍⚕️", phonetic: "/ɡəʊ tə ðə ˈdentɪst/", example_en: "Students go to the dentist on weekdays.", example_vi: "Các bạn học sinh đi khám nha sĩ vào các ngày trong tuần." },
      { id: 'l5_s15_7_have_a_rest',      en: "Have a rest",         vi: "nghỉ ngơi",                         emoji: "🔮",    phonetic: "/hæv ə rest/",        example_en: "We learn about have a rest in English class.", example_vi: "Chúng mình học về nghỉ ngơi trong giờ tiếng Anh." },
      { id: 'l5_s15_8_take_some_medicine', en: "Take some medicine",  vi: "uống thuốc",                        emoji: "💊",    phonetic: "/teɪk səm ˈmedsn/",   example_en: "We learn about take some medicine in English class.", example_vi: "Chúng mình học về uống thuốc trong giờ tiếng Anh." },
      { id: 'l5_s15_9_what_s_the_matter_', en: "What's the matter with you? – I have a sore throat.", vi: "Có chuyện gì với bạn thế? – Mình bị đau họng.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what's the matter with you? – i have a sore throat. in English class.", example_vi: "Chúng mình học về có chuyện gì với bạn thế? – mình bị đau họng. trong giờ tiếng Anh." },
      { id: 'l5_s15_10_you_should_drink_w', en: "You should drink warm water and take some medicine.", vi: "Bạn nên uống nước ấm và uống thuốc.", emoji: "💊",    phonetic: "",                    example_en: "We learn about you should drink warm water and take some medicine. in English class.", example_vi: "Chúng mình học về bạn nên uống nước ấm và uống thuốc. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 16: SEASONS AND THE WEATHER ──
  {
    id: 'lop5_c16_unit_16_seasons_and_',
    gradeId: 'lop5',
    name_vi: "UNIT 16: SEASONS AND THE WEATHER",
    name_en: "UNIT 16: SEASONS AND THE WEATHER",
    emoji: '🔮',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l5_s16_1_autumn',           en: "Autumn",              vi: "mùa thu",                           emoji: "🔮",    phonetic: "/ˈɔːtəm/",            example_en: "We learn about autumn in English class.", example_vi: "Chúng mình học về mùa thu trong giờ tiếng Anh." },
      { id: 'l5_s16_2_spring',           en: "Spring",              vi: "mùa xuân",                          emoji: "🔮",    phonetic: "/sprɪŋ/",             example_en: "We learn about spring in English class.", example_vi: "Chúng mình học về mùa xuân trong giờ tiếng Anh." },
      { id: 'l5_s16_3_summer',           en: "Summer",              vi: "mùa hè",                            emoji: "🔮",    phonetic: "/ˈsʌmə/",             example_en: "We learn about summer in English class.", example_vi: "Chúng mình học về mùa hè trong giờ tiếng Anh." },
      { id: 'l5_s16_4_winter',           en: "Winter",              vi: "mùa đông",                          emoji: "🔮",    phonetic: "/ˈwɪntə/",            example_en: "We learn about winter in English class.", example_vi: "Chúng mình học về mùa đông trong giờ tiếng Anh." },
      { id: 'l5_s16_5_cold',             en: "Cold",                vi: "lạnh",                              emoji: "🤧",    phonetic: "/kəʊld/",             example_en: "We learn about cold in English class.", example_vi: "Chúng mình học về lạnh trong giờ tiếng Anh." },
      { id: 'l5_s16_6_cool',             en: "Cool",                vi: "mát mẻ",                            emoji: "🔮",    phonetic: "/kuːl/",              example_en: "We learn about cool in English class.", example_vi: "Chúng mình học về mát mẻ trong giờ tiếng Anh." },
      { id: 'l5_s16_7_hot',              en: "Hot",                 vi: "nóng",                              emoji: "🔮",    phonetic: "/hɒt/",               example_en: "We learn about hot in English class.", example_vi: "Chúng mình học về nóng trong giờ tiếng Anh." },
      { id: 'l5_s16_8_warm',             en: "Warm",                vi: "ấm áp",                             emoji: "🔮",    phonetic: "/wɔːm/",              example_en: "We learn about warm in English class.", example_vi: "Chúng mình học về ấm áp trong giờ tiếng Anh." },
      { id: 'l5_s16_9_blouse',           en: "Blouse",              vi: "áo sơ mi nữ",                       emoji: "🔮",    phonetic: "/blaʊz/",             example_en: "We learn about blouse in English class.", example_vi: "Chúng mình học về áo sơ mi nữ trong giờ tiếng Anh." },
      { id: 'l5_s16_10_jeans',           en: "Jeans",               vi: "quần bò / jean",                    emoji: "🔮",    phonetic: "/dʒiːnz/",            example_en: "We learn about jeans in English class.", example_vi: "Chúng mình học về quần bò / jean trong giờ tiếng Anh." },
      { id: 'l5_s16_11_jumper',          en: "Jumper",              vi: "áo len chui đầu",                   emoji: "🔮",    phonetic: "/ˈdʒʌmpə/",           example_en: "We learn about jumper in English class.", example_vi: "Chúng mình học về áo len chui đầu trong giờ tiếng Anh." },
      { id: 'l5_s16_12_trousers',        en: "Trousers",            vi: "quần dài",                          emoji: "🔮",    phonetic: "/ˈtraʊzəz/",          example_en: "We learn about trousers in English class.", example_vi: "Chúng mình học về quần dài trong giờ tiếng Anh." },
      { id: 'l5_s16_13_how_s_the_weather_', en: "How's the weather in Ha Noi in spring? – It's warm.", vi: "Thời tiết ở Hà Nội vào mùa xuân như thế nào? – Trời ấm áp.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about how's the weather in ha noi in spring? – it's warm. in English class.", example_vi: "Chúng mình học về thời tiết ở hà nội vào mùa xuân như thế nào? – trời ấm áp. trong giờ tiếng Anh." },
      { id: 'l5_s16_14_what_do_you_usuall', en: "What do you usually wear in winter? – I wear a jumper and trousers.", vi: "Bạn thường mặc gì vào mùa đông? – Mình mặc áo len và quần dài.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what do you usually wear in winter? – i wear a jumper and trousers. in English class.", example_vi: "Chúng mình học về bạn thường mặc gì vào mùa đông? – mình mặc áo len và quần dài. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 17: STORIES FOR CHILDREN ──
  {
    id: 'lop5_c17_unit_17_stories_for_',
    gradeId: 'lop5',
    name_vi: "UNIT 17: STORIES FOR CHILDREN",
    name_en: "UNIT 17: STORIES FOR CHILDREN",
    emoji: '🔮',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'l5_s17_1_ant',              en: "Ant",                 vi: "con kiến",                          emoji: "🔮",    phonetic: "/ænt/",               example_en: "We learn about ant in English class.", example_vi: "Chúng mình học về con kiến trong giờ tiếng Anh." },
      { id: 'l5_s17_2_crow',             en: "Crow",                vi: "con quạ",                           emoji: "🔮",    phonetic: "/krəʊ/",              example_en: "We learn about crow in English class.", example_vi: "Chúng mình học về con quạ trong giờ tiếng Anh." },
      { id: 'l5_s17_3_dwarfs',           en: "Dwarfs",              vi: "chú lùn",                           emoji: "🔮",    phonetic: "/dwɔːfs/",            example_en: "We learn about dwarfs in English class.", example_vi: "Chúng mình học về chú lùn trong giờ tiếng Anh." },
      { id: 'l5_s17_4_fox',              en: "Fox",                 vi: "con cáo",                           emoji: "🔮",    phonetic: "/fɒks/",              example_en: "We learn about fox in English class.", example_vi: "Chúng mình học về con cáo trong giờ tiếng Anh." },
      { id: 'l5_s17_5_grasshopper',      en: "Grasshopper",         vi: "con châu chấu",                     emoji: "🔮",    phonetic: "/ˈɡrɑːshɒpə/",        example_en: "We learn about grasshopper in English class.", example_vi: "Chúng mình học về con châu chấu trong giờ tiếng Anh." },
      { id: 'l5_s17_6_hare',             en: "Hare",                vi: "con thỏ rừng",                      emoji: "🔮",    phonetic: "/heə/",               example_en: "We learn about hare in English class.", example_vi: "Chúng mình học về con thỏ rừng trong giờ tiếng Anh." },
      { id: 'l5_s17_7_snow_white',       en: "Snow White",          vi: "Nàng Bạch Tuyết",                   emoji: "🔮",    phonetic: "/snəʊ waɪt/",         example_en: "We learn about snow white in English class.", example_vi: "Chúng mình học về nàng bạch tuyết trong giờ tiếng Anh." },
      { id: 'l5_s17_8_tortoise',         en: "Tortoise",            vi: "con rùa",                           emoji: "🔮",    phonetic: "/ˈtɔːtəs/",           example_en: "We learn about tortoise in English class.", example_vi: "Chúng mình học về con rùa trong giờ tiếng Anh." },
      { id: 'l5_s17_9_cook_well',        en: "Cook well",           vi: "nấu ăn ngon",                       emoji: "👨‍🍳", phonetic: "/kʊk wel/",           example_en: "We learn about cook well in English class.", example_vi: "Chúng mình học về nấu ăn ngon trong giờ tiếng Anh." },
      { id: 'l5_s17_10_run_fast',        en: "Run fast",            vi: "chạy nhanh",                        emoji: "🔮",    phonetic: "/rʌn fɑːst/",         example_en: "We learn about run fast in English class.", example_vi: "Chúng mình học về chạy nhanh trong giờ tiếng Anh." },
      { id: 'l5_s17_11_sing_beautifully', en: "Sing beautifully",    vi: "hát hay",                           emoji: "🔮",    phonetic: "/sɪŋ ˈbjuːtɪfli/",    example_en: "We learn about sing beautifully in English class.", example_vi: "Chúng mình học về hát hay trong giờ tiếng Anh." },
      { id: 'l5_s17_12_work_hard',       en: "Work hard",           vi: "làm việc chăm chỉ",                 emoji: "🔮",    phonetic: "/wɜːk hɑːd/",         example_en: "We learn about work hard in English class.", example_vi: "Chúng mình học về làm việc chăm chỉ trong giờ tiếng Anh." },
      { id: 'l5_s17_13_who_are_the_main_c', en: "Who are the main characters in the story? – They're the fox and the crow.", vi: "Ai là những nhân vật chính trong câu chuyện? – Đó là con cáo và con quạ.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about who are the main characters in the story? – they're the fox and the crow. in English class.", example_vi: "Chúng mình học về ai là những nhân vật chính trong câu chuyện? – đó là con cáo và con quạ. trong giờ tiếng Anh." },
      { id: 'l5_s17_14_how_did_snow_white', en: "How did Snow White work? – She worked hard.", vi: "Nàng Bạch Tuyết làm việc như thế nào? – Nàng làm việc rất chăm chỉ.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about how did snow white work? – she worked hard. in English class.", example_vi: "Chúng mình học về nàng bạch tuyết làm việc như thế nào? – nàng làm việc rất chăm chỉ. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 18: MEANS OF TRANSPORT ──
  {
    id: 'lop5_c18_unit_18_means_of_tra',
    gradeId: 'lop5',
    name_vi: "UNIT 18: MEANS OF TRANSPORT",
    name_en: "UNIT 18: MEANS OF TRANSPORT",
    emoji: '🔮',
    color: 'from-purple-400 to-fuchsia-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-fuchsia-100',
    words: [
      { id: 'l5_s18_1_dragon_bridge',    en: "Dragon Bridge",       vi: "Cầu Rồng",                          emoji: "🐲",    phonetic: "/ˈdræɡən brɪdʒ/",     example_en: "We learn about dragon bridge in English class.", example_vi: "Chúng mình học về cầu rồng trong giờ tiếng Anh." },
      { id: 'l5_s18_2_ha_noi_opera_house', en: "Ha Noi Opera House",  vi: "Nhà hát Lớn Hà Nội",                emoji: "🏠",    phonetic: "/hɑː nɔɪ ˈɒprə haʊs/", example_en: "We learn about ha noi opera house in English class.", example_vi: "Chúng mình học về nhà hát lớn hà nội trong giờ tiếng Anh." },
      { id: 'l5_s18_3_ho_chi_minh_city_m', en: "Ho Chi Minh City Museum", vi: "Bảo tàng Thành phố Hồ Chí Minh",    emoji: "🏙️",   phonetic: "/həʊ tʃiː mɪn ˈsɪti mjuˈziːəm/", example_en: "We learn about ho chi minh city museum in English class.", example_vi: "Chúng mình học về bảo tàng thành phố hồ chí minh trong giờ tiếng Anh." },
      { id: 'l5_s18_4_ngo_mon_square',   en: "Ngo Mon Square",      vi: "Quảng trường Ngọ Môn",              emoji: "🔮",    phonetic: "/ŋəʊ mɒn skweə/",     example_en: "We learn about ngo mon square in English class.", example_vi: "Chúng mình học về quảng trường ngọ môn trong giờ tiếng Anh." },
      { id: 'l5_s18_5_by_bicycle',       en: "By bicycle",          vi: "bằng xe đạp",                       emoji: "🔮",    phonetic: "/baɪ ˈbaɪsɪkl/",      example_en: "We learn about by bicycle in English class.", example_vi: "Chúng mình học về bằng xe đạp trong giờ tiếng Anh." },
      { id: 'l5_s18_6_by_bus',           en: "By bus",              vi: "bằng xe buýt",                      emoji: "🔮",    phonetic: "/baɪ bʌs/",           example_en: "We learn about by bus in English class.", example_vi: "Chúng mình học về bằng xe buýt trong giờ tiếng Anh." },
      { id: 'l5_s18_7_by_taxi',          en: "By taxi",             vi: "bằng xe taxi",                      emoji: "🔮",    phonetic: "/baɪ ˈtæksi/",        example_en: "We learn about by taxi in English class.", example_vi: "Chúng mình học về bằng xe taxi trong giờ tiếng Anh." },
      { id: 'l5_s18_8_on_foot',          en: "On foot",             vi: "đi bộ",                             emoji: "🔮",    phonetic: "/ɒn fʊt/",            example_en: "We learn about on foot in English class.", example_vi: "Chúng mình học về đi bộ trong giờ tiếng Anh." },
      { id: 'l5_s18_9_where_do_you_want_', en: "Where do you want to visit? – I want to visit Ngo Mon Square.", vi: "Bạn muốn đi thăm địa điểm nào? – Mình muốn thăm Quảng trường Ngọ Môn.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about where do you want to visit? – i want to visit ngo mon square. in English class.", example_vi: "Chúng mình học về bạn muốn đi thăm địa điểm nào? – mình muốn thăm quảng trường ngọ môn. trong giờ tiếng Anh." },
      { id: 'l5_s18_10_how_can_i_get_to_d', en: "How can I get to Dragon Bridge? – You can get there by bus.", vi: "Làm sao mình có thể đến Cầu Rồng? – Bạn có thể đến đó bằng xe buýt.", emoji: "🐲",    phonetic: "",                    example_en: "We learn about how can i get to dragon bridge? – you can get there by bus. in English class.", example_vi: "Chúng mình học về làm sao mình có thể đến cầu rồng? – bạn có thể đến đó bằng xe buýt. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 19: PLACES OF INTEREST ──
  {
    id: 'lop5_c19_unit_19_places_of_in',
    gradeId: 'lop5',
    name_vi: "UNIT 19: PLACES OF INTEREST",
    name_en: "UNIT 19: PLACES OF INTEREST",
    emoji: '🔮',
    color: 'from-fuchsia-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
    words: [
      { id: 'l5_s19_1_beautiful',        en: "Beautiful",           vi: "đẹp, xinh đẹp",                     emoji: "🔮",    phonetic: "/ˈbjuːtɪfl/",         example_en: "We learn about beautiful in English class.", example_vi: "Chúng mình học về đẹp, xinh đẹp trong giờ tiếng Anh." },
      { id: 'l5_s19_2_exciting',         en: "Exciting",            vi: "thú vị, sôi động",                  emoji: "🔮",    phonetic: "/ɪkˈsaɪtɪŋ/",         example_en: "We learn about exciting in English class.", example_vi: "Chúng mình học về thú vị, sôi động trong giờ tiếng Anh." },
      { id: 'l5_s19_3_fantastic',        en: "Fantastic",           vi: "tuyệt vời",                         emoji: "🔮",    phonetic: "/fænˈtæstɪk/",        example_en: "We learn about fantastic in English class.", example_vi: "Chúng mình học về tuyệt vời trong giờ tiếng Anh." },
      { id: 'l5_s19_4_peaceful',         en: "Peaceful",            vi: "yên bình",                          emoji: "🔮",    phonetic: "/ˈpiːsfl/",           example_en: "We learn about peaceful in English class.", example_vi: "Chúng mình học về yên bình trong giờ tiếng Anh." },
      { id: 'l5_s19_5_twenty_nine_29',   en: "Twenty-nine (29)",    vi: "29",                                emoji: "🔮",    phonetic: "/ˌtwenti ˈnaɪn/",     example_en: "We learn about twenty-nine (29) in English class.", example_vi: "Chúng mình học về 29 trong giờ tiếng Anh." },
      { id: 'l5_s19_6_forty_40',         en: "Forty (40)",          vi: "40",                                emoji: "🔮",    phonetic: "/ˈfɔːti/",            example_en: "We learn about forty (40) in English class.", example_vi: "Chúng mình học về 40 trong giờ tiếng Anh." },
      { id: 'l5_s19_7_one_hundred_100',  en: "One hundred (100)",   vi: "100",                               emoji: "🔮",    phonetic: "/wʌn ˈhʌndrəd/",      example_en: "We learn about one hundred (100) in English class.", example_vi: "Chúng mình học về 100 trong giờ tiếng Anh." },
      { id: 'l5_s19_8_one_hundred_and_tw', en: "One hundred and twenty-nine (129)", vi: "129",                               emoji: "🔮",    phonetic: "/wʌn ˈhʌndrəd ænd ˌtwenti ˈnaɪn/", example_en: "We learn about one hundred and twenty-nine (129) in English class.", example_vi: "Chúng mình học về 129 trong giờ tiếng Anh." },
      { id: 'l5_s19_9_what_do_you_think_', en: "What do you think of Phu Quoc Island? – I think it's fantastic.", vi: "Bạn nghĩ gì về Đảo Phú Quốc? – Mình nghĩ nó rất tuyệt vời.", emoji: "🏝️",   phonetic: "",                    example_en: "We learn about what do you think of phu quoc island? – i think it's fantastic. in English class.", example_vi: "Chúng mình học về bạn nghĩ gì về đảo phú quốc? – mình nghĩ nó rất tuyệt vời. trong giờ tiếng Anh." },
      { id: 'l5_s19_10_how_far_is_it_from', en: "How far is it from Ha Noi to Hue? – It's about 650 kilometres.", vi: "Khoảng cách từ Hà Nội đến Huế là bao xa? – Khoảng 650 ki-lô-mét.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about how far is it from ha noi to hue? – it's about 650 kilometres. in English class.", example_vi: "Chúng mình học về khoảng cách từ hà nội đến huế là bao xa? – khoảng 650 ki-lô-mét. trong giờ tiếng Anh." },
    ],
  },

  // ── UNIT 20: OUR SUMMER HOLIDAYS ──
  {
    id: 'lop5_c20_unit_20_our_summer_h',
    gradeId: 'lop5',
    name_vi: "UNIT 20: OUR SUMMER HOLIDAYS",
    name_en: "UNIT 20: OUR SUMMER HOLIDAYS",
    emoji: '🔮',
    color: 'from-indigo-400 to-violet-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-violet-100',
    words: [
      { id: 'l5_s20_1_dam_sen_aquarium', en: "Dam Sen Aquarium",    vi: "Thủy cung Đầm Sen",                 emoji: "🔮",    phonetic: "/dæm sen əˈkweəriəm/", example_en: "We learn about dam sen aquarium in English class.", example_vi: "Chúng mình học về thủy cung đầm sen trong giờ tiếng Anh." },
      { id: 'l5_s20_2_huong_river',      en: "Huong River",         vi: "Sông Hương",                        emoji: "🔮",    phonetic: "/huəŋ ˈrɪvə/",        example_en: "We learn about huong river in English class.", example_vi: "Chúng mình học về sông hương trong giờ tiếng Anh." },
      { id: 'l5_s20_3_phong_nha_cave',   en: "Phong Nha Cave",      vi: "Động Phong Nha",                    emoji: "🍜",    phonetic: "/fɒŋ ɲə keɪv/",       example_en: "We learn about phong nha cave in English class.", example_vi: "Chúng mình học về động phong nha trong giờ tiếng Anh." },
      { id: 'l5_s20_4_phu_quoc_island',  en: "Phu Quoc Island",     vi: "Đảo Phú Quốc",                      emoji: "🏝️",   phonetic: "/fuː kwɒk ˈaɪlənd/",  example_en: "We learn about phu quoc island in English class.", example_vi: "Chúng mình học về đảo phú quốc trong giờ tiếng Anh." },
      { id: 'l5_s20_5_go_camping',       en: "Go camping",          vi: "đi cắm trại",                       emoji: "🔮",    phonetic: "/ɡəʊ ˈkæmpɪŋ/",       example_en: "We learn about go camping in English class.", example_vi: "Chúng mình học về đi cắm trại trong giờ tiếng Anh." },
      { id: 'l5_s20_6_join_a_music_club', en: "Join a music club",   vi: "tham gia câu lạc bộ âm nhạc",       emoji: "🔮",    phonetic: "/dʒɔɪn ə ˈmjuːzɪk klʌb/", example_en: "We learn about join a music club in English class.", example_vi: "Chúng mình học về tham gia câu lạc bộ âm nhạc trong giờ tiếng Anh." },
      { id: 'l5_s20_7_practise_swimming', en: "Practise swimming",   vi: "luyện tập bơi",                     emoji: "🏊",    phonetic: "/ˈpræktɪs ˈswɪmɪŋ/",  example_en: "We learn about practise swimming in English class.", example_vi: "Chúng mình học về luyện tập bơi trong giờ tiếng Anh." },
      { id: 'l5_s20_8_visit_an_eco_farm', en: "Visit an eco-farm",   vi: "thăm trang trại sinh thái",         emoji: "🔮",    phonetic: "/ˈvɪzɪt æn ˈiːkəʊ fɑːm/", example_en: "We learn about visit an eco-farm in English class.", example_vi: "Chúng mình học về thăm trang trại sinh thái trong giờ tiếng Anh." },
      { id: 'l5_s20_9_where_are_you_goin', en: "Where are you going to visit this summer? – I'm going to visit Phong Nha Cave.", vi: "Mùa hè này bạn dự định đi thăm địa điểm nào? – Mình dự định thăm Động Phong Nha.", emoji: "🍜",    phonetic: "",                    example_en: "We learn about where are you going to visit this summer? – i'm going to visit phong nha cave. in English class.", example_vi: "Chúng mình học về mùa hè này bạn dự định đi thăm địa điểm nào? – mình dự định thăm động phong nha. trong giờ tiếng Anh." },
      { id: 'l5_s20_10_what_are_you_going', en: "What are you going to do this summer? – I'm going to join a music club.", vi: "Mùa hè này bạn dự định làm gì? – Mình dự định tham gia một câu lạc bộ âm nhạc.", emoji: "🔮",    phonetic: "",                    example_en: "We learn about what are you going to do this summer? – i'm going to join a music club. in English class.", example_vi: "Chúng mình học về mùa hè này bạn dự định làm gì? – mình dự định tham gia một câu lạc bộ âm nhạc. trong giờ tiếng Anh." },
    ],
  },

  // ── 1. NGHỀ NGHIỆP & NƠI LÀM VIỆC HIỆN ĐẠI (MỞ RỘNG TỪ UNIT 5) ──
  {
    id: 'lop5_c21_1_ngh_nghi_p_n_i_l_m',
    gradeId: 'lop5',
    name_vi: "1. Nghề nghiệp & Nơi làm việc hiện đại (Mở rộng từ Unit 5)",
    name_en: "1. Nghề nghiệp & Nơi làm việc hiện đại (Mở rộng từ Unit 5)",
    emoji: '🔮',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l5_s21_1_architect',        en: "Architect",           vi: "kiến trúc sư",                      emoji: "🔮",    phonetic: "/ˈɑːkɪtekt/",         example_en: "We learn about architect in English class.", example_vi: "Chúng mình học về kiến trúc sư trong giờ tiếng Anh." },
      { id: 'l5_s21_2_pilot',            en: "Pilot",               vi: "phi công",                          emoji: "👨‍✈️", phonetic: "/ˈpaɪlət/",           example_en: "We learn about pilot in English class.", example_vi: "Chúng mình học về phi công trong giờ tiếng Anh." },
      { id: 'l5_s21_3_scientist',        en: "Scientist",           vi: "nhà khoa học",                      emoji: "🧑‍🔬", phonetic: "/ˈsaɪəntɪst/",        example_en: "We learn about scientist in English class.", example_vi: "Chúng mình học về nhà khoa học trong giờ tiếng Anh." },
      { id: 'l5_s21_4_engineer',         en: "Engineer",            vi: "kỹ sư",                             emoji: "👷",    phonetic: "/ˌendʒɪˈnɪə/",        example_en: "We learn about engineer in English class.", example_vi: "Chúng mình học về kỹ sư trong giờ tiếng Anh." },
      { id: 'l5_s21_5_astronaut',        en: "Astronaut",           vi: "phi hành gia",                      emoji: "👨‍🚀", phonetic: "/ˈæstrənɔːt/",        example_en: "We learn about astronaut in English class.", example_vi: "Chúng mình học về phi hành gia trong giờ tiếng Anh." },
      { id: 'l5_s21_6_dentist',          en: "Dentist",             vi: "nha sĩ",                            emoji: "🧑‍⚕️", phonetic: "/ˈdentɪst/",          example_en: "We learn about dentist in English class.", example_vi: "Chúng mình học về nha sĩ trong giờ tiếng Anh." },
      { id: 'l5_s21_7_police_station',   en: "Police station",      vi: "đồn cảnh sát",                      emoji: "🔮",    phonetic: "/pəˈliːs ˈsteɪʃn/",   example_en: "We learn about police station in English class.", example_vi: "Chúng mình học về đồn cảnh sát trong giờ tiếng Anh." },
      { id: 'l5_s21_8_space_station',    en: "Space station",       vi: "trạm vũ trụ",                       emoji: "🔮",    phonetic: "/speɪs ˈsteɪʃn/",     example_en: "We learn about space station in English class.", example_vi: "Chúng mình học về trạm vũ trụ trong giờ tiếng Anh." },
      { id: 'l5_s21_9_laboratory',       en: "Laboratory",          vi: "phòng thí nghiệm",                  emoji: "🔮",    phonetic: "/ləˈbɒrətri/",        example_en: "We learn about laboratory in English class.", example_vi: "Chúng mình học về phòng thí nghiệm trong giờ tiếng Anh." },
    ],
  },

  // ── 2. CÔNG NGHỆ & GIẢI TRÍ INTERNET (MỞ RỘNG TỪ UNIT 4 - SURF THE INTERNET) ──
  {
    id: 'lop5_c22_2_c_ng_ngh_gi_i_tr_i',
    gradeId: 'lop5',
    name_vi: "2. Công nghệ & Giải trí Internet (Mở rộng từ Unit 4 - surf the Internet)",
    name_en: "2. Công nghệ & Giải trí Internet (Mở rộng từ Unit 4 - surf the Internet)",
    emoji: '🔮',
    color: 'from-rose-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-orange-100',
    words: [
      { id: 'l5_s22_1_smartphone',       en: "Smartphone",          vi: "điện thoại thông minh",             emoji: "🍜",    phonetic: "/ˈsmɑːtfəʊn/",        example_en: "We learn about smartphone in English class.", example_vi: "Chúng mình học về điện thoại thông minh trong giờ tiếng Anh." },
      { id: 'l5_s22_2_laptop',           en: "Laptop",              vi: "máy tính xách tay",                 emoji: "💻",    phonetic: "/ˈlæptɒp/",           example_en: "We learn about laptop in English class.", example_vi: "Chúng mình học về máy tính xách tay trong giờ tiếng Anh." },
      { id: 'l5_s22_3_website',          en: "Website",             vi: "trang web",                         emoji: "🌐",    phonetic: "/ˈwebsaɪt/",          example_en: "We learn about website in English class.", example_vi: "Chúng mình học về trang web trong giờ tiếng Anh." },
      { id: 'l5_s22_4_send_an_email',    en: "Send an email",       vi: "gửi thư điện tử",                   emoji: "🔮",    phonetic: "/send æn ˈiːmeɪl/",   example_en: "We learn about send an email in English class.", example_vi: "Chúng mình học về gửi thư điện tử trong giờ tiếng Anh." },
      { id: 'l5_s22_5_social_media',     en: "Social media",        vi: "mạng xã hội",                       emoji: "📲",    phonetic: "/ˈsəʊʃl ˈmiːdiə/",    example_en: "We learn about social media in English class.", example_vi: "Chúng mình học về mạng xã hội trong giờ tiếng Anh." },
      { id: 'l5_s22_6_online_class',     en: "Online class",        vi: "lớp học trực tuyến",                emoji: "🔮",    phonetic: "/ˌɒnˈlaɪn klɑːs/",    example_en: "We learn about online class in English class.", example_vi: "Chúng mình học về lớp học trực tuyến trong giờ tiếng Anh." },
      { id: 'l5_s22_7_video_game',       en: "Video game",          vi: "trò chơi điện tử",                  emoji: "🎮",    phonetic: "/ˈvɪdiəʊ ɡeɪm/",      example_en: "We learn about video game in English class.", example_vi: "Chúng mình học về trò chơi điện tử trong giờ tiếng Anh." },
    ],
  },

  // ── 1. THIẾT BỊ & PHÒNG HỌC NÂNG CAO (MỞ RỘNG TỪ UNIT 6 & UNIT 8) ──
  {
    id: 'lop5_c23_1_thi_t_b_ph_ng_h_c_',
    gradeId: 'lop5',
    name_vi: "1. Thiết bị & Phòng học nâng cao (Mở rộng từ Unit 6 & Unit 8)",
    name_en: "1. Thiết bị & Phòng học nâng cao (Mở rộng từ Unit 6 & Unit 8)",
    emoji: '🔮',
    color: 'from-teal-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-cyan-100',
    words: [
      { id: 'l5_s23_1_canteen',          en: "Canteen",             vi: "nhà ăn trường học",                 emoji: "🔮",    phonetic: "/kænˈtiːn/",          example_en: "We learn about canteen in English class.", example_vi: "Chúng mình học về nhà ăn trường học trong giờ tiếng Anh." },
      { id: 'l5_s23_2_science_lab',      en: "Science lab",         vi: "phòng thí nghiệm khoa học",         emoji: "🔮",    phonetic: "/ˈsaɪəns læb/",       example_en: "We learn about science lab in English class.", example_vi: "Chúng mình học về phòng thí nghiệm khoa học trong giờ tiếng Anh." },
      { id: 'l5_s23_3_hall',             en: "Hall",                vi: "hội trường",                        emoji: "🔮",    phonetic: "/hɔːl/",              example_en: "We learn about hall in English class.", example_vi: "Chúng mình học về hội trường trong giờ tiếng Anh." },
      { id: 'l5_s23_4_compass',          en: "Compass",             vi: "cái com-pa",                        emoji: "🔮",    phonetic: "/ˈkʌmpəs/",           example_en: "We learn about compass in English class.", example_vi: "Chúng mình học về cái com-pa trong giờ tiếng Anh." },
      { id: 'l5_s23_5_calculator',       en: "Calculator",          vi: "máy tính cầm tay",                  emoji: "🔮",    phonetic: "/ˈkælkjuleɪtə/",      example_en: "We learn about calculator in English class.", example_vi: "Chúng mình học về máy tính cầm tay trong giờ tiếng Anh." },
      { id: 'l5_s23_6_textbook',         en: "Textbook",            vi: "sách giáo khoa",                    emoji: "🔮",    phonetic: "/ˈtekstbʊk/",         example_en: "We learn about textbook in English class.", example_vi: "Chúng mình học về sách giáo khoa trong giờ tiếng Anh." },
      { id: 'l5_s23_7_dictionary',       en: "Dictionary",          vi: "từ điển",                           emoji: "🔮",    phonetic: "/ˈdɪkʃənri/",         example_en: "We learn about dictionary in English class.", example_vi: "Chúng mình học về từ điển trong giờ tiếng Anh." },
      { id: 'l5_s23_8_corridor',         en: "Corridor",            vi: "hành lang",                         emoji: "🔮",    phonetic: "/ˈkɒrɪdɔː/",          example_en: "We learn about corridor in English class.", example_vi: "Chúng mình học về hành lang trong giờ tiếng Anh." },
    ],
  },

  // ── 2. THỰC PHẨM & NHÓM DINH DƯỠNG TÍCH HỢP (EXTENSION ACTIVITIES) ──
  {
    id: 'lop5_c24_2_th_c_ph_m_nh_m_din',
    gradeId: 'lop5',
    name_vi: "2. Thực phẩm & Nhóm dinh dưỡng tích hợp (Extension Activities)",
    name_en: "2. Thực phẩm & Nhóm dinh dưỡng tích hợp (Extension Activities)",
    emoji: '🔮',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l5_s24_1_dairy',            en: "Dairy",               vi: "Nhóm sản phẩm từ sữa",              emoji: "🔮",    phonetic: "/ˈdeəri/",            example_en: "We learn about dairy in English class.", example_vi: "Chúng mình học về nhóm sản phẩm từ sữa trong giờ tiếng Anh." },
      { id: 'l5_s24_2_protein',          en: "Protein",             vi: "Nhóm chất đạm",                     emoji: "🔮",    phonetic: "/ˈprəʊtiːn/",         example_en: "We learn about protein in English class.", example_vi: "Chúng mình học về nhóm chất đạm trong giờ tiếng Anh." },
      { id: 'l5_s24_3_grains',           en: "Grains",              vi: "Nhóm ngũ cốc",                      emoji: "🔮",    phonetic: "/ɡreɪnz/",            example_en: "We learn about grains in English class.", example_vi: "Chúng mình học về nhóm ngũ cốc trong giờ tiếng Anh." },
      { id: 'l5_s24_4_fruit_and_vegetabl', en: "Fruit and vegetables", vi: "Nhóm rau củ và trái cây",           emoji: "🔮",    phonetic: "/fruːt ænd ˈvedʒtəblz/", example_en: "We learn about fruit and vegetables in English class.", example_vi: "Chúng mình học về nhóm rau củ và trái cây trong giờ tiếng Anh." },
      { id: 'l5_s24_5_butter',           en: "Butter",              vi: "bơ",                                emoji: "🔮",    phonetic: "/ˈbʌtə/",             example_en: "We learn about butter in English class.", example_vi: "Chúng mình học về bơ trong giờ tiếng Anh." },
      { id: 'l5_s24_6_cereal',           en: "Cereal",              vi: "ngũ cốc",                           emoji: "🔮",    phonetic: "/ˈsɪəriəl/",          example_en: "We learn about cereal in English class.", example_vi: "Chúng mình học về ngũ cốc trong giờ tiếng Anh." },
      { id: 'l5_s24_7_yogurt',           en: "Yogurt",              vi: "sữa chua",                          emoji: "🔮",    phonetic: "/ˈjɒɡət/",            example_en: "We learn about yogurt in English class.", example_vi: "Chúng mình học về sữa chua trong giờ tiếng Anh." },
    ],
  },

  // ── 1. SỨC KHỎE, BỆNH TẬT & Y TẾ (MỞ RỘNG TỪ UNIT 14 & UNIT 15) ──
  {
    id: 'lop5_c25_1_s_c_kh_e_b_nh_t_t_',
    gradeId: 'lop5',
    name_vi: "1. Sức khỏe, Bệnh tật & Y tế (Mở rộng từ Unit 14 & Unit 15)",
    name_en: "1. Sức khỏe, Bệnh tật & Y tế (Mở rộng từ Unit 14 & Unit 15)",
    emoji: '🔮',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'l5_s25_1_fever',            en: "Fever",               vi: "cơn sốt",                           emoji: "🤒",    phonetic: "/ˈfiːvə/",            example_en: "We learn about fever in English class.", example_vi: "Chúng mình học về cơn sốt trong giờ tiếng Anh." },
      { id: 'l5_s25_2_backache',         en: "Backache",            vi: "đau lưng",                          emoji: "🔮",    phonetic: "/ˈbækeɪk/",           example_en: "We learn about backache in English class.", example_vi: "Chúng mình học về đau lưng trong giờ tiếng Anh." },
      { id: 'l5_s25_3_earache',          en: "Earache",             vi: "đau tai",                           emoji: "🔮",    phonetic: "/ˈɪəreɪk/",           example_en: "We learn about earache in English class.", example_vi: "Chúng mình học về đau tai trong giờ tiếng Anh." },
      { id: 'l5_s25_4_flu',              en: "Flu",                 vi: "bệnh cúm",                          emoji: "🔮",    phonetic: "/fluː/",              example_en: "We learn about flu in English class.", example_vi: "Chúng mình học về bệnh cúm trong giờ tiếng Anh." },
      { id: 'l5_s25_5_temperature',      en: "Temperature",         vi: "nhiệt độ / sự sốt",                 emoji: "🔮",    phonetic: "/ˈtemprətʃə/",        example_en: "We learn about temperature in English class.", example_vi: "Chúng mình học về nhiệt độ / sự sốt trong giờ tiếng Anh." },
      { id: 'l5_s25_6_healthy_diet',     en: "Healthy diet",        vi: "chế độ ăn uống lành mạnh",          emoji: "🔮",    phonetic: "/ˈhelθi ˈdaɪət/",     example_en: "We learn about healthy diet in English class.", example_vi: "Chúng mình học về chế độ ăn uống lành mạnh trong giờ tiếng Anh." },
      { id: 'l5_s25_7_vitamins',         en: "Vitamins",            vi: "các vi-ta-min",                     emoji: "🔮",    phonetic: "/ˈvɪtəmɪnz/",         example_en: "We learn about vitamins in English class.", example_vi: "Chúng mình học về các vi-ta-min trong giờ tiếng Anh." },
      { id: 'l5_s25_8_hospital',         en: "Hospital",            vi: "bệnh viện",                         emoji: "🏥",    phonetic: "/ˈhɒspɪtl/",          example_en: "We learn about hospital in English class.", example_vi: "Chúng mình học về bệnh viện trong giờ tiếng Anh." },
      { id: 'l5_s25_9_ambulance',        en: "Ambulance",           vi: "xe cấp cứu",                        emoji: "🚑",    phonetic: "/ˈæmbjələns/",        example_en: "We learn about ambulance in English class.", example_vi: "Chúng mình học về xe cấp cứu trong giờ tiếng Anh." },
      { id: 'l5_s25_10_prescription',    en: "Prescription",        vi: "đơn thuốc",                         emoji: "🔮",    phonetic: "/prɪˈskrɪpʃn/",       example_en: "We learn about prescription in English class.", example_vi: "Chúng mình học về đơn thuốc trong giờ tiếng Anh." },
    ],
  },

  // ── 2. VĂN HÓA, LỄ HỘI & ẨM THỰC TẾT VIỆT NAM (MỞ RỘNG TỪ UNIT 12 & UNIT 13) ──
  {
    id: 'lop5_c26_2_v_n_h_a_l_h_i_m_th',
    gradeId: 'lop5',
    name_vi: "2. Văn hóa, Lễ hội & Ẩm thực Tết Việt Nam (Mở rộng từ Unit 12 & Unit 13)",
    name_en: "2. Văn hóa, Lễ hội & Ẩm thực Tết Việt Nam (Mở rộng từ Unit 12 & Unit 13)",
    emoji: '🔮',
    color: 'from-purple-400 to-fuchsia-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-fuchsia-100',
    words: [
      { id: 'l5_s26_1_apricot_blossom',  en: "Apricot blossom",     vi: "hoa mai",                           emoji: "🌼",    phonetic: "/ˈeɪprɪkɒt ˈblɒsəm/", example_en: "We learn about apricot blossom in English class.", example_vi: "Chúng mình học về hoa mai trong giờ tiếng Anh." },
      { id: 'l5_s26_2_lucky_money',      en: "Lucky money",         vi: "tiền lì xì",                        emoji: "🧧",    phonetic: "/ˈlʌki ˈmʌni/",       example_en: "We learn about lucky money in English class.", example_vi: "Chúng mình học về tiền lì xì trong giờ tiếng Anh." },
      { id: 'l5_s26_3_family_reunion',   en: "Family reunion",      vi: "sự sum họp gia đình",               emoji: "🔮",    phonetic: "/ˈfæməli ˌriːˈjuːniən/", example_en: "We learn about family reunion in English class.", example_vi: "Chúng mình học về sự sum họp gia đình trong giờ tiếng Anh." },
      { id: 'l5_s26_4_five_fruit_tray',  en: "Five-fruit tray",     vi: "mâm ngũ quả",                       emoji: "🔮",    phonetic: "/faɪv fruːt treɪ/",   example_en: "We learn about five-fruit tray in English class.", example_vi: "Chúng mình học về mâm ngũ quả trong giờ tiếng Anh." },
      { id: 'l5_s26_5_hung_kings_temple_', en: "Hung Kings Temple Festival", vi: "Lễ hội Đền Hùng",                   emoji: "👑",    phonetic: "/hʌŋ kɪŋz ˈtempl ˈfestɪvl/", example_en: "We learn about hung kings temple festival in English class.", example_vi: "Chúng mình học về lễ hội đền hùng trong giờ tiếng Anh." },
      { id: 'l5_s26_6_water_puppet_show', en: "Water puppet show",   vi: "Múa rối nước",                      emoji: "🔮",    phonetic: "/ˈwɔːtə ˈpʌpɪt ʃəʊ/", example_en: "We learn about water puppet show in English class.", example_vi: "Chúng mình học về múa rối nước trong giờ tiếng Anh." },
      { id: 'l5_s26_7_beef_noodle_soup', en: "Beef noodle soup",    vi: "phở bò / bún bò",                   emoji: "🔮",    phonetic: "/biːf ˈnuːdl suːp/",  example_en: "We learn about beef noodle soup in English class.", example_vi: "Chúng mình học về phở bò / bún bò trong giờ tiếng Anh." },
      { id: 'l5_s26_8_bun_cha',          en: "Bun cha",             vi: "bún chả",                           emoji: "🔮",    phonetic: "/bʊn tʃɑː/",          example_en: "We learn about bun cha in English class.", example_vi: "Chúng mình học về bún chả trong giờ tiếng Anh." },
    ],
  },

  // ── 1. MÔI TRƯỜNG & THẾ GIỚI TỰ NHIÊN (MỞ RỘNG TỪ UNIT 16 & UNIT 20) ──
  {
    id: 'lop5_c27_1_m_i_tr_ng_th_gi_i_',
    gradeId: 'lop5',
    name_vi: "1. Môi trường & Thế giới tự nhiên (Mở rộng từ Unit 16 & Unit 20)",
    name_en: "1. Môi trường & Thế giới tự nhiên (Mở rộng từ Unit 16 & Unit 20)",
    emoji: '🔮',
    color: 'from-fuchsia-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
    words: [
      { id: 'l5_s27_1_volcano',          en: "Volcano",             vi: "núi lửa",                           emoji: "🌋",    phonetic: "/vɒlˈkeɪnəʊ/",        example_en: "We learn about volcano in English class.", example_vi: "Chúng mình học về núi lửa trong giờ tiếng Anh." },
      { id: 'l5_s27_2_waterfall',        en: "Waterfall",           vi: "thác nước",                         emoji: "🌊",    phonetic: "/ˈwɔːtəfɔːl/",        example_en: "We learn about waterfall in English class.", example_vi: "Chúng mình học về thác nước trong giờ tiếng Anh." },
      { id: 'l5_s27_3_rainforest',       en: "Rainforest",          vi: "rừng mưa nhiệt đới",                emoji: "🌴",    phonetic: "/ˈreɪnfɒrɪst/",       example_en: "We learn about rainforest in English class.", example_vi: "Chúng mình học về rừng mưa nhiệt đới trong giờ tiếng Anh." },
      { id: 'l5_s27_4_desert',           en: "Desert",              vi: "sa mạc",                            emoji: "🏜️",   phonetic: "/ˈdezət/",            example_en: "We learn about desert in English class.", example_vi: "Chúng mình học về sa mạc trong giờ tiếng Anh." },
      { id: 'l5_s27_5_protect_the_enviro', en: "Protect the environment", vi: "bảo vệ môi trường",                 emoji: "🔮",    phonetic: "/prəˈtekt ði ɪnˈvaɪrənmənt/", example_en: "We learn about protect the environment in English class.", example_vi: "Chúng mình học về bảo vệ môi trường trong giờ tiếng Anh." },
      { id: 'l5_s27_6_recycle',          en: "Recycle",             vi: "tái chế",                           emoji: "🔮",    phonetic: "/ˌriːˈsaɪkl/",        example_en: "We learn about recycle in English class.", example_vi: "Chúng mình học về tái chế trong giờ tiếng Anh." },
    ],
  },

  // ── 2. TRUYỆN CỔ TÍCH & NHÂN VẬT DÂN GIAN (MỞ RỘNG TỪ UNIT 17) ──
  {
    id: 'lop5_c28_2_truy_n_c_t_ch_nh_n',
    gradeId: 'lop5',
    name_vi: "2. Truyện cổ tích & Nhân vật dân gian (Mở rộng từ Unit 17)",
    name_en: "2. Truyện cổ tích & Nhân vật dân gian (Mở rộng từ Unit 17)",
    emoji: '🔮',
    color: 'from-indigo-400 to-violet-500',
    gradient: 'bg-gradient-to-br from-indigo-100 to-violet-100',
    words: [
      { id: 'l5_s28_1_fairy_tale',       en: "Fairy tale",          vi: "truyện cổ tích",                    emoji: "🧚",    phonetic: "/ˈfeəri teɪl/",       example_en: "We learn about fairy tale in English class.", example_vi: "Chúng mình học về truyện cổ tích trong giờ tiếng Anh." },
      { id: 'l5_s28_2_legend',           en: "Legend",              vi: "truyền thuyết",                     emoji: "🔮",    phonetic: "/ˈledʒənd/",          example_en: "We learn about legend in English class.", example_vi: "Chúng mình học về truyền thuyết trong giờ tiếng Anh." },
      { id: 'l5_s28_3_prince',           en: "Prince",              vi: "hoàng tử",                          emoji: "🤴",    phonetic: "/prɪns/",             example_en: "We learn about prince in English class.", example_vi: "Chúng mình học về hoàng tử trong giờ tiếng Anh." },
      { id: 'l5_s28_4_princess',         en: "Princess",            vi: "công chúa",                         emoji: "🤴",    phonetic: "/prɪnˈses/",          example_en: "We learn about princess in English class.", example_vi: "Chúng mình học về công chúa trong giờ tiếng Anh." },
      { id: 'l5_s28_5_king',             en: "King",                vi: "nhà vua",                           emoji: "👑",    phonetic: "/kɪŋ/",               example_en: "We learn about king in English class.", example_vi: "Chúng mình học về nhà vua trong giờ tiếng Anh." },
      { id: 'l5_s28_6_queen',            en: "Queen",               vi: "hoàng hậu",                         emoji: "👸",    phonetic: "/kwiːn/",             example_en: "We learn about queen in English class.", example_vi: "Chúng mình học về hoàng hậu trong giờ tiếng Anh." },
      { id: 'l5_s28_7_hero',             en: "Hero",                vi: "anh hùng",                          emoji: "🔮",    phonetic: "/ˈhɪərəʊ/",           example_en: "We learn about hero in English class.", example_vi: "Chúng mình học về anh hùng trong giờ tiếng Anh." },
      { id: 'l5_s28_8_giant',            en: "Giant",               vi: "người khổng lồ",                    emoji: "🔮",    phonetic: "/ˈdʒaɪənt/",          example_en: "We learn about giant in English class.", example_vi: "Chúng mình học về người khổng lồ trong giờ tiếng Anh." },
      { id: 'l5_s28_9_dragon',           en: "Dragon",              vi: "con rồng",                          emoji: "🐲",    phonetic: "/ˈdræɡən/",           example_en: "We learn about dragon in English class.", example_vi: "Chúng mình học về con rồng trong giờ tiếng Anh." },
      { id: 'l5_s28_10_greedy',          en: "Greedy",              vi: "tham lam",                          emoji: "🔮",    phonetic: "/ˈɡriːdi/",           example_en: "We learn about greedy in English class.", example_vi: "Chúng mình học về tham lam trong giờ tiếng Anh." },
      { id: 'l5_s28_11_brave',           en: "Brave",               vi: "dũng cảm",                          emoji: "🔮",    phonetic: "/breɪv/",             example_en: "We learn about brave in English class.", example_vi: "Chúng mình học về dũng cảm trong giờ tiếng Anh." },
    ],
  },

  // ── 3. PHƯƠNG TIỆN & DU LỊCH NÂNG CAO (MỞ RỘNG TỪ UNIT 11 & UNIT 18) ──
  {
    id: 'lop5_c29_3_ph_ng_ti_n_du_l_ch',
    gradeId: 'lop5',
    name_vi: "3. Phương tiện & Du lịch nâng cao (Mở rộng từ Unit 11 & Unit 18)",
    name_en: "3. Phương tiện & Du lịch nâng cao (Mở rộng từ Unit 11 & Unit 18)",
    emoji: '🔮',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l5_s29_1_underground',      en: "Underground",         vi: "tàu điện ngầm",                     emoji: "🚇",    phonetic: "/ˌʌndəˈɡraʊnd/",      example_en: "We learn about underground in English class.", example_vi: "Chúng mình học về tàu điện ngầm trong giờ tiếng Anh." },
      { id: 'l5_s29_2_helicopter',       en: "Helicopter",          vi: "máy bay trực thăng",                emoji: "🚁",    phonetic: "/ˈhelɪkɒptə/",        example_en: "We learn about helicopter in English class.", example_vi: "Chúng mình học về máy bay trực thăng trong giờ tiếng Anh." },
      { id: 'l5_s29_3_cruise_ship',      en: "Cruise ship",         vi: "du thuyền",                         emoji: "🛳️",   phonetic: "/kruːz ʃɪp/",         example_en: "We learn about cruise ship in English class.", example_vi: "Chúng mình học về du thuyền trong giờ tiếng Anh." },
      { id: 'l5_s29_4_passenger',        en: "Passenger",           vi: "hành khách",                        emoji: "🔮",    phonetic: "/ˈpæsɪndʒə/",         example_en: "We learn about passenger in English class.", example_vi: "Chúng mình học về hành khách trong giờ tiếng Anh." },
      { id: 'l5_s29_5_luggage',          en: "Luggage",             vi: "hành lý",                           emoji: "🔮",    phonetic: "/ˈlʌɡɪdʒ/",           example_en: "We learn about luggage in English class.", example_vi: "Chúng mình học về hành lý trong giờ tiếng Anh." },
      { id: 'l5_s29_6_airport',          en: "Airport",             vi: "sân bay",                           emoji: "🛫",    phonetic: "/ˈeəpɔːt/",           example_en: "We learn about airport in English class.", example_vi: "Chúng mình học về sân bay trong giờ tiếng Anh." },
      { id: 'l5_s29_7_passport',         en: "Passport",            vi: "hộ chiếu",                          emoji: "🛂",    phonetic: "/ˈpɑːspɔːt/",         example_en: "We learn about passport in English class.", example_vi: "Chúng mình học về hộ chiếu trong giờ tiếng Anh." },
    ],
  },

  // ── 4. DI TÍCH LỊCH SỬ & DANH LAM THẮNG CẢNH VIỆT NAM (MỞ RỘNG TỪ UNIT 10 & UNIT 19) ──
  {
    id: 'lop5_c30_4_di_t_ch_l_ch_s_dan',
    gradeId: 'lop5',
    name_vi: "4. Di tích lịch sử & Danh lam thắng cảnh Việt Nam (Mở rộng từ Unit 10 & Unit 19)",
    name_en: "4. Di tích lịch sử & Danh lam thắng cảnh Việt Nam (Mở rộng từ Unit 10 & Unit 19)",
    emoji: '🔮',
    color: 'from-rose-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-orange-100',
    words: [
      { id: 'l5_s30_1_temple_of_literatu', en: "Temple of Literature", vi: "Văn Miếu - Quốc Tử Giám",           emoji: "🔮",    phonetic: "/ˈtempl əv ˈlɪtrətʃə/", example_en: "We learn about temple of literature in English class.", example_vi: "Chúng mình học về văn miếu - quốc tử giám trong giờ tiếng Anh." },
      { id: 'l5_s30_2_ho_chi_minh_mausol', en: "Ho Chi Minh Mausoleum", vi: "Lăng Chủ tịch Hồ Chí Minh",         emoji: "🔮",    phonetic: "/həʊ tʃiː mɪn ˌmɔːsəˈliːəm/", example_en: "We learn about ho chi minh mausoleum in English class.", example_vi: "Chúng mình học về lăng chủ tịch hồ chí minh trong giờ tiếng Anh." },
      { id: 'l5_s30_3_cuc_phuong_nationa', en: "Cuc Phuong National Park", vi: "Vườn quốc gia Cúc Phương",          emoji: "🔮",    phonetic: "/kʊk fʊəŋ ˈnæʃnəl pɑːk/", example_en: "We learn about cuc phuong national park in English class.", example_vi: "Chúng mình học về vườn quốc gia cúc phương trong giờ tiếng Anh." },
      { id: 'l5_s30_4_fansipan_peak',    en: "Fansipan Peak",       vi: "Đỉnh Phan-xi-păng",                 emoji: "🔮",    phonetic: "/fænˈsɪpæn piːk/",    example_en: "We learn about fansipan peak in English class.", example_vi: "Chúng mình học về đỉnh phan-xi-păng trong giờ tiếng Anh." },
      { id: 'l5_s30_5_son_doong_cave',   en: "Son Doong Cave",      vi: "Hang Sơn Đoòng",                    emoji: "🔮",    phonetic: "/sən dʊŋ keɪv/",      example_en: "We learn about son doong cave in English class.", example_vi: "Chúng mình học về hang sơn đoòng trong giờ tiếng Anh." },
      { id: 'l5_s30_6_trang_an_landscape', en: "Trang An Landscape Complex", vi: "Quần thể danh thắng Tràng An",      emoji: "🧢",    phonetic: "/trɑːŋ æn ˈlændskeɪp ˈkɒmpleks/", example_en: "We learn about trang an landscape complex in English class.", example_vi: "Chúng mình học về quần thể danh thắng tràng an trong giờ tiếng Anh." },
      { id: 'l5_s30_7_independence_palac', en: "Independence Palace", vi: "Dinh Độc Lập",                      emoji: "🔮",    phonetic: "/ˌɪndɪˈpendəns ˈpælɪs/", example_en: "We learn about independence palace in English class.", example_vi: "Chúng mình học về dinh độc lập trong giờ tiếng Anh." },
    ],
  },
];

let _cachedRaw: string | null = null;
let _cachedCats: CategoryWithGrade[] = [];

const COMMON_FALLBACK: Record<string, Partial<Word>> = {
  month: {
    en: 'month',
    vi: 'Tháng',
    phonetic: '/mʌnθ/',
    emoji: '📅',
    example_en: 'There are twelve months in a year.',
    example_vi: 'Một năm có mười hai tháng.',
  },
  year: {
    en: 'year',
    vi: 'Năm',
    phonetic: '/jɪər/',
    emoji: '🗓️',
    example_en: 'Happy New Year!',
    example_vi: 'Chúc mừng năm mới!',
  },
  week: {
    en: 'week',
    vi: 'Tuần',
    phonetic: '/wiːk/',
    emoji: '📆',
    example_en: 'There are seven days in a week.',
    example_vi: 'Một tuần có bảy ngày.',
  },
  day: {
    en: 'day',
    vi: 'Ngày',
    phonetic: '/deɪ/',
    emoji: '☀️',
    example_en: 'Have a wonderful day!',
    example_vi: 'Chúc bé một ngày tuyệt vời!',
  },
};

export function getCategoryById(id: string): CategoryWithGrade | undefined {
  const builtin = CATEGORIES.find((c) => c.id === id);
  if (builtin) return builtin;

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vocakids_custom_categories_v1');
      if (raw) {
        if (raw !== _cachedRaw) {
          _cachedRaw = raw;
          const customCats = JSON.parse(raw) as any[];
          _cachedCats = customCats.map((c) => {
            const healedWords = (c.words || []).map((w: Word) => {
              let en = w.en || '';
              let phonetic = w.phonetic || '';
              if (!en.trim() && phonetic.includes('mʌnθ')) {
                en = 'month';
              }
              const key = en.toLowerCase().trim();
              const fb = COMMON_FALLBACK[key];
              return {
                ...w,
                en: en || (fb?.en ?? 'word'),
                vi: w.vi || fb?.vi || '',
                phonetic: (phonetic && phonetic.trim()) ? phonetic : (fb?.phonetic || ''),
                emoji: (w.emoji && w.emoji !== '📝') ? w.emoji : (fb?.emoji || w.emoji || '📝'),
                example_en: w.example_en || fb?.example_en || '',
                example_vi: w.example_vi || fb?.example_vi || '',
              };
            });

            return {
              ...c,
              name_vi: c.name_vi?.trim() || 'Từ vựng của bé',
              name_en: c.name_en?.trim() || c.name_vi?.trim() || 'Custom Words',
              emoji: c.emoji || '📚',
              words: healedWords,
              gradeId: c.gradeId || 'custom',
            };
          });
        }
        return _cachedCats.find((c) => c.id === id);
      }
    } catch {
      /* ignore */
    }
  }

  return undefined;
}


export function getAllWords() {
  return CATEGORIES.flatMap((c) => c.words.map((w) => ({ ...w, catId: c.id })));
}
