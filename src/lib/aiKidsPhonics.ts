import type {KidsPhonics} from '@/types';
import {ipaRhythmPlan} from './ipaRhythm';
import {phonicsParts} from './kidsPhonics';

/** Validate AI text and correct emphasis only. Never synthesize replacement syllables. */
export function prepareAiKidsPhonics(word:string,phonetic:string|undefined,value:unknown):KidsPhonics|null {
  if(!value||typeof value!=='object')return null;
  const input=value as KidsPhonics;
  if(!Array.isArray(input.syllables)||!input.syllables.length||input.syllables.length>60||input.syllables.some(s=>typeof s!=='string'||!s.trim()||s.length>100)||typeof input.mouth_tip!=='string'||input.mouth_tip.length>1200)return null;
  const plan=ipaRhythmPlan(phonetic,word);
  if(plan && plan.syllables.length!==input.syllables.length)return null;
  const parts=phonicsParts({...input,syllables:input.syllables.map(s=>s.trim()),...(plan?{stressIndices:plan.stressIndices,stressIndex:undefined}:{})}).parts;
  const syllables=parts.map(part=>part.main+(part.ending??''));
  if(syllables.some(s=>!s))return null;
  const stressIndices=parts.flatMap((part,index)=>part.stressed?[index]:[]);
  return {text:syllables.join(' · '),syllables,stressIndices,...(stressIndices.length===1?{stressIndex:stressIndices[0]}:{}),mouth_tip:input.mouth_tip.trim(),audio_slow_text:syllables.join(' ... ')};
}
