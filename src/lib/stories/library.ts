import type {AppProgress} from '@/types';
import type {StoryLesson,StorySource} from './types';
import {validStorySession} from './learning';

export function deleteStory(progress:AppProgress,id:string,profileId:string,at=new Date().toISOString()):AppProgress {
  if(!validStorySession(progress.storySessions?.[id],profileId)) throw new Error('Không tìm thấy đoạn văn trong hồ sơ này.');
  const stories={...progress.storySessions};delete stories[id];
  return {...progress,storySessions:stories,deletedStories:{...progress.deletedStories,[id]:at}};
}

// A deletion survives stale device sync; an explicit later save can restore a story.
export function mergeStoryLibrary(current:Partial<AppProgress>,incoming:Partial<AppProgress>,profileId:string) {
  const deletedStories:Record<string,string>={};
  for(const progress of [current,incoming]) for(const [id,at] of Object.entries(progress.deletedStories??{})) {
    if(/^[\w-]{1,120}$/.test(id)&&typeof at==='string'&&Number.isFinite(Date.parse(at))&&(!deletedStories[id]||Date.parse(at)>Date.parse(deletedStories[id]))) deletedStories[id]=at;
  }
  const storySessions:NonNullable<AppProgress['storySessions']>={};
  for(const progress of [current,incoming]) for(const session of Object.values(progress.storySessions??{})) {
    if(!validStorySession(session,profileId)||!Number.isFinite(Date.parse(session.updatedAt))) continue;
    const previous=storySessions[session.id];
    if(!previous||Date.parse(session.updatedAt)>Date.parse(previous.updatedAt)) storySessions[session.id]=session;
  }
  for(const [id,at] of Object.entries(deletedStories)) if(storySessions[id]&&Date.parse(storySessions[id].updatedAt)<=Date.parse(at)) delete storySessions[id];
  return {storySessions,deletedStories};
}

export function splitPassage(text:string):string[] {
  return Array.from(new Intl.Segmenter('en',{granularity:'sentence'}).segment(text),part=>part.segment.trim()).filter(Boolean);
}

export function passageTermSentence(sentences:StoryLesson['sentences'],term:string) {
  const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const regex=new RegExp(`(^|[^a-zA-Z])${escaped}(?=$|[^a-zA-Z])`,'i');
  return sentences.find(sentence=>regex.test(sentence.en));
}

export function manualStory(input:{title:string;text:string;translation:string;vocabulary:string},unitId:string,source:StorySource,id:string,at=new Date().toISOString()):StoryLesson {
  const title=input.title.trim(),text=input.text.trim();
  if(!title||title.length>100) throw new Error('Tiêu đề cần từ 1 đến 100 ký tự.');
  if(!text||text.length>6000||!/[A-Za-z]/.test(text)) throw new Error('Dán đoạn văn tiếng Anh, tối đa 6.000 ký tự.');
  if(input.translation.length>12000||input.vocabulary.length>8000) throw new Error('Bản dịch hoặc danh sách từ quá dài.');
  const lines=splitPassage(text);
  if(!lines.length||lines.length>60||lines.some(line=>line.length>600)) throw new Error('Bài đọc tối đa 60 câu, mỗi câu không quá 600 ký tự.');
  const translations=input.translation.trim()?input.translation.trim().split(/\r?\n/).map(line=>line.trim()):[];
  if(translations.length&&translations.length!==lines.length) throw new Error(`Bản dịch cần ${lines.length} dòng, mỗi dòng ứng với một câu tiếng Anh.`);
  const sentences=lines.map((en,index)=>({id:`s${index+1}`,en,vi:translations[index]??'',patternIndexes:[]}));
  const vocabulary:StoryLesson['vocabulary']=[];
  const seen=new Set<string>();
  for(const line of input.vocabulary.split(/\r?\n/).filter(line=>line.trim())) {
    const [en,vi,...extra]=line.split('|').map(value=>value.trim());
    if(!en||en.length>200||!vi||vi.length>500||extra.length) throw new Error('Mỗi dòng từ vựng cần dạng: từ tiếng Anh | nghĩa tiếng Việt.');
    const sentence=passageTermSentence(sentences,en);
    if(!sentence) throw new Error(`Từ “${en}” chưa xuất hiện trong đoạn văn.`);
    const key=en.toLowerCase();if(seen.has(key)) continue;seen.add(key);
    vocabulary.push({id:`v${vocabulary.length+1}`,en,vi,ipa:'',sentenceId:sentence.id});
  }
  if(vocabulary.length>40) throw new Error('Mỗi bài tự viết tối đa 40 từ/cụm từ.');
  return {id,unitId,grade:source.grade,band:'support',title,generatedAt:at,origin:'manual',originalText:text,sourceVersion:1,topic:source.topic,patterns:source.patterns,sentences,vocabulary,questions:[]};
}
