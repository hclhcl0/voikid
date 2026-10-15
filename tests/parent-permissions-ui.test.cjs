/* eslint-disable @typescript-eslint/no-require-imports */
const {test}=require('node:test'),assert=require('node:assert/strict');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');const {createLoader}=require('./ts-loader.cjs');
let role='parent';const child={id:'child',name:'Bé',gradeId:'lop1'};
const progress={totalStars:0,streak:0,wordProgress:{},dailyStats:[],learningSessions:{},ipaPractice:{}};
const profile={hydrated:true,progress,activeProfileId:child.id,activeProfile:child,profiles:[child],getProfileStars:()=>0,isProfileModalOpen:true};
const load=createLoader({
  'next/navigation':{useRouter:()=>({push:()=>{},back:()=>{}}),useSearchParams:()=>new Map()},
  '@/context/AuthContext':{useAuth:()=>({account:role?{role,displayName:'Test'}:null,isAuthenticated:!!role,isLoading:false,openAuthModal:()=>{}})},
  '@/hooks/useBackendSession':{useBackendSession:()=>({authenticated:role==='admin',loading:false})},
  '@/context/AdminContext':{useAdminContext:()=>({isAdmin:true,openAdminModal:()=>{},logoutAdmin:()=>{}})},
  '@/hooks/useProgress':{useProgress:()=>({...profile,getDueReviewWords:()=>[]})},
  '@/context/ProfileContext':{useProfileContext:()=>profile,AVATAR_LIST:[],COLOR_THEMES:{orange:{bg:'bg-orange-50',badge:'',border:'',text:''}}},
  '@/hooks/useCustomCategories':{NEW_WORDS_CAT_ID:'new',useCustomCategories:()=>({categories:[],hydrated:true,syncError:null})},
  '@/hooks/useVocabularyCatalog':{useVocabularyCatalog:()=>({categories:[],settings:{appName:'Test',welcomeText:'Hello',showGames:false}})},
  '@/hooks/useSettings':{useSettings:()=>({apiKey:'',hydrated:true})},
  '@/components/ChildBadge':{ChildBadge:()=>null},
  '@/components/learning/LearningSummary':{LearningSummary:()=>null,LearningEntry:()=>null},
  '@/components/learning/DailyWordCard':{DailyWordCard:()=>null},
  '@/components/ui/AppPageHeader':{AppPageHeader:({title,actions})=>React.createElement('header',null,title,actions)},
});
const render=file=>renderToStaticMarkup(React.createElement(load(file).default));
test('parent home, vocabulary management, import and report have no admin lock or PIN prompts',()=>{
  role='parent';
  for(const file of ['src/app/page.tsx','src/app/manage/page.tsx','src/app/import/page.tsx','src/app/learning-report/page.tsx']){
    const html=render(file);assert.doesNotMatch(html,/Khóa quản trị|Khóa quyền Admin|Mở Khóa Quyền Admin|mã PIN/);
    assert.ok(!html.includes('Đăng nhập phụ huynh'),file);
  }
});
test('an old local PIN session cannot open management pages for a guest or student',()=>{
  for(const nextRole of [undefined,'student']){
    role=nextRole;
    for(const file of ['src/app/manage/page.tsx','src/app/import/page.tsx','src/app/learning-report/page.tsx']){
      const html=render(file);
      assert.match(html,nextRole==='student'?/Phần này dành cho phụ huynh/:/Đăng nhập phụ huynh/);
    }
  }
});
test('student profile selector hides edit, delete and create actions even when the old local PIN is unlocked',()=>{
  role='student';const {ProfileModal}=load('src/components/ProfileModal.tsx');
  const html=renderToStaticMarkup(React.createElement(ProfileModal));
  assert.doesNotMatch(html,/title="Chỉnh sửa"|title="Xóa hồ sơ"|Thêm tài khoản bé mới/);
});
