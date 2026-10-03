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
  // LỚP 1 – SGK Tiếng Anh 1 Global Success
  // ════════════════════════════════════════

  // ── TRƯỜNG & LỚP HỌC (SGK Unit 1, 6 & 13) ────
  {
    id: 'lop1_school',
    gradeId: 'lop1',
    name_vi: 'Trường & Lớp Học',
    name_en: 'School & Classroom',
    emoji: '🏫',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'ball',      en: 'Ball',     vi: 'Quả bóng',     emoji: '⚽', phonetic: '/bɔːl/',         example_en: 'Look at the ball!',                 example_vi: 'Nhìn quả bóng kìa!' },
      { id: 'bike',      en: 'Bike',     vi: 'Xe đạp',       emoji: '🚲', phonetic: '/baɪk/',         example_en: 'I have a bike.',                    example_vi: 'Tôi có một chiếc xe đạp.' },
      { id: 'book_lop1', en: 'Book',     vi: 'Quyển sách',   emoji: '📚', phonetic: '/bʊk/',          example_en: 'Open your book, please.',           example_vi: 'Mời các em mở sách ra nhé.' },
      { id: 'bell',      en: 'Bell',     vi: 'Cái chuông',   emoji: '🔔', phonetic: '/bel/',          example_en: 'Listen to the bell.',               example_vi: 'Lắng nghe tiếng chuông nhé.' },
      { id: 'pen',       en: 'Pen',      vi: 'Bút mực',      emoji: '🖊️', phonetic: '/pen/',          example_en: 'It is a red pen.',                  example_vi: 'Đó là một chiếc bút mực đỏ.' },
      { id: 'pencil_l1', en: 'Pencil',   vi: 'Bút chì',      emoji: '✏️', phonetic: '/ˈpensəl/',      example_en: 'This is my pencil.',                example_vi: 'Đây là bút chì của tôi.' },
      { id: 'desk_lop1', en: 'Desk',     vi: 'Bàn học',      emoji: '🪑', phonetic: '/desk/',         example_en: 'Sit at your desk.',                 example_vi: 'Hãy ngồi vào bàn học nhé.' },
      { id: 'bag_lop1',  en: 'Bag',      vi: 'Cặp sách',     emoji: '🎒', phonetic: '/bæɡ/',          example_en: 'Put the book in the bag.',          example_vi: 'Cất sách vào cặp nhé.' },
      { id: 'hi',        en: 'Hi',       vi: 'Xin chào',     emoji: '👋', phonetic: '/haɪ/',          example_en: 'Hi, I am Bill!',                    example_vi: 'Chào, mình là Bill!' },
      { id: 'bye',       en: 'Bye',      vi: 'Tạm biệt',     emoji: '👋', phonetic: '/baɪ/',          example_en: 'Goodbye, see you again!',           example_vi: 'Tạm biệt, hẹn gặp lại bạn!' },
    ],
  },

  // ── MÓN NGON & CỬA HÀNG (SGK Unit 2, 3, 5 & 9) ──
  {
    id: 'lop1_food_shop',
    gradeId: 'lop1',
    name_vi: 'Món Ngon & Cửa Hàng',
    name_en: 'Food & Shop',
    emoji: '🍎',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'cake',      en: 'Cake',     vi: 'Bánh ngọt',    emoji: '🍰', phonetic: '/keɪk/',         example_en: 'I want a piece of cake.',           example_vi: 'Tôi muốn một miếng bánh ngọt.' },
      { id: 'cup',       en: 'Cup',      vi: 'Cái cốc',      emoji: '☕', phonetic: '/kʌp/',          example_en: 'A cup and a cake.',                 example_vi: 'Một cái cốc và một cái bánh.' },
      { id: 'apple',     en: 'Apple',    vi: 'Quả táo',      emoji: '🍎', phonetic: '/ˈæpəl/',        example_en: 'There is an apple on the table.',   example_vi: 'Có một quả táo trên bàn.' },
      { id: 'chicken',   en: 'Chicken',  vi: 'Thịt gà',      emoji: '🍗', phonetic: '/ˈtʃɪkɪn/',      example_en: 'I like eating chicken.',            example_vi: 'Tôi thích ăn thịt gà.' },
      { id: 'chips',     en: 'Chips',    vi: 'Khoai tây chiên', emoji: '🍟', phonetic: '/tʃɪps/',     example_en: 'Fish and chips are tasty.',         example_vi: 'Cá và khoai tây chiên rất ngon.' },
      { id: 'fish_lop1', en: 'Fish',     vi: 'Con cá',       emoji: '🐟', phonetic: '/fɪʃ/',          example_en: 'I eat fish for dinner.',            example_vi: 'Tôi ăn cá vào bữa tối.' },
      { id: 'milk_lop1', en: 'Milk',     vi: 'Sữa tươi',     emoji: '🥛', phonetic: '/mɪlk/',         example_en: 'I drink milk every morning.',       example_vi: 'Tôi uống sữa mỗi sáng.' },
      { id: 'noodles',   en: 'Noodles',  vi: 'Mì sợi',       emoji: '🍜', phonetic: '/ˈnuːdəlz/',     example_en: 'Noodles are in the bowl.',          example_vi: 'Mì sợi ở trong tô.' },
      { id: 'clock',     en: 'Clock',    vi: 'Đồng hồ',      emoji: '⏰', phonetic: '/klɒk/',         example_en: 'The clock is on the wall.',         example_vi: 'Đồng hồ treo trên tường.' },
      { id: 'pot',       en: 'Pot',      vi: 'Cái nồi',      emoji: '🍲', phonetic: '/pɒt/',          example_en: 'Mom is cooking with a pot.',        example_vi: 'Mẹ đang nấu ăn bằng cái nồi.' },
    ],
  },

  // ── NHÀ CỬA & ĐỒ DÙNG (SGK Unit 4, 11 & 16) ─
  {
    id: 'lop1_home_bedroom',
    gradeId: 'lop1',
    name_vi: 'Nhà Cửa & Đồ Dùng',
    name_en: 'Home & Things',
    emoji: '🏡',
    color: 'from-sky-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-indigo-100',
    words: [
      { id: 'door',      en: 'Door',     vi: 'Cửa ra vào',   emoji: '🚪', phonetic: '/dɔːr/',         example_en: 'Open the door, please.',            example_vi: 'Xin hãy mở cửa ra.' },
      { id: 'window',    en: 'Window',   vi: 'Cửa sổ',       emoji: '🪟', phonetic: '/ˈwɪndoʊ/',      example_en: 'Look out the window.',              example_vi: 'Hãy nhìn ra ngoài cửa sổ.' },
      { id: 'water',     en: 'Water',    vi: 'Nước uống',    emoji: '💧', phonetic: '/ˈwɔːtər/',      example_en: 'Drink a glass of water.',           example_vi: 'Hãy uống một ly nước lọc.' },
      { id: 'wash',      en: 'Wash',     vi: 'Rửa tay / Giặt',emoji: '🧼', phonetic: '/wɒʃ/',         example_en: 'Wash your hands clean.',            example_vi: 'Hãy rửa tay thật sạch nhé.' },
      { id: 'car_lop1',  en: 'Car',      vi: 'Xe ô tô',      emoji: '🚗', phonetic: '/kɑːr/',         example_en: 'I see a red car.',                  example_vi: 'Tôi thấy một chiếc ô tô đỏ.' },
      { id: 'bus_lop1',  en: 'Bus',      vi: 'Xe buýt',      emoji: '🚌', phonetic: '/bʌs/',          example_en: 'We wait at the bus stop.',          example_vi: 'Chúng tôi đợi ở trạm xe buýt.' },
      { id: 'truck',     en: 'Truck',    vi: 'Xe tải',       emoji: '🚚', phonetic: '/trʌk/',         example_en: 'The big truck carries boxes.',      example_vi: 'Chiếc xe tải to chở các thùng hàng.' },
      { id: 'sun',       en: 'Sun',      vi: 'Mặt trời',     emoji: '☀️', phonetic: '/sʌn/',          example_en: 'The sun is shining bright.',        example_vi: 'Mặt trời đang chiếu sáng rực rỡ.' },
      { id: 'run',       en: 'Run',      vi: 'Chạy nhanh',   emoji: '🏃', phonetic: '/rʌn/',          example_en: 'Run fast to the finish line!',      example_vi: 'Chạy thật nhanh về đích nào!' },
      { id: 'hat',       en: 'Hat',      vi: 'Cái mũ',       emoji: '👒', phonetic: '/hæt/',          example_en: 'Put on your hat.',                  example_vi: 'Hãy đội mũ của bạn lên nhé.' },
    ],
  },

  // ── VƯỜN CÂY & SỞ THÚ (SGK Unit 7, 8, 10 & 14) ─
  {
    id: 'lop1_nature_zoo',
    gradeId: 'lop1',
    name_vi: 'Vườn Cây & Sở Thú',
    name_en: 'Garden & Zoo Animals',
    emoji: '🐾',
    color: 'from-emerald-400 to-green-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-green-100',
    words: [
      { id: 'garden',    en: 'Garden',   vi: 'Khu vườn',     emoji: '🌳', phonetic: '/ˈɡɑːrdən/',     example_en: 'There is a beautiful garden.',      example_vi: 'Có một khu vườn rất đẹp.' },
      { id: 'gate',      en: 'Gate',     vi: 'Cổng vườn',    emoji: '⛩️', phonetic: '/ɡeɪt/',         example_en: 'Close the garden gate.',            example_vi: 'Hãy đóng cổng vườn lại nhé.' },
      { id: 'goat',      en: 'Goat',     vi: 'Con dê',       emoji: '🐐', phonetic: '/ɡoʊt/',         example_en: 'The goat is eating green grass.',   example_vi: 'Con dê đang ăn cỏ xanh.' },
      { id: 'duck_lop1', en: 'Duck',     vi: 'Con vịt',      emoji: '🦆', phonetic: '/dʌk/',          example_en: 'The duck swims in the pond.',       example_vi: 'Con vịt bơi trong ao nước.' },
      { id: 'horse',     en: 'Horse',    vi: 'Con ngựa',     emoji: '🐎', phonetic: '/hɔːrs/',        example_en: 'The horse runs very fast.',         example_vi: 'Con ngựa chạy rất nhanh.' },
      { id: 'monkey_l1', en: 'Monkey',   vi: 'Con khỉ',      emoji: '🐒', phonetic: '/ˈmʌŋki/',       example_en: 'The monkey loves bananas.',         example_vi: 'Con khỉ rất thích chuối.' },
      { id: 'mouse',     en: 'Mouse',    vi: 'Con chuột',    emoji: '🐭', phonetic: '/maʊs/',         example_en: 'The little mouse is hiding.',       example_vi: 'Chú chuột nhỏ đang trốn.' },
      { id: 'tiger_l1',  en: 'Tiger',    vi: 'Con hổ',       emoji: '🐯', phonetic: '/ˈtaɪɡər/',      example_en: 'The tiger is big and strong.',      example_vi: 'Con hổ to lớn và dũng mãnh.' },
      { id: 'turtle',    en: 'Turtle',   vi: 'Con rùa',      emoji: '🐢', phonetic: '/ˈtɜːrtəl/',     example_en: 'The turtle walks slowly.',          example_vi: 'Con rùa bò chầm chậm.' },
      { id: 'teddy_bear',en: 'Teddy Bear',vi: 'Gấu bông',   emoji: '🧸', phonetic: '/ˈtedi beər/',   example_en: 'I hug my teddy bear when sleeping.', example_vi: 'Tôi ôm gấu bông khi đi ngủ.' },
    ],
  },

  // ── CƠ THỂ & VUI CHƠI (SGK Unit 8 & 15) ────────
  {
    id: 'lop1_body_play',
    gradeId: 'lop1',
    name_vi: 'Cơ Thể & Vui Chơi',
    name_en: 'Body & Play',
    emoji: '⚽',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'head_lop1', en: 'Head',     vi: 'Cái đầu',      emoji: '👤', phonetic: '/hed/',          example_en: 'Touch your head, please.',          example_vi: 'Hãy chạm vào đầu của bạn nhé.' },
      { id: 'hair_lop1', en: 'Hair',     vi: 'Mái tóc',      emoji: '💇', phonetic: '/heər/',         example_en: 'Touch your hair.',                  example_vi: 'Hãy chạm vào mái tóc của bạn.' },
      { id: 'hand_lop1', en: 'Hand',     vi: 'Bàn tay',      emoji: '✋', phonetic: '/hænd/',         example_en: 'Clap your hands together.',         example_vi: 'Hãy vỗ hai tay vào nhau nào.' },
      { id: 'face',      en: 'Face',     vi: 'Khuôn mặt',    emoji: '😊', phonetic: '/feɪs/',         example_en: 'Wash your face in the morning.',    example_vi: 'Hãy rửa mặt vào buổi sáng nhé.' },
      { id: 'foot_lop1', en: 'Foot',     vi: 'Bàn chân',     emoji: '🦶', phonetic: '/fʊt/',          example_en: 'Kick the ball with your foot.',     example_vi: 'Đá bóng bằng bàn chân của bạn.' },
      { id: 'football',  en: 'Football', vi: 'Bóng đá',      emoji: '⚽', phonetic: '/ˈfʊtbɔːl/',     example_en: 'We play football after school.',    example_vi: 'Chúng mình chơi bóng đá sau giờ học.' },
      { id: 'father',    en: 'Father',   vi: 'Người bố',     emoji: '👨', phonetic: '/ˈfɑːðər/',      example_en: 'This is my father.',                example_vi: 'Đây là bố của tôi.' },
      { id: 'mother',    en: 'Mother',   vi: 'Người mẹ',     emoji: '👩', phonetic: '/ˈmʌðər/',      example_en: 'I love my mother very much.',       example_vi: 'Tôi yêu mẹ của tôi rất nhiều.' },
      { id: 'girl',      en: 'Girl',     vi: 'Cô bé',        emoji: '👧', phonetic: '/ɡɜːrl/',        example_en: 'The girl is smiling happily.',      example_vi: 'Cô bé đang cười vui vẻ.' },
      { id: 'lake',      en: 'Lake',     vi: 'Hồ nước',      emoji: '🌊', phonetic: '/leɪk/',         example_en: 'The lake is very calm and blue.',   example_vi: 'Hồ nước rất phẳng lặng và trong xanh.' },
    ],
  },

  // ── TRANSPORT ────────────────────────────
  {
    id: 'transport',
    gradeId: 'lop2',
    name_vi: 'Phương Tiện',
    name_en: 'Transport',
    emoji: '🚗',
    color: 'from-cyan-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-teal-100',
    words: [
      { id: 'car',        en: 'Car',        vi: 'Ô tô',        emoji: '🚗', phonetic: '/kɑːr/',            example_en: 'My dad drives a red car.',          example_vi: 'Bố tôi lái một chiếc ô tô đỏ.' },
      { id: 'bus',        en: 'Bus',        vi: 'Xe buýt',     emoji: '🚌', phonetic: '/bʌs/',             example_en: 'We take the bus to school.',         example_vi: 'Chúng ta đi xe buýt đến trường.' },
      { id: 'bicycle',    en: 'Bicycle',    vi: 'Xe đạp',      emoji: '🚲', phonetic: '/ˈbaɪsɪkəl/',     example_en: 'I ride my bicycle in the park.',     example_vi: 'Tôi đạp xe trong công viên.' },
      { id: 'airplane',   en: 'Airplane',   vi: 'Máy bay',     emoji: '✈️', phonetic: '/ˈɛrpleɪn/',      example_en: 'The airplane flies in the sky.',     example_vi: 'Máy bay bay trên bầu trời.' },
      { id: 'ship',       en: 'Ship',       vi: 'Tàu thủy',    emoji: '🚢', phonetic: '/ʃɪp/',            example_en: 'The big ship sails on the sea.',     example_vi: 'Con tàu lớn đi trên biển.' },
      { id: 'train',      en: 'Train',      vi: 'Tàu hỏa',     emoji: '🚂', phonetic: '/treɪn/',          example_en: 'The train travels very fast.',       example_vi: 'Tàu hỏa đi rất nhanh.' },
      { id: 'motorcycle', en: 'Motorcycle', vi: 'Xe máy',      emoji: '🏍️', phonetic: '/ˈmoʊtərsaɪkəl/',example_en: 'He rides a motorcycle to work.',     example_vi: 'Anh ấy đi xe máy đi làm.' },
      { id: 'helicopter', en: 'Helicopter', vi: 'Trực thăng',  emoji: '🚁', phonetic: '/ˈhɛlɪkɒptər/',   example_en: 'The helicopter flies over the city.',example_vi: 'Trực thăng bay trên thành phố.' },
      { id: 'boat',       en: 'Boat',       vi: 'Thuyền',      emoji: '⛵', phonetic: '/boʊt/',           example_en: 'We go fishing on a small boat.',     example_vi: 'Chúng ta đi câu cá trên chiếc thuyền nhỏ.' },
      { id: 'truck',      en: 'Truck',      vi: 'Xe tải',      emoji: '🚚', phonetic: '/trʌk/',           example_en: 'The truck carries heavy goods.',     example_vi: 'Xe tải chở hàng hóa nặng.' },
    ],
  },

  // ════════════════════════════════════════
  // LỚP 3
  // ════════════════════════════════════════

  // ── SCHOOL (Lớp 3) ────────────────────────────
  {
    id: 'school',
    gradeId: 'lop3',
    name_vi: 'Trường Học',
    name_en: 'School',
    emoji: '🏫',
    color: 'from-green-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-green-100 to-teal-100',
    words: [
      { id: 'school',      en: 'School',      vi: 'Trường học',    emoji: '🏫', phonetic: '/skuːl/',         example_en: 'I go to school every day.',              example_vi: 'Tôi đến trường mỗi ngày.' },
      { id: 'classroom',   en: 'Classroom',   vi: 'Lớp học',       emoji: '📚', phonetic: '/ˈklɑːsruːm/',   example_en: 'Our classroom is very clean.',           example_vi: 'Lớp học của chúng tôi rất sạch.' },
      { id: 'teacher',     en: 'Teacher',     vi: 'Giáo viên',     emoji: '👩‍🏫', phonetic: '/ˈtiːtʃər/',    example_en: 'My teacher is very kind.',               example_vi: 'Giáo viên của tôi rất tốt bụng.' },
      { id: 'student',     en: 'Student',     vi: 'Học sinh',      emoji: '🧑‍🎓', phonetic: '/ˈstuːdənt/',   example_en: 'She is a good student.',                 example_vi: 'Cô ấy là một học sinh giỏi.' },
      { id: 'book',        en: 'Book',        vi: 'Quyển sách',    emoji: '📖', phonetic: '/bʊk/',           example_en: 'I read a book every night.',             example_vi: 'Tôi đọc sách mỗi tối.' },
      { id: 'pencil',      en: 'Pencil',      vi: 'Bút chì',       emoji: '✏️', phonetic: '/ˈpɛnsəl/',      example_en: 'He draws with a pencil.',                example_vi: 'Cậu ấy vẽ bằng bút chì.' },
      { id: 'ruler',       en: 'Ruler',       vi: 'Thước kẻ',      emoji: '📏', phonetic: '/ˈruːlər/',      example_en: 'Use a ruler to draw a straight line.',   example_vi: 'Dùng thước kẻ để vẽ đường thẳng.' },
      { id: 'desk',        en: 'Desk',        vi: 'Bàn học',       emoji: '🪑', phonetic: '/dɛsk/',          example_en: 'Put your book on the desk.',             example_vi: 'Đặt sách lên bàn học.' },
      { id: 'blackboard',  en: 'Blackboard',  vi: 'Bảng đen',      emoji: '🖥️', phonetic: '/ˈblækbɔːrd/',   example_en: 'Write on the blackboard, please.',       example_vi: 'Hãy viết lên bảng đen nhé.' },
      { id: 'bag',         en: 'Bag',         vi: 'Cặp sách',      emoji: '🎒', phonetic: '/bæɡ/',           example_en: 'My school bag is very heavy.',           example_vi: 'Cặp sách của tôi rất nặng.' },
    ],
  },

  // ── HOBBIES (Lớp 3) ───────────────────────────
  {
    id: 'hobbies',
    gradeId: 'lop3',
    name_vi: 'Sở Thích',
    name_en: 'Hobbies',
    emoji: '🎨',
    color: 'from-fuchsia-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-pink-100',
    words: [
      { id: 'reading',   en: 'Reading',   vi: 'Đọc sách',     emoji: '📚', phonetic: '/ˈriːdɪŋ/',     example_en: 'Reading books is my favourite hobby.',   example_vi: 'Đọc sách là sở thích yêu thích của tôi.' },
      { id: 'drawing',   en: 'Drawing',   vi: 'Vẽ tranh',     emoji: '🎨', phonetic: '/ˈdrɔːɪŋ/',     example_en: 'She loves drawing animals.',             example_vi: 'Cô ấy thích vẽ động vật.' },
      { id: 'singing',   en: 'Singing',   vi: 'Hát',          emoji: '🎤', phonetic: '/ˈsɪŋɪŋ/',      example_en: 'He is good at singing songs.',           example_vi: 'Cậu ấy hát rất hay.' },
      { id: 'dancing',   en: 'Dancing',   vi: 'Nhảy múa',     emoji: '💃', phonetic: '/ˈdɑːnsɪŋ/',    example_en: 'I enjoy dancing with my friends.',       example_vi: 'Tôi thích nhảy múa với bạn bè.' },
      { id: 'swimming',  en: 'Swimming',  vi: 'Bơi lội',      emoji: '🏊', phonetic: '/ˈswɪmɪŋ/',     example_en: 'Swimming is great exercise.',            example_vi: 'Bơi lội là môn thể dục tốt.' },
      { id: 'cycling',   en: 'Cycling',   vi: 'Đạp xe',       emoji: '🚴', phonetic: '/ˈsaɪklɪŋ/',    example_en: 'We go cycling in the park on weekends.', example_vi: 'Chúng tôi đạp xe trong công viên vào cuối tuần.' },
      { id: 'cooking',   en: 'Cooking',   vi: 'Nấu ăn',       emoji: '👨‍🍳', phonetic: '/ˈkʊkɪŋ/',      example_en: 'Cooking is a useful skill.',             example_vi: 'Nấu ăn là một kỹ năng hữu ích.' },
      { id: 'gaming',    en: 'Gaming',    vi: 'Chơi game',    emoji: '🎮', phonetic: '/ˈɡeɪmɪŋ/',     example_en: 'He spends time gaming after school.',    example_vi: 'Cậu ấy dành thời gian chơi game sau giờ học.' },
      { id: 'painting',  en: 'Painting',  vi: 'Tô màu / Vẽ', emoji: '🖌️', phonetic: '/ˈpeɪntɪŋ/',    example_en: 'She is painting a beautiful picture.',   example_vi: 'Cô ấy đang vẽ một bức tranh đẹp.' },
      { id: 'gardening', en: 'Gardening', vi: 'Làm vườn',     emoji: '🌻', phonetic: '/ˈɡɑːrdənɪŋ/',  example_en: 'Grandma loves gardening every morning.', example_vi: 'Bà tôi rất thích làm vườn mỗi sáng.' },
    ],
  },

  // ── WEATHER (Lớp 3) ───────────────────────────
  {
    id: 'weather_lop3',
    gradeId: 'lop3',
    name_vi: 'Thời Tiết',
    name_en: 'Weather',
    emoji: '⛅',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'sunny',   en: 'Sunny',   vi: 'Trời nắng',    emoji: '☀️', phonetic: '/ˈsʌni/',      example_en: 'It is sunny today.',              example_vi: 'Hôm nay trời nắng.' },
      { id: 'rainy',   en: 'Rainy',   vi: 'Trời mưa',     emoji: '🌧️', phonetic: '/ˈreɪni/',     example_en: 'I need an umbrella on rainy days.', example_vi: 'Tôi cần ô vào những ngày mưa.' },
      { id: 'cloudy',  en: 'Cloudy',  vi: 'Trời nhiều mây',emoji: '☁️', phonetic: '/ˈklaʊdi/',   example_en: 'The sky is cloudy today.',         example_vi: 'Hôm nay bầu trời nhiều mây.' },
      { id: 'windy',   en: 'Windy',   vi: 'Trời có gió',  emoji: '💨', phonetic: '/ˈwɪndi/',     example_en: 'It is very windy outside.',        example_vi: 'Ngoài trời rất nhiều gió.' },
      { id: 'cold',    en: 'Cold',    vi: 'Trời lạnh',    emoji: '🥶', phonetic: '/koʊld/',       example_en: 'It is cold in winter.',            example_vi: 'Mùa đông trời rất lạnh.' },
      { id: 'hot',     en: 'Hot',     vi: 'Trời nóng',    emoji: '🌡️', phonetic: '/hɒt/',         example_en: 'It is very hot in summer.',        example_vi: 'Mùa hè trời rất nóng.' },
      { id: 'snowy',   en: 'Snowy',   vi: 'Trời có tuyết', emoji: '❄️', phonetic: '/ˈsnoʊi/',     example_en: 'It is snowy in some countries.',   example_vi: 'Một số nước có tuyết.' },
      { id: 'foggy',   en: 'Foggy',   vi: 'Trời có sương mù', emoji: '🌫️', phonetic: '/ˈfɒɡi/',  example_en: 'It is foggy in the early morning.',example_vi: 'Buổi sáng sớm thường có sương mù.' },
      { id: 'storm',   en: 'Storm',   vi: 'Bão',          emoji: '⛈️', phonetic: '/stɔːrm/',      example_en: 'There is a big storm tonight.',    example_vi: 'Tối nay có cơn bão lớn.' },
      { id: 'rainbow', en: 'Rainbow', vi: 'Cầu vồng',     emoji: '🌈', phonetic: '/ˈreɪnboʊ/',   example_en: 'A rainbow appears after the rain.', example_vi: 'Cầu vồng xuất hiện sau cơn mưa.' },
    ],
  },

  // ════════════════════════════════════════
  // LỚP 4 – SGK Tiếng Anh 4 Tập 1 (Chương trình mới / Global Success)
  // Toàn bộ 89 từ vựng chính thức từ Bảng tra từ (Wordlist) của SGK
  // ════════════════════════════════════════

  // ── Unit 1: Bạn Bè & Quốc Gia ────────────────
  {
    id: 'lop4_u1_friends',
    gradeId: 'lop4',
    name_vi: 'Unit 1: Bạn Bè & Quốc Gia',
    name_en: 'Unit 1: My Friends',
    emoji: '🌍',
    color: 'from-cyan-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    words: [
      { id: 'l4_viet_nam', en: 'Viet Nam', vi: 'nước Việt Nam', emoji: '🇻🇳', phonetic: '/ˌviːetˈnæm/', example_en: 'I live in Viet Nam.', example_vi: 'Tôi sống ở Việt Nam.' },
      { id: 'l4_america', en: 'America', vi: 'nước Hoa Kỳ', emoji: '🇺🇸', phonetic: '/əˈmerɪkə/', example_en: 'She is from America.', example_vi: 'Cô ấy đến từ nước Mỹ.' },
      { id: 'l4_australia', en: 'Australia', vi: 'nước Ô-xtrây-li-a', emoji: '🇦🇺', phonetic: '/ɒˈstrəliə/', example_en: 'Kangaroos live in Australia.', example_vi: 'Chuột túi sống ở nước Úc.' },
      { id: 'l4_britain', en: 'Britain', vi: 'vùng lãnh thổ bao gồm nước Anh, xứ Uên và Xcốt-len', emoji: '🇬🇧', phonetic: '/ˈbrɪtn/', example_en: 'David is from Britain.', example_vi: 'David đến từ nước Anh.' },
      { id: 'l4_japan', en: 'Japan', vi: 'nước Nhật', emoji: '🇯🇵', phonetic: '/dʒə\'pæn/', example_en: 'Akiko is from Japan.', example_vi: 'Akiko đến từ Nhật Bản.' },
      { id: 'l4_malaysia', en: 'Malaysia', vi: 'nước Ma-lai-xi-a', emoji: '🇲🇾', phonetic: '/mə\'leɪziə/, /mə\'leɪʒə/', example_en: 'Hakim is from Malaysia.', example_vi: 'Hakim đến từ Ma-lai-xi-a.' },
      { id: 'l4_singapore', en: 'Singapore', vi: 'nước Xin-ga-po', emoji: '🇸🇬', phonetic: '/ˈsɪŋəpɔː/', example_en: 'Singapore is a very green country.', example_vi: 'Xinh-ga-po là một đất nước rất xanh.' },
      { id: 'l4_thailand', en: 'Thailand', vi: 'nước Thái Lan', emoji: '🇹🇭', phonetic: '/ˈtaɪlænd/', example_en: 'Thailand is famous for beautiful beaches.', example_vi: 'Thái Lan nổi tiếng với những bãi biển đẹp.' },
      { id: 'l4_bangkok', en: 'Bangkok', vi: 'Băng Cốc (thủ đô của nước Thái Lan)', emoji: '🏙️', phonetic: '/bæŋˈkɒk/', example_en: 'Bangkok is the capital of Thailand.', example_vi: 'Băng Cốc là thủ đô của Thái Lan.' },
      { id: 'l4_london', en: 'London', vi: 'Luân Đôn (thủ đô của nước Anh)', emoji: '🎡', phonetic: '/\'lʌndən/', example_en: 'Big Ben is located in London.', example_vi: 'Tháp đồng hồ Big Ben nằm ở Luân Đôn.' },
      { id: 'l4_sydney', en: 'Sydney', vi: 'Xít-ni (thành phố của nước Ô-xtrây-li-a)', emoji: '🏛️', phonetic: '/ˈsɪdni/', example_en: 'The Opera House is in Sydney.', example_vi: 'Nhà hát Opera nằm ở Xít-ni.' },
      { id: 'l4_tokyo', en: 'Tokyo', vi: 'Tô-ki-ô (thủ đô của nước Nhật)', emoji: '🗼', phonetic: '/ˈtəʊkiəʊ/', example_en: 'Tokyo is the capital of Japan.', example_vi: 'Tô-ki-ô là thủ đô của nước Nhật.' },
    ],
  },

  // ── Unit 2: Thời Gian & Thói Quen ────────────────
  {
    id: 'lop4_u2_time',
    gradeId: 'lop4',
    name_vi: 'Unit 2: Thời Gian & Thói Quen',
    name_en: 'Unit 2: Time & Daily Routines',
    emoji: '⏰',
    color: 'from-amber-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-orange-100',
    words: [
      { id: 'l4_o_clock', en: 'o\'clock', vi: 'giờ (dùng sau giờ chẵn, ví dụ: 8 giờ: eight o\'clock)', emoji: '⏰', phonetic: '/ə\'klɒk/', example_en: 'It is seven o\'clock in the morning.', example_vi: 'Bây giờ là đúng 7 giờ sáng.' },
      { id: 'l4_thirty', en: 'thirty', vi: 'số 30', emoji: '🔢', phonetic: '/ˈθɜːti/', example_en: 'It is six thirty.', example_vi: 'Bây giờ là 6 giờ 30 phút.' },
      { id: 'l4_forty_five', en: 'forty-five', vi: 'số 45', emoji: '🕒', phonetic: '/ˌfɔːti ˈfaɪv/', example_en: 'It is seven forty-five.', example_vi: 'Bây giờ là 7 giờ 45 phút.' },
      { id: 'l4_get_up', en: 'get up', vi: 'thức dậy', emoji: '🌅', phonetic: '/ɡet ˈʌp/', example_en: 'I get up early at six o\'clock.', example_vi: 'Tôi thức dậy sớm lúc 6 giờ.' },
      { id: 'l4_have_breakfast', en: 'Have breakfast', vi: 'dùng (bữa sáng)', emoji: '🍳', phonetic: '/hæv (ˈbrekfəst)/', example_en: 'I have breakfast with bread and milk.', example_vi: 'Tôi ăn sáng với bánh mì và sữa.' },
      { id: 'l4_go_to_school', en: 'Go to school', vi: 'đi (học)', emoji: '🎒', phonetic: '/ɡəʊ (tə ˈskuːl)/', example_en: 'We go to school by bicycle.', example_vi: 'Chúng tôi đi học bằng xe đạp.' },
      { id: 'l4_go_to_bed', en: 'Go to bed', vi: 'đi (ngủ)', emoji: '🛏️', phonetic: '/ɡəʊ (tə ˈbed)/', example_en: 'I go to bed at nine thirty.', example_vi: 'Tôi đi ngủ lúc 9 giờ 30 phút.' },
      { id: 'l4_wash', en: 'wash', vi: 'rửa', emoji: '🧼', phonetic: '/wɒʃ/', example_en: 'I wash my face every morning.', example_vi: 'Tôi rửa mặt vào mỗi buổi sáng.' },
      { id: 'l4_today', en: 'today', vi: 'hôm nay', emoji: '☀️', phonetic: '/təˈdeɪ/', example_en: 'What day is it today?', example_vi: 'Hôm nay là thứ mấy?' },
    ],
  },

  // ── Unit 3: Các Ngày Trong Tuần ────────────────
  {
    id: 'lop4_u3_week',
    gradeId: 'lop4',
    name_vi: 'Unit 3: Các Ngày Trong Tuần',
    name_en: 'Unit 3: My Week',
    emoji: '📅',
    color: 'from-emerald-400 to-teal-500',
    gradient: 'bg-gradient-to-br from-emerald-100 to-teal-100',
    words: [
      { id: 'l4_monday', en: 'Monday', vi: 'thứ Hai', emoji: '📅', phonetic: '/\'mʌndeɪ/', example_en: 'We start school on Monday.', example_vi: 'Chúng tôi bắt đầu đi học vào thứ Hai.' },
      { id: 'l4_tuesday', en: 'Tuesday', vi: 'thứ Ba', emoji: '📅', phonetic: '/ˈtjuːzdeɪ/', example_en: 'I have English class on Tuesday.', example_vi: 'Tôi có tiết tiếng Anh vào thứ Ba.' },
      { id: 'l4_wednesday', en: 'Wednesday', vi: 'thứ Tư', emoji: '📅', phonetic: '/ˈwenzdeɪ/', example_en: 'We have science on Wednesday.', example_vi: 'Chúng tôi học khoa học vào thứ Tư.' },
      { id: 'l4_thursday', en: 'Thursday', vi: 'thứ Năm', emoji: '📅', phonetic: '/ˈθɜːzdeɪ/', example_en: 'I have music on Thursday.', example_vi: 'Tôi học âm nhạc vào thứ Năm.' },
      { id: 'l4_friday', en: 'Friday', vi: 'thứ Sáu', emoji: '🎉', phonetic: '/ˈfraɪdeɪ/', example_en: 'Friday is the last school day of the week.', example_vi: 'Thứ Sáu là ngày đi học cuối tuần.' },
      { id: 'l4_saturday', en: 'Saturday', vi: 'thứ Bảy', emoji: '⚽', phonetic: '/\'sætədeɪ/', example_en: 'I play sports on Saturday.', example_vi: 'Tôi chơi thể thao vào thứ Bảy.' },
      { id: 'l4_sunday', en: 'Sunday', vi: 'Chủ nhật', emoji: '🏖️', phonetic: '/ˈsʌndeɪ/', example_en: 'We visit grandparents on Sunday.', example_vi: 'Chúng tôi thăm ông bà vào Chủ nhật.' },
      { id: 'l4_yesterday', en: 'yesterday', vi: 'ngày hôm qua', emoji: '⏮️', phonetic: '/ˈjestədeɪ/', example_en: 'Where were you yesterday?', example_vi: 'Hôm qua bạn đã ở đâu?' },
      { id: 'l4_weekday', en: 'weekday', vi: 'ngày trong tuần (từ thứ Hai đến thứ Sáu)', emoji: '📆', phonetic: '/ˈwiːkdeɪ/', example_en: 'I go to school on weekdays.', example_vi: 'Tôi đi học vào các ngày trong tuần.' },
      { id: 'l4_weekend', en: 'weekend', vi: 'ngày cuối tuần (thứ Bảy và Chủ nhật)', emoji: '🎈', phonetic: '/ˌwiːkˈend/', example_en: 'Have a great weekend!', example_vi: 'Chúc bạn một kỳ nghỉ cuối tuần vui vẻ!' },
      { id: 'l4_housework', en: 'housework', vi: 'việc nhà', emoji: '🧹', phonetic: '/ˈhaʊswɜːk/', example_en: 'I help my parents with the housework.', example_vi: 'Tôi giúp bố mẹ làm việc nhà.' },
    ],
  },

  // ── Unit 4: Sinh Nhật & 12 Tháng ────────────────
  {
    id: 'lop4_u4_birthday',
    gradeId: 'lop4',
    name_vi: 'Unit 4: Sinh Nhật & 12 Tháng',
    name_en: 'Unit 4: My Birthday',
    emoji: '🎂',
    color: 'from-pink-400 to-rose-500',
    gradient: 'bg-gradient-to-br from-pink-100 to-rose-100',
    words: [
      { id: 'l4_birthday', en: 'birthday', vi: 'ngày sinh', emoji: '🎂', phonetic: '/ˈbɜːθdeɪ/', example_en: 'Happy birthday to you!', example_vi: 'Chúc mừng sinh nhật bạn!' },
      { id: 'l4_party', en: 'party', vi: 'buổi tiệc', emoji: '🥳', phonetic: '/\'pɑ:ti/', example_en: 'We are having a birthday party.', example_vi: 'Chúng tôi đang tổ chức tiệc sinh nhật.' },
      { id: 'l4_january', en: 'January', vi: 'tháng Một', emoji: '❄️', phonetic: '/\'dʒænjuəri/', example_en: 'My birthday is in January.', example_vi: 'Sinh nhật của tôi vào tháng Một.' },
      { id: 'l4_february', en: 'February', vi: 'tháng Hai', emoji: '🌸', phonetic: '/ˈfebruərɪ/', example_en: 'Tet holiday is often in February.', example_vi: 'Tết Nguyên Đán thường rơi vào tháng Hai.' },
      { id: 'l4_march', en: 'March', vi: 'tháng Ba', emoji: '🌱', phonetic: '/mɑ:tʃ/', example_en: 'Spring begins in March.', example_vi: 'Mùa xuân bắt đầu vào tháng Ba.' },
      { id: 'l4_april', en: 'April', vi: 'tháng Tư', emoji: '🌧️', phonetic: '/ˈeɪprəl/', example_en: 'April has thirty days.', example_vi: 'Tháng Tư có 30 ngày.' },
      { id: 'l4_may', en: 'May', vi: 'tháng Năm', emoji: '🌺', phonetic: '/meɪ/', example_en: 'May is warm and sunny.', example_vi: 'Tháng Năm ấm áp và có nắng.' },
      { id: 'l4_august', en: 'August', vi: 'tháng Tám', emoji: '🏖️', phonetic: '/ˈɔːɡəst/', example_en: 'We go on holiday in August.', example_vi: 'Chúng tôi đi nghỉ vào tháng Tám.' },
      { id: 'l4_september', en: 'September', vi: 'tháng Chín', emoji: '🔔', phonetic: '/sepˈtembə/', example_en: 'The new school year starts in September.', example_vi: 'Năm học mới bắt đầu vào tháng Chín.' },
      { id: 'l4_october', en: 'October', vi: 'tháng Mười', emoji: '🎃', phonetic: '/ɒk\'təʊbə/', example_en: 'Halloween is in October.', example_vi: 'Lễ hội Halloween vào tháng Mười.' },
      { id: 'l4_november', en: 'November', vi: 'tháng Mười Một', emoji: '🍂', phonetic: '/nəʊ\'vembə/', example_en: 'Teacher\'s Day is in November.', example_vi: 'Ngày Nhà giáo Việt Nam vào tháng Mười Một.' },
      { id: 'l4_december', en: 'December', vi: 'tháng Mười Hai', emoji: '🎄', phonetic: '/dɪˈsembə/', example_en: 'Christmas is in December.', example_vi: 'Giáng sinh vào tháng Mười Hai.' },
      { id: 'l4_story', en: 'story', vi: 'chuyện, câu chuyện', emoji: '📖', phonetic: '/ˈstɔːri/', example_en: 'My grandma tells me a bedtime story.', example_vi: 'Bà kể cho tôi nghe câu chuyện trước khi ngủ.' },
    ],
  },

  // ── Unit 5: Kỹ Năng & Hoạt Động ────────────────
  {
    id: 'lop4_u5_skills',
    gradeId: 'lop4',
    name_vi: 'Unit 5: Kỹ Năng & Hoạt Động',
    name_en: 'Unit 5: Things We Can Do',
    emoji: '🤸',
    color: 'from-violet-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-violet-100 to-purple-100',
    words: [
      { id: 'l4_can', en: 'can', vi: 'có thể, biết (làm gì)', emoji: '💪', phonetic: '/kən/, /kæn/', example_en: 'I can ride a bike.', example_vi: 'Tôi có thể đạp xe.' },
      { id: 'l4_jump', en: 'jump', vi: 'nhảy', emoji: '🦘', phonetic: '/dʒʌmp/', example_en: 'Can you jump high?', example_vi: 'Bạn có thể nhảy cao không?' },
      { id: 'l4_ride_a_bike', en: 'Ride a bike', vi: 'đạp xe', emoji: '🚲', phonetic: '/raɪd (ə baɪk)/', example_en: 'I ride a bike to the park.', example_vi: 'Tôi đạp xe đến công viên.' },
      { id: 'l4_ride_a_horse', en: 'Ride a horse', vi: 'cưỡi ngựa', emoji: '🐎', phonetic: '/raɪd (ə hɔ:s)/', example_en: 'He can ride a horse very well.', example_vi: 'Cậu ấy có thể cưỡi ngựa rất giỏi.' },
      { id: 'l4_roller_skate', en: 'roller skate', vi: 'trượt pa-tanh', emoji: '🛼', phonetic: '/\'rəʊlə skeɪt/', example_en: 'She loves to roller skate after school.', example_vi: 'Cô ấy thích trượt pa-tanh sau giờ học.' },
      { id: 'l4_play_the_guitar', en: 'play the guitar', vi: 'chơi đàn ghi-ta', emoji: '🎸', phonetic: '/pleɪ ðə gɪ\'tɑ:/', example_en: 'He can play the guitar nicely.', example_vi: 'Cậu ấy có thể chơi đàn ghi-ta rất hay.' },
      { id: 'l4_play_the_piano', en: 'play the piano', vi: 'chơi đàn pi-a-nô', emoji: '🎹', phonetic: '/pleɪ ðə pi\'ænəʊ/', example_en: 'I practice playing the piano every day.', example_vi: 'Tôi luyện tập đánh đàn piano mỗi ngày.' },
      { id: 'l4_painter', en: 'painter', vi: 'hoạ sĩ', emoji: '🎨', phonetic: '/\'peɪntə/', example_en: 'He is a famous painter.', example_vi: 'Ông ấy là một họa sĩ nổi tiếng.' },
      { id: 'l4_activity', en: 'activity', vi: 'hoạt động', emoji: '🎯', phonetic: '/ækˈtɪvəti/', example_en: 'Reading is my favourite activity.', example_vi: 'Đọc sách là hoạt động yêu thích của tôi.' },
    ],
  },

  // ── Unit 6: Trường Học Của Em ────────────────
  {
    id: 'lop4_u6_school',
    gradeId: 'lop4',
    name_vi: 'Unit 6: Trường Học Của Em',
    name_en: 'Unit 6: Our School',
    emoji: '🏫',
    color: 'from-blue-400 to-indigo-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-indigo-100',
    words: [
      { id: 'l4_building', en: 'building', vi: 'toà nhà', emoji: '🏢', phonetic: '/ˈbɪldɪŋ/', example_en: 'Our school has a big new building.', example_vi: 'Trường chúng tôi có một tòa nhà mới to lớn.' },
      { id: 'l4_computer_room', en: 'computer room', vi: 'phòng máy tính', emoji: '💻', phonetic: '/kəmˈpjuːtə ruːm/', example_en: 'We study IT in the computer room.', example_vi: 'Chúng tôi học tin học trong phòng máy tính.' },
      { id: 'l4_garden', en: 'garden', vi: 'vườn', emoji: '🌻', phonetic: '/ˈɡɑːdn/', example_en: 'There are pretty flowers in the garden.', example_vi: 'Có nhiều hoa đẹp trong vườn.' },
      { id: 'l4_school_garden', en: 'school garden', vi: 'vườn trường', emoji: '🌳', phonetic: '/sku:l \'gɑ:dn/', example_en: 'We water the plants in the school garden.', example_vi: 'Chúng tôi tưới cây trong vườn trường.' },
      { id: 'l4_stay_at_home', en: 'stay at home', vi: 'ở nhà', emoji: '🏠', phonetic: '/steɪ ət həʊm/', example_en: 'I stay at home on rainy days.', example_vi: 'Tôi ở nhà vào những ngày mưa.' },
    ],
  },

  // ── Unit 7-8: Các Môn Học ────────────────
  {
    id: 'lop4_u7_8_subjects',
    gradeId: 'lop4',
    name_vi: 'Unit 7-8: Các Môn Học',
    name_en: 'Unit 7-8: School Subjects',
    emoji: '📚',
    color: 'from-lime-400 to-green-500',
    gradient: 'bg-gradient-to-br from-lime-100 to-green-100',
    words: [
      { id: 'l4_art', en: 'art', vi: 'môn Mĩ thuật', emoji: '🎨', phonetic: '/ɑːt/', example_en: 'We draw and paint in art class.', example_vi: 'Chúng tôi vẽ và tô màu trong giờ mĩ thuật.' },
      { id: 'l4_english', en: 'English', vi: 'môn Tiếng Anh', emoji: '🇬🇧', phonetic: '/ˈɪŋɡlɪʃ/', example_en: 'I love learning English songs.', example_vi: 'Tôi thích học những bài hát tiếng Anh.' },
      { id: 'l4_history_and_geography', en: 'history and geography', vi: 'môn Lịch sử và Địa lí', emoji: '🗺️', phonetic: '/ˈhɪstrɪ ənd dʒɪˈɒɡrəfi/', example_en: 'We learn about mountains in history and geography.', example_vi: 'Chúng tôi tìm hiểu về núi non trong môn lịch sử và địa lí.' },
      { id: 'l4_it', en: 'IT', vi: 'môn Tin học, môn Công nghệ thông tin', emoji: '🖥️', phonetic: '/ai \'ti:/ (/,infə meɪʃn tek\'nɒlədʒi/)', example_en: 'We use computers in IT class.', example_vi: 'Chúng tôi dùng máy tính trong giờ tin học.' },
      { id: 'l4_maths', en: 'maths', vi: 'môn Toán, toán học', emoji: '📐', phonetic: '/mæθs/', example_en: 'I am good at maths.', example_vi: 'Tôi học giỏi môn toán.' },
      { id: 'l4_music', en: 'music', vi: 'môn Âm nhạc', emoji: '🎵', phonetic: '/\'mju:zɪk/', example_en: 'We sing happy songs in music class.', example_vi: 'Chúng tôi hát những bài ca vui tươi trong giờ âm nhạc.' },
      { id: 'l4_pe', en: 'PE', vi: 'môn Thể dục, môn Giáo dục thể chất', emoji: '🏃', phonetic: '/pi: \'i:/ (/,fɪzɪkl edʒu\'keɪʃn/)', example_en: 'We run and exercise in PE class.', example_vi: 'Chúng tôi chạy và tập thể dục trong giờ thể dục.' },
      { id: 'l4_science', en: 'science', vi: 'môn Khoa học', emoji: '🔬', phonetic: '/\'saɪəns/', example_en: 'Science helps us understand nature.', example_vi: 'Môn khoa học giúp chúng ta hiểu về tự nhiên.' },
      { id: 'l4_vietnamese', en: 'Vietnamese', vi: 'môn Tiếng Việt', emoji: '🇻🇳', phonetic: '/ˌviːetnəˈmiːz/', example_en: 'We read poetry in Vietnamese class.', example_vi: 'Chúng tôi đọc thơ trong giờ học tiếng Việt.' },
      { id: 'l4_subject', en: 'subject', vi: 'môn học', emoji: '📚', phonetic: '/ˈsʌbdʒɪkt/', example_en: 'What is your favourite subject?', example_vi: 'Môn học yêu thích của bạn là gì?' },
      { id: 'l4_study', en: 'study', vi: 'học, nghiên cứu', emoji: '📖', phonetic: '/ˈstʌdi/', example_en: 'I study hard every day.', example_vi: 'Tôi học tập chăm chỉ mỗi ngày.' },
      { id: 'l4_why', en: 'why', vi: 'tại sao', emoji: '❓', phonetic: '/waɪ/', example_en: 'Why do you like English?', example_vi: 'Tại sao bạn thích tiếng Anh?' },
      { id: 'l4_because', en: 'because', vi: 'bởi vì', emoji: '💡', phonetic: '/bɪˈkɒz/', example_en: 'Because I want to talk to friends around the world.', example_vi: 'Bởi vì tôi muốn trò chuyện với bạn bè trên khắp thế giới.' },
    ],
  },

  // ── Unit 9: Hội Thao Trường Em ────────────────
  {
    id: 'lop4_u9_sports',
    gradeId: 'lop4',
    name_vi: 'Unit 9: Hội Thao Trường Em',
    name_en: 'Unit 9: Our Sports Day',
    emoji: '🏆',
    color: 'from-yellow-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    words: [
      { id: 'l4_sports_day', en: 'sports day', vi: 'ngày hội thể thao', emoji: '🏅', phonetic: '/ˈspɔːts deɪ/', example_en: 'When is your sports day?', example_vi: 'Khi nào là ngày hội thể thao của trường bạn?' },
      { id: 'l4_outdoor', en: 'outdoor', vi: 'ngoài trời', emoji: '🏕️', phonetic: '/\'aʊtdɔ:/', example_en: 'We enjoy outdoor games in the sun.', example_vi: 'Chúng tôi thích các trò chơi ngoài trời dưới ánh nắng.' },
      { id: 'l4_when', en: 'when', vi: 'khi nào', emoji: '🕒', phonetic: '/wen/', example_en: 'When is the party?', example_vi: 'Khi nào buổi tiệc bắt đầu?' },
      { id: 'l4_hat', en: 'hat', vi: 'cái mũ', emoji: '👒', phonetic: '/hæt/', example_en: 'Wear a hat when playing outdoors.', example_vi: 'Hãy đội mũ khi chơi ngoài trời nhé.' },
      { id: 'l4_last', en: 'last', vi: 'trước, lần trước', emoji: '⏮️', phonetic: '/lɑ:st/', example_en: 'I saw him last week.', example_vi: 'Tôi đã gặp cậu ấy vào tuần trước.' },
    ],
  },

  // ── Unit 10: Trại Hè & Quê Hương ────────────────
  {
    id: 'lop4_u10_camp',
    gradeId: 'lop4',
    name_vi: 'Unit 10: Trại Hè & Quê Hương',
    name_en: 'Unit 10: Our Summer Camp',
    emoji: '🏕️',
    color: 'from-orange-400 to-red-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-red-100',
    words: [
      { id: 'l4_campsite', en: 'campsite', vi: 'địa điểm cắm trại', emoji: '🏕️', phonetic: '/ˈkæmpsaɪt/', example_en: 'Our campsite is near a beautiful lake.', example_vi: 'Địa điểm cắm trại của chúng tôi ở gần một hồ nước đẹp.' },
      { id: 'l4_beach', en: 'beach', vi: 'bãi biển', emoji: '🏖️', phonetic: '/biːtʃ/', example_en: 'Children love playing on the beach.', example_vi: 'Trẻ em rất thích chơi trên bãi biển.' },
      { id: 'l4_mountains', en: 'mountains', vi: 'những dãy núi', emoji: '⛰️', phonetic: '/\'maʊntənz/', example_en: 'The mountains are tall and misty.', example_vi: 'Những dãy núi cao và phủ sương mù.' },
      { id: 'l4_in_the_mountains', en: 'in the mountains', vi: 'ở vùng núi', emoji: '🏔️', phonetic: '/ɪn ðə ˈmaʊntənz/', example_en: 'We went hiking in the mountains.', example_vi: 'Chúng tôi đã đi leo núi ở vùng núi.' },
      { id: 'l4_city', en: 'city', vi: 'thành phố', emoji: '🏙️', phonetic: '/ˈsɪti/', example_en: 'The city has tall buildings and busy streets.', example_vi: 'Thành phố có nhiều tòa nhà cao tầng và đường xá nhộn nhịp.' },
      { id: 'l4_town', en: 'town', vi: 'thị trấn', emoji: '🏘️', phonetic: '/taʊn/', example_en: 'My grandparents live in a small town.', example_vi: 'Ông bà tôi sống ở một thị trấn nhỏ.' },
      { id: 'l4_village', en: 'village', vi: 'ngôi làng', emoji: '🏡', phonetic: '/ˈvɪlɪdʒ/', example_en: 'The village is quiet and peaceful.', example_vi: 'Ngôi làng rất yên tĩnh và thanh bình.' },
      { id: 'l4_countryside', en: 'countryside', vi: 'nông thôn, vùng quê', emoji: '🌾', phonetic: '/ˈkʌntrɪsaɪd/', example_en: 'I love fresh air in the countryside.', example_vi: 'Tôi yêu không khí trong lành ở miền quê.' },
      { id: 'l4_chips', en: 'chips', vi: 'khoai tây rán', emoji: '🍟', phonetic: '/tʃɪps/', example_en: 'We eat crispy potato chips.', example_vi: 'Chúng tôi ăn khoai tây chiên giòn rụm.' },
      { id: 'l4_grape', en: 'grape', vi: 'quả nho', emoji: '🍇', phonetic: '/ɡreɪp/', example_en: 'Sweet purple grapes are yummy.', example_vi: 'Những quả nho tím ngọt lịm thật ngon.' },
      { id: 'l4_jam', en: 'jam', vi: 'mứt', emoji: '🍓', phonetic: '/dʒæm/', example_en: 'I spread strawberry jam on bread.', example_vi: 'Tôi phết mứt dâu tây lên bánh mì.' },
      { id: 'l4_lemonade', en: 'lemonade', vi: 'nước chanh', emoji: '🍋', phonetic: '/\'lemə\'neɪd/', example_en: 'A glass of cold lemonade is refreshing.', example_vi: 'Một ly nước chanh mát lạnh thật sảng khoái.' },
    ],
  },

  // ════════════════════════════════════════
  // LỚP 4 – SGK Tiếng Anh 4 Tập 2 (Chương trình mới / Global Success)
  // Toàn bộ 100 từ vựng chính thức từ Bảng tra từ (Wordlist) của SGK
  // ════════════════════════════════════════

  // ── Unit 11: Ngôi Nhà & Đường Phố ────────────────
  {
    id: 'lop4_u11_home',
    gradeId: 'lop4',
    name_vi: 'Unit 11: Ngôi Nhà & Đường Phố',
    name_en: 'Unit 11: My Home',
    emoji: '🏡',
    color: 'from-amber-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-emerald-100',
    words: [
      { id: 'l4_road', en: 'road', vi: 'con đường, đường phố', emoji: '🛣️', phonetic: '/rəʊd/', example_en: 'The road in front of my house is wide.', example_vi: 'Con đường trước nhà em rất rộng rãi.' },
      { id: 'l4_street', en: 'street', vi: 'phố, đường phố', emoji: '🏙️', phonetic: '/striːt/', example_en: 'I live in Nguyen Hue Street.', example_vi: 'Em sống ở đường phố Nguyễn Huệ.' },
      { id: 'l4_live', en: 'live', vi: 'sống, sinh sống', emoji: '🏠', phonetic: '/lɪv/', example_en: 'Where do you live? - I live in Ha Noi.', example_vi: 'Bạn sống ở đâu? - Tớ sống ở Hà Nội.' },
      { id: 'l4_busy', en: 'busy', vi: 'bận rộn, nhộn nhịp', emoji: '🚗', phonetic: '/ˈbɪzi/', example_en: 'The street is very busy with many cars.', example_vi: 'Đường phố rất nhộn nhịp đông đúc xe cộ.' },
      { id: 'l4_noisy', en: 'noisy', vi: 'ồn ào, náo nhiệt', emoji: '📢', phonetic: '/ˈnɔɪzi/', example_en: 'The city is quite noisy during the day.', example_vi: 'Thành phố khá ồn ào vào ban ngày.' },
      { id: 'l4_quiet', en: 'quiet', vi: 'yên tĩnh, thanh bình', emoji: '🤫', phonetic: '/ˈkwaɪət/', example_en: 'My village is very quiet and peaceful.', example_vi: 'Làng quê của em rất yên tĩnh và thanh bình.' },
      { id: 'l4_big_street', en: 'big', vi: 'to, lớn (kích thước)', emoji: '🏢', phonetic: '/bɪɡ/', example_en: 'There is a big building on our street.', example_vi: 'Có một tòa nhà to lớn trên phố của chúng em.' },
      { id: 'l4_in_prep', en: 'in', vi: 'ở, trong (đi cùng tên đường / phố)', emoji: '📍', phonetic: '/ɪn/', example_en: 'My grandparents live in Oxford Street.', example_vi: 'Ông bà em sống ở phố Oxford.' },
    ],
  },

  // ── Unit 12: Nghề Nghiệp & Nơi Làm Việc ────────────────
  {
    id: 'lop4_u12_jobs',
    gradeId: 'lop4',
    name_vi: 'Unit 12: Nghề Nghiệp & Nơi Làm Việc',
    name_en: 'Unit 12: Jobs',
    emoji: '👨‍⚕️',
    color: 'from-blue-400 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    words: [
      { id: 'l4_actor', en: 'actor', vi: 'diễn viên (nam)', emoji: '🎭', phonetic: '/ˈæktə/', example_en: 'My uncle is a famous actor.', example_vi: 'Chú của em là một nam diễn viên nổi tiếng.' },
      { id: 'l4_farmer', en: 'farmer', vi: 'bác nông dân', emoji: '👨‍🌾', phonetic: '/ˈfɑːmə/', example_en: 'The farmer works hard on the farm.', example_vi: 'Bác nông dân làm việc chăm chỉ trên nông trại.' },
      { id: 'l4_nurse', en: 'nurse', vi: 'y tá, điều dưỡng viên', emoji: '👩‍⚕️', phonetic: '/nɜːs/', example_en: 'The kind nurse takes care of sick people.', example_vi: 'Cô y tá hiền từ chăm sóc những người ốm.' },
      { id: 'l4_office_worker', en: 'office worker', vi: 'nhân viên văn phòng', emoji: '💼', phonetic: '/ˈɒfɪs wɜːkə/', example_en: 'My mother is an office worker.', example_vi: 'Mẹ em là một nhân viên văn phòng.' },
      { id: 'l4_policeman', en: 'policeman', vi: 'chú cảnh sát (nam)', emoji: '👮‍♂️', phonetic: '/pə\'liːsmən/', example_en: 'The policeman keeps our streets safe.', example_vi: 'Chú cảnh sát giữ an toàn cho đường phố.' },
      { id: 'l4_factory', en: 'factory', vi: 'nhà máy', emoji: '🏭', phonetic: '/ˈfæktri/', example_en: 'Workers produce clothes in the factory.', example_vi: 'Các công nhân may quần áo trong nhà máy.' },
      { id: 'l4_farm', en: 'farm', vi: 'nông trại, trang trại', emoji: '🚜', phonetic: '/fɑːm/', example_en: 'There are cows and chickens on the farm.', example_vi: 'Có những chú bò và chú gà trên nông trại.' },
      { id: 'l4_hospital', en: 'hospital', vi: 'bệnh viện', emoji: '🏥', phonetic: '/ˈhɒspɪtl/', example_en: 'Doctors and nurses work at the hospital.', example_vi: 'Bác sĩ và y tá làm việc tại bệnh viện.' },
      { id: 'l4_nursing_home', en: 'nursing home', vi: 'viện điều dưỡng', emoji: '🩺', phonetic: '/ˈnɜːsɪŋ həʊm/', example_en: 'Nurses care for the elderly in the nursing home.', example_vi: 'Các y tá chăm sóc người cao tuổi trong viện điều dưỡng.' },
      { id: 'l4_email', en: 'email', vi: 'gửi thư điện tử', emoji: '📧', phonetic: '/ˈiːmeɪl/', example_en: 'Office workers often email their colleagues.', example_vi: 'Nhân viên văn phòng thường gửi email cho đồng nghiệp.' },
    ],
  },

  // ── Unit 13: Ngoại Hình & Khuôn Mặt ────────────────
  {
    id: 'lop4_u13_appearance',
    gradeId: 'lop4',
    name_vi: 'Unit 13: Ngoại Hình & Khuôn Mặt',
    name_en: 'Unit 13: Appearance',
    emoji: '✨',
    color: 'from-purple-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-100 to-pink-100',
    words: [
      { id: 'l4_tall', en: 'tall', vi: 'cao ráo', emoji: '🦒', phonetic: '/tɔːl/', example_en: 'My brother is very tall.', example_vi: 'Anh trai của em rất cao.' },
      { id: 'l4_short', en: 'short', vi: 'thấp, ngắn', emoji: '🧒', phonetic: '/ʃɔːt/', example_en: 'The little boy is short and cute.', example_vi: 'Cậu bé nhỏ nhắn trông thấp và đáng yêu.' },
      { id: 'l4_slim', en: 'slim', vi: 'mảnh mai, thon gọn', emoji: '🏃‍♀️', phonetic: '/slɪm/', example_en: 'My sister is slim because she dances every day.', example_vi: 'Chị gái em mảnh mai vì chị tập múa mỗi ngày.' },
      { id: 'l4_face', en: 'face', vi: 'khuôn mặt', emoji: '😊', phonetic: '/feɪs/', example_en: 'She has a smiling round face.', example_vi: 'Cô bé có khuôn mặt tròn hay mỉm cười.' },
      { id: 'l4_eye', en: 'eye', vi: 'đôi mắt, mắt', emoji: '👀', phonetic: '/aɪ/', example_en: 'The baby has big bright eyes.', example_vi: 'Em bé có đôi mắt to sáng ngời.' },
      { id: 'l4_hair', en: 'hair', vi: 'mái tóc', emoji: '💇', phonetic: '/heə/', example_en: 'My mother has soft black hair.', example_vi: 'Mẹ em có mái tóc đen mềm mại.' },
      { id: 'l4_long', en: 'long', vi: 'dài', emoji: '📏', phonetic: '/lɒŋ/', example_en: 'She has long hair and wears a red bow.', example_vi: 'Cô ấy có mái tóc dài và cài nơ đỏ.' },
      { id: 'l4_round', en: 'round', vi: 'tròn trịa', emoji: '⚪', phonetic: '/raʊnd/', example_en: 'The full moon is round like a ball.', example_vi: 'Mặt trăng tròn như một quả bóng.' },
      { id: 'l4_like_look', en: 'like', vi: 'giống như, trông như', emoji: '👥', phonetic: '/laɪk/', example_en: 'What does he look like? - He is tall and slim.', example_vi: 'Cậu ấy trông như thế nào? - Cậu ấy cao và thon thả.' },
    ],
  },

  // ── Unit 14: Hoạt Động & Việc Nhà ────────────────
  {
    id: 'lop4_u14_daily',
    gradeId: 'lop4',
    name_vi: 'Unit 14: Hoạt Động & Việc Nhà',
    name_en: 'Unit 14: Daily Activities',
    emoji: '🧹',
    color: 'from-orange-400 to-amber-500',
    gradient: 'bg-gradient-to-br from-orange-100 to-amber-100',
    words: [
      { id: 'l4_morning', en: 'morning', vi: 'buổi sáng', emoji: '🌅', phonetic: '/ˈmɔːnɪŋ/', example_en: 'I brush my teeth in the morning.', example_vi: 'Em đánh răng vào buổi sáng.' },
      { id: 'l4_noon', en: 'noon', vi: 'buổi trưa', emoji: '☀️', phonetic: '/nuːn/', example_en: 'We eat delicious lunch at noon.', example_vi: 'Chúng em ăn bữa trưa ngon miệng vào buổi trưa.' },
      { id: 'l4_afternoon', en: 'afternoon', vi: 'buổi chiều', emoji: '🌤️', phonetic: '/ˌɑːftəˈnuːn/', example_en: 'I play football with friends in the afternoon.', example_vi: 'Em đá bóng cùng các bạn vào buổi chiều.' },
      { id: 'l4_evening', en: 'evening', vi: 'buổi tối', emoji: '🌙', phonetic: '/ˈiːvnɪŋ/', example_en: 'My family reads books in the evening.', example_vi: 'Gia đình em đọc sách vào buổi tối.' },
      { id: 'l4_clean_the_floor', en: 'clean the floor', vi: 'lau sàn nhà', emoji: '🧹', phonetic: '/kliːn ðə flɔː/', example_en: 'I help my dad clean the floor on Sundays.', example_vi: 'Em giúp bố lau sàn nhà vào ngày Chủ nhật.' },
      { id: 'l4_help_with_cooking', en: 'help with the cooking', vi: 'giúp đỡ việc nấu ăn', emoji: '🍳', phonetic: '/help wɪð ðə ˈkʊkɪŋ/', example_en: 'Children can help with the cooking safely.', example_vi: 'Trẻ em có thể giúp việc nấu ăn một cách an toàn.' },
      { id: 'l4_cooking', en: 'cooking', vi: 'việc nấu nướng', emoji: '🍲', phonetic: '/ˈkʊkɪŋ/', example_en: 'Mum loves cooking tasty soups for us.', example_vi: 'Mẹ rất thích nấu những món súp thơm ngon cho chúng em.' },
      { id: 'l4_wash_clothes', en: 'wash the clothes', vi: 'giặt quần áo', emoji: '🧺', phonetic: '/wɒʃ ðə ˈkləʊðz/', example_en: 'I help my mum wash the clothes.', example_vi: 'Em giúp mẹ giặt quần áo sạch sẽ.' },
      { id: 'l4_wash_dishes', en: 'wash the dishes', vi: 'rửa bát đĩa', emoji: '🧽', phonetic: '/wɒʃ ðə ˈdɪʃɪz/', example_en: 'After dinner, we wash the dishes together.', example_vi: 'Sau bữa tối, chúng em cùng nhau rửa bát đĩa.' },
      { id: 'l4_do_housework', en: 'do housework', vi: 'làm việc nhà', emoji: '🏠', phonetic: '/duː ˈhaʊswɜːk/', example_en: 'We do housework to keep our home neat.', example_vi: 'Chúng em làm việc nhà để giữ nhà cửa ngăn nắp.' },
    ],
  },

  // ── Unit 15: Cuối Tuần Của Gia Đình ────────────────
  {
    id: 'lop4_u15_weekends',
    gradeId: 'lop4',
    name_vi: 'Unit 15: Cuối Tuần Của Gia Đình',
    name_en: 'Unit 15: My Family\'s Weekends',
    emoji: '🎬',
    color: 'from-rose-400 to-pink-500',
    gradient: 'bg-gradient-to-br from-rose-100 to-pink-100',
    words: [
      { id: 'l4_cinema', en: 'cinema', vi: 'rạp chiếu phim', emoji: '🎬', phonetic: '/ˈsɪnəmə/', example_en: 'We watch cartoons at the cinema.', example_vi: 'Chúng em xem phim hoạt hình ở rạp chiếu phim.' },
      { id: 'l4_film', en: 'film', vi: 'bộ phim', emoji: '🎞️', phonetic: '/fɪlm/', example_en: 'That animated film is so exciting!', example_vi: 'Bộ phim hoạt hình đó thật là thú vị!' },
      { id: 'l4_watch', en: 'watch', vi: 'xem, theo dõi', emoji: '📺', phonetic: '/wɒtʃ/', example_en: 'We watch films together on Saturday.', example_vi: 'Gia đình em cùng xem phim vào thứ Bảy.' },
      { id: 'l4_television', en: 'television', vi: 'ti vi, truyền hình', emoji: '📺', phonetic: '/ˈtelɪvɪʒn/', example_en: 'We turn off the television after 9 p.m.', example_vi: 'Chúng em tắt ti vi sau 9 giờ tối.' },
      { id: 'l4_sports_centre', en: 'sports centre', vi: 'trung tâm thể thao', emoji: '🏟️', phonetic: '/ˈspɔːts sentə/', example_en: 'I practice karate at the sports centre.', example_vi: 'Em tập karate ở trung tâm thể thao.' },
      { id: 'l4_swimming_pool', en: 'swimming pool', vi: 'hồ bơi, bể bơi', emoji: '🏊', phonetic: '/ˈswɪmɪŋ puːl/', example_en: 'Water in the swimming pool is cool and blue.', example_vi: 'Nước trong bể bơi mát lành và xanh ngắt.' },
      { id: 'l4_centre', en: 'centre', vi: 'trung tâm', emoji: '🎯', phonetic: '/ˈsentə/', example_en: 'The community centre has a big library.', example_vi: 'Trung tâm cộng đồng có một thư viện lớn.' },
      { id: 'l4_do_yoga', en: 'do yoga', vi: 'tập yoga', emoji: '🧘', phonetic: '/duː ˈjəʊɡə/', example_en: 'Mum does yoga in the morning for good health.', example_vi: 'Mẹ tập yoga vào buổi sáng để có sức khỏe tốt.' },
      { id: 'l4_play_tennis', en: 'play tennis', vi: 'chơi quần vợt (tennis)', emoji: '🎾', phonetic: '/pleɪ \'tenɪs/', example_en: 'Dad and uncle play tennis on weekends.', example_vi: 'Bố và chú chơi quần vợt vào dịp cuối tuần.' },
      { id: 'l4_meal', en: 'meal', vi: 'bữa ăn gia đình', emoji: '🍽️', phonetic: '/miːl/', example_en: 'We enjoy a happy family meal together.', example_vi: 'Chúng em quây quần bên bữa ăn gia đình ấm cúng.' },
    ],
  },

  // ── Unit 16: Thời Tiết & Dạo Phố ────────────────
  {
    id: 'lop4_u16_weather',
    gradeId: 'lop4',
    name_vi: 'Unit 16: Thời Tiết & Dạo Phố',
    name_en: 'Unit 16: Weather',
    emoji: '⛅',
    color: 'from-sky-400 to-blue-500',
    gradient: 'bg-gradient-to-br from-sky-100 to-blue-100',
    words: [
      { id: 'l4_weather', en: 'weather', vi: 'thời tiết', emoji: '🌤️', phonetic: '/ˈweðə/', example_en: 'What is the weather like today? - It is sunny.', example_vi: 'Thời tiết hôm nay thế nào? - Trời nắng đẹp.' },
      { id: 'l4_sunny', en: 'sunny', vi: 'có nắng, trời nắng', emoji: '☀️', phonetic: '/ˈsʌni/', example_en: 'It is warm and sunny today.', example_vi: 'Hôm nay trời ấm áp và đầy nắng.' },
      { id: 'l4_cloudy', en: 'cloudy', vi: 'có mây, nhiều mây', emoji: '☁️', phonetic: '/ˈklaʊdi/', example_en: 'The sky is cloudy this afternoon.', example_vi: 'Bầu trời chiều nay có nhiều mây.' },
      { id: 'l4_rainy', en: 'rainy', vi: 'có mưa, trời mưa', emoji: '🌧️', phonetic: '/ˈreɪni/', example_en: 'Take an umbrella on a rainy day.', example_vi: 'Hãy mang ô vào một ngày trời mưa nhé.' },
      { id: 'l4_windy', en: 'windy', vi: 'có gió, gió to', emoji: '💨', phonetic: '/ˈwɪndi/', example_en: 'It is windy, perfect for flying a kite.', example_vi: 'Trời có gió lộng, rất thích hợp để thả diều.' },
      { id: 'l4_bakery', en: 'bakery', vi: 'tiệm bánh mì', emoji: '🥖', phonetic: '/ˈbeɪkəri/', example_en: 'The bakery smells of fresh hot bread.', example_vi: 'Tiệm bánh mì thơm phức mùi bánh nóng hổi.' },
      { id: 'l4_bookshop', en: 'bookshop', vi: 'hiệu sách', emoji: '📚', phonetic: '/ˈbʊkʃɒp/', example_en: 'I buy comic books at the bookshop.', example_vi: 'Em mua truyện tranh ở hiệu sách.' },
      { id: 'l4_food_stall', en: 'food stall', vi: 'quầy hàng thực phẩm', emoji: '🥟', phonetic: '/fuːd stɔːl/', example_en: 'We bought hot noodles at the food stall.', example_vi: 'Chúng em mua mì nóng ở quầy ẩm thực.' },
      { id: 'l4_water_park', en: 'water park', vi: 'công viên nước', emoji: '🌊', phonetic: '/ˈwɔːtə pɑːk/', example_en: 'Children love water slides at the water park.', example_vi: 'Trẻ em thích trượt máng nước ở công viên nước.' },
    ],
  },

  // ── Unit 17: Thành Phố & Chỉ Đường ────────────────
  {
    id: 'lop4_u17_city',
    gradeId: 'lop4',
    name_vi: 'Unit 17: Thành Phố & Chỉ Đường',
    name_en: 'Unit 17: In The City',
    emoji: '🚦',
    color: 'from-teal-400 to-emerald-500',
    gradient: 'bg-gradient-to-br from-teal-100 to-emerald-100',
    words: [
      { id: 'l4_get_to', en: 'get to', vi: 'đến (địa điểm nào đó)', emoji: '🗺️', phonetic: '/ɡet tə/', example_en: 'How can I get to the zoo?', example_vi: 'Làm thế nào để tôi đến được sở thú?' },
      { id: 'l4_go_straight', en: 'go straight', vi: 'đi thẳng', emoji: '⬆️', phonetic: '/ɡəʊ streɪt/', example_en: 'Go straight ahead for two hundred metres.', example_vi: 'Hãy đi thẳng về phía trước khoảng 200 mét.' },
      { id: 'l4_turn', en: 'turn', vi: 'rẽ, quẹo', emoji: '🔄', phonetic: '/tɜːn/', example_en: 'Turn at the traffic light.', example_vi: 'Hãy rẽ ở cột đèn giao thông.' },
      { id: 'l4_turn_left', en: 'turn left', vi: 'rẽ trái', emoji: '⬅️', phonetic: '/tɜːn \'left/', example_en: 'Turn left at the bakery.', example_vi: 'Rẽ sang bên trái ở chỗ tiệm bánh mì.' },
      { id: 'l4_turn_right', en: 'turn right', vi: 'rẽ phải', emoji: '➡️', phonetic: '/tɜːn \'raɪt/', example_en: 'Turn right at the bookstore.', example_vi: 'Rẽ sang bên phải ở chỗ hiệu sách.' },
      { id: 'l4_turn_round', en: 'turn round', vi: 'quay lại, quay đầu', emoji: '↩️', phonetic: '/tɜːn \'raʊnd/', example_en: 'Turn round, you missed the corner!', example_vi: 'Hãy quay đầu lại, bạn vừa đi quá góc đường rồi!' },
      { id: 'l4_left', en: 'left', vi: 'bên trái', emoji: '👈', phonetic: '/left/', example_en: 'The museum is on your left.', example_vi: 'Bảo tàng nằm ở phía bên trái của bạn.' },
      { id: 'l4_right', en: 'right', vi: 'bên phải', emoji: '👉', phonetic: '/raɪt/', example_en: 'The post office is on the right.', example_vi: 'Bưu điện nằm ở phía bên phải.' },
      { id: 'l4_stop', en: 'stop', vi: 'dừng lại', emoji: '🛑', phonetic: '/stɒp/', example_en: 'Stop when the traffic light turns red.', example_vi: 'Hãy dừng lại khi đèn giao thông chuyển sang màu đỏ.' },
      { id: 'l4_road_sign', en: 'road sign', vi: 'biển chỉ đường', emoji: '🚸', phonetic: '/ˈrəʊd saɪn/', example_en: 'Look at the road sign for directions.', example_vi: 'Hãy nhìn biển báo để biết hướng đi.' },
    ],
  },

  // ── Unit 18: Mua Sắm & Giá Cả ────────────────
  {
    id: 'lop4_u18_shopping',
    gradeId: 'lop4',
    name_vi: 'Unit 18: Mua Sắm & Giá Cả',
    name_en: 'Unit 18: At The Shopping Centre',
    emoji: '🛍️',
    color: 'from-fuchsia-400 to-purple-500',
    gradient: 'bg-gradient-to-br from-fuchsia-100 to-purple-100',
    words: [
      { id: 'l4_shopping_centre', en: 'shopping centre', vi: 'trung tâm mua sắm', emoji: '🏬', phonetic: '/ˈʃɒpɪŋ sentə/', example_en: 'There are many stores in the shopping centre.', example_vi: 'Có rất nhiều cửa hàng trong trung tâm thương mại.' },
      { id: 'l4_supermarket', en: 'supermarket', vi: 'siêu thị', emoji: '🛒', phonetic: '/ˈsuːpəmɑːkɪt/', example_en: 'We buy fresh fruits at the supermarket.', example_vi: 'Chúng em mua hoa quả tươi ở siêu thị.' },
      { id: 'l4_gift_shop', en: 'gift shop', vi: 'cửa hàng quà tặng', emoji: '🎁', phonetic: '/ˈɡɪft ʃɒp/', example_en: 'I bought a lovely card at the gift shop.', example_vi: 'Em mua một tấm thiệp xinh xắn ở tiệm quà lưu niệm.' },
      { id: 'l4_skirt', en: 'skirt', vi: 'chân váy, chiếc váy', emoji: '👗', phonetic: '/skɜːt/', example_en: 'She wears a blue pleated skirt.', example_vi: 'Cô bé mặc một chiếc chân váy màu xanh dương.' },
      { id: 'l4_t_shirt', en: 'T-shirt', vi: 'áo phông, áo thun', emoji: '👕', phonetic: '/ˈtiː ʃɜːt/', example_en: 'I wear a comfortable white T-shirt.', example_vi: 'Em mặc một chiếc áo phông trắng thoáng mát.' },
      { id: 'l4_dong', en: 'dong', vi: 'đồng (tiền tệ Việt Nam)', emoji: '💵', phonetic: '/dɒŋ/', example_en: 'The pen costs five thousand dong.', example_vi: 'Chiếc bút bi có giá 5.000 đồng.' },
      { id: 'l4_thousand', en: 'thousand', vi: 'nghìn, một ngàn', emoji: '🔢', phonetic: '/ˈθaʊznd/', example_en: 'Ten thousand dong for an ice cream.', example_vi: 'Mười nghìn đồng một chiếc kem.' },
      { id: 'l4_near', en: 'near', vi: 'ở gần', emoji: '📍', phonetic: '/nɪə/', example_en: 'The gift shop is near the entrance.', example_vi: 'Cửa hàng quà tặng nằm ở gần lối vào.' },
      { id: 'l4_behind', en: 'behind', vi: 'ở đằng sau', emoji: '🔙', phonetic: '/bɪˈhaɪnd/', example_en: 'The bakery is behind the supermarket.', example_vi: 'Tiệm bánh mì nằm ở đằng sau siêu thị.' },
      { id: 'l4_between', en: 'between', vi: 'ở giữa (hai nơi)', emoji: '↔️', phonetic: '/bɪˈtwiːn/', example_en: 'The bookshop is between the bakery and cinema.', example_vi: 'Hiệu sách nằm ở giữa tiệm bánh và rạp chiếu phim.' },
      { id: 'l4_opposite', en: 'opposite', vi: 'ở đối diện', emoji: '🔄', phonetic: '/ˈɒpəzɪt/', example_en: 'The toy shop is opposite the gift shop.', example_vi: 'Cửa hàng đồ chơi nằm đối diện cửa hàng quà tặng.' },
    ],
  },

  // ── Unit 19: Thế Giới Động Vật ────────────────
  {
    id: 'lop4_u19_animals',
    gradeId: 'lop4',
    name_vi: 'Unit 19: Thế Giới Động Vật',
    name_en: 'Unit 19: The Animal World',
    emoji: '🦁',
    color: 'from-amber-400 to-yellow-500',
    gradient: 'bg-gradient-to-br from-amber-100 to-yellow-100',
    words: [
      { id: 'l4_lion', en: 'lion', vi: 'con sư tử', emoji: '🦁', phonetic: '/ˈlaɪən/', example_en: 'The brave lion is the king of the jungle.', example_vi: 'Chú sư tử dũng cảm là chúa tể rừng xanh.' },
      { id: 'l4_giraffe', en: 'giraffe', vi: 'hươu cao cổ', emoji: '🦒', phonetic: '/dʒɪˈrɑːf/', example_en: 'The tall giraffe eats green leaves from trees.', example_vi: 'Chú hươu cao cổ ăn lá xanh trên ngọn cây.' },
      { id: 'l4_hippo', en: 'hippo', vi: 'hà mã', emoji: '🦛', phonetic: '/ˈhɪpəʊ/', example_en: 'The big hippo likes swimming in the river.', example_vi: 'Chú hà mã to lớn thích bơi lội dưới sông.' },
      { id: 'l4_crocodile', en: 'crocodile', vi: 'con cá sấu', emoji: '🐊', phonetic: '/ˈkrɒkədaɪl/', example_en: 'The green crocodile has very sharp teeth.', example_vi: 'Chú cá sấu xanh có hàm răng rất sắc nhọn.' },
      { id: 'l4_roar', en: 'roar', vi: 'tiếng gầm, gầm rống', emoji: '🔊', phonetic: '/rɔː/', example_en: 'Lions roar loudly in the zoo.', example_vi: 'Những chú sư tử gầm vang thật to trong sở thú.' },
      { id: 'l4_loudly', en: 'loudly', vi: 'ầm ĩ, vang to', emoji: '📢', phonetic: '/ˈlaʊdli/', example_en: 'The monkeys chatter loudly in the trees.', example_vi: 'Lũ khỉ kêu chí chóe thật to trên các tán cây.' },
      { id: 'l4_quickly', en: 'quickly', vi: 'nhanh nhẹn, mau chóng', emoji: '⚡', phonetic: '/ˈkwɪkli/', example_en: 'Cheetahs run very quickly across the field.', example_vi: 'Báo đốm chạy rất nhanh băng qua cánh đồng.' },
      { id: 'l4_merrily', en: 'merrily', vi: 'vui tươi, ríu rít', emoji: '🎵', phonetic: '/ˈmerəli/', example_en: 'Birds sing merrily in the sunny garden.', example_vi: 'Những chú chim hót líu lo vui vẻ trong vườn đầy nắng.' },
      { id: 'l4_beautifully', en: 'beautifully', vi: 'tuyệt đẹp, duyên dáng', emoji: '🦚', phonetic: '/ˈbjuːtɪfli/', example_en: 'The peacock dances beautifully.', example_vi: 'Chú công xoè đuôi múa thật là đẹp đẽ.' },
      { id: 'l4_burrow', en: 'burrow', vi: 'hang đất (thỏ, cầy)', emoji: '🕳️', phonetic: '/ˈbʌrəʊ/', example_en: 'Rabbits dig a burrow underground.', example_vi: 'Những chú thỏ đào hang sâu dưới lòng đất.' },
      { id: 'l4_den', en: 'den', vi: 'hang ổ (sư tử)', emoji: '⛰️', phonetic: '/den/', example_en: 'The lion family rests in their cool den.', example_vi: 'Gia đình sư tử nghỉ ngơi trong hang ổ mát mẻ.' },
      { id: 'l4_web', en: 'web', vi: 'mạng nhện', emoji: '🕸️', phonetic: '/web/', example_en: 'The spider spins a silky web.', example_vi: 'Chú nhện giăng một mạng tơ óng ánh.' },
    ],
  },

  // ── Unit 20: Trại Hè & Lửa Trại ────────────────
  {
    id: 'lop4_u20_summer_camp',
    gradeId: 'lop4',
    name_vi: 'Unit 20: Trại Hè & Lửa Trại',
    name_en: 'Unit 20: At Summer Camp',
    emoji: '⛺',
    color: 'from-red-400 to-orange-500',
    gradient: 'bg-gradient-to-br from-red-100 to-orange-100',
    words: [
      { id: 'l4_tent', en: 'tent', vi: 'lều cắm trại', emoji: '⛺', phonetic: '/tent/', example_en: 'We sleep in a cozy tent at camp.', example_vi: 'Chúng em ngủ trong căn lều ấm áp ở khu cắm trại.' },
      { id: 'l4_put_up_tent', en: 'put up a tent', vi: 'dựng lều, cắm trại', emoji: '🎪', phonetic: '/pʊt ʌp ə \'tent/', example_en: 'We work together to put up a tent.', example_vi: 'Chúng em cùng nhau chung sức dựng lều trại.' },
      { id: 'l4_build_campfire', en: 'build a campfire', vi: 'đốt lửa trại', emoji: '🔥', phonetic: '/bɪld ə ˈkæmpfaɪə/', example_en: 'The scouts build a campfire at night.', example_vi: 'Các bạn hướng đạo sinh đốt lửa trại vào ban đêm.' },
      { id: 'l4_dance_around_campfire', en: 'dance around the campfire', vi: 'nhảy múa quanh lửa trại', emoji: '💃', phonetic: '/dɑːns əˈraʊnd ðə ˈkæmpfaɪə/', example_en: 'We dance around the campfire happily.', example_vi: 'Chúng em hào hứng nhảy múa quanh đốm lửa trại.' },
      { id: 'l4_around', en: 'around', vi: 'xung quanh', emoji: '🔄', phonetic: '/əˈraʊnd/', example_en: 'Children sit around the warm fire.', example_vi: 'Các bạn nhỏ ngồi xung quanh ngọn lửa ấm áp.' },
      { id: 'l4_play_card_games', en: 'play card games', vi: 'chơi trò chơi thẻ bài', emoji: '🃏', phonetic: '/pleɪ \'kɑːd ɡeɪmz/', example_en: 'We play card games inside the tent.', example_vi: 'Chúng em chơi trò chơi đánh bài vui vẻ trong lều.' },
      { id: 'l4_play_tug_of_war', en: 'play tug of war', vi: 'chơi kéo co', emoji: '🪢', phonetic: '/pleɪ ˌtʌɡ əv \'wɔː/', example_en: 'Our team wins when we play tug of war!', example_vi: 'Đội của chúng em đã chiến thắng khi chơi kéo co!' },
      { id: 'l4_sing_songs', en: 'sing songs', vi: 'hát các bài hát', emoji: '🎤', phonetic: '/sɪŋ sɒŋz/', example_en: 'We sing songs together under the stars.', example_vi: 'Chúng em cùng hát những bài hát dưới bầu trời đầy sao.' },
      { id: 'l4_tell_story', en: 'tell a story', vi: 'kể một câu chuyện', emoji: '📖', phonetic: '/tel ə \'stɔːri/', example_en: 'Our teacher tells a story about forest animals.', example_vi: 'Thầy giáo kể một câu chuyện thú vị về các loài thú rừng.' },
      { id: 'l4_take_photo', en: 'take a photo', vi: 'chụp một bức ảnh', emoji: '📸', phonetic: '/teɪk ə \'fəʊtəʊ/', example_en: 'Smile and say cheese while I take a photo!', example_vi: 'Cười lên nào để tớ chụp một bức ảnh kỷ niệm nhé!' },
      { id: 'l4_photo', en: 'photo', vi: 'bức ảnh chụp', emoji: '🖼️', phonetic: '/ˈfəʊtəʊ/', example_en: 'This summer camp photo is so lovely.', example_vi: 'Bức ảnh chụp đợt trại hè này thật là đáng yêu.' },
    ],
  },

    // ════════════════════════════════════════
  // LỚP 5 – SGK Tiếng Anh 5 Global Success (Tập 1 & Tập 2 - 20 Units)
  // ════════════════════════════════════════
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
