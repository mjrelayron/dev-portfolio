// Static video library: replaces the old Railway `/api/videos/search` endpoint.
// public/data/videos.json is refreshed by the "Scrape videos" GitHub Action.

let libraryPromise = null;

export function loadVideoLibrary() {
  libraryPromise ??= fetch('/data/videos.json').then((r) => {
    if (!r.ok) throw new Error(`video library: ${r.status}`);
    return r.json();
  });
  return libraryPromise;
}

export function loadScrapeRuns() {
  return fetch('/data/scrape-runs.json', { cache: 'no-cache' }).then((r) => (r.ok ? r.json() : { runs: [] }));
}

/**
 * Same filtering and ordering as the old endpoint: tool, optional difficulty,
 * optional text query, quality_score >= 50, best first. Returns the old
 * response shape ({ videos, totalVideos, fromCache }).
 */
export async function searchVideos({ tool, query = '', difficulty = 'all' }) {
  const { videos } = await loadVideoLibrary();
  const q = query.trim().toLowerCase();
  const matches = videos
    .filter((v) => v.tool === tool)
    .filter((v) => !difficulty || difficulty === 'all' || v.difficulty === difficulty)
    .filter((v) => !q || `${v.title} ${v.description} ${v.channelTitle}`.toLowerCase().includes(q))
    .filter((v) => v.quality_score >= 50)
    .sort((a, b) => b.quality_score - a.quality_score || b.viewCount - a.viewCount)
    .map((v) => ({
      ...v,
      videoId: v.id,
      views: v.viewCount,
      duration_seconds: v.duration,
      video_url: `https://www.youtube.com/watch?v=${v.id}`,
      cached_at: v.scraped_at,
      source: 'scraped',
    }));
  return { videos: matches, totalVideos: matches.length, fromCache: true };
}
