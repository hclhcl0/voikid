import type {ManagedCategory} from '@/lib/backend/types';
import type {CustomCategory} from '@/hooks/useCustomCategories';

/** Global curriculum and admin-authored collections are common learning material. */
export function sharedVocabulary(categories:ManagedCategory[],adminCategories:CustomCategory[]):ManagedCategory[]{
  const result=categories.filter(c=>!c.archived).map(c=>({...c,words:[...c.words]}));
  const archived=new Set(categories.filter(c=>c.archived).map(c=>c.id));
  for(const category of adminCategories){
    if(category.id==='custom_new_words'||archived.has(category.id)||!/^(lop[1-5]|maugiao)$/.test(category.gradeId??'')||('archived'in category&&category.archived))continue;
    const existing=result.find(c=>c.id===category.id);
    if(existing){if(existing.gradeId!==category.gradeId)continue;const known=new Set(existing.words.map(w=>w.en.trim().toLowerCase())),ids=new Set(existing.words.map(w=>w.id));for(const word of category.words)if(!known.has(word.en.trim().toLowerCase())&&!ids.has(word.id)){existing.words.push(word);known.add(word.en.trim().toLowerCase());ids.add(word.id);}}
    else result.push({...category,gradeId:category.gradeId!,words:[...category.words]});
  }
  return result;
}
