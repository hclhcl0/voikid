/* eslint-disable @typescript-eslint/no-require-imports */
// Selected Fluent Emoji 3D artwork, pinned to the same revision as our Flat set.
// node scripts/download-sticker-assets.cjs [optional cached GitHub tree JSON]
const fs = require('node:fs/promises');
const path = require('node:path');
const flat = require('../src/lib/fluent-emoji-manifest.json');
const revision = '1ffb34c752ecf5d402f04cfb4b392c77f57c54bc';
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'public/media/stickers/fluent-3d');
const raw = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/${revision}/`;
const emojis = ['🐱','🐶','🐰','🦊','🐼','🦁','🦄','🐉','🌈','🪄','💎','👑','🚀','🧭','🏝️','🪐','🌍','🎒','🌟','⭐','🏆','🎖️','🎉','🎯','🌱','🔥','💯','🎁','📚','👂','🔤'];
emojis.push('🐠','🐬','🐢','🐙','🦀','🐳','🐵','🦒','🐘','🐯','🦓','🦍','🌸','🐞','🦋','🌷','🌻','🌳','🍓','🧁','🍦','🍩','🍰','🍭','🏎️','🚌','🚁','⛵','🚂','✈️','🎵','🥁','🎸','🎺','🎻','🎤');
const pngSignature = Buffer.from([137,80,78,71,13,10,26,10]);
async function download(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, {headers: {'User-Agent':'VocaKids-stickers'}, signal: AbortSignal.timeout(30000)});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}
async function main() {
  await fs.mkdir(target, {recursive:true});
  const tree = JSON.parse(process.argv[2] ? await fs.readFile(process.argv[2], 'utf8') : (await download(`https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/${revision}?recursive=1`)).toString('utf8'));
  if (tree.sha !== revision || tree.truncated) throw new Error('Unexpected/incomplete source tree');
  const manifest = {};
  const sources = [];
  const jobs = emojis.map(emoji => {
    const code = Array.from(emoji).map(char => char.codePointAt(0).toString(16)).filter(code => code !== 'fe0f' && code !== 'fe0e').join('-');
    const filename = flat[code]?.replace('_flat','_3d').replace('.svg','.png');
    const source = tree.tree.find(file => file.path.endsWith('/' + filename));
    if (!source) throw new Error(`Missing 3D asset for ${emoji}`);
    manifest[code] = filename;
    sources.push({emoji,filename,path:source.path});
    return {filename,path:source.path};
  });
  let index = 0;
  await Promise.all(Array.from({length:6}, async () => {
    while (index < jobs.length) {
      const job = jobs[index++];
      const destination = path.join(target, job.filename);
      const existing = await fs.readFile(destination).catch(() => null);
      if (existing?.subarray(0,8).equals(pngSignature)) continue;
      const bytes = await download(raw + job.path.split('/').map(encodeURIComponent).join('/'));
      if (!bytes.subarray(0,8).equals(pngSignature)) throw new Error(`Invalid PNG: ${job.filename}`);
      await fs.writeFile(destination, bytes);
    }
  }));
  await fs.writeFile(path.join(target,'LICENSE'), await download(raw + 'LICENSE'));
  await fs.writeFile(path.join(target,'SOURCE.json'), JSON.stringify({repository:'https://github.com/microsoft/fluentui-emoji',revision,license:'MIT',assets:sources},null,2) + '\n');
  await fs.writeFile(path.join(root,'src/lib/sticker-assets.json'), JSON.stringify(manifest,null,2) + '\n');
  console.log(`Saved ${jobs.length} Fluent Emoji 3D PNGs, license and source manifest.`);
}
main().catch(error => {console.error(error.message);process.exitCode=1;});
