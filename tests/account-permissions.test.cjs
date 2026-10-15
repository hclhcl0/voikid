/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');const {NextRequest,NextResponse}=require('next/server');
const {createLoader}=require('./ts-loader.cjs');
fs.mkdirSync(path.join(process.cwd(),'.tmp-learning'),{recursive:true});
process.env.VOCAKIDS_FAMILY_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/permissions-family-'));
process.env.VOCAKIDS_CONTENT_DIR=fs.mkdtempSync(path.join(process.cwd(),'.tmp-learning/permissions-content-'));
process.env.VOCAKIDS_ADMIN_PASSWORD='permissions-test-only-secret';
const load=createLoader(),auth=load('src/lib/auth.ts'),backend=load('src/lib/backend/auth.ts');
const {canManageFamily}=load('src/lib/access.ts');
const token=role=>auth.signJWT({accountId:`${role}-test`,email:`${role}@test.invalid`,displayName:'Test',...(role?{role}:{})});
const req=(role,method='GET',body)=>new NextRequest('http://localhost:3000/api/admin/content',{method,headers:{host:'localhost:3000',origin:'http://localhost:3000',cookie:`${backend.ADMIN_COOKIE}=${backend.newAdminToken()}; ${auth.AUTH_COOKIE_NAME}=${token(role)}`},...(body?{body:JSON.stringify(body)}:{})});

test('parent and student roles cannot inherit admin access from a previous browser cookie',async()=>{
  const content=load('src/app/api/admin/content/route.ts'),keys=load('src/app/api/admin/api-keys/route.ts'),family=load('src/app/api/admin/family/route.ts');
  for(const role of ['parent','student',undefined]){
    assert.equal(backend.isBackendAdmin(req(role)),false);
    assert.equal(content.GET(req(role)).status,401);
    assert.equal((await content.PUT(req(role,'PUT',{}))).status,403);
    assert.equal(keys.GET(req(role)).status,401);
    assert.equal(family.GET(req(role)).status,403);
    assert.equal((await family.POST(req(role,'POST',{action:'create_student'}))).status,403);
  }
  assert.equal(backend.isBackendAdmin(req('admin')),true);
  assert.equal(backend.isBackendAdmin(new NextRequest('http://localhost:3000',{headers:{cookie:`${backend.ADMIN_COOKIE}=${backend.newAdminToken()}`}})),true);
});

test('non-admin login expires both admin cookie paths, while an admin login retains its session',()=>{
  for(const role of ['parent','student',undefined]){
    const response=NextResponse.json({success:true});auth.setAuthCookie(response,token(role));
    const cookies=response.headers.getSetCookie();
    assert.ok(cookies.some(c=>c.startsWith(`${backend.ADMIN_COOKIE}=`)&&/Path=\/;/.test(c)&&/Max-Age=0/.test(c)));
    assert.ok(cookies.some(c=>c.startsWith(`${backend.ADMIN_COOKIE}=`)&&/Path=\/api\/admin;/.test(c)&&/Max-Age=0/.test(c)));
    assert.ok(cookies.some(c=>c.startsWith(`${auth.AUTH_COOKIE_NAME}=`)));
  }
  const response=NextResponse.json({});auth.setAuthCookie(response,token('admin'));
  assert.ok(!response.headers.getSetCookie().some(c=>c.startsWith(`${backend.ADMIN_COOKIE}=`)));
});

test('only the configured admin password grants system admin login on every login endpoint',async()=>{
  const legacy=createLoader({'@/lib/postgres':{isPostgresConfigured:()=>false},'@/lib/profiles':{readProfiles:()=>[],getProfilesByOwner:()=>[]}})('src/app/api/auth/login/route.ts');
  const family=load('src/app/api/family/route.ts'),session=load('src/app/api/admin/session/route.ts');
  let sequence=0;
  const login=(body)=>new NextRequest('http://localhost:3000/api/family',{method:'POST',headers:{host:'localhost:3000',origin:'http://localhost:3000','x-forwarded-for':`test-${sequence++}`},body:JSON.stringify(body)});
  for(const password of ['admin123','123456','admin']){
    assert.equal(backend.passwordMatches(password),false);
    for(const email of ['admin@vocakids.com','parent@test.invalid']){
      const data=await (await family.POST(login({action:'login',email,password}))).json();assert.notEqual(data.account?.role,'admin');
      const old=await (await legacy.POST(login({email,password}))).json();assert.notEqual(old.account?.role,'admin');
    }
    assert.equal((await session.POST(login({password}))).status,401);
  }
  assert.equal(backend.passwordMatches(process.env.VOCAKIDS_ADMIN_PASSWORD),true);
  assert.equal((await session.POST(login({password:process.env.VOCAKIDS_ADMIN_PASSWORD}))).status,200);
});

test('family management depends on roles, never on local PIN state',()=>{
  for(const role of ['parent','admin'])assert.equal(canManageFamily(role),true);
  assert.equal(canManageFamily(undefined),false);
  assert.equal(canManageFamily('student',true),false);
  assert.equal(canManageFamily(undefined,true),true);
});

test('logout expires both admin cookie paths so a later guest cannot regain the old session',async()=>{
  const logout=load('src/app/api/auth/logout/route.ts'),session=load('src/app/api/admin/session/route.ts');
  for(const response of [await logout.POST(req('parent','POST')),await logout.GET(req('parent')),session.DELETE(req('admin','DELETE'))]){
    const cookies=response.headers.getSetCookie();
    for(const cookiePath of ['/','/api/admin'])assert.ok(cookies.some(c=>c.startsWith(`${backend.ADMIN_COOKIE}=`)&&c.includes(`Path=${cookiePath};`)&&c.includes('Max-Age=0')));
  }
});
