import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const read = (file) => readFileSync(new URL(file, root), 'utf8');
const app = read('app/app.js');
const html = read('app/index.html');
const css = read('app/styles.css');
const readmePath = fileURLToPath(new URL('README.md', root));
const start = '<!-- INVENTARIO_MOTTA_INICIO -->';
const end = '<!-- INVENTARIO_MOTTA_FIM -->';

const screenBlock = app.match(/const screens = \{([\s\S]*?)\n\};\s*\/\* ---------- roteador/);
const titleBlock = app.match(/const titles = \{([^\n]+)\};/);
const guardBlock = app.match(/const protectedRoutes = \[([^\]]*)\]/);
if (!screenBlock || !titleBlock || !guardBlock) throw new Error('Estrutura de rotas não reconhecida; README preservado.');

const screens = [...screenBlock[1].matchAll(/^  ([a-z_]+)\([^\n]*\) \{/gm)].map((m) => m[1]);
const titles = new Map([...titleBlock[1].matchAll(/([a-z_]+):\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]));
const protectedRoutes = new Set([...guardBlock[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));
if (!screens.length || screens.some((route) => !titles.has(route))) throw new Error('Rotas ou títulos incompletos; README preservado.');

const features = [
  ['Navegação por hash', /location\.hash/.test(app)],
  ['Estado no armazenamento local', /localStorage\.(getItem|setItem)/.test(app)],
  ['Diálogo nativo', /<dialog\b/.test(html) && /\.showModal\(/.test(app)],
  ['Service worker', /serviceWorker\.register/.test(html)],
  ['Alinhamento de texto com text-box', /text-box\s*:/.test(css)],
  ['Consultas de estado de rolagem', /@container\s+scroll-state/.test(css)],
].filter(([, present]) => present).map(([name]) => `- ${name}`);

const rows = screens.sort((a, b) => a.localeCompare(b, 'pt-BR')).map((route) =>
  `| \`#/${route}\` | ${titles.get(route).replaceAll('|', '\\|')} | ${protectedRoutes.has(route) ? 'Login' : 'Público'} |`
);
const generated = [
  '### Inventário gerado a partir do código',
  '',
  'Execute `node scripts/atualizar-inventario.mjs` para atualizar esta seção. A lista descreve rotas e recursos presentes no código; não comprova integração remota nem testes aprovados.',
  '',
  '| Rota | Tela | Acesso no roteador |',
  '| :--- | :--- | :--- |',
  ...rows,
  '',
  '**Recursos web identificados**',
  '',
  ...features,
].join('\n');

const readme = readFileSync(readmePath, 'utf8');
const from = readme.indexOf(start);
const to = readme.indexOf(end);
if (from < 0 || to < from || readme.indexOf(start, from + start.length) !== -1 || readme.indexOf(end, to + end.length) !== -1) {
  throw new Error('Marcadores ausentes, duplicados ou fora de ordem; README preservado.');
}
const updated = readme.slice(0, from + start.length) + '\n' + generated + '\n' + readme.slice(to);
if (updated !== readme) writeFileSync(readmePath, updated);
console.log(`Inventário atualizado: ${screens.length} rotas e ${features.length} recursos.`);
