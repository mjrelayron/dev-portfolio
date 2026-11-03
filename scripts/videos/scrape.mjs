// Refresh public/data/videos.json from the YouTube Data API and append a run
// record to public/data/scrape-runs.json. Run by .github/workflows/scrape-videos.yml.
//
// env: YOUTUBE_API_KEY (required), TRIGGER (schedule|manual|...), RUN_URL (optional)
// Quota: 6 searches (100 units each) + a few videos.list calls ≈ 610 of the 10,000 daily units.
import { TOOLS, DIFFICULTIES, VIDEOS_FILE, RUNS_FILE, readJson, writeJson, guessDifficulty, qualityScore } from './lib.mjs';

const KEY = process.env.YOUTUBE_API_KEY;
const TRIGGER = process.env.TRIGGER || 'manual';
const RUN_URL = process.env.RUN_URL || null;
const PER_SEARCH = 25;
const MAX_PER_TOOL = 400;
const MAX_RUNS = 40;

const queries = {
  beginner: (t) => `${t} tutorial for beginners`,
  intermediate: (t) => `${t} workflow automation tutorial`,
  advanced: (t) => `${t} advanced automation`,
};

const isoDuration = (d) => {
  const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(d || '') || [];
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
};

async function yt(path, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [k, v] of Object.entries({ ...params, key: KEY })) url.searchParams.set(k, String(v));
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error?.message || `YouTube API ${res.status}`);
  return body;
}

async function scrape() {
  const found = new Map(); // id -> { tool, difficulty hint }
  for (const tool of TOOLS) {
    for (const level of DIFFICULTIES) {
      const r = await yt('search', { part: 'id', type: 'video', q: queries[level](tool), maxResults: PER_SEARCH, relevanceLanguage: 'en', videoDuration: 'medium' });
      for (const item of r.items ?? []) if (item.id?.videoId && !found.has(item.id.videoId)) found.set(item.id.videoId, { tool });
    }
  }
  const ids = [...found.keys()];
  const videos = [];
  for (let i = 0; i < ids.length; i += 50) {
    const r = await yt('videos', { part: 'snippet,contentDetails,statistics', id: ids.slice(i, i + 50).join(',') });
    for (const v of r.items ?? []) {
      const s = v.snippet;
      const base = {
        id: v.id,
        title: s.title,
        description: (s.description || '').slice(0, 500),
        thumbnail: s.thumbnails?.maxres?.url || s.thumbnails?.high?.url || `https://img.youtube.com/vi/${v.id}/mqdefault.jpg`,
        channelTitle: s.channelTitle,
        duration: isoDuration(v.contentDetails?.duration),
        viewCount: Number(v.statistics?.viewCount) || 0,
        tool: found.get(v.id).tool,
        published_at: s.publishedAt,
        scraped_at: new Date().toISOString(),
      };
      const mentionsTool = `${base.title} ${base.description}`.toLowerCase().includes(base.tool);
      if (!mentionsTool) continue;
      videos.push({
        ...base,
        difficulty: guessDifficulty(base.title, base.description),
        quality_score: qualityScore({ ...base, durationSec: base.duration, publishedAt: base.published_at }),
      });
    }
  }
  return videos;
}

const startedAt = new Date().toISOString();
const library = readJson(VIDEOS_FILE, { videos: [] });
const runs = readJson(RUNS_FILE, { runs: [] });
const record = { id: `run-${Date.now()}`, startedAt, trigger: TRIGGER, url: RUN_URL };

try {
  if (!KEY) throw new Error('YOUTUBE_API_KEY secret is not set on the repository.');
  const fresh = await scrape();
  const byId = new Map(library.videos.map((v) => [v.id, v]));
  let added = 0;
  let updated = 0;
  for (const v of fresh) {
    const old = byId.get(v.id);
    if (old) {
      // keep the original classification; refresh the moving numbers
      byId.set(v.id, { ...old, viewCount: v.viewCount, title: v.title, thumbnail: v.thumbnail, scraped_at: v.scraped_at });
      updated++;
    } else {
      byId.set(v.id, v);
      added++;
    }
  }
  // cap each tool's library, best first
  const videos = TOOLS.flatMap((t) =>
    [...byId.values()]
      .filter((v) => v.tool === t)
      .sort((a, b) => b.quality_score - a.quality_score || b.viewCount - a.viewCount)
      .slice(0, MAX_PER_TOOL),
  );
  writeJson(VIDEOS_FILE, { updatedAt: new Date().toISOString(), count: videos.length, videos });
  Object.assign(record, {
    status: 'success',
    found: fresh.length,
    added,
    updated,
    total: videos.length,
    perTool: Object.fromEntries(TOOLS.map((t) => [t, videos.filter((v) => v.tool === t).length])),
  });
  console.log(`found ${fresh.length}, added ${added}, updated ${updated}, library ${videos.length}`);
} catch (err) {
  Object.assign(record, { status: 'failed', error: String(err.message || err), total: library.videos.length });
  console.error('scrape failed:', record.error);
  process.exitCode = 1;
} finally {
  record.finishedAt = new Date().toISOString();
  writeJson(RUNS_FILE, { runs: [record, ...runs.runs].slice(0, MAX_RUNS) });
}
