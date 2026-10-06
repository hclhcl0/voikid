import type {StoryLesson, StorySession} from './types';
import {normalizeReading, recordStoryAnswer} from './learning';

export type ListeningFillScope = 'main' | 'all';
export interface ListeningGap {key:string; answer:string; start:number; end:number}
export interface ListeningTask {id:string; sentenceIndex:number; text:string; gaps:ListeningGap[]}
const functionWords = new Set('i you he she it we they my your his her its our their a an the am is are was were be and or but to of in on at from with for as this that these those'.split(' '));

// Use literal word positions: repeated words and phrases keep their own answers,
// and masking never replaces part of another word or removes punctuation.
export function listeningTasks(lesson:StoryLesson, size:1|2|3, scope:ListeningFillScope='main'):ListeningTask[] {
  const phrases=[...new Set(['Viet Nam',...lesson.vocabulary.map(term=>term.en.trim()).filter(term=>/\s/.test(term))])].sort((a,b)=>b.length-a.length);
  const escaped=phrases.map(phrase=>phrase.split(/\s+/).map(word=>word.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('\\s+'));
  const tokens=new RegExp(`(?<![A-Za-z])(?:${escaped.join('|')})(?![A-Za-z])|[A-Za-z]+(?:['’\\-][A-Za-z]+)*`,'gi');
  return lesson.sentences.flatMap((sentence,sentenceIndex)=>{
    const words=Array.from(sentence.en.matchAll(tokens), match=>({
      // Phrase answers must not inherit a previously scored single-word blank.
      key:/\s/.test(match[0])?`listen-fill:phrase-v1:${sentence.id}:${match.index}-${match.index!+match[0].length}`:`listen-fill:word-v1:${sentence.id}:${match.index}`, answer:match[0], start:match.index!, end:match.index!+match[0].length,
    }));
    const main=words.filter(word=>!functionWords.has(word.answer.toLowerCase()));
    const targets=scope==='all'||!main.length?words:main;
    const tasks:ListeningTask[]=[];
    for(let offset=0;offset<targets.length;offset+=size) {
      const gaps=targets.slice(offset,offset+size);
      tasks.push({id:gaps.map(gap=>gap.key).join('|'), sentenceIndex, text:sentence.en, gaps});
    }
    return tasks;
  });
}

export function listeningLengthHint(answer:string):string {
  return answer.trim().replace(/\s+/g,' ').replace(/\p{L}/gu,'*');
}

export function maskedListeningSentence(task:ListeningTask):string {
  let position=0;
  const parts=task.gaps.map((gap,index)=>{
    const prefix=task.text.slice(position,gap.start);position=gap.end;
    return `${prefix}[${index+1}] _____`;
  });
  return parts.join('')+task.text.slice(position);
}

export function gradeListeningTask(session:StorySession, task:ListeningTask, responses:string[], revealed:boolean) {
  const correct=task.gaps.map((gap,index)=>normalizeReading(responses[index]??'')===normalizeReading(gap.answer));
  const updated=task.gaps.reduce((current,gap,index)=>recordStoryAnswer(current,gap.key,responses[index]??'',correct[index],revealed),session);
  return {session:updated,correct};
}
