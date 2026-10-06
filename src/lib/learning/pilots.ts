import type { LearningResource } from './types';

// Original supplementary drafts. These are previews, not publisher lessons.
// Vocabulary links are resolved against the existing category, retaining all IDs.
export interface PilotDraft {
  unitId: string;
  title: string;
  scenes: { speaker?: string; en: string; vi: string; terms: string[] }[];
  application: LearningResource['application'];
  examples: Record<string, [string, string]>;
  comprehension: { question: string; hint: string; answer: string; choices: string[] };
}

export const PILOT_DRAFTS: PilotDraft[] = [
  {
    unitId: 'lop1_unit1', title: 'Cùng chơi trên sân trường',
    scenes: [
      { en: 'A ball.', vi: 'Một quả bóng.', terms: ['ball'] },
      { en: 'A bike.', vi: 'Một chiếc xe đạp.', terms: ['bike'] },
      { en: 'A book.', vi: 'Một quyển sách.', terms: ['book'] },
    ],
    examples: { ball: ['A ball.', 'Một quả bóng.'], bike: ['A bike.', 'Một chiếc xe đạp.'], book: ['A book.', 'Một quyển sách.'] },
    comprehension: { question: 'Trong cảnh đầu tiên, con gặp đồ vật nào?', hint: 'Cảnh đầu tiên: A ball. — Một quả bóng.', answer: 'ball', choices: ['ball', 'bike', 'book'] },
    application: { instruction: 'Chọn một từ và thử nói theo mẫu. Con có thể chỉ vào đồ vật tương ứng.', prompts: ['Ball', 'Bike', 'Book'], example: 'A ball.', exampleVi: 'Một quả bóng.' },
  },
  {
    unitId: 'lop2_unit1', title: 'Bữa tiệc nhỏ',
    scenes: [
      { speaker: 'Mai', en: 'Pasta, please.', vi: 'Cho mình mì Ý nhé.', terms: ['pasta'] },
      { speaker: 'Nam', en: 'Pizza, please.', vi: 'Cho mình bánh pizza nhé.', terms: ['pizza'] },
      { speaker: 'Mai', en: 'Popcorn, please.', vi: 'Cho mình bỏng ngô nhé.', terms: ['popcorn'] },
      { speaker: 'Nam', en: 'Thank you!', vi: 'Cảm ơn!', terms: [] },
    ],
    examples: { pasta: ['Pasta, please.', 'Cho mình mì Ý nhé.'], pizza: ['Pizza, please.', 'Cho mình bánh pizza nhé.'], popcorn: ['Popcorn, please.', 'Cho mình bỏng ngô nhé.'] },
    comprehension: { question: 'Ở lượt đầu của Nam, bạn ấy chọn món nào?', hint: 'Nam nói: Pizza, please.', answer: 'pizza', choices: ['pasta', 'pizza', 'popcorn'] },
    application: { instruction: 'Chọn món con thích và nói một câu theo mẫu.', prompts: ['Pasta', 'Pizza', 'Popcorn'], example: 'Pizza, please.', exampleVi: 'Cho mình bánh pizza nhé.' },
  },
  {
    unitId: 'lop3_unit1', title: 'Gặp bạn ở cổng trường',
    scenes: [
      { speaker: 'Mai', en: 'Hello, Nam!', vi: 'Xin chào Nam!', terms: ['hello'] },
      { speaker: 'Nam', en: 'Hi, Mai!', vi: 'Chào Mai!', terms: ['hi'] },
      { speaker: 'Mai', en: 'How are you?', vi: 'Bạn khỏe không?', terms: [] },
      { speaker: 'Nam', en: "I'm fine, thank you.", vi: 'Mình khỏe, cảm ơn bạn.', terms: ['fine'] },
      { speaker: 'Mai', en: 'Goodbye, Nam!', vi: 'Tạm biệt Nam!', terms: ['goodbye'] },
    ],
    examples: { hello: ['Hello, Nam!', 'Xin chào Nam!'], hi: ['Hi, Mai!', 'Chào Mai!'], bye: ['Bye, Mai!', 'Tạm biệt Mai!'], goodbye: ['Goodbye, Nam!', 'Tạm biệt Nam!'], fine: ["I'm fine, thank you.", 'Mình khỏe, cảm ơn bạn.'] },
    comprehension: { question: 'Cuối cuộc trò chuyện, Mai dùng từ nào để chào tạm biệt?', hint: 'Mai nói: Goodbye, Nam!', answer: 'goodbye', choices: ['hello', 'fine', 'goodbye'] },
    application: { instruction: 'Viết hoặc nói 2–3 câu để chào và hỏi thăm một người bạn. Đây là hoạt động mở, không chấm đúng/sai tự động.', prompts: ['Hello, …!', 'How are you?', "I'm fine, thank you."], example: "Hello, Mai! How are you? I'm fine, thank you.", exampleVi: 'Chào Mai! Bạn khỏe không? Mình khỏe, cảm ơn bạn.' },
  },
  {
    unitId: 'lop4_c1_unit_1_my_friends', title: 'Những người bạn mới',
    scenes: [
      { speaker: 'Mai', en: 'Hello! My name is Mai.', vi: 'Xin chào! Mình tên là Mai.', terms: [] },
      { speaker: 'Ben', en: "Hi! I'm Ben. I'm from Britain.", vi: 'Chào bạn! Mình là Ben. Mình đến từ Anh.', terms: ['britain'] },
      { speaker: 'Mai', en: 'Where are you from, Yuki?', vi: 'Bạn đến từ đâu, Yuki?', terms: [] },
      { speaker: 'Yuki', en: "I'm from Japan.", vi: 'Mình đến từ Nhật Bản.', terms: ['japan'] },
      { speaker: 'Amy', en: "I'm from Australia.", vi: 'Mình đến từ Úc.', terms: ['australia'] },
      { speaker: 'Mai', en: 'Nice to meet you!', vi: 'Rất vui được gặp các bạn!', terms: [] },
    ],
    examples: { america: ["I'm from America.", 'Mình đến từ Mỹ.'], australia: ["I'm from Australia.", 'Mình đến từ Úc.'], britain: ["I'm from Britain.", 'Mình đến từ Anh.'], japan: ["I'm from Japan.", 'Mình đến từ Nhật Bản.'], malaysia: ["I'm from Malaysia.", 'Mình đến từ Ma-lai-xi-a.'], singapore: ["I'm from Singapore.", 'Mình đến từ Xinh-ga-po.'] },
    comprehension: { question: 'Ben đến từ nước nào?', hint: "Ben nói: I'm from Britain.", answer: 'britain', choices: ['britain', 'japan', 'australia'] },
    application: { instruction: 'Đóng vai một người bạn mới. Giới thiệu tên và nơi bạn đến từ, rồi hỏi bạn còn lại. Có thể dùng tên nhân vật.', prompts: ['My name is ….', "I'm from ….", 'Where are you from?'], example: "My name is Ben. I'm from Britain. Where are you from?", exampleVi: 'Mình tên là Ben. Mình đến từ Anh. Bạn đến từ đâu?' },
  },
  {
    unitId: 'lop5_c1_unit_1_all_about_me', title: 'Tấm thẻ giới thiệu của Linh',
    scenes: [
      { en: 'Hello! My name is Linh.', vi: 'Xin chào! Mình tên là Linh.', terms: [] },
      { en: "I'm in Class 5A.", vi: 'Mình học lớp 5A.', terms: [] },
      { en: 'I live in the countryside.', vi: 'Mình sống ở vùng nông thôn.', terms: ['countryside'] },
      { en: 'My favourite colour is pink.', vi: 'Màu yêu thích của mình là màu hồng.', terms: ['pink'] },
      { en: 'My favourite food is a sandwich.', vi: 'Món ăn yêu thích của mình là bánh mì kẹp.', terms: ['sandwich'] },
      { en: 'My favourite sport is table tennis.', vi: 'Môn thể thao yêu thích của mình là bóng bàn.', terms: ['table tennis'] },
      { en: 'Can you tell me about yourself?', vi: 'Bạn có thể giới thiệu về bản thân không?', terms: [] },
      { en: 'My friend lives in the city.', vi: 'Bạn của mình sống ở thành phố.', terms: ['city'] },
    ],
    examples: { city: ['My friend lives in the city.', 'Bạn của mình sống ở thành phố.'], countryside: ['I live in the countryside.', 'Mình sống ở vùng nông thôn.'], pink: ['My favourite colour is pink.', 'Màu yêu thích của mình là màu hồng.'], sandwich: ['My favourite food is a sandwich.', 'Món ăn yêu thích của mình là bánh mì kẹp.'], 'table tennis': ['My favourite sport is table tennis.', 'Môn thể thao yêu thích của mình là bóng bàn.'] },
    comprehension: { question: 'Linh sống ở đâu? Hãy phân biệt nơi Linh sống với nơi bạn của Linh sống.', hint: 'Linh nói: I live in the countryside. My friend lives in the city.', answer: 'countryside', choices: ['city', 'countryside'] },
    application: { instruction: 'Tạo tấm thẻ giới thiệu bằng 3–4 câu: tên, lớp, nơi ở và một sở thích. Nói hoặc viết; không cần chia sẻ thông tin riêng tư.', prompts: ['My name is ….', "I'm in Class ….", 'I live in ….', 'My favourite … is … .'], example: "My name is Linh. I'm in Class 5A. I live in the countryside. My favourite sport is table tennis.", exampleVi: 'Mình tên là Linh. Mình học lớp 5A. Mình sống ở vùng nông thôn. Môn thể thao yêu thích của mình là bóng bàn.' },
  },
];
