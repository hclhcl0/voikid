/* eslint-disable @typescript-eslint/no-require-imports -- Uses the project's TS loader. */
const test=require('node:test'),assert=require('node:assert/strict');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {load,createLoader}=require('./ts-loader.cjs');
const {appSection,primaryNavigation,navigationActive}=load('src/lib/navigation.ts');

test('every feature belongs to exactly one primary navigation section',()=>{
  const routes={learning:['/','/learn/unit','/speak/unit','/daily','/test','/test/unit','/ipa'],reading:['/curriculum','/unit/story'],games:['/games','/arena','/shop','/wordsearch/unit','/treasure/unit','/quiz/unit'],stickers:['/stickers'],family:['/admin','/manage','/parent','/settings','/import','/learning-report','/login'],review:['/review']};
  for(const [section,paths] of Object.entries(routes))for(const path of paths){
    assert.equal(appSection(path),section,path);
    const active=primaryNavigation('parent').filter(item=>navigationActive(item.id,path,'parent'));
    assert.equal(active.length,1,path);
  }
  assert.equal(appSection('/unit-other'),'learning');
});

test('student navigation never sends a child to family management or admin',()=>{
  const items=primaryNavigation('student');
  assert.equal(items.length,5);assert.equal(new Set(items.map(i=>i.id)).size,5);
  assert.ok(items.some(i=>i.href==='/review'));
  assert.ok(items.every(i=>!['/parent','/admin','/learning-report'].includes(i.href)));
  assert.equal(items.filter(i=>navigationActive(i.id,'/review','student')).length,1);
});

test('shared navigation announces its active destination and hides decorative icons',()=>{
  const fixture=createLoader({'next/navigation':{usePathname:()=>'/unit/test'},'@/context/AuthContext':{useAuth:()=>({account:{role:'parent'}})}});
  const {BottomNavBar}=fixture('src/components/navigation/BottomNavBar.tsx');
  const html=renderToStaticMarkup(React.createElement(BottomNavBar));
  assert.match(html,/Điều hướng chính/);assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
  const activeAnchor=html.match(/<a\b[^>]*aria-current="page"[^>]*>/)?.[0];
  assert.match(activeAnchor,/href="\/curriculum"/);
  assert.equal((html.match(/aria-hidden="true"/g)||[]).length,5);
});

test('shared page headers keep functional actions and can omit the profile control for admin',()=>{
  const fixture=createLoader({'@/components/ChildBadge':{ChildBadge:()=>React.createElement('span',null,'Hồ sơ bé')}});
  const {AppPageHeader}=fixture('src/components/ui/AppPageHeader.tsx');
  const html=renderToStaticMarkup(React.createElement(AppPageHeader,{title:'Quản trị ứng dụng',description:'Cài đặt chung',profile:false,actions:React.createElement('button',{type:'button'},'Lưu thay đổi')}));
  assert.equal((html.match(/<h1/g)||[]).length,1);assert.match(html,/Lưu thay đổi/);
  assert.match(html,/href="\/"/);assert.ok(!html.includes('Hồ sơ bé'));
});

test('game hub respects game visibility, grade and empty search/profile states',()=>{
  let showGames=true,profileId='child';
  const fixture=createLoader({
    '@/components/ChildBadge':{ChildBadge:()=>React.createElement('span',null,'Hồ sơ bé')},
    '@/hooks/useVocabularyCatalog':{useVocabularyCatalog:()=>({settings:{showGames},categories:[{id:'grade1',gradeId:'lop1',name_vi:'Lớp một',words:[{id:'one'}]},{id:'grade4',gradeId:'lop4',name_vi:'Lớp bốn',words:[{id:'four'}]},{id:'old',gradeId:'lop1',archived:true,name_vi:'Đã ẩn',words:[{id:'old'}]}]})},
    '@/context/ProfileContext':{useProfileContext:()=>({activeProfile:{id:profileId,gradeId:'lop1'},hydrated:true,openProfileModal:()=>{}})},
    '@/hooks/useCustomCategories':{useCustomCategories:()=>({categories:[]})},
  });
  const Page=fixture('src/app/games/page.tsx').default,render=()=>renderToStaticMarkup(React.createElement(Page));
  let html=render();assert.match(html,/\/treasure\/grade1/);assert.ok(!html.includes('/treasure/grade4'));assert.ok(!html.includes('/treasure/old'));
  showGames=false;html=render();assert.match(html,/tạm nghỉ/);assert.ok(!html.includes('href="/arena"'));
  showGames=true;profileId='';assert.match(render(),/Chọn học sinh để mở trò chơi đúng lớp/);
});
