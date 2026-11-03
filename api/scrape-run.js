/* eslint-disable no-undef */
// POST /api/scrape-run — the Scraping Dashboard's "Run now" button.
// Starts the "Scrape videos" GitHub Action (workflow_dispatch).
//
// env: GITHUB_TOKEN — fine-grained token for this repo with "Actions: read and write".
//      GITHUB_REPO (optional, default mjrelayron/developerverse), GITHUB_REF (optional, default main)
// A 30-minute cooldown keeps visitors from burning the YouTube API quota.

const WORKFLOW = 'scrape-videos.yml';
const COOLDOWN_MS = 30 * 60 * 1000;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'mjrelayron/developerverse';
  const ref = process.env.GITHUB_REF || 'main';
  if (!token) return res.status(503).json({ error: 'not_configured', message: 'Manual runs are not switched on yet. The scraper still runs every night.' });

  const gh = (path, init = {}) =>
    fetch(`https://api.github.com/repos/${repo}${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...init.headers },
    });

  try {
    const latest = await gh(`/actions/workflows/${WORKFLOW}/runs?per_page=1`).then((r) => r.json());
    const last = latest.workflow_runs?.[0];
    if (last) {
      if (last.status !== 'completed') return res.status(409).json({ error: 'running', message: 'A run is already in progress.', url: last.html_url });
      const since = Date.now() - new Date(last.created_at).getTime();
      if (since < COOLDOWN_MS) {
        const mins = Math.ceil((COOLDOWN_MS - since) / 60000);
        return res.status(429).json({ error: 'cooldown', message: `The scraper ran recently. Try again in ${mins} min.`, retryInMinutes: mins });
      }
    }
    const r = await gh(`/actions/workflows/${WORKFLOW}/dispatches`, { method: 'POST', body: JSON.stringify({ ref, inputs: { trigger: 'dashboard' } }) });
    if (r.status !== 204) return res.status(502).json({ error: 'dispatch_failed', message: `GitHub answered ${r.status}.` });
    return res.status(202).json({ ok: true, message: 'Run started. New data appears here a few minutes after it finishes and the site redeploys.', url: `https://github.com/${repo}/actions/workflows/${WORKFLOW}` });
  } catch (err) {
    return res.status(500).json({ error: 'server_error', message: String(err?.message || err) });
  }
}
