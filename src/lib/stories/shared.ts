import * as fs from 'node:fs';
import * as path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';
import type {StoryLesson} from './types';
import {passageTermSentence} from './library';
export interface SharedStory {id:string;lesson:StoryLesson;publishedAt:string}
const directory=(unitId:string)=>path.join(process.env.VOCAKIDS_CONTENT_DIR||path.join(process.cwd(),'data','backend'),'shared-stories',createHash('sha256').update(unitId).digest('hex'));
const text=(value:unknown,max:number,required=false):value is string=>typeof value==='string'&&value.length<=max&&(!required||!!value.trim());
export function sharedStoryLesson(input:unknown):StoryLesson {
  const lesson=input as StoryLesson;const fail=()=>{throw new Error('Bài đọc dùng chung không hợp lệ.');};
  if(!lesson||!text(lesson.unitId,120,true)||!text(lesson.title,120,true)||!Number.isInteger(lesson.grade)||lesson.grade<1||lesson.grade>5||!['support','standard','challenge'].includes(lesson.band)||!text(lesson.topic,200,true)||!Array.isArray(lesson.patterns)||lesson.patterns.length>50||!lesson.patterns.every(p=>text(p,1000))||!Array.isArray(lesson.sentences)||!lesson.sentences.length||lesson.sentences.length>60||!Array.isArray(lesson.vocabulary)||lesson.vocabulary.length>80||!Array.isArray(lesson.questions)||lesson.questions.length>12)fail();
  const ids=new Set<string>();
  for(const s of lesson.sentences){if(!s||!text(s.id,120,true)||ids.has(s.id)||!text(s.en,600,true)||!text(s.vi,2000)||!Array.isArray(s.patternIndexes)||s.patternIndexes.length>50||!s.patternIndexes.every(i=>Number.isInteger(i)&&i>=0&&i<lesson.patterns.length))fail();ids.add(s.id);}
  if(lesson.sentences.map(s=>s.en).join(' ').length>6000||(lesson.originalText!==undefined&&!text(lesson.originalText,6000)))fail();
  const termIds=new Set<string>();
  for(const v of lesson.vocabulary){if(!v||!text(v.id,120,true)||termIds.has(v.id)||!text(v.en,200,true)||!text(v.vi,500,true)||!text(v.ipa,200)||!ids.has(v.sentenceId)||!passageTermSentence(lesson.sentences.filter(s=>s.id===v.sentenceId),v.en))fail();termIds.add(v.id);}
  const questionIds=new Set<string>();
  for(const q of lesson.questions){if(!q||!text(q.id,120,true)||questionIds.has(q.id)||!text(q.en,600,true)||!text(q.vi,2000)||!ids.has(q.sentenceId)||!Array.isArray(q.options)||q.options.length<2||q.options.length>6||!q.options.every(o=>text(o,500,true))||!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>=q.options.length||!text(q.explanationVi,2000))fail();questionIds.add(q.id);}
  // Only lesson content crosses family boundaries: no profile IDs, answers or scores.
  return {id:'',unitId:lesson.unitId,grade:lesson.grade,band:lesson.band,title:lesson.title,topic:lesson.topic,patterns:[...lesson.patterns],sourceVersion:Number.isInteger(lesson.sourceVersion)?lesson.sourceVersion:1,origin:lesson.origin==='manual'?'manual':'ai',...(lesson.originalText!==undefined?{originalText:lesson.originalText}:{}),generatedAt:text(lesson.generatedAt,60)?lesson.generatedAt:new Date().toISOString(),sentences:lesson.sentences.map(s=>({id:s.id,en:s.en,vi:s.vi,patternIndexes:[...s.patternIndexes]})),vocabulary:lesson.vocabulary.map(v=>({id:v.id,en:v.en,vi:v.vi,ipa:v.ipa,sentenceId:v.sentenceId})),questions:lesson.questions.map(q=>({id:q.id,en:q.en,vi:q.vi,options:[...q.options],answerIndex:q.answerIndex,sentenceId:q.sentenceId,explanationVi:q.explanationVi}))};
}
export function publishSharedStory(input:unknown):SharedStory {
  const lesson=sharedStoryLesson(input);const {generatedAt,...content}=lesson;
  const id=`shared_${createHash('sha256').update(JSON.stringify(content)).digest('hex')}`;
  const folder=directory(lesson.unitId),file=path.join(folder,`${id}.json`);
  if(fs.existsSync(file))return JSON.parse(fs.readFileSync(file,'utf8'));
  fs.mkdirSync(folder,{recursive:true});if(fs.readdirSync(folder).filter(f=>/^shared_[a-f0-9]{64}\.json$/.test(f)).length>=50)throw new Error('Mỗi unit tối đa 50 bài dùng chung. Gỡ bớt bài cũ trước khi thêm.');
  const entry={id,lesson:{...lesson,id,generatedAt},publishedAt:new Date().toISOString()};
  const tmp=`${file}.${randomUUID()}.tmp`;fs.writeFileSync(tmp,JSON.stringify(entry),{mode:0o600});fs.renameSync(tmp,file);return entry;
}
export function listSharedStories(unitId:string):SharedStory[] {
  const folder=directory(unitId);if(!fs.existsSync(folder))return [];
  return fs.readdirSync(folder).filter(f=>/^shared_[a-f0-9]{64}\.json$/.test(f)).flatMap(file=>{try{const entry=JSON.parse(fs.readFileSync(path.join(folder,file),'utf8')) as SharedStory;sharedStoryLesson(entry.lesson);return entry.lesson.unitId===unitId&&entry.id===entry.lesson.id?[entry]:[];}catch{return [];}}).sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
}
export function removeSharedStory(unitId:string,id:string) {
  if(!/^shared_[a-f0-9]{64}$/.test(id))throw new Error('Mã bài đọc không hợp lệ.');
  const file=path.join(directory(unitId),`${id}.json`);if(fs.existsSync(file))fs.unlinkSync(file);
}
