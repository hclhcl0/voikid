// =============================================
// VocaKids – 8 Exercise Stations Export & Metadata
// =============================================

export { ExerciseListenPickPicture } from './ExerciseListenPickPicture';
export { ExerciseLookPickWord } from './ExerciseLookPickWord';
export { ExerciseMatchWordPicture } from './ExerciseMatchWordPicture';
export { ExerciseListenPickLetter } from './ExerciseListenPickLetter';
export { ExerciseFillMissingLetter } from './ExerciseFillMissingLetter';
export { ExerciseMemoryMatch } from './ExerciseMemoryMatch';
export { ExerciseListenRecordReview } from './ExerciseListenRecordReview';
export { ExerciseListenOrderSequence } from './ExerciseListenOrderSequence';

export type ExerciseType =
  | 'listen_pick_pic'     // 1. Nghe và chọn hình
  | 'look_pick_word'      // 2. Nhìn hình và chọn từ
  | 'match_word_pic'      // 3. Ghép từ với hình
  | 'listen_pick_letter'  // 4. Nghe và chọn chữ cái
  | 'fill_missing_letter' // 5. Điền chữ còn thiếu
  | 'memory_match'        // 6. Lật thẻ tìm cặp
  | 'record_review'       // 7. Nghe, nói và nghe lại giọng mình
  | 'order_sequence';     // 8. Nghe và sắp xếp tranh

export interface ExerciseMeta {
  id: ExerciseType;
  num: number;
  title: string;
  tagline: string;
  goal: string;
  icon: string;
  color: string;
  badgeColor: string;
  priority: 'Làm trước' | 'Giai đoạn 2';
}

export const EXERCISE_METAS: ExerciseMeta[] = [
  {
    id: 'listen_pick_pic',
    num: 1,
    title: 'Nghe và chọn hình',
    tagline: 'Bấm loa nghe từ, chọn đúng trong 2–3 hình.',
    goal: 'Nghe hiểu từ vựng',
    icon: '👂',
    color: 'from-violet-500 to-indigo-600',
    badgeColor: 'bg-violet-100 text-violet-700',
    priority: 'Làm trước',
  },
  {
    id: 'look_pick_word',
    num: 2,
    title: 'Nhìn hình và chọn từ',
    tagline: 'Hiện một hình, chọn một trong 2–3 từ. Có nút nghe lại.',
    goal: 'Nhận diện mặt chữ',
    icon: '👀',
    color: 'from-pink-500 to-rose-600',
    badgeColor: 'bg-pink-100 text-pink-700',
    priority: 'Làm trước',
  },
  {
    id: 'match_word_pic',
    num: 3,
    title: 'Ghép từ với hình',
    tagline: 'Kéo từ vào hình tương ứng hoặc chạm lần lượt để ghép.',
    goal: 'Ghi nhớ nghĩa của từ',
    icon: '🧩',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    priority: 'Làm trước',
  },
  {
    id: 'listen_pick_letter',
    num: 4,
    title: 'Nghe và chọn chữ cái',
    tagline: 'Nghe tên chữ hoặc âm đang luyện, chọn chữ đúng (2 chế độ).',
    goal: 'Nhận biết chữ và âm',
    icon: '🔤',
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    priority: 'Làm trước',
  },
  {
    id: 'fill_missing_letter',
    num: 5,
    title: 'Điền chữ còn thiếu',
    tagline: 'Có hình và từ khuyết một chữ; trẻ kéo chữ vào ô trống.',
    goal: 'Làm quen cách viết từ',
    icon: '✍️',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-100 text-amber-800',
    priority: 'Làm trước',
  },
  {
    id: 'memory_match',
    num: 6,
    title: 'Lật thẻ tìm cặp',
    tagline: 'Lật tìm cặp tranh–tranh hoặc tranh–từ; phát âm khi đúng.',
    goal: 'Ôn tập qua trò chơi',
    icon: '🃏',
    color: 'from-purple-500 to-fuchsia-600',
    badgeColor: 'bg-purple-100 text-purple-700',
    priority: 'Làm trước',
  },
  {
    id: 'record_review',
    num: 7,
    title: 'Nghe, nói & nghe lại',
    tagline: 'Nghe mẫu → ghi âm giọng bé → nghe lại → luyện lần nữa.',
    goal: 'Luyện nói, tạo sự tự tin',
    icon: '🎙️',
    color: 'from-rose-500 to-red-600',
    badgeColor: 'bg-rose-100 text-rose-700',
    priority: 'Giai đoạn 2',
  },
  {
    id: 'order_sequence',
    num: 8,
    title: 'Nghe và sắp xếp tranh',
    tagline: 'Nghe lần lượt 3 từ rồi xếp tranh vào đúng thứ tự 1-2-3.',
    goal: 'Luyện nghe và ghi nhớ',
    icon: '🔢',
    color: 'from-blue-500 to-sky-600',
    badgeColor: 'bg-blue-100 text-blue-700',
    priority: 'Giai đoạn 2',
  },
];
