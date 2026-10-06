/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {NextRequest}=require('next/server');
const {load,createLoader}=require('./ts-loader.cjs');
const {prepareAiKidsPhonics:prepare}=load('src/lib/aiKidsPhonics.ts');
const {AiWordReadingGuide:Guide}=load('src/components/learning/AiWordReadingGuide.tsx');
const hint={text:'AI hint',syllables:['SÁT-(t)','Ơ','ĐÂY'],stressIndex:2,mouth_tip:'Mẹo riêng do AI tạo.',audio_slow_text:'AI hint'};
let pool={keys:[],mode:'priority',maxAttempts:2,cooldownSeconds:60};
let provider=()=>hint;
const calls=[];
class FakeGemini {
  constructor(secret){this.secret=secret;}
  getGenerativeModel(options){
    calls.push({secret:this.secret,model:options.model});
    return {generateContent:async prompt=>({response:{text:()=>JSON.stringify(provider(this.secret,prompt))}})};
  }
}
const mockLoad=createLoader({
  '@google/generative-ai':{GoogleGenerativeAI:FakeGemini},
  '@/lib/backend/apiKeys':{readApiKeys:()=>pool,credentialId:key=>key.id},
  '@/lib/backend/store':{readContent:()=>({settings:{pronunciation:{model:'gemini-2.5-flash',timeoutMs:10000}}})},
});
const route=mockLoad('src/app/api/phonics/route.ts');
function request(body,method='POST'){
  return new NextRequest('http://localhost:3000/api/phonics',{method,headers:{host:'localhost:3000',origin:'http://localhost:3000','Content-Type':'application/json'},body:JSON.stringify(body)});
}

test('AI hints retain their wording, endings and mouth tip; IPA only corrects emphasis',()=>{
  const result=prepare('Saturday','/ˈsæt.ə.deɪ/',hint);
  assert.deepEqual(result.syllables,['SÁT(t)','ơ','đây']);
  assert.deepEqual(result.stressIndices,[0]);
  assert.equal(result.mouth_tip,hint.mouth_tip);
  assert.equal(prepare('Tuesday','/ˈtjuːzdeɪ/',{...hint,syllables:['BỜ','TIU','ĐÂY']}),null);
  assert.equal(prepare('Tuesday','/ˈtjuːzdeɪ/',undefined),null);
  assert.equal(prepare('new word',undefined,{...hint,syllables:[7]}),null);
});
test('UI renders AI text, visible final sounds and refresh control',()=>{
  const phonics=prepare('Saturday','/ˈsæt.ə.deɪ/',hint);
  const html=renderToStaticMarkup(React.createElement(Guide,{phonics,loading:false,error:null,onRefresh:()=>{}}));
  assert.ok(html.includes('SÁT'));
  assert.ok(html.includes('(t)'));
  assert.ok(html.includes('AI tạo lại gợi ý'));
  assert.ok(!html.includes('XAT'));
});
test('new words use Gemini and the configured model, not IPA-to-letter text',async()=>{
  pool={...pool,keys:[]};calls.length=0;provider=()=>({...hint,syllables:['thờ','MỚI'],stressIndex:1});
  const response=await route.POST(request({word:'new word',apiKey:'fake-test-client-key'}));
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.source,'ai');
  assert.deepEqual(data.phonics.syllables,['thờ','MỚI']);
  assert.equal(calls[0].model,'gemini-2.5-flash');
});
test('Admin key pool works without browser key and switches keys on quota failure',async()=>{
  pool={...pool,keys:[{id:'phonics-test-first',project:'first',enabled:true,secret:'fake-first'},{id:'phonics-test-next',project:'second',enabled:true,secret:'fake-next'}]};
  calls.length=0;
  provider=secret=>{if(secret==='fake-first')throw Object.assign(new Error('quota'),{status:429});return hint;};
  const response=await route.POST(request({word:'Saturday',phonetic:'/ˈsæt.ə.deɪ/'}));
  assert.equal(response.status,200);
  assert.deepEqual(calls.map(call=>call.secret),['fake-first','fake-next']);
});
test('malformed AI output never becomes an English or rule-generated fallback',async()=>{
  pool={...pool,keys:[]};provider=()=>({error:'UNSURE'});
  const response=await route.POST(request({word:'Saturday',phonetic:'/ˈsæt.ə.deɪ/',apiKey:'fake-test-client-key'}));
  assert.equal(response.status,503);
  const data=await response.json();assert.equal(data.phonics,undefined);
  assert.equal(data.error,'AI_UNAVAILABLE');
});
test('invalid inputs fail before any provider request and batch output is checked',async()=>{
  calls.length=0;
  assert.equal((await route.POST(request({word:{invalid:true}}))).status,400);
  assert.equal(calls.length,0);
  provider=()=>[{en:'Saturday',...hint}];
  const response=await route.PUT(request({words:[{en:'Saturday',phonetic:'/ˈsæt.ə.deɪ/'}],apiKey:'fake-test-client-key'},'PUT'));
  assert.equal(response.status,200);
  assert.deepEqual((await response.json()).results.saturday.stressIndices,[0]);
});
