# Repo audit — DEVELOPERVERSE rebuild

Baseline taken on `main` @ `d785f39`, before any change.

## Baseline build
- `npm install` OK (warning: local Node 20.18.0 < Vite 7's required 20.19 — works, but upgrade Node locally; Vercel uses 22.x).
- `npm run build` **passes**. One JS chunk of 1,070 kB (302 kB gzip), 221 kB CSS, ~45 css-syntax warnings from daisyUI 5 running on Tailwind 3.
- No lint/test step in CI.

## Security
- 🔴 `.env` (containing `GEMINI_API_KEY`) was committed and the repo is **public**. It has been in history since `ffe5ced`.
  Untracked now (`git rm --cached .env`), `.env.example` added. **The key must be rotated** — removing it from the tree does not remove it from history.
- `VITE_YOUTUBE_API_KEY` is a client-side var and ends up in the browser bundle. Restrict it by HTTP referrer in Google Cloud.
- EmailJS public key + service/template IDs are hardcoded in `ContactSection.jsx` (these are public by design; fine).

## Findings
| Area | Finding | Action |
|---|---|---|
| Styling | MUI 7, Emotion, `@mui/lab`, `@mui/icons-material` have **zero imports** | remove |
| Styling | daisyUI 5 is incompatible with Tailwind 3 (css warnings); classes `btn`/`card`/`modal` overlap with custom `App.css` | remove plugin once tools are re-homed |
| Styling | `index.css` applies `transition` to `*` (incl. `transform`) — fights every animation | replaced by `styles/globals.css` |
| Styling | `App.css` (2,660 lines) holds both landing-page and tool styles, globally | scoped into a `ToolShell` for the lead tools |
| Theme | `next-themes` light/dark toggle | replaced by single dark navy theme |
| Data | `api/chat.js` imports `src/data/ai-context.js`, `bot-data.js`, `experience.js` | **keep those files and their exports unchanged** |
| Data | Several projects have placeholder repo URLs (`github.com/username/...`) | never rendered — filtered in the data layer |
| Links | Resume links pointed at `/src/assets/Resume.pdf` (404 in production) | moved to `public/resume/` |
| Media | 36 MB of video bundled through `src/assets` | moved to `public/media/` |
| Media | FitSync / IX Solutions / WhosIn / covers were PNG/JPG | converted to WebP (`npm run convert-images`, extended) |
| Routing | No `vercel.json` → refreshing a deep route 404s | SPA rewrite added (excludes `/api`, static files) |
| Repo | Dev scripts and planning docs in root, three `*.backup.*` files | moved to `scripts/dev/`, `docs/`; backups deleted (grep: no importers) |

## Keep / refactor / replace
- **Keep (logic untouched, restyled):** ChatWidget, AIChatPage, ServiceSelector, 4 simulators, 4 quote generators, ProcessPage, WorkflowChallenger, ScrapingDashboard, ContactSection (EmailJS), LightboxGallery, ProjectModal, EnglishPracticePage, `api/`, `backend/`, `youtube-scraper-app/`.
- **Refactor:** `data/projects.js` → typed model in `data/projects.ts` that wraps it (no content rewritten).
- **Replace:** App.jsx single-page landing (Hero, About, Projects, DigitalMarketing sections, Navigation, AnimatedBackground, PhysicsParticleSystem, ThemeToggle) → hub map + routed pages.

## Dependency changes
- Add: `@rive-app/react-canvas`, `zustand`, `gsap`, `@fontsource-variable/*` (3), `canvas-confetti`, `howler`, `typescript`, `@playwright/test` (dev).
- Remove (after zero-import check): `@mui/*`, `@emotion/*`, `next-themes`, `daisyui`, `@headlessui/react` if unused.

## Risks
- Lead tools are large (700–1,000 lines each) and styled with hard-coded Tailwind colours; restyle is token-level, not a redesign.
- Prerendering requires every route component to render in Node; tools that touch `window` at render stay lazy and client-only.
- `dev:api` proxy targets the production domain `mjre-portfolio.vercel.app` for `/api` in dev — unchanged.
