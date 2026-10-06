/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./ts-loader.cjs');
const {providerAudioError,audioFailure}=load('src/lib/media/errors.ts');
test('provider reason takes precedence over HTTP auth status without exposing arbitrary messages',()=>{
  assert.equal(providerAudioError(401,{detail:{status:'detected_unusual_activity'}}).code,'UNUSUAL_ACTIVITY');
  assert.equal(providerAudioError(401,{detail:{status:'quota_exceeded'}}).code,'QUOTA');
  assert.equal(providerAudioError(400,{detail:{status:'paid_plan_required'}}).code,'PAID_VOICE');
  const failure=providerAudioError(500,{detail:{status:'secret with spaces',message:'private input'}});
  assert.equal(failure.providerCode,undefined);
  assert.ok(!JSON.stringify(failure).includes('private input'));
});
test('storage, TLS/network and timeout failures are distinguished',()=>{
  assert.equal(audioFailure(Object.assign(new Error('private file path'),{code:'EACCES'})).code,'STORAGE');
  assert.equal(audioFailure(new TypeError('fetch failed')).code,'NETWORK');
  assert.equal(audioFailure(Object.assign(new Error(),{name:'TimeoutError'})).code,'TIMEOUT');
});
