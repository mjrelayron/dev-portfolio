// Open Graph cards (1200×630): one per project from its built cover, plus a default.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > max) {
      lines.push(line.trim());
      line = w;
    } else line += ' ' + w;
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

const logo = `<g transform="translate(64 58) scale(1.6)"><path d="M16 3 L28 10 L16 17 L4 10 Z" fill="#9A94FF"/><path d="M4 10 L16 17 V29 L4 22 Z" fill="#6C63FF"/><path d="M28 10 L16 17 V29 L28 22 Z" fill="#4A42C7"/><circle cx="16" cy="10" r="2.4" fill="#FFAD5A"/></g>`;

function overlay({ eyebrow, title, sub }) {
  const titleLines = wrap(title, 22).slice(0, 2);
  const subLines = wrap(sub ?? '', 52).slice(0, 2);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#171B35" stop-opacity="0.98"/><stop offset="0.55" stop-color="#171B35" stop-opacity="0.9"/><stop offset="1" stop-color="#171B35" stop-opacity="0.15"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect x="0" y="0" width="${W}" height="8" fill="#6C63FF"/>
  ${logo}
  <text x="128" y="96" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="26" letter-spacing="4" fill="#FFFFFF">DEVELOPERVERSE</text>
  <text x="64" y="250" font-family="Consolas, 'Courier New', monospace" font-size="24" letter-spacing="4" fill="#FFAD5A">${esc(eyebrow.toUpperCase())}</text>
  ${titleLines.map((l, i) => `<text x="64" y="${330 + i * 78}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="72" fill="#FFFFFF">${esc(l)}</text>`).join('')}
  ${subLines.map((l, i) => `<text x="64" y="${330 + titleLines.length * 78 + 20 + i * 38}" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#C4C8E8">${esc(l)}</text>`).join('')}
  <text x="64" y="${H - 50}" font-family="Consolas, 'Courier New', monospace" font-size="22" fill="#959BC7">MJR ELAYRON · FULL-STACK DEVELOPER</text>
</svg>`);
}

export async function buildOgImages({ dist, projects, profile }) {
  const out = path.join(dist, 'og');
  fs.mkdirSync(out, { recursive: true });
  const navy = { r: 23, g: 27, b: 53, alpha: 1 };

  await sharp({ create: { width: W, height: H, channels: 4, background: navy } })
    .composite([{ input: overlay({ eyebrow: 'Build. Explore. Experience.', title: profile.name, sub: profile.headline }) }])
    .png()
    .toFile(path.join(out, 'default.png'));

  let n = 0;
  for (const p of projects) {
    const src = p.cover && path.join(dist, decodeURIComponent(p.cover.replace(/^\//, '')));
    const base = src && fs.existsSync(src) ? sharp(src).resize(W, H, { fit: 'cover', position: 'attention' }) : sharp({ create: { width: W, height: H, channels: 4, background: navy } });
    await base
      .composite([{ input: overlay({ eyebrow: `${p.category}${p.year ? ' · ' + p.year : ''}`, title: p.title, sub: p.subtitle ?? p.summary }) }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(out, `${p.slug}.jpg`));
    n++;
  }
  return n;
}
