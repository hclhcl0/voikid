/* eslint-disable @typescript-eslint/no-require-imports -- Node tests use the CommonJS TypeScript loader. */
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./ts-loader.cjs');
const { CURRICULUM, getPilot, validateCurriculum } = load('src/lib/learning/curriculum.ts');
const { generateActivities, validateActivities, normalizeAnswer, checkAnswer, createSession, isIndependent, nextReviewDate } = load('src/lib/learning/engine.ts');
const { validSession, sessionsFor, mergeSessions, skillReport, dueVocabularyIds, applyLearningSession } = load('src/lib/learning/progress.ts');

test('all five grades have a playable pilot with original context and stable legacy IDs', () => {
  for (const grade of [1, 2, 3, 4, 5]) {
    const unit = getPilot(grade);
    assert.ok(unit);
    assert.ok(unit.vocabulary.length >= 3);
    assert.ok(unit.resource.scenes.length >= 3);
    assert.ok(unit.resource.application.prompts.length);
    assert.equal(unit.status, 'draft');
    assert.equal(unit.verificationStatus, 'unverified');
    assert.deepEqual(validateActivities(generateActivities(unit, 'stable'), unit), []);
  }
  assert.deepEqual(validateCurriculum(), []);
});
test('grade configuration changes interactions without engine changes', () => {
  assert.ok(generateActivities(getPilot(1), 'a').every(a => a.kind === 'meaning-choice'));
  assert.ok(generateActivities(getPilot(2), 'a').some(a => a.kind === 'letter-order'));
  for (const grade of [3, 4, 5]) assert.ok(generateActivities(getPilot(grade), 'a').some(a => a.kind === 'spelling'));
});
test('all existing units can supply meaningful questions without duplicate choices', () => {
  for (const unit of CURRICULUM) {
    for (const mode of ['meaning-choice', 'word-choice', 'listen-choice', 'letter-order', 'spelling', 'dictation', 'context-choice']) {
      const activities = generateActivities(unit, 'deterministic', mode, true);
      assert.deepEqual(validateActivities(activities, unit), [], `${unit.id}/${mode}`);
    }
  }
});
test('audio activities are excluded when audio is unavailable', () => {
  assert.equal(generateActivities(getPilot(1), 'a', 'listen-choice', false).length, 0);
  assert.equal(generateActivities(getPilot(5), 'a', 'dictation', false).length, 0);
});
test('options remain stable across rerender and serialization', () => {
  const unit = getPilot(4);
  const first = generateActivities(unit, 'repeat');
  assert.deepEqual(first, generateActivities(unit, 'repeat'));
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first.map(a => JSON.parse(JSON.stringify(a))));
});
test('one-word and three-word units do not invent ten-word grids', () => {
  const unit = { ...getPilot(1), vocabulary: getPilot(1).vocabulary.slice(0, 1) };
  const activities = generateActivities(unit, 'single');
  assert.equal(activities.length, 1);
  assert.equal(activities[0].kind, 'letter-order');
  assert.equal(generateActivities(getPilot(1), 'three').length, 3);
});
test('synonymous greetings never appear together as distractors', () => {
  for (const a of generateActivities(getPilot(3), 'greetings', 'word-choice')) {
    const labels = a.options.map(o => normalizeAnswer(o.text));
    assert.ok(!(labels.includes('hello') && labels.includes('hi')));
    assert.ok(!(labels.includes('bye') && labels.includes('goodbye')));
  }
});
test('normalization accepts case/space/punctuation but rejects spelling errors', () => {
  const activity = generateActivities(getPilot(5), 'spell', 'spelling').find(a => a.answers[0].toLowerCase() === 'table tennis');
  assert.ok(checkAnswer(activity, '  TABLE   TENNIS! '));
  assert.equal(checkAnswer(activity, 'table tenis'), false);
  assert.equal(normalizeAnswer("I'm"), "i'm");
});
test('correct answer IDs do not depend on option positions', () => {
  const a = generateActivities(getPilot(1), 'ids')[0];
  assert.ok(checkAnswer({ ...a, options: [...a.options].reverse() }, a.answerId));
  assert.equal(checkAnswer(a, '0'), false);
});
test('letter order permits repeated letters using unique token IDs', () => {
  const a = generateActivities(getPilot(2), 'letters', 'letter-order').find(a => a.answer === 'Popcorn');
  assert.equal(new Set(a.tokens.map(t => t.id)).size, a.tokens.length);
  assert.ok(checkAnswer(a, 'popcorn'));
  assert.equal(checkAnswer(a, 'popcron'), false);
});
test('independent results exclude hints, answer reveal, retry and unheard audio', () => {
  const e = { firstCorrect: true, correct: true, hinted: false, revealed: false, skill: 'meaning' };
  assert.ok(isIndependent(e));
  for (const override of [{ hinted: true }, { revealed: true }, { firstCorrect: false }, { correct: false }, { skill: 'listening', audioPlayed: false }]) assert.equal(isIndependent({ ...e, ...override }), false);
});
test('new attempts keep profile, version, activity order and restore stage', () => {
  const s = createSession(getPilot(2), 'child-a');
  s.stage = 'resource'; s.sceneIndex = 2;
  assert.ok(validSession(JSON.parse(JSON.stringify(s)), 'child-a'));
  assert.equal(validSession(s, 'child-b'), false);
  assert.notEqual(createSession(getPilot(2), 'child-a').id, s.id);
  assert.deepEqual(sessionsFor({ [s.id]: s }, 'child-b'), []);
});
test('corrupt data and outdated versions cannot break session recovery', () => {
  const s = createSession(getPilot(1), 'a');
  for (const value of [null, {}, 'broken', { ...s, contentVersion: 999 }, { ...s, activities: [null] }, { ...s, activities: [{ ...s.activities[0], options: [null] }] }]) assert.equal(validSession(value, 'a'), false);
});
test('sync is idempotent and the newer session wins', () => {
  const s = createSession(getPilot(1), 'a');
  const newer = { ...s, updatedAt: '2099-01-01T00:00:00.000Z', cardIndex: 1 };
  const merged = mergeSessions({ [s.id]: newer }, { [s.id]: s });
  assert.equal(merged[s.id].cardIndex, 1);
  assert.deepEqual(mergeSessions(merged, merged), merged);
});
test('completion rewards are stable across reload and new attempts, separated by profile', () => {
  const base = { totalStars: 20, stickers: [], learningRewardKeys: [] };
  const session = { ...createSession(getPilot(1), 'child-a'), completed: true };
  const first = applyLearningSession(base, session);
  assert.equal(first.totalStars, 21);
  assert.equal(first.stickers.length, 1);
  const replay = applyLearningSession(JSON.parse(JSON.stringify(first)), session);
  assert.equal(replay.totalStars, 21);
  assert.equal(replay.stickers.length, 1);
  assert.equal(applyLearningSession(replay, { ...session, id: 'new-attempt' }).totalStars, 21);
  assert.equal(applyLearningSession(base, { ...session, profileId: 'child-b' }).totalStars, 21);
});
test('report uses latest evidence per sense/skill and schedules supported answers for review', () => {
  const s = createSession(getPilot(1), 'a');
  const a = s.activities[0];
  const e = { activityId: a.id, vocabularyId: a.vocabularyId, senseId: a.senseId, skill: 'meaning', firstCorrect: false, correct: true, hinted: true, revealed: false, attempts: 2, response: a.answerId, completedAt: '2026-10-05T10:00:00Z', reviewDueDate: '2026-10-06' };
  s.evidence[a.id] = e;
  const report = skillReport([s]);
  assert.equal(report.find(r => r.skill === 'meaning').supported, 1);
  assert.deepEqual(dueVocabularyIds([s], s.unitId, '2026-10-05'), [e.vocabularyId]);
  assert.equal(nextReviewDate(true, 1, new Date(2026, 9, 5, 12)), '2026-10-08');
});
