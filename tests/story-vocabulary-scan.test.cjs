/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createLoader}=require('./ts-loader.cjs');
const lesson={grade:4,sentences:[{id:'s1',en:'We stay healthy.',vi:'Chúng em giữ sức khỏe.'}]};
const term={en:'stay healthy',vi:'giữ sức khỏe',ipa:'',sentenceId:'s1'};
function setup(responses,pool={keys:[]}) {
  const calls=[];
  const load=createLoader({
    '@/lib/backend/apiKeys':{readApiKeys:()=>pool,credentialId:key=>key.id},
    '@google/generative-ai':{SchemaType:{STRING:'string',OBJECT:'object',ARRAY:'array'},GoogleGenerativeAI:class {
      constructor(key){this.key=key;}
      getGenerativeModel(config,options){return {generateContent:async prompt=>{
        calls.push({key:this.key,prompt,timeout:options.timeout});
        const result=responses.shift();if(result instanceof Error)throw result;
        return {response:{text:()=>typeof result==='string'?result:JSON.stringify(result)}};
      }};}
    }},
  });
  return {calls,...load('src/lib/stories/extractVocabulary.ts')};
}
test('scan prefers shared server key over stale browser key even with disabled pool entries',async()=>{
  const old=process.env.GEMINI_API_KEY;process.env.GEMINI_API_KEY='dummy-shared-server';
  try {
    const scan=setup([{vocabulary:[term]}],{keys:[{enabled:false}]});
    assert.equal((await scan.extractVocabulary(lesson,'test-model',20000,'dummy-stale-browser'))[0].en,term.en);
    assert.equal(scan.calls[0].key,'dummy-shared-server');
  }finally{if(old===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=old;}
});
test('scan repairs invalid output within remaining deadline and keeps exact passage terms',async()=>{
  const scan=setup([{vocabulary:[{...term,en:'invented word'}]},{vocabulary:[term]}]);
  const result=await scan.extractVocabulary(lesson,'test-model',20000,'dummy-client');
  assert.equal(result[0].en,term.en);assert.equal(scan.calls.length,2);
  assert.match(scan.calls[1].prompt,/Repair this previous JSON/);
  assert.ok(scan.calls[1].timeout<=scan.calls[0].timeout);
});
test('scan rejects invalid repairs and exposes failure codes without provider secrets',async()=>{
  const invalid=setup(['not json',{vocabulary:[{...term,sentenceId:'unknown'}]}]);
  await assert.rejects(invalid.extractVocabulary(lesson,'test-model',20000,'dummy-client'),e=>e.code==='invalid_output');
  for(const [status,code] of [[401,'auth'],[429,'quota'],[503,'transient'],[404,'provider']]) {
    const scan=setup([Object.assign(new Error('provider detail containing dummy-secret'),{status})]);
    await assert.rejects(scan.extractVocabulary(lesson,'test-model',20000,'dummy-client'),e=>e.code===code&&!e.message.includes('dummy-secret'));
  }
});
test('scan route returns specific safe errors instead of a generic failure',async()=>{
  const {NextRequest}=require('next/server');
  for(const [code,status] of [['auth',503],['quota',429],['invalid_output',503],['NO_API_KEY',503]]) {
    const {VocabularyScanError}=setup([]);
    const load=createLoader({
      '@/lib/backend/auth':{sameOrigin:()=>true,isBackendAdmin:()=>true},
      '@/lib/auth':{getAccountFromRequest:()=>null},
      '@/lib/backend/families':{readFamilies:()=>({accounts:[],profiles:[],categories:{}}),ownsProfile:()=>false,familyId:()=> 'admin'},
      '@/lib/backend/store':{readContent:()=>({categories:[],settings:{}})},
      '@/lib/learning/curriculum':{curriculumForCategories:()=>[{id:'unit-test',grade:4}]},
      '@/lib/stories/learning':{newStorySession:()=>({}),validStorySession:()=>true},
      '@/lib/stories/store':{readVocabulary:()=>null,saveVocabulary:()=>{}},
      '@/lib/stories/extractVocabulary':{VocabularyScanError,extractVocabulary:async()=>{throw new VocabularyScanError(code);}},
    });
    const {POST}=load('src/app/api/story/vocabulary/route.ts');
    const result=await POST(new NextRequest('http://localhost/api/story/vocabulary',{method:'POST',body:JSON.stringify({profileId:'child',lesson:{...lesson,unitId:'unit-test'}})}));
    assert.equal(result.status,status);const body=await result.json();
    assert.equal(body.code,code);assert.ok(body.message.length>20);
    assert.equal(result.headers.get('Cache-Control'),'no-store');
  }
});
