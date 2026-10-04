import fs from 'fs';

const rawText = fs.readFileSync('d:/engl/vocakids/data/tu-vung-tieng-anh-lop-3-v2.txt', 'utf8');
const lines = rawText.split(/\r?\n/);

let currentSection = null;
const sections = [];

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('===') || trimmed.startsWith('---') || trimmed.startsWith('PHẦN ')) {
    continue;
  }
  
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const title = trimmed.slice(1, -1);
    currentSection = { title, words: [], sentences: [], phonics: [] };
    sections.push(currentSection);
    continue;
  }
  
  if (!currentSection) continue;

  if (trimmed.startsWith('- Phonics:')) {
    currentSection.phonics.push(trimmed.replace('- Phonics:', '').trim());
  } else if (trimmed.startsWith('* Mẫu câu:')) {
    currentSection.sentences.push(trimmed.replace('* Mẫu câu:', '').trim());
  } else if (trimmed.startsWith('-')) {
    const content = trimmed.slice(1).trim();
    const slashIdx = content.indexOf('/');
    if (slashIdx !== -1) {
      const en = content.slice(0, slashIdx).trim();
      const rest = content.slice(slashIdx);
      const colonIdx = rest.indexOf(':');
      let phonetic = '';
      let vi = '';
      if (colonIdx !== -1) {
        phonetic = rest.slice(0, colonIdx).trim();
        vi = rest.slice(colonIdx + 1).trim();
      } else {
        phonetic = rest.trim();
      }
      currentSection.words.push({ en, phonetic, vi });
    } else {
      const colonIdx = content.indexOf(':');
      if (colonIdx !== -1) {
        const en = content.slice(0, colonIdx).trim();
        const vi = content.slice(colonIdx + 1).trim();
        currentSection.words.push({ en, phonetic: '', vi });
      }
    }
  }
}

// Emoji dictionary
const EMOJI_DICT = {
  'one': '1️⃣', 'two': '2️⃣', 'three': '3️⃣', 'four': '4️⃣', 'five': '5️⃣',
  'six': '6️⃣', 'seven': '7️⃣', 'eight': '8️⃣', 'nine': '9️⃣', 'ten': '🔟',
  'eleven': '1️⃣1️⃣', 'twelve': '1️⃣2️⃣', 'thirteen': '1️⃣3️⃣', 'fourteen': '1️⃣4️⃣', 'fifteen': '1️⃣5️⃣',
  'sixteen': '1️⃣6️⃣', 'seventeen': '1️⃣7️⃣', 'eighteen': '1️⃣8️⃣', 'nineteen': '1️⃣9️⃣', 'twenty': '2️⃣0️⃣',
  'hello': '👋', 'hi': '🙋', 'bye': '👋', 'goodbye': '👋', 'fine': '😊', 'thank you': '🙏', 'how': '❓',
  'name': '🏷️', 'old': '🎂', 'friend': '🤝', 'teacher': '👩‍🏫', 'mr': '👨‍💼', 'ms': '👩‍💼',
  'this': '👉', 'that': '👉', 'yes': '✅', 'no': '❌',
  'ear': '👂', 'eye': '👁️', 'face': '😊', 'hair': '💇', 'hand': '✋', 'mouth': '👄', 'nose': '👃', 'open': '👐', 'touch': '👆',
  'cooking': '🍳', 'dancing': '💃', 'drawing': '🎨', 'painting': '🖌️', 'running': '🏃', 'singing': '🎤', 'swimming': '🏊', 'walking': '🚶',
  'art room': '🎨', 'classroom': '🏫', 'computer room': '💻', 'gym': '🏋️', 'library': '📚', 'music room': '🎵', 'playground': '🛝', 'school': '🏫',
  'close': '🚪', 'come in': '🚶', 'go out': '🚪', 'sit down': '🪑', 'speak': '🗣️', 'stand up': '🧍',
  'book': '📖', 'eraser': '🧼', 'notebook': '📓', 'pen': '🖊️', 'pencil': '✏️', 'pencil case': '👝', 'ruler': '📏', 'school bag': '🎒',
  'black': '⚫', 'blue': '🔵', 'brown': '🟤', 'colour': '🎨', 'green': '🟢', 'orange': '🟠', 'red': '🔴', 'white': '⚪', 'yellow': '🟡',
  'break time': '⏰', 'chat': '💬', 'do word puzzles': '🧩', 'play badminton': '🏸', 'play basketball': '🏀', 'play chess': '♟️', 'play football': '⚽', 'play table tennis': '🏓', 'play volleyball': '🏐',
  'brother': '👦', 'father': '👨', 'mother': '👩', 'sister': '👧', 'sure': '👌',
  'cook': '👨‍🍳', 'doctor': '👨‍⚕️', 'driver': '🚗', 'farmer': '👨‍🌾', 'job': '💼', 'nurse': '👩‍⚕️', 'singer': '🎤', 'worker': '👷',
  'bathroom': '🛁', 'bedroom': '🛏️', 'chair': '🪑', 'house': '🏡', 'kitchen': '🍳', 'lamp': '💡', 'living room': '🛋️', 'table': '🪑', 'in': '📥', 'on': '🔝', 'here': '📍', 'there': '👉',
  'bed': '🛏️', 'big': '🐘', 'desk': '🪑', 'door': '🚪', 'new': '✨', 'room': '🚪', 'small': '🐭', 'window': '🪟',
  'bean': '🫘', 'bread': '🍞', 'chicken': '🍗', 'egg': '🥚', 'fish': '🐟', 'juice': '🧃', 'meat': '🥩', 'milk': '🥛', 'rice': '🍚', 'water': '💧',
  'bird': '🐦', 'cat': '🐱', 'dog': '🐶', 'goldfish': '🐠', 'parrot': '🦜', 'rabbit': '🐰', 'many': '🔢', 'some': '🥣',
  'bus': '🚌', 'car': '🚗', 'kite': '🪁', 'plane': '✈️', 'ship': '🚢', 'teddy bear': '🧸', 'toy': '🧸', 'train': '🚂', 'truck': '🚚',
  'drawing a picture': '🎨', 'listening to music': '🎧', 'playing basketball': '🏀', 'reading': '📖', 'watching tv': '📺', 'writing': '✍️',
  'cycling': '🚴', 'flying a kite': '🪁', 'playing badminton': '🏸', 'skating': '🛼', 'skipping': '🪢',
  'climbing': '🧗', 'counting': '🔢', 'elephant': '🐘', 'horse': '🐎', 'monkey': '🐒', 'peacock': '🦚', 'swinging': '🐒', 'tiger': '🐯',
  'board': '📋', 'bookcase': '📚', 'crayon': '🖍️', 'cupboard': '🗄️', 'map': '🗺️', 'paper': '📄', 'poster': '🖼️', 'rubber': '🧼', 'scissors': '✂️', 'sharpener': '✏️',
  'grandfather': '👴', 'grandmother': '👵', 'grandparents': '👵👴', 'uncle': '👨', 'aunt': '👩', 'cousin': '🧑', 'parents': '👩👨', 'baby': '👶',
  'garden': '🌳', 'hall': '🏛️', 'balcony': '🏢', 'clock': '⏰', 'mirror': '🪞', 'sofa': '🛋️', 'armchair': '🪑', 'carpet': '🧶', 'picture': '🖼️', 'television': '📺',
  'apple': '🍎', 'banana': '🍌', 'burger': '🍔', 'candy': '🍬', 'lemonade': '🍋', 'mango': '🥭', 'sausage': '🌭', 'watermelon': '🍉',
  'bear': '🐻', 'crocodile': '🐊', 'duck': '🦆', 'frog': '🐸', 'giraffe': '🦒', 'hippo': '🦛', 'lizard': '🦎', 'mouse': '🐭', 'sheep': '🐑', 'spider': '🕷️',
  'clothes': '👗', 'dress': '👗', 'hat': '👒', 'jacket': '🧥', 'jeans': '👖', 'shirt': '👔', 'shoes': '👟', 'skirt': '🩰', 'socks': '🧦', 'trousers': '👖',
  'weather': '🌤️', 'sunny': '☀️', 'rainy': '🌧️', 'windy': '💨', 'cloudy': '☁️', 'cold': '🥶', 'hot': '🥵', 'spring': '🌸', 'summer': '☀️', 'winter': '❄️',
  'bicycle': '🚲', 'motorbike': '🛵', 'helicopter': '🚁', 'boat': '⛵', 'taxi': '🚕', 'lorry': '🚛', 'station': '🚉',
  'happy': '😊', 'sad': '😢', 'angry': '😠', 'tired': '🥱', 'hungry': '😋', 'thirsty': '🥤', 'clever': '🧠', 'friendly': '🤝', 'funny': '😄', 'kind': '❤️',
  'good morning!': '🌅', 'good afternoon!': '☀️', 'good evening!': '🌆', 'nice to meet you.': '🤝', 'here you are.': '🎁', "you're welcome.": '😊', 'pardon?': '👂', 'see you later!': '👋'
};

// Natural sentence generator
function makeExamples(en, vi, secTitle) {
  const low = en.toLowerCase();
  
  if (low === 'one') return { en: 'I have one younger sister.', vi: 'Tôi có một người em gái.' };
  if (low === 'two') return { en: 'She has two lovely pets.', vi: 'Cô bé có hai con thú cưng đáng yêu.' };
  if (low === 'three') return { en: 'There are three pens on the desk.', vi: 'Có ba chiếc bút trên bàn học.' };
  if (low === 'four') return { en: 'A rectangle has four straight sides.', vi: 'Hình chữ nhật có bốn cạnh thẳng.' };
  if (low === 'five') return { en: 'We have five English classes a week.', vi: 'Chúng mình có năm tiết tiếng Anh mỗi tuần.' };
  if (low === 'six') return { en: 'The clock shows six in the morning.', vi: 'Đồng hồ chỉ sáu giờ sáng.' };
  if (low === 'seven') return { en: 'There are seven days in a week.', vi: 'Có bảy ngày trong một tuần.' };
  if (low === 'eight') return { en: 'I am eight years old now.', vi: 'Bây giờ mình tám tuổi.' };
  if (low === 'nine') return { en: 'She has nine colorful stickers.', vi: 'Cô bé có chín chiếc nhãn dán xinh xắn.' };
  if (low === 'ten') return { en: 'He scored ten points on the test.', vi: 'Cậu ấy đạt mười điểm trong bài kiểm tra.' };

  if (low === 'eleven') return { en: 'There are eleven players on the field.', vi: 'Có mười một cầu thủ trên sân.' };
  if (low === 'twelve') return { en: 'Twelve months make one year.', vi: 'Mười hai tháng tạo thành một năm.' };
  if (low === 'thirteen') return { en: 'My cousin is thirteen years old.', vi: 'Anh họ tôi mười ba tuổi.' };
  if (low === 'fourteen') return { en: 'She read fourteen story books.', vi: 'Cô bé đã đọc mười bốn cuốn truyện.' };
  if (low === 'fifteen') return { en: 'Fifteen minutes of recess is fun.', vi: 'Mười lăm phút ra chơi thật vui vẻ.' };
  if (low === 'sixteen') return { en: 'He solved sixteen puzzle pieces.', vi: 'Cậu ấy đã ghép được mười sáu mảnh ghép.' };
  if (low === 'seventeen') return { en: 'Seventeen flowers bloom today.', vi: 'Mười bảy bông hoa nở rộ hôm nay.' };
  if (low === 'eighteen') return { en: 'There are eighteen birds on the fence.', vi: 'Có mười tám chú chim trên hàng rào.' };
  if (low === 'nineteen') return { en: 'She has nineteen shiny marbles.', vi: 'Cô bé có mười chín viên bi sáng lấp lánh.' };
  if (low === 'twenty') return { en: 'Twenty students study in our class.', vi: 'Có hai mươi bạn học sinh trong lớp chúng tôi.' };

  if (low === 'hello') return { en: "Hello! My name is Nam.", vi: "Xin chào! Mình tên là Nam." };
  if (low === 'hi') return { en: "Hi Mary! How are you today?", vi: "Chào Mary! Hôm nay bạn khỏe không?" };
  if (low === 'bye') return { en: "Bye! See you tomorrow.", vi: "Tạm biệt! Hẹn gặp lại bạn ngày mai nhé." };
  if (low === 'goodbye') return { en: "Goodbye teacher, have a nice day.", vi: "Tạm biệt cô giáo, chúc cô một ngày tốt lành." };
  if (low === 'fine') return { en: "I am fine, thank you very much.", vi: "Mình khỏe, cảm ơn bạn rất nhiều." };
  if (low === 'thank you') return { en: "Thank you for helping me.", vi: "Cảm ơn bạn đã giúp đỡ mình." };
  if (low === 'how') return { en: "How are you doing today?", vi: "Hôm nay bạn thế nào rồi?" };

  if (low === 'name') return { en: "What is your name? – My name is Linh.", vi: "Tên bạn là gì? – Tên mình là Linh." };
  if (low === 'old') return { en: "How old are you? – I am eight years old.", vi: "Bạn bao nhiêu tuổi? – Mình tám tuổi." };
  if (low === 'friend') return { en: "Peter is my best friend at school.", vi: "Peter là bạn thân nhất của tôi ở trường." };
  if (low === 'teacher') return { en: "Our English teacher is very patient.", vi: "Giáo viên tiếng Anh của chúng mình rất kiên nhẫn." };
  if (low === 'mr') return { en: "Mr Loc is our favorite teacher.", vi: "Thầy Lộc là thầy giáo yêu thích của chúng tôi." };
  if (low === 'ms') return { en: "Ms Hoa teaches us music.", vi: "Cô Hoa dạy chúng mình môn âm nhạc." };
  if (low === 'this') return { en: "This is my friend Mai.", vi: "Đây là bạn Mai của mình." };
  if (low === 'that') return { en: "That is our school playground.", vi: "Kia là sân trường của chúng mình." };
  if (low === 'yes') return { en: "Yes, it is my school bag.", vi: "Vâng, đúng là cặp sách của mình rồi." };
  if (low === 'no') return { en: "No, it is not my pencil.", vi: "Không, đó không phải là bút chì của mình." };

  if (low === 'ear') return { en: "Touch your ears gently.", vi: "Hãy chạm nhẹ vào đôi tai của bạn nhé." };
  if (low === 'eye') return { en: "Close your eyes and make a wish.", vi: "Hãy nhắm mắt lại và ước một điều ước." };
  if (low === 'face') return { en: "Wash your face every morning.", vi: "Hãy rửa mặt vào mỗi buổi sáng nhé." };
  if (low === 'hair') return { en: "She has neat black hair.", vi: "Cô bé có mái tóc đen gọn gàng." };
  if (low === 'hand') return { en: "Wash your hands before lunch.", vi: "Hãy rửa tay sạch sẽ trước bữa trưa." };
  if (low === 'mouth') return { en: "Open your mouth and say Ah.", vi: "Hãy mở miệng ra và nói A nhé." };
  if (low === 'nose') return { en: "Touch your nose with your finger.", vi: "Hãy chạm ngón tay vào chiếc mũi của bạn." };
  if (low === 'open') return { en: "Open your English workbook.", vi: "Hãy mở vở bài tập tiếng Anh ra nhé." };
  if (low === 'touch') return { en: "Touch your toes if you can.", vi: "Hãy chạm vào các ngón chân nếu bạn có thể." };

  if (low === 'cooking') return { en: "My father enjoys cooking tasty food.", vi: "Bố tôi rất thích nấu những món ăn ngon." };
  if (low === 'dancing') return { en: "She is good at dancing gracefully.", vi: "Cô ấy nhảy múa rất duyên dáng." };
  if (low === 'drawing') return { en: "I like drawing colorful animals.", vi: "Tôi thích vẽ những con vật sặc sỡ." };
  if (low === 'painting') return { en: "He is painting a pretty flower picture.", vi: "Cậu ấy đang vẽ màu một bức tranh hoa đẹp." };
  if (low === 'running') return { en: "Running in the park is healthy.", vi: "Chạy bộ trong công viên rất tốt cho sức khỏe." };
  if (low === 'singing') return { en: "We love singing English songs together.", vi: "Chúng mình thích cùng nhau hát các bài hát tiếng Anh." };
  if (low === 'swimming') return { en: "Swimming keeps us fit and cool.", vi: "Bơi lội giúp chúng mình khỏe mạnh và mát mẻ." };
  if (low === 'walking') return { en: "Grandpa likes walking in the garden.", vi: "Ông thích đi bộ dạo trong vườn." };

  if (low === 'art room') return { en: "We draw pictures in the art room.", vi: "Chúng mình vẽ tranh trong phòng mỹ thuật." };
  if (low === 'classroom') return { en: "Our classroom is bright and clean.", vi: "Lớp học của chúng mình rất sáng sủa và sạch đẹp." };
  if (low === 'computer room') return { en: "We practice typing in the computer room.", vi: "Chúng mình luyện gõ phím trong phòng máy tính." };
  if (low === 'gym') return { en: "Students exercise in the school gym.", vi: "Các bạn học sinh tập thể dục trong phòng tập thể chất." };
  if (low === 'library') return { en: "Read quiet storybooks in the library.", vi: "Hãy đọc truyện thật yên tĩnh trong thư viện." };
  if (low === 'music room') return { en: "We sing songs in the music room.", vi: "Chúng mình hát các bài ca trong phòng âm nhạc." };
  if (low === 'playground') return { en: "Children play games in the playground.", vi: "Các bạn nhỏ chơi trò chơi trên sân trường." };
  if (low === 'school') return { en: "I love going to my primary school.", vi: "Tôi rất yêu quý ngôi trường tiểu học của mình." };

  if (low === 'close') return { en: "Close your books, please.", vi: "Làm ơn hãy gấp sách lại nhé." };
  if (low === 'come in') return { en: "May I come in, teacher? – Yes, you can.", vi: "Em xin phép vào lớp ạ? – Được, em vào đi." };
  if (low === 'go out') return { en: "May I go out for water, please?", vi: "Em xin phép ra ngoài uống nước được không ạ?" };
  if (low === 'sit down') return { en: "Please sit down at your desk.", vi: "Xin mời các em ngồi xuống bàn học." };
  if (low === 'speak') return { en: "Speak English clearly, please.", vi: "Làm ơn hãy nói tiếng Anh rõ ràng nhé." };
  if (low === 'stand up') return { en: "Stand up and stretch your arms.", vi: "Hãy đứng dậy và vươn vai nào." };

  if (low === 'eraser') return { en: "Use an eraser to fix your drawing.", vi: "Dùng cục tẩy để sửa lại nét vẽ của bạn nhé." };
  if (low === 'pencil case') return { en: "My pencil case holds colorful pens.", vi: "Hộp bút của tôi đựng những chiếc bút sặc sỡ." };
  if (low === 'school bag') return { en: "Put your books inside your school bag.", vi: "Hãy cất sách vào trong cặp đi học nhé." };

  if (low === 'break time') return { en: "We have fun during break time.", vi: "Chúng mình vui chơi thoải mái trong giờ giải lao." };
  if (low === 'chat') return { en: "I chat with my friends under the tree.", vi: "Tôi trò chuyện với bạn bè dưới tán cây." };
  if (low === 'do word puzzles') return { en: "They like to do word puzzles together.", vi: "Các bạn ấy thích cùng nhau giải đố chữ." };
  if (low === 'play badminton') return { en: "We play badminton in the gym.", vi: "Chúng mình chơi cầu lông trong nhà tập thể thao." };
  if (low === 'play basketball') return { en: "He can play basketball very well.", vi: "Cậu ấy chơi bóng rổ rất cừ khôi." };
  if (low === 'play chess') return { en: "Dad taught me how to play chess.", vi: "Bố đã dạy tôi cách chơi cờ vua." };
  if (low === 'play football') return { en: "Boys play football on the green pitch.", vi: "Các bạn nam đá bóng trên sân cỏ xanh." };
  if (low === 'play table tennis') return { en: "Let's play table tennis after school.", vi: "Chúng mình cùng chơi bóng bàn sau giờ học nhé." };
  if (low === 'play volleyball') return { en: "They play volleyball in the yard.", vi: "Họ chơi bóng chuyền trong sân trường." };

  if (low === 'doctor') return { en: "The caring doctor helps sick people.", vi: "Bác sĩ chu đáo tận tình giúp đỡ người ốm." };
  if (low === 'driver') return { en: "The bus driver drives safely.", vi: "Bác tài xế xe buýt lái xe rất an toàn." };
  if (low === 'farmer') return { en: "The hard-working farmer grows rice.", vi: "Bác nông dân chăm chỉ trồng lúa." };
  if (low === 'nurse') return { en: "The kind nurse looks after patients.", vi: "Cô y tá tốt bụng chăm sóc cho các bệnh nhân." };
  if (low === 'singer') return { en: "The famous singer has a sweet voice.", vi: "Ca sĩ nổi tiếng có một giọng hát ngọt ngào." };
  if (low === 'worker') return { en: "My uncle is a factory worker.", vi: "Chú tôi là một công nhân nhà máy." };

  if (low === 'drawing a picture') return { en: "She is drawing a picture of her house.", vi: "Cô bé đang vẽ một bức tranh về ngôi nhà của mình." };
  if (low === 'listening to music') return { en: "He is listening to cheerful music.", vi: "Cậu ấy đang lắng nghe những điệu nhạc vui tươi." };
  if (low === 'playing basketball') return { en: "They are playing basketball in the yard.", vi: "Họ đang chơi bóng rổ ngoài sân." };
  if (low === 'reading') return { en: "I am reading an exciting comic book.", vi: "Tôi đang đọc một cuốn truyện tranh hấp dẫn." };
  if (low === 'singing') return { en: "The choir is singing on the stage.", vi: "Dàn hợp xướng đang hát trên sân khấu." };
  if (low === 'watching tv') return { en: "We are watching TV together in the evening.", vi: "Chúng mình cùng xem ti-vi vào buổi tối." };
  if (low === 'writing') return { en: "He is writing a letter to his pen pal.", vi: "Cậu ấy đang viết một bức thư gửi bạn qua thư." };

  if (low === 'flying a kite') return { en: "The boys are flying a kite in the field.", vi: "Các bạn nam đang thả diều trên cánh đồng." };
  if (low === 'skating') return { en: "She enjoys skating around the park.", vi: "Cô bé thích trượt patin vòng quanh công viên." };
  if (low === 'skipping') return { en: "Girls are skipping rope happily.", vi: "Các bạn nữ đang nhảy dây thật vui vẻ." };

  if (low === 'climbing') return { en: "The monkey is climbing up the tall tree.", vi: "Chú khỉ đang leo thoăn thoắt lên cây cao." };
  if (low === 'counting') return { en: "She is counting apples in the basket.", vi: "Cô bé đang đếm những quả táo trong giỏ." };
  if (low === 'peacock') return { en: "The peacock displays its gorgeous feathers.", vi: "Con công xòe bộ lông tuyệt đẹp của mình." };
  if (low === 'swinging') return { en: "The baby monkey is swinging on the vine.", vi: "Chú khỉ con đang đu đưa trên dây leo." };

  // Daily sentences
  if (low.startsWith('good morning')) return { en: "Good morning! Have a wonderful day at school.", vi: "Chào buổi sáng! Chúc bạn một ngày tuyệt vời ở trường." };
  if (low.startsWith('good afternoon')) return { en: "Good afternoon teacher and classmates!", vi: "Chào buổi chiều cô giáo và cả lớp!" };
  if (low.startsWith('good evening')) return { en: "Good evening mom and dad!", vi: "Con chào buổi tối bố mẹ!" };
  if (low.startsWith('nice to meet you')) return { en: "Nice to meet you! My name is Mai.", vi: "Rất vui được gặp bạn! Mình tên là Mai." };
  if (low.startsWith('here you are')) return { en: "Here you are, enjoy your sweet cake.", vi: "Của bạn đây, chúc bạn thưởng thức bánh ngon nhé." };
  if (low.startsWith("you're welcome")) return { en: "You're welcome! Happy to help.", vi: "Không có chi đâu! Rất vui được giúp bạn." };
  if (low.startsWith('pardon')) return { en: "Pardon? Could you please repeat that?", vi: "Dạ bạn nói lại được không? Bạn có thể nhắc lại không?" };
  if (low.startsWith('see you later')) return { en: "See you later! Have a safe trip home.", vi: "Hẹn gặp lại sau nhé! Chúc bạn về nhà an toàn." };

  // Fallback natural sentence
  const cleanEn = en.charAt(0).toUpperCase() + en.slice(1);
  return {
    en: `This is a nice ${en.toLowerCase()}.`,
    vi: `Đây là ${vi ? vi.toLowerCase() : 'từ vựng'}.`
  };
}

// Map sections to Category objects
import { LOP3_META } from './lop3_meta_list.mjs';

const LOP3_CATEGORIES = sections.map((sec, secIdx) => {
  const meta = LOP3_META[secIdx];
  const catId = meta ? meta.id : `lop3_sec_${secIdx}`;
  const name_vi = meta ? meta.name_vi : sec.title;
  const name_en = meta ? meta.name_en : sec.title;
  const emoji = meta ? meta.emoji : '📘';
  const color = meta ? meta.color : 'from-teal-400 to-cyan-500';
  const gradient = meta ? meta.gradient : 'bg-gradient-to-br from-teal-100 to-cyan-100';

  const words = sec.words.map((w, wIdx) => {
    const rawEn = w.en.trim();
    const cleanEn = rawEn.charAt(0).toUpperCase() + rawEn.slice(1);
    const lowEn = rawEn.toLowerCase();
    const idSlug = lowEn.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const id = `l3_s${secIdx + 1}_${idSlug}`;
    const wordEmoji = EMOJI_DICT[lowEn] || emoji;
    const examples = makeExamples(rawEn, w.vi, sec.title);

    return {
      id,
      en: cleanEn,
      vi: w.vi,
      emoji: wordEmoji,
      phonetic: w.phonetic,
      example_en: examples.en,
      example_vi: examples.vi
    };
  });

  return {
    id: catId,
    gradeId: 'lop3',
    name_vi,
    name_en,
    emoji,
    color,
    gradient,
    words
  };
});

console.log(`Generated ${LOP3_CATEGORIES.length} categories.`);
let totalWords = 0;
const wordIds = new Set();
for (const cat of LOP3_CATEGORIES) {
  for (const w of cat.words) {
    if (wordIds.has(w.id)) throw new Error(`Duplicate ID: ${w.id}`);
    wordIds.add(w.id);
    totalWords++;
  }
}
console.log(`Validated: ${totalWords} total words across ${LOP3_CATEGORIES.length} categories with 0 duplicates.`);

// Write scripts/generate_lop3.mjs
const fileContent = `export const LOP3_CATEGORIES = ` + JSON.stringify(LOP3_CATEGORIES, null, 2) + `;\n`;
fs.writeFileSync('d:/engl/vocakids/scripts/generate_lop3.mjs', fileContent, 'utf8');
console.log('Saved scripts/generate_lop3.mjs!');
