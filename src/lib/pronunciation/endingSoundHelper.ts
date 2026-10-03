// =============================================
// VocaKids – Ending Sound Helper
// Phân tích và phát hiện âm đuôi cần bắt chặt
// =============================================

export interface EndingSoundInfo {
  phoneme: string;          // e.g. "/t/", "/s/", "/k/", "/d/", "/ʃ/"
  nameVi: string;           // e.g. "âm đuôi /t/", "âm đuôi gió /s/"
  guideVi: string;          // Hướng dẫn luyện âm đuôi cho bé
}

export function detectEndingSound(word: string, phonetic?: string): EndingSoundInfo | null {
  const cleanPhonetic = (phonetic || '').toLowerCase().replace(/[\/\[\]ˈˌː]/g, '').trim();
  const cleanWord = (word || '').toLowerCase().trim();

  // 1. Phân tích dựa trên phiên âm IPA nếu có (chính xác nhất)
  if (cleanPhonetic) {
    if (cleanPhonetic.endsWith('tʃ')) {
      return {
        phoneme: '/tʃ/',
        nameVi: 'âm đuôi /tʃ/',
        guideVi: 'Con nhớ chu môi và bật nhẹ âm /tʃ/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('dʒ')) {
      return {
        phoneme: '/dʒ/',
        nameVi: 'âm đuôi /dʒ/',
        guideVi: 'Con nhớ bật rõ âm /dʒ/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('ks')) {
      return {
        phoneme: '/ks/',
        nameVi: 'âm đuôi /ks/',
        guideVi: 'Con nhớ bật âm /k/ rồi xì nhẹ âm /s/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('ʃ')) {
      return {
        phoneme: '/ʃ/',
        nameVi: 'âm đuôi /ʃ/ (sh)',
        guideVi: 'Con nhớ chu môi và thổi gió âm /ʃ/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('t')) {
      return {
        phoneme: '/t/',
        nameVi: 'âm đuôi /t/',
        guideVi: 'Con nhớ đặt đầu lưỡi sau hàm răng trên và bật nhẹ âm /t/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('s')) {
      return {
        phoneme: '/s/',
        nameVi: 'âm đuôi gió /s/',
        guideVi: 'Con nhớ khép nhẹ hai hàm răng và xì nhẹ âm /s/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('k')) {
      return {
        phoneme: '/k/',
        nameVi: 'âm đuôi /k/',
        guideVi: 'Con nhớ bật hơi nhẹ âm /k/ trong cổ họng ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('d')) {
      return {
        phoneme: '/d/',
        nameVi: 'âm đuôi /d/',
        guideVi: 'Con nhớ bật nhẹ âm /d/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('p')) {
      return {
        phoneme: '/p/',
        nameVi: 'âm đuôi /p/',
        guideVi: 'Con nhớ mím nhẹ hai môi và bật hơi âm /p/ ở cuối từ nhé!',
      };
    }
    if (cleanPhonetic.endsWith('z')) {
      return {
        phoneme: '/z/',
        nameVi: 'âm đuôi /z/',
        guideVi: 'Con nhớ rung nhẹ âm /z/ ở cuối từ nhé!',
      };
    }
  }

  // 2. Dự phòng dựa trên mặt chữ tiếng Anh
  if (cleanWord.endsWith('sh')) {
    return { phoneme: '/ʃ/', nameVi: 'âm đuôi /ʃ/ (sh)', guideVi: 'Con nhớ chu môi thổi gió âm /ʃ/ ở cuối nhé!' };
  }
  if (cleanWord.endsWith('ch') || cleanWord.endsWith('tch')) {
    return { phoneme: '/tʃ/', nameVi: 'âm đuôi /tʃ/', guideVi: 'Con nhớ bật nhẹ âm /tʃ/ ở cuối nhé!' };
  }
  if (cleanWord.endsWith('x')) {
    return { phoneme: '/ks/', nameVi: 'âm đuôi /ks/', guideVi: 'Con nhớ xì âm /ks/ ở cuối nhé!' };
  }
  if (cleanWord.endsWith('t') || cleanWord.endsWith('te')) {
    return { phoneme: '/t/', nameVi: 'âm đuôi /t/', guideVi: 'Con nhớ bật nhẹ âm /t/ ở cuối từ nhé!' };
  }
  if (cleanWord.endsWith('s') || cleanWord.endsWith('ss') || cleanWord.endsWith('se') || cleanWord.endsWith('ce')) {
    return { phoneme: '/s/', nameVi: 'âm đuôi /s/', guideVi: 'Con nhớ xì nhẹ âm /s/ ở cuối từ nhé!' };
  }
  if (cleanWord.endsWith('k') || cleanWord.endsWith('ck') || cleanWord.endsWith('ke')) {
    return { phoneme: '/k/', nameVi: 'âm đuôi /k/', guideVi: 'Con nhớ bật nhẹ âm /k/ ở cuối từ nhé!' };
  }
  if (cleanWord.endsWith('d') || cleanWord.endsWith('de')) {
    return { phoneme: '/d/', nameVi: 'âm đuôi /d/', guideVi: 'Con nhớ bật nhẹ âm /d/ ở cuối từ nhé!' };
  }
  if (cleanWord.endsWith('p') || cleanWord.endsWith('pe')) {
    return { phoneme: '/p/', nameVi: 'âm đuôi /p/', guideVi: 'Con nhớ mím môi bật âm /p/ ở cuối từ nhé!' };
  }

  return null;
}
