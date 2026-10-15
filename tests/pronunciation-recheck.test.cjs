/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createLoader}=require('./ts-loader.cjs');
const policy={targetText:'cat',taskKind:'word',locale:'en-US',acceptedResponses:['cat'],acceptedTranscriptAliases:[],policyVersion:'test'};
const heard={speechStatus:'clear',transcript:'cat',interference:'none_detected'};
const assessed={assessability:'usable',contentMatch:'match',pronunciation:'acceptable',rawModelScore:null,issues:[]};
async function evaluate(perceptions,assessments,timeout=20000){
  const calls=[];
  const load=createLoader({'./geminiAdapter':{
    runPerceptionBranch:async(audio,mime,key,model,budget)=>{
      calls.push({branch:'blind',audio,budget});const value=perceptions.shift();if(value instanceof Error)throw value;return value;
    },
    runAssessmentBranch:async(audio,mime,policy,key,score,model,budget)=>{
      calls.push({branch:'assessment',audio,budget});const value=assessments.shift();if(value instanceof Error)throw value;return value;
    },
  }});
  const {evaluatePronunciationDual}=load('src/lib/pronunciation/index.ts');
  const result=await evaluatePronunciationDual('recheck-test','same-audio','audio/webm',policy,'dummy-key','off','test-model',timeout);
  return {result,calls};
}
test('clear contradictory evidence is rechecked once on the same recording',async()=>{
  const {result,calls}=await evaluate([{...heard,transcript:'cap'},heard],[assessed,assessed]);
  assert.equal(result.status,'pass');assert.equal(calls.length,4);
  assert.ok(calls.every(call=>call.audio==='same-audio'&&call.budget<=20000));
});
test('recheck preserves a supported pronunciation issue instead of passing from text alone',async()=>{
  const practice={...assessed,pronunciation:'needs_practice',issues:[{kind:'sound',targetTokenIndex:0,suggestionVi:'Con thử đọc âm cuối nhé.'}]};
  const {result}=await evaluate([heard,heard],[{...assessed,pronunciation:'uncertain'},practice]);
  assert.equal(result.status,'practice');assert.equal(result.passed,false);assert.match(result.feedbackVi,/âm cuối/);
});
test('persistent conflict or failed recheck stays ungraded without blaming volume',async()=>{
  for(const second of [assessed,new Error('provider failed')]){
    const {result,calls}=await evaluate([{...heard,transcript:'cap'},{...heard,transcript:'cap'}],[assessed,second]);
    assert.equal(result.status,'retry');assert.equal(result.passed,null);assert.equal(calls.length,4);
    assert.doesNotMatch(result.feedbackVi,/nói to|gần mic|Âm thanh chưa đủ rõ/);
  }
});
test('decisions, silence, interference, service errors and short budgets need no extra calls',async()=>{
  for(const [perception,assessment,timeout] of [
    [heard,assessed,20000],
    [{...heard,interference:'suspected'},assessed,20000],
    [{...heard,speechStatus:'no_speech',transcript:null},assessed,20000],
    [new Error('provider failed'),assessed,20000],
    [{...heard,transcript:'cap'},assessed,2000],
  ]){
    const {calls}=await evaluate([perception],[assessment],timeout);assert.equal(calls.length,2);
  }
});
