/* eslint-disable @typescript-eslint/no-require-imports */
const test = require('node:test');
const assert = require('node:assert/strict');
const { load, createLoader } = require('./ts-loader.cjs');
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

const numberPolicy = (targetText, extra = {}) => ({...policy,targetText,acceptedResponses:[targetText],acceptedTranscriptAliases:[],...extra});

test('spoken cardinals match numeral transcriptions across words, phrases and sentences', () => {
  for (const [digits, words] of [
    ['0','zero'], ['1','one'], ['12','twelve'], ['20','twenty'], ['45','Forty-five'],
    ['80','eighty'], ['99','ninety-nine'], ['100','one hundred'],
    ['105','one hundred and five'], ['245','two hundred and forty-five'],
    ['1000','one thousand'], ['1,005','one thousand and five'],
    ['12345','twelve thousand three hundred and forty-five'],
    ['999,999','nine hundred and ninety-nine thousand nine hundred and ninety-nine'],
  ]) {
    assert.equal(compareContent(digits,numberPolicy(words)),'allowed_match',`${digits} = ${words}`);
    assert.equal(compareContent(words,numberPolicy(digits)),'allowed_match',`${words} = ${digits}`);
  }
  assert.equal(compareContent('45.',numberPolicy('forty-five')),'allowed_match');
  assert.equal(compareContent('forty five',numberPolicy('forty-five')),'allowed_match');
  assert.equal(compareContent('45',numberPolicy('Forty‑five')),'allowed_match');
  assert.equal(compareContent('the 45',numberPolicy('forty-five',{acceptedResponses:['forty-five','the forty-five']})),'allowed_match');
  assert.equal(compareContent('I have 45 books.',numberPolicy('I have forty-five books',{taskKind:'sentence'})),'allowed_match');
  assert.equal(compareContent('I have 45',numberPolicy('I have forty-five books',{taskKind:'sentence'})),'omissions_only');
});

test('number formatting does not accept a different number, digit reading or ambiguous numeric format', () => {
  const target = numberPolicy('Forty-five');
  for (const transcript of ['54','forty-four','forty','five','four five','4 5','45 six','45th','045','+45','-45','−45','–45','45.0','4.5','4:5','45/1','45-50','45%','$45','A45','45B','45,0']) {
    assert.equal(compareContent(transcript,target),'other',transcript);
  }
  assert.equal(compareContent('45',numberPolicy('four five')),'other');
  assert.equal(compareContent('45',numberPolicy('forty-fifth')),'other');
  assert.equal(compareContent('45',numberPolicy('four')),'other');
  assert.equal(compareContent('45 45',target),'allowed_match');
  assert.equal(compareContent('45 45',{...target,allowRepetitions:false}),'other');
  assert.equal(compareContent('cats and dogs',numberPolicy('cats dogs')),'other');
});

test('a numeral transcript passes only when the independent audio assessment accepts pronunciation', async () => {
  const target = numberPolicy('Forty-five');
  const heard = {...perception,transcript:'45'};
  for (const [audioAssessment, expectedStatus] of [
    [assessment,'pass'],
    [{...assessment,pronunciation:'needs_practice',issues:[{kind:'sound',targetTokenIndex:0,suggestionVi:'Con đọc rõ âm /v/ ở cuối nhé.'}]},'practice'],
    [{...assessment,pronunciation:'uncertain'},'retry'],
    [{...assessment,contentMatch:'different',pronunciation:'not_applicable'},'retry'],
  ]) {
    const loadEngine = createLoader({'./geminiAdapter':{
      runPerceptionBranch:async()=>heard,
      runAssessmentBranch:async()=>audioAssessment,
    }});
    const {evaluatePronunciationDual} = loadEngine('src/lib/pronunciation/index.ts');
    const result = await evaluatePronunciationDual('number-attempt','mock-recording','audio/webm',target,'mock-key');
    assert.equal(result.status,expectedStatus);
    assert.equal(result.passed,expectedStatus==='pass'?true:expectedStatus==='practice'?false:null);
    assert.equal(result.score,null);
    assert.doesNotMatch(result.feedbackVi,/Cô nghe thấy từ "45"/);
    if (expectedStatus==='practice') assert.match(result.feedbackVi,/âm \/v\//);
  }
});
test('o clock transcription variants match complete readings without admitting missing or different sounds', () => {
  const clock = {...policy,targetText:"O'clock",acceptedResponses:["O'clock"]};
  for (const transcript of ["O'clock",'o’clock','O Clock','oclock','a clock','a clock a clock']) {
    assert.equal(compareContent(transcript,clock),'allowed_match',transcript);
  }
  for (const transcript of ['clock','the clock','a lock','a cock','o lock','a clock dog','dog a clock']) {
    assert.equal(compareContent(transcript,clock),'other',transcript);
  }
  assert.equal(compareContent('a clock a clock',{...clock,allowRepetitions:false}),'other');
  assert.equal(compareContent("o'clock",{...clock,targetText:'clock',acceptedResponses:['clock']}),'other');
  const sentence = {...clock,taskKind:'sentence',targetText:"It's six o'clock.",acceptedResponses:["It's six o'clock."]};
  assert.equal(compareContent("It's 6 a clock.",sentence),'allowed_match');
  assert.equal(compareContent('six a clock',sentence),'omissions_only');
  assert.equal(compareContent("It's six clock",sentence),'omissions_only');
  assert.equal(compareContent("It's seven a clock.",sentence),'other');
});

test('English sound-alike spellings match whole tokens and keep other words and locales distinct', () => {
  for (const [target, transcript] of [['two','too'],['two','to'],['four','for'],['one','won'],['eight','ate'],['see','sea'],['hear','here'],['right','write'],['week','weak']]) {
    const sameSound = {...policy,targetText:target,acceptedResponses:[target]};
    assert.equal(compareContent(transcript,sameSound),'allowed_match');
    assert.equal(compareContent(transcript,{...sameSound,locale:'vi-VN'}),'other');
  }
  assert.equal(compareContent('tooth',{...policy,targetText:'two',acceptedResponses:['two']}),'other');
  assert.equal(compareContent('too cats',{...policy,targetText:'two cats',acceptedResponses:['two cats']}),'allowed_match');
  assert.equal(compareContent('too dogs',{...policy,targetText:'two cats',acceptedResponses:['two cats']}),'other');
});

test('a clock spelling never overrides pronunciation, uncertainty, interference or provider failures', async () => {
  const clock = {...policy,targetText:"O'clock",acceptedResponses:["O'clock"]};
  const cases = [
    [{...perception,transcript:'a clock'},assessment,'pass'],
    [{...perception,transcript:'a clock'},{...assessment,pronunciation:'needs_practice',issues:[{kind:'sound',targetTokenIndex:0,suggestionVi:'Con đọc nhẹ âm đầu nhé.'}]},'practice'],
    [{...perception,transcript:'a clock'},{...assessment,pronunciation:'uncertain'},'retry'],
    [{...perception,transcript:'a clock'},{...assessment,contentMatch:'different',pronunciation:'not_applicable'},'retry'],
    [{...perception,transcript:'a clock',interference:'suspected'},assessment,'retry'],
    [{...perception,transcript:'a clock',speechStatus:'unclear'},assessment,'retry'],
    [{...perception,transcript:'a lock'},assessment,'retry'],
    [{...perception,transcript:'a clock'},null,'service_error'],
  ];
  for (const [heard, audioAssessment, expectedStatus] of cases) {
    const loadEngine = createLoader({'./geminiAdapter':{
      runPerceptionBranch:async()=>heard,
      runAssessmentBranch:async()=>{if (!audioAssessment) throw new Error('mock-provider-failure'); return audioAssessment;},
    }});
    const {evaluatePronunciationDual} = loadEngine('src/lib/pronunciation/index.ts');
    const result = await evaluatePronunciationDual('clock-attempt','mock-recording','audio/webm',clock,'mock-key');
    assert.equal(result.status,expectedStatus);
    assert.equal(result.passed,expectedStatus==='pass'?true:expectedStatus==='practice'?false:null);
    assert.equal(result.score,null);
    assert.doesNotMatch(result.feedbackVi,/Cô nghe thấy từ/);
    if (expectedStatus==='practice') assert.match(result.feedbackVi,/đọc nhẹ âm đầu/);
    if (result.reason==='conflicting_evidence') assert.match(result.feedbackVi,/chưa chắc chắn/);
  }
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
