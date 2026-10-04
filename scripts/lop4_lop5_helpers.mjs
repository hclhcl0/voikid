import fs from 'fs';

// Universal natural example sentence generator
function makeSentence(en, vi) {
  const low = en.toLowerCase().trim();
  const cleanEn = en.trim();
  const cleanVi = vi ? vi.trim() : '';

  // Specific common patterns
  if (low.includes('good morning')) return { en: 'Good morning! Have a nice day.', vi: 'Chào buổi sáng! Chúc bạn một ngày tốt lành.' };
  if (low.includes('excuse me')) return { en: 'Excuse me! Can you help me?', vi: 'Xin lỗi cho mình hỏi! Bạn có thể giúp mình không?' };
  if (low.includes('how much')) return { en: 'How much is this red T-shirt?', vi: 'Chiếc áo thun đỏ này giá bao nhiêu?' };
  if (low.includes('what time')) return { en: 'What time does the lesson start?', vi: 'Mấy giờ thì tiết học bắt đầu?' };
  if (low.includes('looking for')) return { en: "I am looking for the city library.", vi: 'Tôi đang tìm kiếm thư viện thành phố.' };
  if (low.includes('would you like')) return { en: 'Would you like some fresh orange juice?', vi: 'Bạn có muốn dùng một ít nước cam tươi không?' };
  if (low.includes('nice to see you')) return { en: 'Nice to see you again at school!', vi: 'Rất vui được gặp lại bạn ở trường!' };

  // Countries
  if (low === 'viet nam' || low === 'vietnam') return { en: 'I live in beautiful Viet Nam.', vi: 'Tôi sống ở đất nước Việt Nam tươi đẹp.' };
  if (low === 'america') return { en: 'She has a pen pal from America.', vi: 'Cô ấy có một người bạn qua thư đến từ nước Mỹ.' };
  if (low === 'australia') return { en: 'Kangaroos are famous in Australia.', vi: 'Chuột túi rất nổi tiếng ở nước Úc.' };
  if (low === 'japan') return { en: 'Mount Fuji is in Japan.', vi: 'Núi Phú Sĩ nằm ở đất nước Nhật Bản.' };
  if (low === 'britain') return { en: 'Big Ben is located in Britain.', vi: 'Tháp đồng hồ Big Ben tọa lạc tại nước Anh.' };
  if (low === 'singapore') return { en: 'Singapore is a clean and green island.', vi: 'Xinh-ga-po là một hòn đảo xanh và sạch đẹp.' };
  if (low === 'thailand') return { en: 'They traveled to Thailand on holiday.', vi: 'Họ đã đi du lịch tới Thái Lan vào kỳ nghỉ.' };
  if (low === 'malaysia') return { en: 'Kuala Lumpur is in Malaysia.', vi: 'Kua-la Lăm-pơ nằm ở Ma-lai-xi-a.' };

  // Common activities
  if (low.startsWith('play the ')) return { en: `He practices to ${low} every evening.`, vi: `Cậu ấy tập ${cleanVi.toLowerCase()} vào mỗi buổi tối.` };
  if (low.startsWith('play ')) return { en: `We like to ${low} after school.`, vi: `Chúng mình thích ${cleanVi.toLowerCase()} sau giờ học.` };
  if (low.startsWith('go to ')) return { en: `Students ${low} on weekdays.`, vi: `Các bạn học sinh ${cleanVi.toLowerCase()} vào các ngày trong tuần.` };
  if (low.startsWith('surf the internet')) return { en: 'I surf the Internet to find information.', vi: 'Tôi lướt mạng Internet để tìm kiếm thông tin.' };
  if (low.startsWith('water the flowers')) return { en: 'She helps grandma water the flowers.', vi: 'Cô bé giúp bà tưới hoa trong vườn.' };

  // Default natural sentence
  return {
    en: `We learn about ${cleanEn.toLowerCase()} in English class.`,
    vi: `Chúng mình học về ${cleanVi.toLowerCase()} trong giờ tiếng Anh.`
  };
}

// Emoji resolver
const EMOJI_MAP = {
  'america': '🇺🇸', 'australia': '🇦🇺', 'britain': '🇬🇧', 'japan': '🇯🇵', 'malaysia': '🇲🇾', 'singapore': '🇸🇬', 'thailand': '🇹🇭', 'viet nam': '🇻🇳', 'vietnam': '🇻🇳',
  'vietnamese': '🇻🇳', 'english': '🇬🇧', 'american': '🇺🇸', 'japanese': '🇯🇵', 'chinese': '🇨🇳', 'china': '🇨🇳', 'korea': '🇰🇷', 'korean': '🇰🇷', 'france': '🇫🇷', 'french': '🇫🇷',
  'monday': '📅', 'tuesday': '📅', 'wednesday': '📅', 'thursday': '📅', 'friday': '📅', 'saturday': '📅', 'sunday': '📅',
  'january': '🗓️', 'february': '🗓️', 'march': '🗓️', 'april': '🗓️', 'may': '🗓️', 'june': '🗓️', 'july': '🗓️', 'august': '🗓️', 'september': '🗓️', 'october': '🗓️', 'november': '🗓️', 'december': '🗓️',
  'cook': '👨‍🍳', 'draw': '🎨', 'swim': '🏊', 'guitar': '🎸', 'piano': '🎹', 'bike': '🚲', 'horse': '🐎', 'roller skate': '🛼',
  'city': '🏙️', 'mountains': '⛰️', 'village': '🏡', 'town': '🏘️', 'building': '🏢', 'flat': '🏬', 'tower': '🗼', 'house': '🏠',
  'dolphin': '🐬', 'whale': '🐋', 'shark': '🦈', 'kangaroo': '🦘', 'panda': '🐼', 'tiger': '🐯', 'lion': '🦁', 'crocodile': '🐊', 'giraffe': '🦒', 'hippo': '🦛', 'peacock': '🦚',
  'coat': '🧥', 'jacket': '🧥', 'sweater': '🧶', 'boots': '👢', 'scarf': '🧣', 'gloves': '🧤', 'belt': '🥋', 'raincoat': '🧥', 'cap': '🧢', 'glasses': '👓', 'skirt': '🩰', 't-shirt': '👕',
  'fever': '🤒', 'cough': '😷', 'cold': '🤧', 'headache': '🤕', 'toothache': '🦷', 'stomach ache': '🤢', 'medicine': '💊', 'hospital': '🏥', 'ambulance': '🚑',
  'pho': '🍜', 'banh mi': '🥖', 'banh chung': '🍱', 'spring roll': '🥟', 'sticky rice': '🍚', 'iced coffee': '☕', 'milk tea': '🧋',
  'tet holiday': '🧧', 'lantern': '🏮', 'dragon dance': '🐉', 'lucky money': '🧧', 'peach blossom': '🌸', 'apricot blossom': '🌼',
  'firefighter': '🧑‍🚒', 'gardener': '🧑‍🌾', 'reporter': '🎤', 'writer': '✍️', 'dentist': '🧑‍⚕️', 'pilot': '👨‍✈️', 'scientist': '🧑‍🔬', 'engineer': '👷', 'astronaut': '👨‍🚀',
  'smartphone': '📱', 'laptop': '💻', 'website': '🌐', 'video game': '🎮', 'social media': '📲',
  'volcano': '🌋', 'waterfall': '🌊', 'rainforest': '🌴', 'desert': '🏜️', 'fairy tale': '🧚', 'dragon': '🐲', 'king': '👑', 'queen': '👸', 'prince': '🤴', 'princess': '👸',
  'underground': '🚇', 'helicopter': '🚁', 'cruise ship': '🛳️', 'passport': '🛂', 'airport': '🛫',
  'ha long bay': '🏞️', 'hoan kiem lake': '🐢', 'one pillar pagoda': '🛕', 'hoi an ancient town': '🏮', 'phu quoc island': '🏝️', 'ba na hills': '🌁',
};

function getEmoji(en) {
  const low = en.toLowerCase().trim();
  for (const [k, v] of Object.entries(EMOJI_MAP)) {
    if (low.includes(k)) return v;
  }
  return '📘';
}

console.log('Helpers initialized.');
