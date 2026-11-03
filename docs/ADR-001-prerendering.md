# ADR-001 — Prerendering content routes

**Status:** accepted · **Date:** 2026-11-03

## Context
Content routes (`/`, `/projects`, 26 case studies, `/skills`, `/experience`, `/about`, `/contact`, `/resume`, `/lab`, `/os`, `/arcade`, `/classic`) must ship real HTML with per-route `<title>`, description, canonical, Open Graph/Twitter tags and JSON-LD. The app is a Vite + react-router 6 SPA with lazy routes, deployed on Vercel. The brief suggested `vite-react-ssg` or `vite-plugin-prerender`.

## Options
1. **vite-react-ssg** — replaces the app entry and router setup with its own route-config API and head manager. Couples the whole app to the plugin's react-router integration and its React 19 support at the time of writing; migrating the lead tools (which touch `window` at render) into its model would mean touching their code.
2. **vite-plugin-prerender** — snapshots pages in headless Chromium (Puppeteer). Unmaintained; needs a Chromium on the Vercel build image; flaky timing with animations.
3. **Own Vite SSR prerender (chosen)** — `vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs`. Each route is rendered with React 19's `prerenderToNodeStream` (waits for every `lazy()` route to resolve) inside `StaticRouter`; a tiny `<Seo>` context collects the head tags during render; the script writes `dist/<route>.html` (served by Vercel `cleanUrls`), `sitemap.xml` and `robots.txt`.

## Decision
Option 3. ~60 lines, no new dependency, runs in plain Node on Vercel, and the same `<Seo>` component updates `document.head` on client navigation.

## Consequences
- Route components must not touch `window`/`document`/storage during render; legacy tools stay lazy and inside `<ClientOnly>`.
- The client mounts with `createRoot` (not `hydrateRoot`): the static HTML is visible until JS takes over, and client-only differences (viewport, saved settings, intro flag) can't cause hydration errors. Cost: no partial hydration; acceptable for this site.
- Client-only routes not in the list (e.g. legacy redirects) fall back to the SPA rewrite in `vercel.json`.

# ADR-002 — Typed data files named `portfolio.ts` / `career.ts`

`api/chat.js` (the Gemini function) imports `src/data/experience.js` and `projects`-derived files. A sibling `experience.ts` / `projects.ts` would be shadowed (Vite resolves `.js` before `.ts`) or would invite breaking the API's imports. The typed layers therefore live in `src/data/portfolio.ts` (wraps `projects.js`) and `src/data/career.ts`; the `.js` files remain the content source of truth and are untouched.
