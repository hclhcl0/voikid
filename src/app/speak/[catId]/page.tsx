"use client";
import Link from 'next/link';
import {useParams} from 'next/navigation';
import {useState} from 'react';
import {useVocabularyCatalog} from '@/hooks/useVocabularyCatalog';
import {useCustomCategories} from '@/hooks/useCustomCategories';
import {useEnrichedWord} from '@/hooks/useEnrichedWord';
import {useProgress} from '@/hooks/useProgress';
import {WordLearningNavigation} from '@/components/learning/WordLearningNavigation';
import {WordSpeakingPractice} from '@/components/learning/WordSpeakingPractice';

export default function SpeakPage(){
  const {catId}=useParams<{catId:string}>();
  return <UnitSpeaking key={catId} categoryId={catId}/>;
}
function UnitSpeaking({categoryId}:{categoryId:string}){
  const {categories}=useVocabularyCatalog();
  const {categories:custom,updateWord}=useCustomCategories();
  const {activeProfile,hydrated}=useProgress();
  const [index,setIndex]=useState(0);
  const category=(categoryId.startsWith('custom_')?[...custom,...categories]:categories).find(c=>c.id===categoryId);
  const position=Math.min(index,Math.max(0,(category?.words.length??0)-1));
  const rawWord=category?.words[position];
  const {word:enriched}=useEnrichedWord(categoryId,rawWord,updateWord);
  const word=enriched||rawWord;
  if(!hydrated)return <p role="status" className="p-8 text-center">Đang mở luyện nói…</p>;
  if(!category||!word)return <p className="p-8 text-center">Chưa có từ để luyện. <Link href="/" className="text-violet-700 underline">Về trang chủ</Link></p>;
  return <div className="min-h-screen bg-slate-50">
    <WordLearningNavigation categoryId={categoryId} emoji={category.emoji} index={position} total={category.words.length} mode="speak"/>
    <div className="mx-auto max-w-2xl px-4 pb-24 pt-4">
      <WordSpeakingPractice key={`${activeProfile.id}:${categoryId}:${word.id}`} categoryId={categoryId} word={word}
        onPrevious={position>0?()=>setIndex(position-1):undefined}
        onNext={position<category.words.length-1?()=>setIndex(position+1):undefined}/>
    </div>
  </div>;
}
