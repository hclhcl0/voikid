/* eslint-disable @typescript-eslint/no-require-imports -- Matches the project's CommonJS test loader. */
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./ts-loader.cjs');
const { treasureWords, treasureChoices, treasureComplete, treasureReward } = load('src/lib/games/treasure.ts');
const { pronunciationStarGain } = load('src/lib/pronunciation/rewards.ts');
const { CATEGORIES } = load('src/lib/vocabulary.ts');
const { mergeStickers } = load('src/lib/stickers.ts');
const word = (id, en, vi) => ({ id, en, vi, phonetic: '', emoji: '', example_en: '', example_vi: '' });
const words = [word('a', 'America', 'nước Mỹ'), word('b', 'Australia', 'nước Úc'), word('c', 'Japan', 'nước Nhật'), word('d', 'England', 'nước Anh'), word('e', 'Vietnam', 'nước Việt Nam'), word('f', 'Malaysia', 'nước Malaysia')];

test('selects up to five distinct playable words deterministically without mutating the catalog', () => {
  const original = JSON.stringify(words);
  const result = treasureWords(words, 'child-session');
  assert.equal(result.length, 5);
  assert.equal(new Set(result.map(w => w.id)).size, 5);
  assert.deepEqual(result, treasureWords(words, 'child-session'));
  assert.equal(JSON.stringify(words), original);
});

test('excludes ambiguous duplicate spellings, meanings, IDs and missing content', () => {
  const batch = treasureWords([...words, word('x', ' AMERICA ', 'Mỹ'), word('y', 'USA', ' NƯỚC MỸ '), word('a', 'test', 'thử'), word('empty', '', 'trống'), word('no-meaning', 'nothing', ''), word('', 'missing-id', 'thiếu mã')], 'duplicates');
  assert.equal(new Set(batch.map(w => w.id)).size, batch.length);
  assert.equal(new Set(batch.map(w => w.en.trim().toLowerCase())).size, batch.length);
  assert.equal(new Set(batch.map(w => w.vi.trim().toLowerCase())).size, batch.length);
  assert.ok(batch.every(w => w.id && w.en && w.vi));
});

test('all multiple-choice questions have exactly one correct option and distinct meanings', () => {
  const batch = treasureWords(words, 'options');
  for (const target of batch) {
    const options = treasureChoices(batch, target, target.id);
    assert.equal(options.length, 4);
    assert.equal(options.filter(w => w.id === target.id).length, 1);
    assert.equal(new Set(options.map(w => w.vi)).size, options.length);
  }
});

test('small and empty units remain safe; matching cannot complete a missing stage', () => {
  assert.deepEqual(treasureWords([], 'empty'), []);
  assert.equal(treasureComplete([], [], [], []), false);
  const batch = [words[0]];
  assert.deepEqual(treasureChoices(batch, batch[0], 'single'), batch);
  assert.equal(treasureComplete(batch, ['a'], [], ['a']), false);
  assert.equal(treasureComplete(batch, ['a'], ['a'], []), false);
  assert.equal(treasureComplete(batch, ['unrelated'], ['a'], ['a']), false);
  assert.equal(treasureComplete(batch, ['a'], ['a'], ['a']), true);
});

test('rewards have stable replay IDs, separate unit/grade editions and increasing tiers', () => {
  const lower = treasureReward('unit1', 'lop1');
  const upper = treasureReward('unit1', 'lop5');
  assert.deepEqual(treasureReward('unit1', 'lop5'), upper);
  assert.notEqual(lower.id, upper.id);
  assert.notEqual(upper.id, treasureReward('unit2', 'lop5').id);
  assert.equal(lower.tier, 'basic');
  assert.equal(treasureReward('unit1', 'lop4').tier, 'rare');
  assert.equal(upper.tier, 'legendary');
  assert.match(upper.condition, /không chứng nhận phát âm/);
});

test('replaying never farms existing pronunciation stars, and practice never removes them', () => {
  assert.equal(pronunciationStarGain(0, 3), 3);
  assert.equal(pronunciationStarGain(1, 3), 2);
  assert.equal(pronunciationStarGain(3, 3), 0);
  assert.equal(pronunciationStarGain(3, 0), 0);
});

test('every existing unit supplies a playable treasure batch with valid answers', () => {
  for (const category of CATEGORIES) {
    const batch = treasureWords(category.words, category.id);
    assert.ok(batch.length > 0 && batch.length <= 5, category.id);
    for (const target of batch) {
      const options = treasureChoices(batch, target, target.id);
      assert.equal(options.filter(w => w.id === target.id).length, 1, category.id);
      assert.equal(new Set(options.map(w => w.vi.trim().toLowerCase())).size, options.length, category.id);
    }
  }
});

test('the existing server sticker merge keeps treasure rewards and deduplicates replays', () => {
  const earned = { ...treasureReward('unit1', 'lop4'), earnedAt: '2026-10-07T02:00:00Z' };
  const replay = { ...earned, earnedAt: '2026-10-08T02:00:00Z' };
  assert.deepEqual(mergeStickers([earned], [replay]), [earned]);
  assert.equal(mergeStickers([earned], [{ ...treasureReward('unit1', 'lop5'), earnedAt: earned.earnedAt }]).length, 2);
});
