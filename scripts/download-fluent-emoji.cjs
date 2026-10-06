// Download the complete Flat SVG collection from a pinned Microsoft release.
// Run: node scripts/download-fluent-emoji.cjs
const fs = require('node:fs/promises');
const path = require('node:path');
const revision = '1ffb34c752ecf5d402f04cfb4b392c77f57c54bc';
const root = path.resolve(__dirname, '..');
const target = path.join(root, 'public/media/fluent-emoji');
const raw = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/${revision}/`;
async function download(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': 'VocaKids-icons' }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      if (attempt === 3) throw new Error(`${url}: ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
}
function code(unicode) {
  return unicode.toLowerCase().split(/\s+/).filter(part => !['fe0f', 'fe0e'].includes(part)).map(part => parseInt(part, 16).toString(16)).join('-');
}
async function main() {
  const tree = JSON.parse(await download(`https://api.github.com/repos/microsoft/fluentui-emoji/git/trees/${revision}?recursive=1`));
  if (tree.truncated) throw new Error('Incomplete upstream tree');
  const icons = tree.tree.filter(entry => /^assets\/.+\/Flat\/[^/]+\.svg$/.test(entry.path));
  const metadata = tree.tree.filter(entry => /^assets\/[^/]+\/metadata\.json$/.test(entry.path));
  if (icons.length < 3000) throw new Error('Unexpected upstream icon count');
  await fs.mkdir(target, { recursive: true });
  const groups = new Map();
  for (const icon of icons) {
    const group = icon.path.split('/')[1];
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(icon.path);
  }
  const manifest = {};
  const tasks = [...icons.map(icon => ({ type: 'svg', path: icon.path })), ...metadata.map(item => ({ type: 'metadata', path: item.path }))];
  let cursor = 0;
  let completed = 0;
  await Promise.all(Array.from({ length: 20 }, async () => {
    while (cursor < tasks.length) {
      const task = tasks[cursor++];
      const filename = path.posix.basename(task.path);
      if (task.type === 'svg') {
        const destination = path.join(target, filename);
        try { await fs.access(destination); }
        catch {
          const svg = await download(raw + task.path.split('/').map(encodeURIComponent).join('/'));
          if (!svg.includes('<svg') || /<script\b/i.test(svg)) throw new Error(`Invalid SVG: ${task.path}`);
          await fs.writeFile(destination, svg);
        }
      } else {
        const info = JSON.parse(await download(raw + task.path.split('/').map(encodeURIComponent).join('/')));
        const files = groups.get(task.path.split('/')[1]) || [];
        const defaults = files.find(file => file.includes('/Default/')) || files.find(file => file.split('/').length === 4);
        if (defaults) manifest[code(info.unicode)] = path.posix.basename(defaults);
        const tones = ['Default', 'Light', 'Medium-Light', 'Medium', 'Medium-Dark', 'Dark'];
        for (const [index, unicode] of (info.unicodeSkintones || []).entries()) {
          const file = files.find(file => file.includes(`/${tones[index]}/`));
          if (file) manifest[code(unicode)] = path.posix.basename(file);
        }
      }
      completed++;
      if (completed % 500 === 0) console.log(`${completed}/${tasks.length} downloaded`);
    }
  }));
  await fs.writeFile(path.join(target, 'LICENSE'), await download(raw + 'LICENSE'));
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(path.join(root, 'src/lib/fluent-emoji-manifest.json'), JSON.stringify(sorted, null, 2) + '\n');
  await fs.writeFile(path.join(target, 'SOURCE.json'), JSON.stringify({ repository: 'https://github.com/microsoft/fluentui-emoji', revision, style: 'Flat', license: 'MIT', icons: icons.length, mapped: Object.keys(sorted).length }, null, 2) + '\n');
  console.log(`Done: ${icons.length} SVGs, ${Object.keys(sorted).length} Unicode mappings.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
