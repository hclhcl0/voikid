/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./ts-loader.cjs');
const { compareContent } = load('src/lib/pronunciation/comparator.ts');
const { decideAttemptResult } = load('src/lib/pronunciation/decisionEngine.ts');
const { parsePerception, parseAssessment } = load('src/lib/pronunciation/validation.ts');
const { frameQuality, recordingProblem } = load('src/lib/pronunciation/audioQuality.ts');
const { defaultPronunciationSettings: defaults, validatePronunciationSettings } = load('src/lib/pronunciation/settings.ts');
const policy = { targetText: 'cat', taskKind: 'word', locale: 'en-US', acceptedResponses: ['cat','a cat','the cat'], acceptedTranscriptAliases: [], allowRepetitions: true, endingSound: '/t/', policyVersion: '2' };
const perception = { speechStatus: 'clear', transcript: 'cat', interference: 'none_detected' };
const assessment = { assessability: 'usable', contentMatch: 'match', pronunciation: 'acceptable', issues: [], rawModelScore: null };
const decide = (p = perception, a = assessment, c = 'allowed_match') => decideAttemptResult('attempt-1',policy,p,a,c,'test');
test('matches complete answers; never accepts a different word or article alone', () => {
  for (const word of ['cat','Cat!','a cat','the cat','cat cat','a cat a cat']) assert.equal(compareContent(word,policy),'allowed_match');
  for (const word of ['cap','cut','a','the','a dog','the dog','dog cat','cat dog',null]) assert.equal(compareContent(word,policy),'other');
});
test('repetition and article policies can be disabled', () => {
  assert.equal(compareContent('cat cat',{...policy,allowRepetitions:false}),'other');
  assert.equal(compareContent('a cat',{...policy,acceptedResponses:['cat']}),'other');
});
test('sentence omissions are separate from different content', () => {
  const sentence = {...policy,taskKind:'sentence',acceptedResponses:['I have a cat']};
  assert.equal(compareContent('I have cat',sentence),'omissions_only');
  assert.equal(compareContent('I have a dog',sentence),'other');
});
test('correct spelling never overrides an acoustic pronunciation issue', () => {
  const a = {...assessment,pronunciation:'needs_practice',issues:[{kind:'sound',targetTokenIndex:0,suggestionVi:'Con thử âm cuối nhẹ hơn nhé.'}]};
  assert.equal(decide(perception,a).status,'practice');
  assert.equal(decide(perception,a).score,null);
  assert.equal(decide().status,'pass');
});
test('uncertainty, interference, conflict and provider failures never mark a child wrong', () => {
  for (const result of [decide({...perception,speechStatus:'no_speech',transcript:null}),decide({...perception,interference:'suspected'}),decide(perception,{...assessment,assessability:'uncertain',contentMatch:'uncertain',pronunciation:'uncertain'}),decide(perception,assessment,'other')]) {
    assert.equal(result.status,'retry'); assert.equal(result.passed,null); assert.equal(result.score,null);
  }
  assert.equal(decide(null).status,'service_error');
});
test('runtime validation rejects broken or inconsistent AI output', () => {
  assert.deepEqual(parsePerception(perception),perception);
  assert.deepEqual(parseAssessment(assessment,1),assessment);
  for (const p of [null,{}, {...perception,speechStatus:'unknown'}, {...perception,transcript:''}, {...perception,speechStatus:'no_speech'}]) assert.throws(()=>parsePerception(p),/invalid_model_output/);
  for (const a of [null,{}, {...assessment,rawModelScore:99}, {...assessment,contentMatch:'different'}, {...assessment,assessability:'uncertain'}, {...assessment,pronunciation:'needs_practice',issues:[{kind:'sound',targetTokenIndex:1,suggestionVi:'Thử lại'}]}]) assert.throws(()=>parseAssessment(a,1),/invalid_model_output/);
});
test('RMS measures signal energy and catches silent or clipped recordings', () => {
  assert.equal(frameQuality(Uint8Array.from([128,128])).rms,0);
  assert.equal(frameQuality(Uint8Array.from([64,192])).rms,0.5);
  assert.equal(frameQuality(Uint8Array.from([0,255])).clippedFraction,1);
  assert.ok(recordingProblem(50,0,150)); assert.ok(recordingProblem(300,0.2,150));
  assert.equal(recordingProblem(300,0.01,150),null);
});
test('settings enforce numeric bounds and room for speech after waiting', () => {
  validatePronunciationSettings(defaults);
  for (const value of [null,{...defaults,timeoutMs:0},{...defaults,minSpeechMs:NaN},{...defaults,adaptiveVad:'yes'},{...defaults,model:'arbitrary-model'},{...defaults,wordDurationMs:5000,waitForSpeechMs:5000}]) assert.throws(()=>validatePronunciationSettings(value));
});
