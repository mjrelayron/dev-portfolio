// One-off: turn the last database export (youtube-scraper-app/scraped_videos_export.csv)
// into the static library the site reads. Run: node scripts/videos/import-csv.mjs
import fs from 'node:fs';
import { parseCsv, writeJson, VIDEOS_FILE, RUNS_FILE } from './lib.mjs';

const rows = parseCsv(fs.readFileSync('youtube-scraper-app/scraped_videos_export.csv', 'utf8'));
const toIso = (s) => (s ? new Date(s.replace(' ', 'T') + (s.includes('+') ? '' : 'Z')).toISOString() : null);
const thumb = (r) => (r.thumbnail_url && r.thumbnail_url !== 'NA' ? r.thumbnail_url : `https://img.youtube.com/vi/${r.video_id}/mqdefault.jpg`);

const videos = rows.map((r) => ({
  id: r.video_id,
  title: r.title,
  description: (r.description || '').slice(0, 500),
  thumbnail: thumb(r),
  channelTitle: r.channel,
  duration: Number(r.duration) || 0,
  viewCount: Number(r.view_count) || 0,
  difficulty: r.difficulty,
  tool: r.tool,
  quality_score: Number(r.quality_score) || 0,
  published_at: toIso(r.published_at),
  scraped_at: toIso(r.scraped_at),
}));

const updatedAt = videos.reduce((m, v) => (v.scraped_at > m ? v.scraped_at : m), '');
writeJson(VIDEOS_FILE, { updatedAt, count: videos.length, videos });
writeJson(RUNS_FILE, {
  runs: [
    {
      id: 'import-railway-export',
      startedAt: updatedAt,
      finishedAt: updatedAt,
      trigger: 'import',
      status: 'success',
      note: 'Imported the last export of the old Railway database.',
      found: videos.length,
      added: videos.length,
      updated: 0,
      total: videos.length,
      perTool: Object.fromEntries(['n8n', 'zapier'].map((t) => [t, videos.filter((v) => v.tool === t).length])),
    },
  ],
});
console.log(`wrote ${videos.length} videos → ${VIDEOS_FILE} (${(fs.statSync(VIDEOS_FILE).size / 1024).toFixed(0)} KB)`);
