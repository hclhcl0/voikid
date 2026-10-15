/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');const assert=require('node:assert/strict');
const {createLoader}=require('./ts-loader.cjs');
const load=createLoader();
const {canReassessRecording,pronunciationResultTitle,recordingAttemptFor}=load('src/lib/pronunciation/recordingReview.ts');
const {floatFrameQuality,voiceThresholds}=load('src/lib/pronunciation/audioQuality.ts');

test('same physical recording keeps its attempt ID on reassessment; a new recording gets a new ID',()=>{
  let count=0;const id=()=>`recording-${++count}`;
  const blob=new Blob(['audio']);
  const first=recordingAttemptFor(blob,null,id);
  const again=recordingAttemptFor(blob,first,id);
  assert.equal(again,first);assert.equal(count,1);
  const second=recordingAttemptFor(new Blob(['audio']),first,id);
  assert.notEqual(second.id,first.id);assert.equal(count,2);
});
test('only ungraded AI uncertainty or service errors permit reassessment; silence requires a new recording',()=>{
  for(const reason of ['uncertain_assessment','conflicting_evidence'])assert.ok(canReassessRecording({status:'retry',reason}));
  assert.ok(canReassessRecording({status:'service_error',reason:'provider_unavailable'}));
  for(const reason of ['no_clear_speech','interference','poor_recording'])assert.equal(canReassessRecording({status:'retry',reason}),false);
  for(const status of ['pass','practice'])assert.equal(canReassessRecording({status,reason:'acceptable'}),false);
  assert.match(pronunciationResultTitle({status:'retry',reason:'conflicting_evidence'}),/AI chưa kết luận/);
  assert.match(pronunciationResultTitle({status:'retry',reason:'no_clear_speech'}),/bản thu/);
  assert.match(pronunciationResultTitle({status:'service_error',reason:'invalid_model_output'}),/Chưa chấm được/);
});
test('floating point audio retains quiet signal and reports clipping',()=>{
  const quiet=floatFrameQuality(new Float32Array([0.001,-0.001]));
  assert.ok(quiet.rms>0&&quiet.rms<0.002);assert.equal(quiet.clippedFraction,0);
  assert.equal(floatFrameQuality(new Float32Array([1,-1])).clippedFraction,1);
  assert.equal(floatFrameQuality(new Float32Array()).rms,0);
});
test('adaptive stop threshold stays below speech threshold in quiet and noisy rooms',()=>{
  for(const floor of [0,0.004,0.01,0.1,1,NaN]){
    const threshold=voiceThresholds(floor,true);
    assert.ok(threshold.silence>0&&threshold.silence<threshold.speech);
    assert.ok(threshold.speech>=0.012&&threshold.speech<=0.08);
  }
  assert.deepEqual(voiceThresholds(1,false),{speech:0.018,silence:0.01});
});
