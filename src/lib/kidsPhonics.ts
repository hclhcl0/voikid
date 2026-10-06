import type {KidsPhonics} from '@/types';

export interface PhonicsPart {main:string;ending:string|null;stressed:boolean}
export function phonicsParts(phonics:KidsPhonics):{parts:PhonicsPart[];hasRhythm:boolean} {
  const parsed=phonics.syllables.map(syllable=>{
    const ending=syllable.match(/(\([^)]+\))$/)?.[1]??null;
    const main=(ending?syllable.slice(0,-ending.length):syllable).replace(/-$/,'').trim();
    return {main,ending};
  });
  const capitals=parsed.flatMap((p,i)=>p.main===p.main.toUpperCase() && p.main!==p.main.toLowerCase() ? [i] : []);
  const explicit=Number.isInteger(phonics.stressIndex) && phonics.stressIndex!>=0 && phonics.stressIndex!<parsed.length;
  const indices=Array.isArray(phonics.stressIndices) ? phonics.stressIndices.filter(i=>Number.isInteger(i)&&i>=0&&i<parsed.length) : explicit ? [phonics.stressIndex!] : parsed.length===1 ? [0] : capitals.length===1 ? capitals : [];
  return {
    hasRhythm:indices.length>0,
    parts:parsed.map((part,i)=>({...part,main:indices.includes(i)?part.main.toUpperCase():part.main.toLowerCase(),stressed:indices.includes(i)})),
  };
}
