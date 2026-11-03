// Static snapshot of every content route (SEO + fast first paint).
// Runs after `vite build` (client) and `vite build --ssr` (server entry).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, headTags, prerenderPaths } = await import(pathToFileURL(path.resolve('dist-ssr/entry-server.js')).href);
const SITE = 'https://mjre-portfolio.vercel.app';

const paths = prerenderPaths();
let ok = 0;
for (const url of paths) {
  try {
    const { html, seo } = await render(url);
    const head = seo ? headTags(seo) : '';
    const page = template.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, head).replace('<!--app-->', html);
    // /projects -> dist/projects.html (vercel cleanUrls serves it at /projects)
    const file = url === '/' ? path.join(dist, 'index.html') : path.join(dist, `${url.slice(1)}.html`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, page);
    ok++;
  } catch (err) {
    console.error(`✗ ${url}: ${err?.stack ?? err}`);
    process.exitCode = 1;
  }
}

// SPA shell for client-only routes (keeps the default head)
fs.writeFileSync(path.join(dist, '200.html'), template.replace('<!--app-->', ''));

const today = new Date().toISOString().slice(0, 10);
const indexable = paths.filter((p) => p !== '/world');
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable
    .map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerendered ${ok}/${paths.length} routes`);
