const icons:Record<string,string>={
  apple:'🍎',banana:'🍌',orange:'🍊',grape:'🍇',watermelon:'🍉',milk:'🥛',water:'💧',bread:'🍞',rice:'🍚',fish:'🐟',chicken:'🐔',egg:'🥚',cake:'🍰',icecream:'🍦',
  cat:'🐱',dog:'🐶',bird:'🐦',duck:'🦆',rabbit:'🐰',elephant:'🐘',monkey:'🐵',tiger:'🐯',lion:'🦁',bear:'🐻',horse:'🐴',cow:'🐮',pig:'🐷',
  book:'📚',pen:'🖊️',pencil:'✏️',ruler:'📏',eraser:'🧽',school:'🏫',teacher:'🧑‍🏫',student:'🧑‍🎓',bag:'🎒',desk:'🪑',computer:'💻',
  football:'⚽',basketball:'🏀',swim:'🏊',swimming:'🏊',run:'🏃',running:'🏃',dance:'💃',sing:'🎤',read:'📖',write:'✍️',draw:'🎨',
  sunny:'☀️',rainy:'🌧️',cloudy:'☁️',windy:'🌬️',snowy:'🌨️',hot:'🥵',cold:'🥶',happy:'😊',sad:'😢',hungry:'🍽️',sleepy:'😴',
  red:'🔴',blue:'🔵',green:'🟢',yellow:'🟡',black:'⚫',white:'⚪',purple:'🟣',brown:'🟤',
  eye:'👁️',eyes:'👀',ear:'👂',nose:'👃',mouth:'👄',hand:'✋',foot:'🦶',head:'🙂',
  'play football':'⚽','play badminton':'🏸','ride a bike':'🚴','watch tv':'📺','listen to music':'🎧','read a book':'📖',
  month:'📅',year:'🗓️',week:'📆',day:'☀️',time:'⏰',
  'at':'📍','o clock':'🕒','get up':'🌅','wake up':'🌅','go to bed':'😴','go to school':'🏫',
  'have breakfast':'🍳','eat breakfast':'🍳','have lunch':'🍱','eat lunch':'🍱','have dinner':'🍽️','eat dinner':'🍽️',
  'every morning':'🌅','morning':'🌅','afternoon':'🌤️','evening':'🌆','night':'🌙',
  'play games':'🎮','daily routine':'📋','stay healthy':'💪','brush my teeth':'🪥','brush your teeth':'🪥',
};
const units:Record<string,number>={zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19};
const tens:Record<string,number>={twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
export function illustrationKey(text:string){return text.normalize('NFC').toLowerCase().replace(/[’']/g,' ').replace(/-/g,' ').replace(/\s+/g,' ').trim();}
export function wordNumber(text:string):number|null{
  const key=illustrationKey(text);if(Object.hasOwn(units,key))return units[key];if(Object.hasOwn(tens,key))return tens[key];
  const parts=key.split(' ');if(parts.length===2&&Object.hasOwn(tens,parts[0])&&Object.hasOwn(units,parts[1])&&units[parts[1]]>0&&units[parts[1]]<10)return tens[parts[0]]+units[parts[1]];
  return null;
}
export function wordIllustrationEmoji(text:string):string|null{
  const key=illustrationKey(text);if(icons[key])return icons[key];
  const time=/^(?:(half past) )?(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?: o clock)?$/.exec(key);
  if(time&&(time[1]||key.endsWith('o clock'))){const hour=units[time[2]];return String.fromCodePoint((time[1]?0x1f55c:0x1f550)+(hour-1));}
  if(key.startsWith('what time is it?')||key.startsWith('what time do you get up?'))return '🕕';
  return null;
}
export function displayWordEmoji(text:string,emoji:string){return wordIllustrationEmoji(text)&&['','🌊','📖','📝'].includes(emoji)?wordIllustrationEmoji(text)!:emoji||'🔤';}
