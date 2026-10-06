import { normalizeReading, storyLimits } from './learning';
import type { ReadingBand, StoryLesson, StorySource } from './types';
export function validateStoryOutput(value:unknown,source:StorySource,band:ReadingBand): Pick<StoryLesson,'title'|'sentences'|'vocabulary'|'questions'> {
  const v=value as StoryLesson; const limits=storyLimits(source.grade,band);
  const text=(s:unknown,max:number)=>typeof s==='string'&&s.trim().length>0&&s.length<=max&&!/[<>]/.test(s);
  const fail=(detail:string)=>{throw new Error(`INVALID_STORY_OUTPUT: ${detail}`);};
  if(!v||!text(v.title,120)||!Array.isArray(v.sentences)||v.sentences.length<limits.minSentences||v.sentences.length>limits.maxSentences||!Array.isArray(v.vocabulary)||v.vocabulary.length<2||v.vocabulary.length>20||!Array.isArray(v.questions)||v.questions.length<2||v.questions.length>5) fail(`Need title, ${limits.minSentences}-${limits.maxSentences} sentences, 2-20 vocabulary entries, 2-5 questions.`);
  const ids=new Set<string>(); let words=0,patternUsed=false;
  v.sentences.forEach((s,i)=>{
    if(!s||!text(s.en,350)||!text(s.vi,500)||!Array.isArray(s.patternIndexes)||s.patternIndexes.some(n=>!Number.isInteger(n)||n<0||n>=source.patterns.length)) fail(`Sentence ${i+1}: English/Vietnamese text and valid zero-based patternIndexes required.`);
    const count=s.en.trim().split(/\s+/).length; words+=count;
    if(/[.!?]\s+\S/.test(s.en.trim())) fail(`Sentence ${i+1} combines multiple sentences; one sentence per entry required.`);
    if((source.grade>=3&&/^(why|what|where|when|who|how|which)\s/i.test(s.en.trim()))||/^because\s/i.test(s.en.trim())) fail(`Sentence ${i+1}: use a complete declarative sentence, integrate because in the same sentence; do not disguise a question with a period.`);
    if(count>limits.maxSentenceWords) fail(`Sentence ${i+1} must have at most ${limits.maxSentenceWords} words.`);
    patternUsed ||= s.patternIndexes.length>0;
    s.id=`s${i+1}`;ids.add(s.id);
  });
  if(words>limits.maxWords||!patternUsed) fail(`At most ${limits.maxWords} total words; at least one target pattern must be used.`);
  if(v.sentences.filter(s=>s.en.includes('?')).length>(source.grade>=3?0:1)) fail('Use declarative narrative rather than questions inside the paragraph.');
  const todayDays=v.sentences.flatMap(s=>[...s.en.matchAll(/today\s+is\s+(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/gi)].map(m=>m[1].toLowerCase()));
  if(new Set(todayDays).size>1) fail('Today cannot be different weekdays in the same narrative.');
  const terms=new Set<string>();
  v.vocabulary.forEach((word,i)=>{
    const sentence=v.sentences.find(s=>s.id===word?.sentenceId);
    if(!word||!text(word.en,80)||!text(word.vi,180)||typeof word.ipa!=='string'||word.ipa.length>150||!sentence||!(` ${normalizeReading(sentence.en)} `).includes(` ${normalizeReading(word.en)} `)||terms.has(normalizeReading(word.en))) fail(`Vocabulary ${i+1}: use a unique EXACT word/phrase occurring in its sentenceId, IDs s1,s2,...; include vi and ipa (empty if unsure).`);
    terms.add(normalizeReading(word.en));word.id=`v${i+1}`;
  });
  v.questions.forEach((q,i)=>{
    const sentence=v.sentences.find(s=>s.id===q?.sentenceId);
    if(!q||!text(q.en,220)||!text(q.vi,300)||!text(q.explanationVi,500)||!sentence||!Array.isArray(q.options)||q.options.length<2||q.options.length>4||q.options.some(o=>!text(o,120))||new Set(q.options.map(normalizeReading)).size!==q.options.length||!Number.isInteger(q.answerIndex)||q.answerIndex<0||q.answerIndex>=q.options.length) fail(`Question ${i+1}: valid sentenceId, 2-4 distinct options and zero-based answerIndex required, with question and explanation translations.`);
    if(!(` ${normalizeReading(sentence!.en)} `).includes(` ${normalizeReading(q.options[q.answerIndex])} `)) fail(`Question ${i+1}: correct option must be an exact contiguous phrase occurring in its evidence sentence.`);
    q.id=`q${i+1}`;
  });
  return {title:v.title,sentences:v.sentences,vocabulary:v.vocabulary,questions:v.questions};
}
