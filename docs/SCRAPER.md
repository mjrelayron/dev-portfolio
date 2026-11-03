# Video scraper (no Railway)

Workflow Challenger and the Scraping Dashboard used to call a Node + Postgres
backend on Railway. That app no longer exists, so the site now reads two static
files that a GitHub Action keeps fresh:

| File | Written by | Read by |
|---|---|---|
| `public/data/videos.json` | `scripts/videos/scrape.mjs` | Workflow Challenger (`src/lib/videoLibrary.js`), Scraping Dashboard |
| `public/data/scrape-runs.json` | same | Scraping Dashboard run history |

The library was seeded from the last database export (`youtube-scraper-app/scraped_videos_export.csv`,
375 videos) with `node scripts/videos/import-csv.mjs`.

## How a refresh happens
1. `.github/workflows/scrape-videos.yml` runs nightly at 03:17 UTC (and on demand).
2. It searches the YouTube Data API for n8n and Zapier tutorials (6 searches ≈ 610 of the
   10,000 free daily quota units), scores each video 0–100, and merges results into the library
   (max 400 per tool; videos under 50 are hidden).
3. It commits the two JSON files as the site owner, so Vercel deploys the update.
   Failed runs are recorded too, with the reason.

Scheduled runs only start once the workflow is on the default branch (after merging).

## Setup (one-time)
1. **Repo secret `YOUTUBE_API_KEY`** — GitHub → Settings → Secrets and variables → Actions.
   A YouTube Data API v3 key from Google Cloud. Restrict it to the YouTube Data API.
2. **Optional "Run now" button** — Vercel → Project → Environment Variables: `GITHUB_TOKEN`, a
   fine-grained token for this repo with **Actions: Read and write**. Without it the button explains
   that manual runs are off; the nightly schedule still works. Runs have a 30-minute cooldown.

## Not used any more
`backend/` and the old `scripts/scraper.py` are kept for reference but the site no longer calls them.
