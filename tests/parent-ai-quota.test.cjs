/* eslint-disable @typescript-eslint/no-require-imports -- Uses the project's CommonJS TS loader. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createLoader} = require('./ts-loader.cjs');
fs.mkdirSync(path.join(process.cwd(),'.tmp-learning'),{recursive:true});
process.env.VOCAKIDS_CONTENT_DIR = fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/parent-ai-test-'));
const load = createLoader();
const {reserveParentAi,finishParentAi,ParentAiQuotaError,quotaDay,quotaReset} = load('src/lib/backend/parentAiQuota.ts');
const {validateParentAiSettings} = load('src/lib/stories/parentAiSettings.ts');
const cap = {enabled:true,dailyLimit:1};

test('validates finite integer limits, including a zero allowance',()=>{
  validateParentAiSettings({enabled:true,dailyLimit:0});
  for (const dailyLimit of [-1,1.5,NaN,1001,'5']) assert.throws(()=>validateParentAiSettings({enabled:true,dailyLimit}));
  assert.throws(()=>validateParentAiSettings(null));
});

test('admin control shows the enabled daily limit and disables the field when limits are off',()=>{
  const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
  const {ParentAiOptions}=load('src/components/settings/ParentAiOptions.tsx');
  const render=value=>renderToStaticMarkup(React.createElement(ParentAiOptions,{value,onChange:()=>{}}));
  const enabled=render({enabled:true,dailyLimit:3});
  assert.match(enabled,/Giới hạn AI cho phụ huynh/);
  assert.match(enabled,/value="3"/);
  assert.match(enabled,/min="0"/);
  assert.match(enabled,/00:00/);
  assert.ok(!enabled.includes('disabled=""'));
  assert.match(render({enabled:false,dailyLimit:5}),/disabled=""/);
});

test('disabled limits and admin accounts are exempt; zero blocks parent generation',async()=>{
  assert.equal(await reserveParentAi('admin','admin',cap),null);
  assert.equal(await reserveParentAi('unlimited','parent',{enabled:false,dailyLimit:1}),null);
  await assert.rejects(reserveParentAi('blocked','parent',{enabled:true,dailyLimit:0}),ParentAiQuotaError);
});

test('concurrent requests reserve at most one slot and failures release it',async()=>{
  const attempts=await Promise.allSettled(Array.from({length:12},()=>reserveParentAi('concurrent','parent',cap)));
  const allowed=attempts.filter(a=>a.status==='fulfilled');
  assert.equal(allowed.length,1);
  assert.equal(attempts.filter(a=>a.status==='rejected'&&a.reason instanceof ParentAiQuotaError).length,11,JSON.stringify(attempts.filter(a=>a.status==='rejected'&&!(a.reason instanceof ParentAiQuotaError)).map(a=>({message:a.reason.message,code:a.reason.code}))));
  await finishParentAi(allowed[0].value,false);
  const retry=await reserveParentAi('concurrent','parent',cap);
  await finishParentAi(retry,true);
  await assert.rejects(reserveParentAi('concurrent','parent',cap),ParentAiQuotaError);
});

test('success is durable across module reload; accounts do not share allowance',async()=>{
  const reload=createLoader()('src/lib/backend/parentAiQuota.ts');
  await assert.rejects(reload.reserveParentAi('concurrent','parent',cap),/dùng hết/);
  const other=await reload.reserveParentAi('another-parent','parent',cap);
  await reload.finishParentAi(other,true);
  await reload.finishParentAi(other,true);
  const entries=JSON.parse(fs.readFileSync(path.join(process.env.VOCAKIDS_CONTENT_DIR,'parent-ai-usage.json'),'utf8')).entries;
  assert.equal(entries.find(e=>e.accountId==='another-parent').used,1);
});

test('quota resets at Vietnamese midnight and completes an older pending reservation in its original day',async()=>{
  const before=Date.parse('2026-10-07T16:59:59Z'),after=Date.parse('2026-10-07T17:00:01Z');
  assert.equal(quotaDay(before),'2026-10-07');
  assert.equal(quotaDay(after),'2026-10-08');
  assert.equal(quotaReset(before),'2026-10-07T17:00:00.000Z');
  const first=await reserveParentAi('midnight','parent',cap,before);
  await finishParentAi(first,true,after);
  await assert.rejects(reserveParentAi('midnight','parent',cap,before),ParentAiQuotaError);
  assert.ok(await reserveParentAi('midnight','parent',cap,after));
});

test('a crashed generation does not hold allowance forever',async()=>{
  const now=Date.parse('2026-10-09T06:00:00Z');
  await reserveParentAi('crashed','parent',cap,now);
  await assert.rejects(reserveParentAi('crashed','parent',cap,now+1000),ParentAiQuotaError);
  assert.ok(await reserveParentAi('crashed','parent',cap,now+11*60000));
});

test('story API enforces parent quota across children, keeps cached reads free, exempts admin, and refunds provider errors',async()=>{
  const {NextRequest}=require('next/server');
  let calls=0,fail=false;
  const cached=new Map();
  const settings={parentAi:cap};
  const units=[{id:'unit-a',grade:1,vocabulary:[]},{id:'unit-b',grade:1,vocabulary:[]}];
  const accounts=['route-parent','route-other'].map(id=>({id,role:'parent'}));
  const routeLoader=createLoader({
    '@/lib/backend/store':{readContent:()=>({settings,categories:[]})},
    '@/lib/backend/auth':{sameOrigin:()=>true,isBackendAdmin:req=>req.headers.get('test-admin')==='yes'},
    '@/lib/auth':{getAccountFromRequest:req=>({accountId:req.headers.get('test-parent')||'route-parent'})},
    '@/lib/backend/families':{readFamilies:()=>({accounts,profiles:[{id:'child-a',ownerId:'route-parent',gradeId:'lop1'},{id:'child-b',ownerId:'route-parent',gradeId:'lop1'},{id:'other-child',ownerId:'route-other',gradeId:'lop1'}],progresses:{}}),ownsProfile:(a,p)=>a.id===p.ownerId||a.role==='admin'},
    '@/lib/learning/curriculum':{curriculumForCategories:()=>units},
    '@/lib/stories/source':{storySource:()=>({topic:'Test',patterns:[]}),STORY_SOURCE_VERSION:1,STORY_GENERATION_VERSION:1},
    '@/lib/stories/learning':{readingEvidence:()=>({total:0,independent:0}),readingBand:()=> 'support'},
    '@/lib/stories/validation':{validateStoryOutput:()=>{}},
    '@/lib/stories/store':{readStory:hash=>cached.get(hash),saveStory:(hash,story)=>cached.set(hash,story)},
    '@/lib/stories/generate':{generateStory:async()=>{calls++;if(fail)throw new Error('MOCK_PROVIDER_FAILURE');return {title:'Test',sentences:[{id:'s1',en:'Hello.',vi:'Xin chào.',patternIndexes:[]}],vocabulary:[],questions:[]};}},
  });
  const {POST}=routeLoader('src/app/api/story/route.ts');
  const req=(variant=0,profileId='child-a',headers={},unitId='unit-a')=>new NextRequest('https://app.test/api/story',{method:'POST',headers,body:JSON.stringify({unitId,profileId,gradeId:'lop1',variant})});
  const responses=await Promise.all([POST(req()),POST(req())]);
  assert.ok(responses.every(r=>r.status===200));assert.equal(calls,1);
  assert.equal((await POST(req())).status,200);assert.equal(calls,1);
  const blocked=await POST(req(1,'child-b'));
  assert.equal(blocked.status,429);assert.equal((await blocked.json()).code,'PARENT_AI_DAILY_LIMIT');assert.ok(blocked.headers.get('Retry-After'));assert.equal(calls,1);
  assert.equal((await POST(req(1,'local-child',{'test-admin':'yes'}))).status,200);assert.equal(calls,2);
  fail=true;
  assert.equal((await POST(req(2,'other-child',{'test-parent':'route-other'}))).status,503);
  fail=false;
  assert.equal((await POST(req(2,'other-child',{'test-parent':'route-other'}))).status,200);
  settings.parentAi={enabled:true,dailyLimit:0};
  assert.equal((await POST(req())).status,200); // Cached content stays usable.
  assert.equal((await POST(req(3,'child-a',{},'unit-b'))).status,429);
  assert.equal((await POST(req(3,'other-child'))).status,403); // Ownership checks precede quota.
});
