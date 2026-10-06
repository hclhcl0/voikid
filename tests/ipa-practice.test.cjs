/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./ts-loader.cjs');
const {ALL_44_IPA_SOUNDS}=load('src/data/ipaChart.ts');
const {PRACTICE_SOUNDS,practiceWords,practiceRecord,validIpaRecord,mergeIpaPractice,recommendSound,containsSound}=load('src/lib/ipa/practice.ts');

test('every chart sound has a practice lesson with two distinct listening choices',()=>{
  assert.equal(PRACTICE_SOUNDS.length,44);
  assert.deepEqual(new Set(PRACTICE_SOUNDS.map(s=>s.ipa)),new Set(ALL_44_IPA_SOUNDS.map(s=>s.ipa)));
  for(const sound of PRACTICE_SOUNDS){
    const words=practiceWords(sound.ipa);
    assert.equal(words.length,2);
    assert.equal(words[0].en,sound.sample_word);
    assert.notEqual(words[0].en,words[1].en);
    assert.ok(words.every(word=>word.en&&word.vi&&word.emoji));
  }
});

test('IPA vocabulary suggestions respect complete phonemes rather than substrings',()=>{
  assert.equal(containsSound('/tʃeər/','t'),false);
  assert.equal(containsSound('/tʃeər/','tʃ'),true);
  assert.equal(containsSound('/bəʊt/','ə'),false);
  assert.equal(containsSound('/bəʊt/','əʊ'),true);
  assert.equal(containsSound('/goʊt/','ɡ'),true);
});

test('review schedule reflects first answers without claiming pronunciation mastery',()=>{
  const now=new Date('2026-10-06T08:00:00Z');
  const supported=practiceRecord('child','m',[false,true],now);
  const independent=practiceRecord('child','s',[true,true],now);
  assert.equal(supported.reviewDueAt,'2026-10-07T08:00:00.000Z');
  assert.equal(independent.reviewDueAt,'2026-10-09T08:00:00.000Z');
  assert.equal(recommendSound({m:supported,s:independent},Date.parse('2026-10-08')).ipa,'m');
  assert.equal('pronunciationScore' in supported,false);
});

test('profile isolation and stale sync preserve the newest valid practice per sound',()=>{
  const old=practiceRecord('a','m',[false,false],new Date('2026-10-05'));
  const latest=practiceRecord('a','m',[true,true],new Date('2026-10-06'));
  const foreign=practiceRecord('b','s',[true,true]);
  const merged=mergeIpaPractice({m:latest},{m:old,s:foreign},'a');
  assert.deepEqual(merged,{m:latest});
  assert.equal(validIpaRecord({...old,firstTry:[true]},'a'),false);
  assert.equal(validIpaRecord({...old,practicedSpeaking:false},'a'),false);
  assert.equal(validIpaRecord({...old,updatedAt:'invalid'},'a'),false);
});
