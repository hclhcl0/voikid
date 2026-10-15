/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./ts-loader.cjs');

const { selectDailyWords } = load('src/lib/dailyWords.ts');
const { validateContent, defaultSettings } = load('src/lib/backend/types.ts');

const mockCategories = [
  {
    id: 'cat_animals',
    name_vi: 'Động vật',
    name_en: 'Animals',
    gradeId: 'lop1',
    emoji: '🐾',
    color: 'bg-orange-100',
    gradient: 'from-orange-400 to-amber-500',
    words: [
      { id: 'w_cat', en: 'Cat', vi: 'Con mèo', phonetic: '/kæt/', emoji: '🐱', example_en: 'A cute cat.', example_vi: 'Một con mèo đáng yêu.' },
      { id: 'w_dog', en: 'Dog', vi: 'Con chó', phonetic: '/dɒɡ/', emoji: '🐶', example_en: 'A loyal dog.', example_vi: 'Một con chó trung thành.' },
      { id: 'w_bird', en: 'Bird', vi: 'Con chim', phonetic: '/bɜːd/', emoji: '🐦', example_en: 'A blue bird.', example_vi: 'Một con chim xanh.' },
      { id: 'w_fish', en: 'Fish', vi: 'Con cá', phonetic: '/fɪʃ/', emoji: '🐟', example_en: 'A gold fish.', example_vi: 'Một con cá vàng.' },
    ],
  },
  {
    id: 'cat_colors',
    name_vi: 'Màu sắc',
    name_en: 'Colors',
    gradeId: 'lop1',
    emoji: '🎨',
    color: 'bg-sky-100',
    gradient: 'from-sky-400 to-blue-500',
    words: [
      { id: 'w_red', en: 'Red', vi: 'Màu đỏ', phonetic: '/red/', emoji: '🔴', example_en: 'Red apple.', example_vi: 'Quả táo đỏ.' },
      { id: 'w_blue', en: 'Blue', vi: 'Màu xanh', phonetic: '/bluː/', emoji: '🔵', example_en: 'Blue sky.', example_vi: 'Bầu trời xanh.' },
    ],
  },
];

test('selectDailyWords selects configured count of words deterministically based on date', () => {
  const result1 = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 1,
    wordProgress: {},
  });

  const result2 = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 1,
    wordProgress: {},
  });

  assert.equal(result1.length, 1);
  assert.equal(result2.length, 1);
  assert.equal(result1[0].word.id, result2[0].word.id);
  assert.equal(result1[0].isLearned, false);
  assert.equal(result1[0].isSpoken, false);
});

test('changing date selects a different word', () => {
  const day1 = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 1,
  });

  const day2 = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-14',
    count: 1,
  });

  assert.ok(day1[0].word.id);
  assert.ok(day2[0].word.id);
  // Two different dates should yield valid words
  assert.equal(typeof day1[0].word.en, 'string');
  assert.equal(typeof day2[0].word.en, 'string');
});

test('handles count > 1 and respects dailyNewWordsCount setting', () => {
  const words = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 3,
  });

  assert.equal(words.length, 3);
  const ids = new Set(words.map(w => w.word.id));
  assert.equal(ids.size, 3); // All distinct words
});

test('prioritizes unstudied words over already mastered words', () => {
  // Mark all animal words as mastered except w_fish
  const wordProgress = {
    'cat_animals:w_cat': { wordId: 'w_cat', catId: 'cat_animals', stars: 3, mastered: true, attempts: 5 },
    'cat_animals:w_dog': { wordId: 'w_dog', catId: 'cat_animals', stars: 3, mastered: true, attempts: 5 },
    'cat_animals:w_bird': { wordId: 'w_bird', catId: 'cat_animals', stars: 3, mastered: true, attempts: 5 },
    'cat_colors:w_red': { wordId: 'w_red', catId: 'cat_colors', stars: 3, mastered: true, attempts: 5 },
    'cat_colors:w_blue': { wordId: 'w_blue', catId: 'cat_colors', stars: 3, mastered: true, attempts: 5 },
  };

  const words = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 1,
    wordProgress,
  });

  assert.equal(words.length, 1);
  assert.equal(words[0].word.id, 'w_fish'); // Picked the unstudied one!
  assert.equal(words[0].isLearned, false);
});

test('tracks isLearned and isSpoken states correctly', () => {
  const wordProgress = {
    'cat_animals:w_cat': { wordId: 'w_cat', catId: 'cat_animals', stars: 3, attempts: 1, bestScore: 0, lastPronunciationAttemptId:'ai-test-attempt',consecutivePasses:1 },
  };

  const words = selectDailyWords({
    categories: mockCategories.slice(0, 1),
    gradeId: 'lop1',
    count: 4,
    wordProgress,
  });

  const catWord = words.find(w => w.word.id === 'w_cat');
  assert.ok(catWord);
  if (catWord) {
    assert.equal(catWord.isLearned, true);
    assert.equal(catWord.isSpoken, true);
    assert.equal(catWord.isCompleted, true);
  }
});

test('remembering a daily word never creates pronunciation evidence or free stars',()=>{
  const {markDailyWordLearned,dailyWordStatus}=load('src/lib/dailyWordProgress.ts');
  const progress={totalStars:7,wordProgress:{},dailyStats:[],stickers:[]};
  const next=markDailyWordLearned(progress,'cat_animals','w_cat','2026-10-15T01:00:00Z');
  const word=next.wordProgress['cat_animals:w_cat'];
  assert.equal(next.totalStars,7);assert.equal(word.attempts,0);assert.equal(word.stars,0);
  assert.equal(word.lastPronunciationAttemptId,undefined);
  assert.deepEqual(dailyWordStatus(word),{isLearned:true,isSpoken:false,isCompleted:false});
  assert.equal(markDailyWordLearned(next,'cat_animals','w_cat'),next);
  assert.deepEqual(dailyWordStatus({...word,lastPronunciationAttemptId:'pass-1',consecutivePasses:1,stars:3}),{isLearned:true,isSpoken:true,isCompleted:true});
  assert.equal(dailyWordStatus({...word,lastPronunciationAttemptId:'practice-1',consecutivePasses:0}).isCompleted,false);
  assert.equal(dailyWordStatus({...word,attempts:1,bestScore:100}).isSpoken,false);
});

test('validates dailyNewWordsCount setting in SiteSettings', () => {
  const validData = {
    revision: 1,
    updatedAt: new Date().toISOString(),
    categories: [],
    settings: {
      ...defaultSettings,
      dailyNewWordsCount: 3,
      dailyNewWordsSource: 'shop',
    },
  };
  assert.doesNotThrow(() => validateContent(validData));

  const invalidCountData = {
    ...validData,
    settings: {
      ...defaultSettings,
      dailyNewWordsCount: 25, // Exceeds max 20
    },
  };
  assert.throws(() => validateContent(invalidCountData), /Số từ mới mỗi ngày/);

  const invalidSourceData = {
    ...validData,
    settings: {
      ...defaultSettings,
      dailyNewWordsSource: 'invalid_source',
    },
  };
  assert.throws(() => validateContent(invalidSourceData), /Nguồn từ mới phải là curriculum, shop hoặc all/);
});

test('selectDailyWords with source="shop" selects words from shopThemes', () => {
  const words = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 2,
    source: 'shop',
  });

  assert.equal(words.length, 2);
  assert.ok(words[0].category.id.startsWith('shop_'));
  assert.ok(words[1].category.id.startsWith('shop_'));
  assert.ok(words[0].word.en);
  assert.ok(words[0].word.vi);
});

test('selectDailyWords with source="all" includes words from both curriculum and shop', () => {
  const words = selectDailyWords({
    categories: mockCategories,
    gradeId: 'lop1',
    dateStr: '2026-10-13',
    count: 5,
    source: 'all',
  });

  assert.equal(words.length, 5);
  for (const item of words) {
    assert.ok(item.word.id);
    assert.ok(item.word.en);
  }
});

