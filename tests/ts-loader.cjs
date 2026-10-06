/* eslint-disable @typescript-eslint/no-require-imports -- Intentional CommonJS loader for compiler output. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const cache = new Map();

function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  const compiled = { exports: {} };
  cache.set(file, compiled);
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const localRequire = name => {
    if (name.startsWith('.') || name.startsWith('@/')) {
      const target = name.startsWith('@/') ? path.join(__dirname, '../src', name.slice(2)) : path.join(path.dirname(file), name);
      if (name.endsWith('.json')) return JSON.parse(fs.readFileSync(target,'utf8'));
      return load(target + (fs.existsSync(target+'.ts')?'.ts':'.tsx'));
    }
    return require(name);
  };
  vm.runInThisContext(`(function(require,module,exports){${js}\n})`, { filename: file })(localRequire, compiled, compiled.exports);
  return compiled.exports;
}
module.exports = { load };
