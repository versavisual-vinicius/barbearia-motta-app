import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appDir = path.resolve(__dirname, '../app');

console.log('--- Test 1: File Presence ---');
const files = [
  'index.html',
  'styles.css',
  'app.js',
  'sw.js',
  'icon.svg',
  'manifest.webmanifest',
  'play-game.js',
  'play/index.html',
  'play/_next'
];

for (const file of files) {
  const fullPath = path.join(appDir, file);
  assert.ok(fs.existsSync(fullPath), `Expected file/dir to exist: ${file}`);
  console.log(`✓ Exists: ${file}`);
}

console.log('\n--- Test 2: HTML Integration ---');
const indexHtml = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');
assert.ok(indexHtml.includes('play-game.js?v=30'), 'index.html should reference play-game.js?v=30');
assert.ok(indexHtml.includes('app.js?v=30'), 'index.html should reference app.js?v=30');
assert.ok(indexHtml.includes('styles.css?v=30'), 'index.html should reference styles.css?v=30');
assert.ok(indexHtml.includes('sw.js?v=30'), 'index.html should register sw.js?v=30');
console.log('✓ index.html references verified');

console.log('\n--- Test 3: Service Worker Cache ---');
const swJs = fs.readFileSync(path.join(appDir, 'sw.js'), 'utf8');
assert.ok(swJs.includes('motta-cache-v30'), 'sw.js should use motta-cache-v30');
assert.ok(swJs.includes('./play-game.js'), 'sw.js should cache play-game.js');
assert.ok(swJs.includes('./play/index.html'), 'sw.js should cache play/index.html');
assert.ok(swJs.includes('./icon.svg'), 'sw.js should cache icon.svg');
assert.ok(swJs.includes('./manifest.webmanifest'), 'sw.js should cache manifest.webmanifest');
assert.ok(swJs.includes('e.request.mode === "navigate"'), 'sw.js must guard index.html fallback for navigation only');
console.log('✓ sw.js cache manifests and navigate fallback guard verified');

console.log('\n--- Test 4: App.js Integration ---');
const appJs = fs.readFileSync(path.join(appDir, 'app.js'), 'utf8');
assert.ok(appJs.includes('play(arg) {'), 'app.js should define play(arg) in screens');
assert.ok(appJs.includes('MottaPlay.cleanup()'), 'app.js should handle MottaPlay cleanup');
assert.ok(appJs.includes('MottaPlay.init(arg)'), 'app.js should pass arg to MottaPlay init');
assert.ok(appJs.includes('#/play'), 'app.js should link to #/play from inicio and agendamentos');
assert.ok(appJs.includes('MOTTA / INTERVALO'), 'app.js should feature MOTTA / INTERVALO copy');
console.log('✓ app.js routes, titles, and hooks verified');

console.log('\n--- Test 5: CSS Styles ---');
const stylesCss = fs.readFileSync(path.join(appDir, 'styles.css'), 'utf8');
assert.ok(stylesCss.includes('.play-wrapper'), 'styles.css should style .play-wrapper');
assert.ok(stylesCss.includes('.game-grid'), 'styles.css should style .game-grid');
assert.ok(stylesCss.includes('.game-area'), 'styles.css should style .game-area');
assert.ok(stylesCss.includes('.frequency-'), 'styles.css should style frequency game elements');
assert.ok(stylesCss.includes('.continuum-'), 'styles.css should style continuum game elements');
assert.ok(stylesCss.includes('width: 100%;'), 'styles.css status-bar should have width: 100%');
console.log('✓ styles.css game classes verified');

console.log('\n--- Test 6: Vercel Config ---');
const vercelJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../vercel.json'), 'utf8'));
assert.strictEqual(vercelJson.outputDirectory, 'app');
const playRewrite = vercelJson.rewrites.find(r => r.source === '/play');
assert.ok(playRewrite, 'vercel.json should have a rewrite for /play');
assert.strictEqual(playRewrite.destination, '/play/index.html');
const wildcardRewrite = vercelJson.rewrites.find(r => r.source === '/(.*)');
assert.ok(wildcardRewrite, 'vercel.json should have a fallback rewrite for /(.*)');
console.log('✓ vercel.json rewrites verified');

console.log('\n--- Test 7: MottaPlay JavaScript Module Evaluation ---');
// Mock browser environment to test play-game.js
const mockWindow = {
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); }
  },
  performance: { now: () => Date.now() },
  requestAnimationFrame: (cb) => setTimeout(cb, 16),
  cancelAnimationFrame: (id) => clearTimeout(id)
};

const playGameCode = fs.readFileSync(path.join(appDir, 'play-game.js'), 'utf8');
const fn = new Function('window', 'global', playGameCode);
fn(mockWindow, mockWindow);

assert.ok(mockWindow.MottaPlay, 'MottaPlay must be attached to global/window');
assert.strictEqual(typeof mockWindow.MottaPlay.renderHTML, 'function');
assert.strictEqual(typeof mockWindow.MottaPlay.init, 'function');
assert.strictEqual(typeof mockWindow.MottaPlay.launch, 'function');
assert.strictEqual(typeof mockWindow.MottaPlay.cleanup, 'function');

const html = mockWindow.MottaPlay.renderHTML();
assert.ok(html.includes('data-play-game="equilibrio"'), 'Rendered HTML must include Equilibrio card');
assert.ok(html.includes('data-play-game="frequencia"'), 'Rendered HTML must include Frequência card');
assert.ok(html.includes('data-play-game="continuum"'), 'Rendered HTML must include Continuum card');
assert.ok(html.includes('data-play-game="ondas"'), 'Rendered HTML must include Ondas card');
assert.ok(html.includes('O luxo de'), 'Rendered HTML must include editorial copy');

// Test direct rendering with gameId (deep-link support)
const shellHtml = mockWindow.MottaPlay.renderHTML('equilibrio');
assert.ok(shellHtml.includes('Equilíbrio'), 'Direct render of game shell must include title');
assert.ok(shellHtml.includes('play-overlay-ready'), 'Direct render must include ready overlay');

console.log('✓ MottaPlay engine and HTML rendering verified');

console.log('\nALL 7 TESTS PASSED PERFECTLY!');
