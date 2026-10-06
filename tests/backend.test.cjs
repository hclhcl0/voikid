/* eslint-disable @typescript-eslint/no-require-imports */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./ts-loader.cjs');
process.env.VOCAKIDS_CONTENT_DIR = fs.mkdtempSync(path.join(process.cwd(), '.tmp-learning/backend-test-'));
process.env.VOCAKIDS_ADMIN_PASSWORD = 'test-password-only-not-a-real-credential';
const { readContent, writeContent } = load('src/lib/backend/store.ts');
const { validateContent } = load('src/lib/backend/types.ts');
const { newAdminToken, isBackendAdmin, passwordMatches, sameOrigin } = load('src/lib/backend/auth.ts');
const { curriculumForCategories, validateCurriculum } = load('src/lib/learning/curriculum.ts');
test('seed remains readable and can be persisted including incomplete legacy entries', () => {
  const original=readContent(); validateContent(original);
  const next=writeContent(original); assert.equal(next.revision,1);
  assert.deepEqual(readContent(),next);
  assert.throws(()=>writeContent(original), /CONFLICT/);
});
test('rejects malformed settings, duplicate IDs and new incomplete words', () => {
  const data=readContent();
  assert.throws(()=>validateContent({...data,settings:{...data.settings,dailyGoal:0}}));
  assert.throws(()=>validateContent({...data,categories:[data.categories[0],data.categories[0]]}));
  const cat=structuredClone(data.categories[0]); cat.words.push({id:'invalid-new',en:'new',vi:'',phonetic:'',emoji:'',example_en:'',example_vi:''});
  assert.throws(()=>writeContent({...data,categories:[cat,...data.categories.slice(1)]}), /cần đủ/);
  assert.equal(readContent().revision,data.revision);
});
test('persist edits without replacing stable vocabulary IDs', () => {
  const data=readContent(); const cat=data.categories[0]; const id=cat.words[0].id;
  cat.words[0].vi='Nghĩa được cập nhật'; data.settings.appName='Tên ứng dụng mới';
  const saved=writeContent(data); assert.equal(saved.categories[0].words[0].id,id); assert.equal(readContent().settings.appName,'Tên ứng dụng mới');
});
test('pronunciation options persist and older clients preserve saved options', () => {
  const original=readContent();
  assert.equal(original.settings.pronunciation.adaptiveVad,true);
  original.settings.pronunciation.wordDurationMs=15000;
  const saved=writeContent(original);
  assert.equal(readContent().settings.pronunciation.wordDurationMs,15000);
  const legacy=structuredClone(saved); delete legacy.settings.pronunciation;
  writeContent(legacy);
  assert.equal(readContent().settings.pronunciation.wordDurationMs,15000);
  const invalid=readContent(); invalid.settings.pronunciation=null;
  assert.throws(()=>validateContent(invalid));
});
test('admin sessions reject absent, forged and password-rotated tokens', () => {
  const request=token=>({cookies:{get:()=>token?{value:token}:undefined}});
  assert.equal(isBackendAdmin(request('')),false);
  const token=newAdminToken(); assert.equal(isBackendAdmin(request(token)),true);
  assert.equal(isBackendAdmin(request(token.slice(0,-1)+'z')),false);
  assert.equal(passwordMatches('wrong'),false); assert.equal(passwordMatches(process.env.VOCAKIDS_ADMIN_PASSWORD),true);
  const password=process.env.VOCAKIDS_ADMIN_PASSWORD; process.env.VOCAKIDS_ADMIN_PASSWORD='rotated'; assert.equal(isBackendAdmin(request(token)),false); process.env.VOCAKIDS_ADMIN_PASSWORD=password;
});

test('unconfigured admin is reported separately from a wrong password', async () => {
  const { NextRequest } = require('next/server');
  const { GET, POST } = load('src/app/api/admin/session/route.ts');
  const password = process.env.VOCAKIDS_ADMIN_PASSWORD;
  const request = value => new NextRequest('https://app.test/api/admin/session', { method: 'POST', headers: { host: 'app.test', origin: 'https://app.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ password: value }) });
  try {
    delete process.env.VOCAKIDS_ADMIN_PASSWORD;
    assert.deepEqual(await GET(new NextRequest('https://app.test/api/admin/session')).json(), { authenticated: false, configured: false });
    const missing = await POST(request('test-only'));
    assert.equal(missing.status, 503);
    assert.match((await missing.json()).message, /VOCAKIDS_ADMIN_PASSWORD/);
    process.env.VOCAKIDS_ADMIN_PASSWORD = password;
    assert.equal((await POST(request('wrong-test-only'))).status, 401);
    const valid = await POST(request(password));
    assert.equal(valid.status, 200);
    const cookie = valid.cookies.get('vocakids_backend_session');
    assert.ok(cookie?.value);
    assert.equal(cookie.path, '/api/admin');
    assert.equal(cookie.httpOnly, true);
    assert.deepEqual(await valid.json(), { authenticated: true });
  } finally { process.env.VOCAKIDS_ADMIN_PASSWORD = password; }
});
test('rejects cross-origin writes', () => {
  const request=origin=>({headers:{get:key=>key==='host'?'localhost:3000':origin},nextUrl:{origin:'http://localhost:3000'}});
  assert.equal(sameOrigin(request('http://localhost:3000')),true); assert.equal(sameOrigin(request('https://evil.test')),false); assert.equal(sameOrigin(request(null)),false);
});
test('managed curriculum drops incompatible resource references after word removal', () => {
  const categories=readContent().categories.filter(c=>!c.archived);
  const all=curriculumForCategories(categories); assert.deepEqual(validateCurriculum(all),[]);
  const pilot=all.find(u=>u.resource); const cat=categories.find(c=>c.id===pilot.id); cat.words=[];
  const next=curriculumForCategories(categories).find(u=>u.id===pilot.id); assert.equal(next.resource,undefined); assert.equal(next.vocabulary.length,0);
});

