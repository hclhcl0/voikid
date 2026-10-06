import type {Category,Word} from '@/types';
import type {StoryLesson} from './types';
import {passageTermSentence} from './library';

const wordKey=(value:string)=>value.normalize('NFC').trim().toLowerCase().replace(/\s+/g,' ');
export function mergeExtractedVocabulary(lesson:StoryLesson,terms:StoryLesson['vocabulary']):StoryLesson {
  const vocabulary=[...lesson.vocabulary],seen=new Set(vocabulary.map(term=>wordKey(term.en))),ids=new Set(vocabulary.map(term=>term.id));
  let number=1;
  for(const term of terms) {
    const key=wordKey(term.en);if(seen.has(key))continue;seen.add(key);
    while(ids.has(`scan_v${number}`))number++;
    const id=`scan_v${number++}`;ids.add(id);vocabulary.push({...term,id});
  }
  return {...lesson,vocabulary,vocabularyScannedAt:new Date().toISOString()};
}
export function newStoryVocabulary(lesson:StoryLesson,categories:(Category&{gradeId?:string;archived?:boolean})[],grade:number) {
  const key=(value:string)=>wordKey(value).replace(/’/g,"'").replace(/^viet nam$/,'vietnam');
  const known=new Set(categories.filter(category=>!category.archived&&/^lop[1-5]$/.test(category.gradeId??'')&&Number(category.gradeId!.slice(3))<=grade).flatMap(category=>category.words.map(word=>key(word.en))));
  const seen=new Set<string>();
  return lesson.vocabulary.filter(term=>{const normalized=key(term.en);if(!normalized||known.has(normalized)||seen.has(normalized))return false;seen.add(normalized);return true;});
}
export function wordsFromStory(lesson:StoryLesson,ids:string[],newId:()=>string):Word[] {
  const selected=new Set(ids),seen=new Set<string>();
  return lesson.vocabulary.flatMap(term=>{
    if(!selected.has(term.id)||!term.en.trim()||!term.vi.trim()) return [];
    const key=wordKey(term.en);if(seen.has(key)) return [];seen.add(key);
    const sentence=lesson.sentences.find(s=>s.id===term.sentenceId);
    if(!sentence||!passageTermSentence([sentence],term.en)) throw new Error('Từ vựng không khớp đoạn văn.');
    return [{id:newId(),en:term.en.trim(),vi:term.vi.trim(),phonetic:term.ipa||'',emoji:'📖',example_en:sentence.en,example_vi:sentence.vi}];
  });
}
export function appendUniqueStoryWords<T extends Category>(categories:T[],categoryId:string,words:Word[]) {
  const category=categories.find(c=>c.id===categoryId);
  if(!category) throw new Error('Chủ đề không còn tồn tại. Tải lại trước khi thêm từ.');
  const existing=new Set(category.words.map(word=>wordKey(word.en)));
  const added=words.filter(word=>{const key=wordKey(word.en);if(existing.has(key)) return false;existing.add(key);return true;});
  return {categories:categories.map(c=>c.id===categoryId?{...c,words:[...c.words,...added]}:c),added:added.length};
}
