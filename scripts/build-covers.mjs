// Responsive project covers.
// usage: npm run covers
//
// Loads the real project data through Vite's SSR module loader (so the cover
// values resolve exactly as the app sees them — in dev mode a Vite asset import
// is just "/src/assets/..."), then writes
//   public/covers/<slug>-{480,960,1440}.{avif,webp}
// skipping widths larger than the source, plus src/showroom/covers.manifest.json
// so the client only references files that exist.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'public', 'covers');
const manifestPath = path.join(root, 'src', 'showroom', 'covers.manifest.json');
const WIDTHS = [480, 960, 1440];

const vite = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true, include: [] },
});

let projects;
try {
  ({ projects } = await vite.ssrLoadModule('/src/data/portfolio.ts'));
} finally {
  await vite.close();
}

/** "/src/assets/webp/IX%20Solutions/1.webp?import" → absolute file path */
function sourceFile(url) {
  if (typeof url !== 'string') return null;
  const clean = decodeURIComponent(url.split('?')[0]);
  if (clean.startsWith('/@fs/')) return clean.slice(5);
  const candidates = [path.join(root, clean), path.join(root, 'public', clean)];
  return candidates.find((f) => fs.existsSync(f) && fs.statSync(f).isFile()) ?? null;
}

fs.mkdirSync(outDir, { recursive: true });
const manifest = {};
let written = 0;

for (const p of projects) {
  const file = sourceFile(p.cover);
  if (!file) {
    console.warn(`skip ${p.slug}: no cover source (${p.cover})`);
    continue;
  }
  if (/\.svg$/i.test(file)) {
    console.warn(`skip ${p.slug}: svg cover`);
    continue;
  }
  const meta = await sharp(file).metadata();
  const srcW = meta.width ?? 0;
  const srcH = meta.height ?? 0;
  let widths = WIDTHS.filter((w) => w <= srcW);
  // a source smaller than 480px still gets one optimised file at its own width
  if (!widths.length && srcW) widths = [srcW];
  for (const w of widths) {
    for (const fmt of ['avif', 'webp']) {
      const out = path.join(outDir, `${p.slug}-${w}.${fmt}`);
      if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(file).mtimeMs) continue;
      const img = sharp(file).resize({ width: w, withoutEnlargement: true });
      await (fmt === 'avif' ? img.avif({ quality: 50, effort: 4 }) : img.webp({ quality: 74 })).toFile(out);
      written++;
    }
  }
  manifest[p.slug] = { w: srcW, h: srcH, widths };
  console.log(`${p.slug.padEnd(32)} ${srcW}x${srcH} → ${widths.join(', ')}`);
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${Object.keys(manifest).length} covers, ${written} files written → public/covers, manifest → src/showroom/covers.manifest.json`);
