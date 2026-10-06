import {ipaRhythmPlan} from './ipaRhythm';

// Approximate spellings are reading aids, not replacements for English audio.
// Keep diphthongs together and never insert vowels into consonant clusters.
const vowels:Record<string,string>={
  'iː':'i','uː':'u','ɑː':'a','ɔː':'o','ɜː':'ơ','eɪ':'ây','aɪ':'ai','ɔɪ':'oi','oʊ':'âu','əʊ':'âu','aʊ':'ao',
  'ɪə':'ia','eə':'eờ','ʊə':'uờ','ɪ':'i','i':'i','e':'e','ɛ':'e','æ':'a','ʌ':'â','ɑ':'a','ɒ':'o','ɔ':'o',
  'ʊ':'u','u':'u','ə':'ờ','ɚ':'ờr','ɝ':'ơr','ɜ':'ơ','l̩':'l','n̩':'n','m̩':'m',
};
const consonants:Record<string,string>={p:'p',b:'b',t:'t',d:'đ',k:'k',g:'g',f:'ph',v:'v',s:'x',z:'d',h:'h',m:'m',n:'n',l:'l',r:'r',j:'i',w:'u','θ':'th','ð':'đ','ʃ':'s','ʒ':'gi','ŋ':'ng','tʃ':'ch','dʒ':'gi','ɾ':'r'};
export interface VietnameseBeat {main:string;ending:string;stressed:boolean}

/** /æ/ cannot be taught as Vietnamese e or a without a mouth-position cue. */
export function vietnameseReadingCue(phonetic?:string):string|null {
  return phonetic?.includes('æ') ? 'Âm a bẹt: mở miệng rộng, kéo nhẹ hai khóe môi sang ngang rồi nghe mẫu. Không đọc thành e nhé.' : null;
}

export function vietnameseReadingGroups(word:string,phonetic?:string):VietnameseBeat[][]|null {
  const words=word.trim().split(/\s+/);
  const ipaWords=phonetic?.trim().replace(/^[/\[]|[/\]]$/g,'').split(/\s+/)??[];
  if(words.length!==ipaWords.length)return null;
  const groups:VietnameseBeat[][]=[];
  for(let i=0;i<words.length;i++){
    const plan=ipaRhythmPlan(ipaWords[i],words[i]);
    if(!plan)return null;
    // Older IPA may omit syllable dots. Close /æ/ before a single consonant
    // and weak schwa; move the consonant, never duplicate or remove it.
    if(!ipaWords[i].includes('.'))for(let j=0;j<plan.syllables.length-1;j++){
      const previous=plan.syllables[j],next=plan.syllables[j+1];
      if(previous.at(-1)==='æ' && next[0] in consonants && next[1]==='ə' && !plan.stressIndices.includes(j+1))previous.push(next.shift()!);
    }
    groups.push(plan.syllables.map((tokens,j)=>{
      const nucleus=tokens.findIndex(t=>t in vowels);
      let onset=tokens.slice(0,nucleus).map(t=>consonants[t]).join('');
      const vowel=vowels[tokens[nucleus]];
      const coda=tokens.slice(nucleus+1);
      if(onset==='g'&&/^[eiê]/.test(vowel))onset='gh';
      // Vietnamese can represent these single final consonants as part of a syllable.
      const nativeEnd=coda.length===1&&['m','n','ŋ','p','t','k'].includes(coda[0]);
      const end=coda.map(t=>t==='k'?'c':consonants[t]).join('');
      const main=onset+vowel+(nativeEnd?end:'');
      const stressed=plan.stressIndices.includes(j);
      return {main:stressed?main.toUpperCase():main,ending:nativeEnd?'':end,stressed};
    }));
  }
  return groups;
}
