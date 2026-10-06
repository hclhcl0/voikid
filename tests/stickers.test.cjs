/* eslint-disable @typescript-eslint/no-require-imports */
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {load} = require('./ts-loader.cjs');
const {STICKER_MILESTONES,STICKER_COLLECTIONS,stickerStats,applyStickerRewards,mergeStickers,isDueIpaReview,mergeStickerStudyDays} = load('src/lib/stickers.ts');
const {createSession} = load('src/lib/learning/engine.ts');
const {getPilot} = load('src/lib/learning/curriculum.ts');
const {practiceRecord} = load('src/lib/ipa/practice.ts');
const {emojiToTwemojiCode} = load('src/lib/twemoji.ts');
const now = '2026-10-06T12:00:00.000Z';
const empty = () => ({totalStars:0,streak:0,lastActiveDate:'',wordProgress:{},dailyStats:[],stickers:[],badges:[],unitTestResults:{},unlockedUnits:[],totalPoints:0});
const ids = p => p.stickers.map(s => s.id);
const story = (id,profileId='child-a',completed=true) => ({id,profileId,unitId:'unit-a',updatedAt:now,read:true,listened:true,speakingPracticed:false,completed,answers:{},lesson:{id,unitId:'unit-a',sentences:[{id:'s1',en:'I like cats.',vi:'Tôi thích mèo.'}],vocabulary:[],questions:[]}});

test('all 24 themed rewards have a local 3D PNG with its license', () => {
  const assets = require('../src/lib/sticker-assets.json');
  assert.equal(STICKER_MILESTONES.length,24);
  assert.equal(new Set(STICKER_MILESTONES.map(s => s.id)).size,24);
  for (const set of STICKER_COLLECTIONS) assert.equal(STICKER_MILESTONES.filter(s => s.setId===set.id).length,6);
  for (const s of STICKER_MILESTONES) {
    const filename = assets[emojiToTwemojiCode(s.emoji)];
    assert.ok(filename,s.name);
    const buffer = fs.readFileSync(`public/media/stickers/fluent-3d/${filename}`);
    assert.equal(buffer.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
  }
  assert.match(fs.readFileSync('public/media/stickers/fluent-3d/LICENSE','utf8'),/MIT License/);
});
test('a first attempt earns an effort reward even without a passing score; retries do not duplicate it', () => {
  const p = {...empty(),wordProgress:{'unit:w1':{wordId:'w1',catId:'unit',attempts:1,lastPracticed:'2026-10-06',bestScore:0}}};
  const first = applyStickerRewards(p,'child-a',now);
  assert.ok(ids(first).includes('pets_first_word'));
  assert.equal(first.totalStars,0);
  assert.strictEqual(applyStickerRewards(first,'child-a',now),first);
  const second = applyStickerRewards({...first,wordProgress:{...first.wordProgress,'another:w1':{...p.wordProgress['unit:w1'],attempts:20}}},'child-a',now);
  assert.equal(stickerStats(second,'child-a').words,1);
  assert.equal(ids(second).filter(id=>id==='pets_first_word').length,1);
  assert.ok(!ids(second).includes('pets_words_5'));
});
test('saved drafts and records from another student never earn story or IPA rewards', () => {
  const p = {...empty(),storySessions:{foreign:story('foreign','child-b'),draft:story('draft','child-a',false)},ipaPractice:{m:practiceRecord('child-b','m',[true,true],new Date(now))}};
  assert.deepEqual(applyStickerRewards(p,'child-a',now).stickers,[]);
  const completed = applyStickerRewards({...p,storySessions:{...p.storySessions,own:story('own')}},'child-a',now);
  assert.ok(ids(completed).includes('pets_story_1'));
  assert.equal(stickerStats(completed,'child-a').stories,1);
});
test('learning completions count distinct units instead of replay sessions', () => {
  const a = {...createSession(getPilot(1),'child-a','path',false),completed:true,updatedAt:now};
  const b = {...a,id:'replay'};
  const foreign = {...a,id:'foreign',profileId:'child-b',unitId:'foreign'};
  const p = applyStickerRewards({...empty(),learningSessions:{[a.id]:a,replay:b,foreign}},'child-a',now);
  assert.ok(ids(p).includes('pets_lesson_1'));
  assert.equal(stickerStats(p,'child-a').lessons,1);
  assert.ok(!ids(p).includes('explorers_lessons_3'));
});
test('IPA listening reward uses distinct sounds, not a pronunciation score', () => {
  const ipaPractice = Object.fromEntries(['m','s','f'].map(sound=>[sound,practiceRecord('child-a',sound,[true,true],new Date(now))]));
  const p = applyStickerRewards({...empty(),ipaPractice},'child-a',now);
  assert.ok(ids(p).includes('pets_ipa_1'));
  assert.ok(ids(p).includes('magic_ipa_3'));
  assert.ok(ids(p).includes('magic_attentive_3'));
  assert.ok(!ids(p).includes('explorers_ipa_review'));
});
test('the current reading path can earn topic rewards without double-counting an old lesson for that unit', () => {
  const old = {...createSession(getPilot(1),'child-a'),unitId:'unit-a',completed:true,updatedAt:now};
  const stories = [story('one'),story('two'),story('three')];
  stories[1].unitId=stories[1].lesson.unitId='unit-b';
  stories[2].unitId=stories[2].lesson.unitId='unit-c';
  const p = applyStickerRewards({...empty(),learningSessions:{[old.id]:old},storySessions:Object.fromEntries(stories.map(s=>[s.id,s]))},'child-a',now);
  assert.equal(stickerStats(p,'child-a').lessons,3);
  assert.equal(stickerStats(p,'child-a').activities,4);
  assert.ok(ids(p).includes('explorers_lessons_3'));
  assert.ok(ids(p).includes('magic_stories_3'));
});
test('IPA review earns once only after a real due date, never on early replay or profile mismatch', () => {
  const previous = practiceRecord('child-a','m',[true,true],new Date('2026-10-01T12:00:00Z'));
  const early = practiceRecord('child-a','m',[true,true],new Date('2026-10-02T12:00:00Z'));
  const due = practiceRecord('child-a','m',[true,true],new Date('2026-10-04T12:00:00Z'));
  assert.equal(isDueIpaReview(previous,early,'child-a'),false);
  assert.equal(isDueIpaReview(previous,due,'child-a'),true);
  assert.equal(isDueIpaReview(previous,due,'child-b'),false);
  assert.equal(isDueIpaReview(due,previous,'child-a'),false);
  const p = applyStickerRewards({...empty(),ipaPractice:{m:due}},'child-a',due.updatedAt,true);
  assert.equal(ids(p).filter(id=>id==='explorers_ipa_review').length,1);
  assert.strictEqual(applyStickerRewards(p,'child-a',now,true),p);
});
test('study days survive practicing the same sound on later days', () => {
  let p = empty();
  for (const date of ['2026-10-01','2026-10-03','2026-10-06']) {
    p = applyStickerRewards({...p,ipaPractice:{m:practiceRecord('child-a','m',[false,true],new Date(date+'T12:00:00Z'))}},'child-a',now);
  }
  assert.equal(stickerStats(p,'child-a').studyDays,3);
  assert.ok(ids(p).includes('pets_days_3'));
  assert.deepEqual(mergeStickerStudyDays(p.stickerStudyDays,['bad',null,'2026-10-06']),['2026-10-01','2026-10-03','2026-10-06']);
});
test('perfect answers are rewarded; score with speed bonuses alone is not proof', () => {
  const t = {unitId:'unit',score:135,grade:'excellent',completedAt:now,attempts:1,fastAnswers:10,streak:10};
  let p = applyStickerRewards({...empty(),unitTestResults:{unit:t}},'child-a',now);
  assert.ok(!ids(p).includes('perfect_test'));
  p = applyStickerRewards({...p,unitTestResults:{unit:{...t,correctAnswers:9,questionCount:10}}},'child-a',now);
  assert.ok(!ids(p).includes('perfect_test'));
  p = applyStickerRewards({...p,unitTestResults:{unit:{...t,correctAnswers:10,questionCount:10}}},'child-a',now);
  assert.ok(ids(p).includes('perfect_test'));
});
test('previous grade souvenirs and milestones remain earned after a lower retake or story deletion', () => {
  const legacy = {id:'old_grade_test_good',name:'Sao học giỏi',emoji:'⭐',tier:'star',setId:'unit_test',unitId:'old_grade',condition:'Đạt bài kiểm tra lớp trước',earnedAt:'2026-09-01T12:00:00Z'};
  let p = applyStickerRewards({...empty(),stickers:[legacy],storySessions:{own:story('own')},streak:7,totalStars:100},'child-a',now);
  assert.ok(ids(p).includes(legacy.id));
  assert.ok(ids(p).includes('stars_first_test'));
  assert.ok(ids(p).includes('streak_7'));
  assert.ok(ids(p).includes('stars_100'));
  p = applyStickerRewards({...p,storySessions:{},streak:1,totalStars:0},'child-a',now);
  assert.ok(ids(p).includes('pets_story_1'));
  assert.deepEqual(mergeStickers(p.stickers,[legacy,{...legacy,earnedAt:now}]),p.stickers);
});
