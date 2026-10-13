/**
 * Script quét và tạo mới toàn bộ audio ElevenLabs cho các từ vựng chưa có.
 *
 * Cách dùng:
 *   node scripts/batch-generate-audio.cjs                     # Tạo tất cả từ chưa có trong toàn bộ app
 *   node scripts/batch-generate-audio.cjs --scope=shop        # Chỉ tạo các từ trong Cửa hàng
 *   node scripts/batch-generate-audio.cjs --scope=curriculum  # Chỉ tạo các từ trong Bài học
 *   node scripts/batch-generate-audio.cjs --limit=10          # Chỉ thử tạo 10 từ đầu tiên
 */

const { load } = require('../tests/ts-loader.cjs');
const { readContent } = load('src/lib/backend/store.ts');
const { shopItems } = load('src/lib/shop.ts');
const { audioId, audioSettingsForPace, findAudio, generateAudio, listAudio, publicAudioSettings } = load('src/lib/media/store.ts');

const args = process.argv.slice(2);
const scopeArg = args.find(a => a.startsWith('--scope='))?.split('=')[1] || 'all';
const limitArg = Number(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 0;
const dryRun = args.includes('--dry-run') || args.includes('--scan');

async function main() {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  🎙️  VOCAKIDS · QUÉT VÀ TẠO AUDIO ELEVENLABS HÀNG LOẠT');
  console.log('════════════════════════════════════════════════════════════════\n');

  const settings = audioSettingsForPace('normal');
  const pub = publicAudioSettings();
  console.log('⚙️  Cấu hình hiện tại:');
  console.log(`   - Enabled:    ${settings.enabled ? '✓ Bật' : '✗ Đang tắt'}`);
  console.log(`   - Model:      ${settings.model}`);
  console.log(`   - Voice ID:   ${settings.voiceId || '(chưa có)'}`);
  console.log(`   - Chế độ key: ${pub.keyMode === 'round_robin' ? '🔄 Luân phiên (Round-Robin)' : '🥇 Ưu tiên (Priority / Failover)'}`);
  console.log(`   - Số API Key: ${pub.activeKeyCount || (pub.configured ? 1 : 0)} key đang kích hoạt`);
  if (pub.apiKeys && pub.apiKeys.length > 0) {
    pub.apiKeys.forEach((k, idx) => {
      console.log(`     [${idx + 1}] ${k.name}: ${k.masked} (${k.enabled ? 'Bật' : 'Tắt'})`);
    });
  } else if (settings.apiKey) {
    console.log(`     [1] Key chính: ${settings.apiKey.slice(0, 4)}...${settings.apiKey.slice(-4)}`);
  }
  console.log(`   - Tốc độ:     ${settings.speed}×\n`);

  if (!dryRun && (!settings.enabled || !pub.configured || !settings.voiceId)) {
    console.error('❌ LỖI: ElevenLabs chưa được cấu hình hoặc chưa bật.');
    console.error('👉 Vui lòng vào trang Admin (http://localhost:3000/admin → Media) nhập key và voice ID,');
    console.error('   hoặc cấu hình các biến môi trường: ELEVENLABS_ENABLED=true, ELEVENLABS_API_KEY/ELEVENLABS_API_KEYS, ELEVENLABS_VOICE_ID.');
    console.error('💡 Gợi ý: Có thể thêm cờ `--dry-run` để chỉ quét kiểm tra danh sách từ chưa có audio mà không gọi API.\n');
    process.exit(1);
  }

  // Thu thập từ vựng theo scope
  const shopWords = Array.from(new Set(shopItems.map(w => w.en.trim()).filter(Boolean)));
  const content = readContent();
  const curriculumWords = Array.from(
    new Set(content.categories.flatMap(c => c.words.map(w => w.en.trim())).filter(Boolean))
  );

  let targetWords = [];
  if (scopeArg === 'shop') {
    targetWords = shopWords;
    console.log(`🎯 Phạm vi: Cửa hàng (Shop) · ${shopWords.length} từ`);
  } else if (scopeArg === 'curriculum') {
    targetWords = curriculumWords;
    console.log(`🎯 Phạm vi: Bài học theo chủ đề (Curriculum) · ${curriculumWords.length} từ`);
  } else {
    targetWords = Array.from(new Set([...curriculumWords, ...shopWords]));
    console.log(`🎯 Phạm vi: Toàn bộ ứng dụng (Curriculum + Shop) · ${targetWords.length} từ độc nhất`);
  }

  // Quét các từ chưa có audio
  const isMissing = text => !findAudio(audioId(text, settings));
  let missingWords = targetWords.filter(isMissing);

  const alreadyCount = targetWords.length - missingWords.length;
  console.log(`📊 Kết quả quét:`);
  console.log(`   - Tổng số từ:  ${targetWords.length}`);
  console.log(`   - Đã có audio: ${alreadyCount} (${Math.round((alreadyCount / targetWords.length) * 100)}%)`);
  console.log(`   - Chưa có:     ${missingWords.length} từ cần tạo mới\n`);

  if (missingWords.length === 0) {
    console.log('🎉 Tuyệt vời! Tất cả các từ trong phạm vi này đều đã có MP3 trên máy chủ. Không cần tạo thêm.');
    return;
  }

  if (dryRun) {
    console.log('🔍 [CHẾ ĐỘ QUÉT THỬ / DRY-RUN]');
    console.log(`   Tìm thấy ${missingWords.length} từ chưa có file audio MP3 trên server.`);
    console.log(`   15 từ mẫu đầu tiên: ${missingWords.slice(0, 15).join(', ')}...`);
    console.log('\n💡 Để bắt đầu gọi ElevenLabs tạo thật, hãy cấu hình key/voice trong Admin rồi chạy lệnh:');
    console.log('   node scripts/batch-generate-audio.cjs --scope=' + scopeArg);
    return;
  }

  if (limitArg > 0 && limitArg < missingWords.length) {
    missingWords = missingWords.slice(0, limitArg);
    console.log(`⚡ Giới hạn (--limit=${limitArg}): Chỉ tạo ${limitArg} từ trong đợt này.\n`);
  }

  console.log(`🚀 Bắt đầu tạo audio cho ${missingWords.length} từ... (Bấm Ctrl+C bất kỳ lúc nào để dừng an toàn)\n`);

  let done = 0;
  let errors = 0;
  const startTime = Date.now();

  for (let i = 0; i < missingWords.length; i++) {
    const text = missingWords[i];
    const indexStr = `[${i + 1}/${missingWords.length}]`.padStart(8);

    try {
      await generateAudio(text, 'normal');
      done++;
      console.log(`${indexStr}  ✓ "${text}"`);
    } catch (err) {
      errors++;
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`${indexStr}  ✗ "${text}" - Lỗi: ${msg}`);

      // Fatal errors
      if (['QUOTA', 'INVALID_KEY', 'PERMISSION', 'PAID_VOICE', 'VOICE_NOT_FOUND', 'DISABLED'].includes(msg)) {
        console.error(`\n⛔ Dừng tiến trình vì lỗi nghiêm trọng: ${msg}`);
        break;
      }
    }

    // Rate limit delay (350ms)
    await new Promise(r => setTimeout(r, 350));
  }

  const durationSec = Math.round((Date.now() - startTime) / 1000);
  console.log('\n════════════════════════════════════════════════════════════════');
  console.log(`  🏁 KẾT THÚC TIẾN TRÌNH (${durationSec}s)`);
  console.log(`     - Tạo thành công: ${done} từ`);
  console.log(`     - Lỗi:            ${errors} từ`);
  console.log(`     - Tổng audio lưu: ${listAudio().length} file MP3`);
  console.log('════════════════════════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
