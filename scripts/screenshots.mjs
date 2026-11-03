// Screenshot routes at 390 / 768 / 1440 px against `vite preview`.
// usage: node scripts/screenshots.mjs <outDir> [route ...]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';

const [outDir = 'docs/screenshots/tmp', ...routesArg] = process.argv.slice(2);
const routes = routesArg.length ? routesArg : ['/world', '/projects', '/about', '/classic', '/404-test'];
const widths = [390, 768, 1440];
const PORT = 4179;

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
await new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(new Error('preview did not start')), 30000);
  server.stdout.on('data', (d) => d.toString().includes(String(PORT)) && (clearTimeout(t), resolve()));
});

fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();
const errors = [];
try {
  for (const w of widths) {
    const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : w < 1000 ? 1024 : 900 }, deviceScaleFactor: 1, hasTouch: w < 1000, isMobile: w < 600 });
    await ctx.addInitScript(() => {
      if (!sessionStorage.getItem('keep-intro')) localStorage.setItem('dv-settings', JSON.stringify({ state: { sound: false, introSeen: true }, version: 0 }));
    });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && errors.push(`[${w}] ${page.url()}: ${m.text()}`));
    page.on('response', (r) => r.status() >= 400 && errors.push(`[${w}] ${r.status()} ${r.url()}`));
    page.on('pageerror', (e) => errors.push(`[${w}] ${page.url()}: ${e.message}`));
    for (const r of routes) {
      await page.goto(`http://localhost:${PORT}${r}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1300);
      const name = `${(r.replace(/\//g, '_').replace(/^_/, '') || 'home')}-${w}.png`;
      await page.screenshot({ path: path.join(outDir, name) });
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  server.kill();
}
if (errors.length) {
  console.log('Console errors:\n' + [...new Set(errors)].join('\n'));
} else console.log('No console errors.');
console.log(`Saved to ${outDir}`);
