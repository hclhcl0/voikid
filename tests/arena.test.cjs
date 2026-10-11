/* eslint-disable @typescript-eslint/no-require-imports -- Uses the existing CommonJS test loader. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./ts-loader.cjs');
const { createArenaQuestions, initialArena, answerArena, arenaResult } = load('src/lib/arena.ts');
const words = Array.from({ length: 12 }, (_, i) => ({ id: `w${i}`, en: `word ${i}`, vi: `nghĩa ${i}`, phonetic: '', emoji: '', example_en: '', example_vi: '' }));

test('arena rewards require completion and bound speed, combo and difficulty bonuses', () => {
  const { arenaReward } = load('src/lib/arena.ts');
  assert.equal(arenaReward(initialArena()).stars, 0);
  const state = { ...initialArena(), finished: true, rivalHealth: 0, bestCombo: 10, answers: Array.from({length: 10}, () => ({ correct: true, hinted: false, speedTier: 3 })) };
  assert.deepEqual(arenaReward(state, 2), { stars: 10, points: 100, base: 3, speed: 3, combo: 2, difficultyBonus: 2 });
  assert.equal(arenaReward({...state, health: 0, rivalHealth: 50, bestCombo: 0, answers: []}, 2).stars, 1);
  assert.equal(arenaReward({...state, answers: state.answers.map(a => ({...a, hinted: true}))}, 0).speed, 0);
});

test('wrong answers and timeouts always trigger a counterattack', () => {
  const questions = [{ word: words[0], kind: 'word', options: [], rivalHits: false }];
  for (const timedOut of [false, true]) {
    const result = answerArena({ ...initialArena(), combo: 2 }, questions, timedOut ? words[0].id : 'wrong', false, false, 15000, timedOut);
    assert.equal(result.health, 86);
    assert.equal(result.rivalHealth, 100);
    assert.equal(result.combo, 0);
    assert.equal(result.answers[0].correct, false);
    assert.equal(result.answers[0].rivalDamage, 14);
    assert.equal(result.answers[0].timedOut, timedOut);
  }
});

test('listening rounds have no choices and grade typed English with normalization', () => {
  const questions = createArenaQuestions(words, 'audio');
  const q = questions.find(q => q.kind === 'listening');
  assert.ok(q);
  assert.deepEqual(q.options, []);
  const result = answerArena(initialArena(), [q], `  ${q.word.en.toUpperCase()}  `, false, false, 5000);
  assert.equal(result.answers[0].correct, true);
  assert.equal(result.answers[0].speedTier, 3);
  assert.equal(answerArena(initialArena(), [q], 'wrong', false, false).health, 86);
});

test('new practice kinds generate playable prompts and score their responses', () => {
  const pool = words.map((w, i) => ({...w, en: ['apple','banana','orange','grape','melon','peach','pear','plum','kiwi','mango','lemon','lime'][i]}));
  const questions = createArenaQuestions(pool, 'new-practice');
  for (const kind of ['missing', 'scramble', 'listen-choice']) {
    const q = questions.find(q => q.kind === kind);
    assert.ok(q);
    const response = kind === 'missing' ? q.missingLetters : kind === 'scramble' ? q.word.en : q.word.id;
    assert.equal(answerArena(initialArena(), [q], response, false, false).answers[0].correct, true);
    assert.equal(answerArena(initialArena(), [q], 'wrong', false, false).answers[0].correct, false);
    if (kind === 'scramble') assert.deepEqual([...q.letters].sort(), [...q.word.en].sort());
    if (kind === 'missing') assert.ok(q.prompt.includes('_') && q.missingLetters.length);
    if (kind === 'listen-choice') assert.equal(q.options.filter(o => o.id === q.word.id).length, 1);
  }
});

test('opponent difficulty controls counterattack strength', () => {
  const q = [{ word: words[0], kind: 'word', options: [], rivalHits: true }];
  assert.deepEqual([0, 1, 2].map(level => answerArena(initialArena(), q, 'wrong', false, false, 1000, false, level).health), [90, 86, 80]);
  assert.deepEqual([0, 1, 2].map(level => answerArena(initialArena(), q, words[0].id, false, false, 1000, false, level).health), [97, 95, 93]);
});

test('speed bonuses respect boundaries, spelling allowance, hints and special multipliers', () => {
  const { arenaSpeedTier } = load('src/lib/arena.ts');
  assert.deepEqual([0, 3000, 3001, 6000, 6001, 10000, 10001, Infinity, -1].map(t => arenaSpeedTier(t, 'word')), [3, 3, 2, 2, 1, 1, 0, 0, 0]);
  assert.equal(arenaSpeedTier(6000, 'spelling'), 3);
  const q = [{ word: words[0], kind: 'word', options: [], rivalHits: false }];
  const fast = answerArena(initialArena(), q, words[0].id, false, false, 2000);
  const slow = answerArena(initialArena(), q, words[0].id, false, false, 20000);
  assert.equal(fast.answers[0].damage - slow.answers[0].damage, 12);
  assert.equal(answerArena(initialArena(), q, words[0].id, true, false, 1000).answers[0].speedBonus, 0);
  assert.equal(answerArena(initialArena(), q, 'wrong', false, false, 1000).answers[0].speedBonus, 0);
  assert.equal(answerArena({ ...initialArena(), energy: 3 }, q, words[0].id, false, true, 1000).answers[0].speedBonus, 24);
});

test('questions are repeatable, bounded, unique and contain exactly one correct option', () => {
  const questions = createArenaQuestions([...words, { ...words[0], id: 'duplicate' }], 'match-1');
  assert.deepEqual(questions, createArenaQuestions([...words, { ...words[0], id: 'duplicate' }], 'match-1'));
  assert.equal(questions.length, 10);
  assert.equal(new Set(questions.map(q => q.word.en)).size, 10);
  for (const q of questions.filter(q => q.kind === 'meaning' || q.kind === 'word')) {
    assert.equal(q.options.filter(o => o.id === q.word.id).length, 1);
    assert.equal(new Set(q.options.map(o => o.text)).size, q.options.length);
  }
});

test('ambiguous meanings fall back to spelling and empty content is excluded', () => {
  const questions = createArenaQuestions([{ ...words[0], vi: 'chào' }, { ...words[1], vi: 'CHÀO' }, { ...words[2], vi: '' }], 'same');
  assert.equal(questions.length, 2);
  assert.ok(questions.every(q => ['spelling', 'listening', 'missing', 'scramble'].includes(q.kind)));
});

test('hints never build combo or energy; special requires and consumes energy', () => {
  const questions = words.map(word => ({ word, kind: 'word', options: [], rivalHits: false }));
  let state = answerArena(initialArena(), questions, words[0].id, true, true);
  assert.equal(state.energy, 0); assert.equal(state.combo, 0); assert.equal(state.answers[0].damage, 8);
  for (let i = 1; i <= 3; i++) state = answerArena(state, questions, words[i].id, false, false);
  assert.equal(state.energy, 3); assert.equal(state.combo, 3);
  state = answerArena(state, questions, 'wrong', false, true);
  assert.equal(state.energy, 0); assert.equal(state.combo, 0); assert.equal(state.answers.at(-1).damage, 0);
});

test('spelling normalizes case and spacing and finished matches cannot be scored twice', () => {
  const questions = [{ word: words[0], kind: 'spelling', options: [], rivalHits: true }];
  const state = answerArena(initialArena(), questions, '  WORD   0 ', false, false);
  assert.equal(state.answers[0].correct, true); assert.equal(state.finished, true);
  assert.equal(arenaResult(state), 'win');
  assert.equal(answerArena(state, questions, 'word 0', false, true), state);
});

test('special damage is bounded and knockout ends the match immediately', () => {
  const questions = words.map(word => ({ word, kind: 'word', options: [], rivalHits: false }));
  const state = answerArena({ ...initialArena(), rivalHealth: 10, energy: 3 }, questions, words[0].id, false, true);
  assert.equal(state.rivalHealth, 0); assert.equal(state.finished, true);
  assert.equal(state.answers[0].damage, 30); assert.equal(state.energy, 1);
});
