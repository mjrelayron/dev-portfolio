# DEV-BOT — Rive file contract

The site ships an SVG DEV-BOT (`src/mascot/DevBotSvg.tsx`). When `public/rive/devbot.riv`
exists at build time, every `<DevBot>` switches to Rive automatically (`vite.config.js`
sets `__HAS_RIVE__`). **No code changes are needed** — add the file, commit, deploy.

If the file fails to load at runtime, the component falls back to the SVG.
Under `prefers-reduced-motion` the static SVG pose is always used.

## File
| Item | Name | Type | Notes |
|---|---|---|---|
| File | `public/rive/devbot.riv` | | keep under ~150 KB |
| Artboard | `DevBot` | ~512 × 512 | character centred, shadow inside the artboard, transparent background |
| State machine | `Main` | | autoplay |
| Input | `wave` | Trigger | right arm waves twice, returns to idle |
| Input | `celebrate` | Trigger | hop + spin, eyes squint happily (site adds its own confetti) |
| Input | `point` | Trigger | right arm extends forward-up and holds ~1.5 s |
| Input | `think` | Boolean | eyes look up, three dots pulse above the head while true |
| Input | `talk` | Boolean | visor rim glow pulses while true |
| Input | `lookX` | Number | −100 (left) … 100 (right); head turns up to ±12°, eyes shift further |
| Input | `lookY` | Number | −100 (up) … 100 (down) |
| Idle layer | always on | | blink every 3–6 s · float bob ±5 px over ~3.2 s · antenna tip glow pulse |

The site drives it like this (`src/mascot/DevBotRive.tsx`):
- `state` prop → fires `wave` / `celebrate` / `point`, sets `think` / `talk`.
- `lookAt` prop → `lookX` / `lookY` (the hub bot looks at the hovered island).

## Character (must match the SVG)
- Small rounded **white** body (soft blue-grey shading `#DCE6FA`), light-blue accents `#42BDF5` / `#8ED3F7`.
- **Rounded-rectangle head**, roughly 80 × 50 in a 120-wide frame, with side "ear" pods in `#42BDF5`.
- **Dark visor** `#141833` with a faint cyan rim; **two cyan glowing eyes** (`#5FF0FF` → `#14B8E6`), tall ovals.
- Short **antenna** with a glowing cyan tip.
- **No legs** — it floats; soft dark ellipse shadow below that shrinks as it rises.
- Short capsule arms. Friendly, simple, readable at 48 px.

## Sizes used on the site
`xs` 32 px (toasts) · `sm` 48 px · `md` 96 px (page headers, hub) · `lg` 180 px (intro, 404).
Design so the silhouette survives at 32 px: thick shapes, no thin detail lines.
