'use client';
import Link from 'next/link';
import {useState} from 'react';
import {Gamepad2,Map,Search,ShoppingBag,Swords} from 'lucide-react';
import {AppPageHeader} from '@/components/ui/AppPageHeader';
import {useVocabularyCatalog} from '@/hooks/useVocabularyCatalog';
import {useProfileContext} from '@/context/ProfileContext';
import {useCustomCategories} from '@/hooks/useCustomCategories';

export default function GamesPage(){
  const {categories,settings}=useVocabularyCatalog(),{categories:custom}=useCustomCategories();
  const {activeProfile,hydrated,openProfileModal}=useProfileContext();
  const [query,setQuery]=useState('');
  const units=[...custom,...categories].filter((category,index,all)=>all.findIndex(c=>c.id===category.id)===index&&category.words.length>0&&(!category.gradeId||category.gradeId===activeProfile.gradeId)&&!('archived'in category&&category.archived));
  const visible=units.filter(c=>`${c.name_vi} ${c.name_en}`.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
  if(!settings.showGames)return <main className="ui-page"><div className="ui-container"><AppPageHeader title="Góc trò chơi" description="Cùng học từ qua những thử thách nhỏ."/><p className="ui-empty">Trò chơi đang tạm nghỉ theo cài đặt của quản trị viên.</p></div></main>;
  return <main className="ui-page"><div className="ui-container">
    <AppPageHeader title="Góc trò chơi" description="Nghe, nhớ từ và khám phá qua những lượt chơi ngắn."/>
    <section className="ui-feature-grid" aria-label="Trò chơi khám phá">
      {[{href:'/arena',title:'Đấu trường từ vựng',description:'Chọn chủ đề, trả lời và cùng nhân vật vượt thử thách.',Icon:Swords},{href:'/shop',title:'Cửa hàng nhỏ',description:'Nghe từ, chọn đồ và học từ vựng qua mua sắm.',Icon:ShoppingBag}].map(({href,title,description,Icon})=><Link key={href} href={href} className="ui-panel ui-feature-link"><span className="ui-feature-icon"><Icon aria-hidden="true" className="h-6 w-6"/></span><h2 className="ui-section-title">{title}</h2><p className="ui-page-description">{description}</p><span className="ui-link-label">Khám phá →</span></Link>)}
    </section>
    <section className="ui-section"><div><h2 className="ui-section-title">Chơi theo chủ đề của bé</h2><p className="ui-page-description">Tìm từ hoặc săn kho báu từ chính những Unit đang học.</p></div>
      {!hydrated?<p role="status" className="ui-empty">Đang mở các chủ đề…</p>:!activeProfile.id?<div className="ui-empty"><p>Chọn học sinh để mở trò chơi đúng lớp.</p><button onClick={openProfileModal} className="ui-button ui-button-primary mt-4">Chọn học sinh</button></div>:<>
        <label className="ui-search"><Search aria-hidden="true" className="h-5 w-5"/><span className="sr-only">Tìm chủ đề chơi</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm chủ đề chơi…"/></label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{visible.map(unit=><article key={unit.id} className="ui-panel flex flex-col gap-3"><Gamepad2 aria-hidden="true" className="h-6 w-6 text-violet-600"/><h3 className="font-bold">{unit.name_vi}</h3><p className="text-sm text-slate-500">{unit.words.length} từ trong chủ đề</p><div className="mt-auto grid gap-2"><Link href={`/treasure/${unit.id}`} className="ui-button ui-button-primary"><Map aria-hidden="true" className="h-4 w-4"/>Săn kho báu</Link><Link href={`/wordsearch/${unit.id}`} className="ui-button ui-button-secondary"><Search aria-hidden="true" className="h-4 w-4"/>Tìm từ</Link></div></article>)}</div>
        {!visible.length&&<p role="status" className="ui-empty">Chưa có chủ đề phù hợp. Thử từ khóa khác hoặc thêm từ vào kho của bé nhé!</p>}
      </>}
    </section>
  </div></main>;
}
