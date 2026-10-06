import type {KidsPhonics} from '@/types';

const vowels:Record<string,string>={
  'iː':'i','uː':'u','ɑː':'a','ɔː':'o','ɜː':'ơ','eɪ':'ây','aɪ':'ai','ɔɪ':'oi','oʊ':'âu','əʊ':'âu','aʊ':'ao',
  'ɪə':'ia','eə':'eờ','ʊə':'uờ','ɪ':'i','i':'i','e':'e','ɛ':'e','æ':'e','ʌ':'â','ɑ':'a','ɒ':'o','ɔ':'o',
  'ʊ':'u','u':'u','ə':'ờ','ɚ':'ờr','ɝ':'ơr','ɜ':'ơ','l̩':'l','n̩':'n','m̩':'m',
};
const consonants:Record<string,string>={p:'p',b:'b',t:'t',d:'d',k:'k',g:'g',f:'f',v:'v',s:'s',z:'z',h:'h',m:'m',n:'n',l:'l',r:'r',j:'y',w:'w','θ':'th','ð':'đ','ʃ':'sh','ʒ':'zh','ŋ':'ng','tʃ':'ch','dʒ':'j','ɾ':'r'};
const symbols=[...Object.keys(vowels),...Object.keys(consonants)].sort((a,b)=>b.length-a.length);
const onsets=new Set(['bl','br','pl','pr','tr','dr','kl','kr','gl','gr','fl','fr','θr','ʃr','sm','sn','sp','st','sk','sl','sw','tw','dw','kw','gw','spl','spr','str','skr','skw']);
export interface IpaRhythmPlan {syllables:string[][];stressIndices:number[]}

/** Strictly parse IPA. Spelling and translated prose cannot be phonetic evidence. */
export function ipaRhythmPlan(phonetic:string|undefined,word=''):IpaRhythmPlan|null {
  if(!phonetic?.trim())return null;
  let ipa=phonetic.trim().normalize('NFD').replace(/ɡ/g,'g').replace(/ɹ/g,'r').replace(/:/g,'ː').replace(/\(r\)/g,'r');
  if((ipa.startsWith('/')&&ipa.endsWith('/'))||(ipa.startsWith('[')&&ipa.endsWith(']')))ipa=ipa.slice(1,-1);
  const words=ipa.trim().split(/\s+/);
  if(word && !/\s/.test(word.trim()) && words.length!==1)return null;
  const syllables:string[][]=[],stressIndices:number[]=[];
  for(const chunk of words){
    const tokens:string[]=[],nuclei:number[]=[],boundaries:number[]=[],stresses:number[]=[];
    let primaryPending=false;
    for(let offset=0;offset<chunk.length;){
      const character=chunk[offset];
      if(character==='ˈ'||character==='ˌ'||character==='.'){
        boundaries.push(tokens.length);
        if(character==='ˈ')primaryPending=true;
        offset++;continue;
      }
      const symbol=symbols.find(s=>chunk.startsWith(s,offset));
      if(!symbol)return null;
      tokens.push(symbol);
      if(symbol in vowels){
        if(primaryPending){stresses.push(nuclei.length);primaryPending=false;}
        nuclei.push(tokens.length-1);
      }
      offset+=symbol.length;
    }
    if(!nuclei.length||primaryPending||stresses.length>1)return null;
    const starts=[0];
    for(let n=1;n<nuclei.length;n++){
      const previous=nuclei[n-1],next=nuclei[n];
      const explicit=boundaries.find(index=>index>previous&&index<=next);
      let boundary=next;
      if(explicit!==undefined)boundary=explicit;
      else for(let start=previous+1;start<next;start++){
        const cluster=tokens.slice(start,next);
        if((cluster.length===1&&cluster[0]!=='ŋ')||onsets.has(cluster.join(''))){boundary=start;break;}
      }
      starts.push(boundary);
    }
    const base=syllables.length;
    starts.forEach((start,i)=>syllables.push(tokens.slice(start,starts[i+1]??tokens.length)));
    if(stresses.length)stressIndices.push(base+stresses[0]);
    else if(nuclei.length===1&&words.length===1)stressIndices.push(base);
  }
  return {syllables,stressIndices};
}

function splitHint(syllable:string){
  const ending=syllable.match(/(\([^)]+\))$/)?.[1]??null;
  return {main:(ending?syllable.slice(0,-ending.length):syllable).replace(/-$/,'').trim(),ending};
}
function approximateSyllable(tokens:string[]):string {
  const nucleus=tokens.findIndex(t=>t in vowels);
  const onset=tokens.slice(0,nucleus).map(t=>consonants[t]).join('');
  const coda=tokens.slice(nucleus+1).map(t=>consonants[t]).join('');
  return onset+vowels[tokens[nucleus]]+(coda?`(${coda})`:'');
}
function alignHints(hints:string[],plan:IpaRhythmPlan):string[]|null {
  const result=[...hints];
  while(result.length>plan.syllables.length){
    const index=result.findIndex((s,i)=>{
      const match=/^(b|g|k|p|t|d|f|v|s|z|th|sh|r|l|m|n|w)ờ$/i.exec(s.trim());
      const tokens=plan.syllables[i];
      return i<result.length-1 && !!match && !!tokens && tokens.findIndex(t=>t in vowels)>1 && consonants[tokens[0]]===match[1].toLowerCase();
    });
    if(index<0)return null;
    result.splice(index,2,result[index].trim().slice(0,-1)+result[index+1]);
  }
  if(result.length!==plan.syllables.length)return null;
  return result.map((hint,i)=>{
    const {main,ending}=splitHint(hint),tokens=plan.syllables[i],nucleus=tokens.findIndex(t=>t in vowels);
    const joined=main.replace(/-/g,'');
    const corrected=tokens[nucleus]==='ə' && nucleus===tokens.length-1 ? joined.replace(/[ơờ]$/i,'ờ') : joined;
    return corrected+(ending??'');
  });
}

/** Normalize every source: embedded hints, browser cache, AI output, or IPA alone. */
export function normalizeKidsPhonics(word:string,phonetic?:string,phonics?:KidsPhonics|null):KidsPhonics|null {
  const plan=ipaRhythmPlan(phonetic,word);
  const validHints=Array.isArray(phonics?.syllables) && phonics.syllables.length>0 && phonics.syllables.every(s=>typeof s==='string'&&!!s.trim()) ? phonics : null;
  if(!plan)return validHints && phonetic?.trim() ? {...validHints,stressIndices:[],stressIndex:undefined} : validHints;
  const hints=validHints ? alignHints(validHints.syllables,plan) : null;
  const source=hints??plan.syllables.map(approximateSyllable);
  const syllables=source.map((hint,i)=>{
    const part=splitHint(hint);
    return (plan.stressIndices.includes(i)?part.main.toUpperCase():part.main.toLowerCase())+(part.ending??'');
  });
  const rhythm=syllables.map((_,i)=>plan.stressIndices.includes(i)?'MẠNH':'nhẹ').join(' – ');
  return {
    text:syllables.join('-'),syllables,stressIndices:plan.stressIndices,
    ...(plan.stressIndices.length===1?{stressIndex:plan.stressIndices[0]}:{}),
    mouth_tip:plan.stressIndices.length ? `Đọc theo nhịp ${rhythm}. Nhấn phần màu cam, đọc nhẹ các phần còn lại rồi nối cả từ theo giọng mẫu. Không thêm âm “ờ” vào cụm phụ âm nhé!` : 'Nghe giọng mẫu rồi nối các phần thành cả từ. Chữ Việt chỉ gợi ý gần âm; mở Giải mã IPA để xem cách đặt miệng nhé!',
    audio_slow_text:syllables.join(' ... '),
  };
}
