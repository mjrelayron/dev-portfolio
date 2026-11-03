import { useEffect, useMemo, useState } from 'react';
import { Play, RefreshCw, CheckCircle2, XCircle, Clock, ExternalLink, Database, Radar, CalendarClock, Github } from 'lucide-react';
import { loadVideoLibrary, loadScrapeRuns } from '../lib/videoLibrary';
import { Skeleton } from '../components/ui/Skeleton';
import { playSound } from '../hooks/useSound';
import './scrape.css';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  viewCount: number;
  difficulty: string;
  tool: string;
  quality_score: number;
  scraped_at: string;
}
interface Run {
  id: string;
  startedAt: string;
  finishedAt?: string;
  trigger: string;
  status: 'success' | 'failed';
  found?: number;
  added?: number;
  updated?: number;
  total?: number;
  error?: string;
  note?: string;
  url?: string | null;
}

const REPO_ACTIONS = 'https://github.com/mjrelayron/dev-portfolio/actions/workflows/scrape-videos.yml';
const nf = new Intl.NumberFormat('en');
const LABELS: Record<string, string> = { n8n: 'n8n', zapier: 'Zapier', beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
const ago = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
};
const when = (iso: string) => new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
/** next 03:17 UTC */
function nextRun(): Date {
  const d = new Date();
  const n = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 3, 17));
  if (n <= d) n.setUTCDate(n.getUTCDate() + 1);
  return n;
}

type RunState = { kind: 'idle' } | { kind: 'busy' } | { kind: 'ok' | 'info' | 'error'; message: string; url?: string };

export default function ScrapeDashboard() {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [runs, setRuns] = useState<Run[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [runState, setRunState] = useState<RunState>({ kind: 'idle' });

  useEffect(() => {
    loadVideoLibrary()
      .then((d: { videos: Video[]; updatedAt: string }) => {
        setVideos(d.videos);
        setUpdatedAt(d.updatedAt);
      })
      .catch(() => setLoadError(true));
    loadScrapeRuns().then((d: { runs: Run[] }) => setRuns(d.runs ?? []));
  }, []);

  const stats = useMemo(() => {
    if (!videos) return null;
    const by = (key: 'tool' | 'difficulty') => videos.reduce<Record<string, number>>((m, v) => ((m[v[key]] = (m[v[key]] ?? 0) + 1), m), {});
    const avg = videos.length ? Math.round(videos.reduce((a, v) => a + v.quality_score, 0) / videos.length) : 0;
    const views = videos.reduce((a, v) => a + v.viewCount, 0);
    return { total: videos.length, tools: by('tool'), levels: by('difficulty'), avg, views };
  }, [videos]);

  const newest = useMemo(() => (videos ? [...videos].sort((a, b) => (b.scraped_at > a.scraped_at ? 1 : -1)).slice(0, 6) : []), [videos]);
  const lastRun = runs?.[0];

  const runNow = async () => {
    playSound('pop');
    setRunState({ kind: 'busy' });
    try {
      const res = await fetch('/api/scrape-run', { method: 'POST' });
      const body = await res.json().catch(() => ({}));
      if (res.ok) setRunState({ kind: 'ok', message: body.message, url: body.url });
      else if (res.status === 429 || res.status === 409 || res.status === 503) setRunState({ kind: 'info', message: body.message, url: body.url ?? REPO_ACTIONS });
      else setRunState({ kind: 'error', message: body.message || `Couldn't start a run (${res.status}).` });
    } catch {
      setRunState({ kind: 'error', message: 'Couldn’t reach the run endpoint. The nightly schedule still runs.' });
    }
  };

  return (
    <div className="scr">
      {/* status strip */}
      <section className="scr-status panel" aria-label="Scraper status">
        <div className="scr-status__item">
          <span className={`scr-dot ${lastRun?.status === 'failed' ? 'is-bad' : 'is-good'}`} aria-hidden />
          <div>
            <p className="mono-label text-ink-3">Last run</p>
            <p className="font-display font-bold">
              {lastRun ? (
                <>
                  {lastRun.status === 'success' ? 'Succeeded' : 'Failed'} · <span className="text-ink-2">{ago(lastRun.finishedAt ?? lastRun.startedAt)}</span>
                </>
              ) : runs ? (
                'No runs yet'
              ) : (
                <Skeleton className="h-4 w-32" />
              )}
            </p>
          </div>
        </div>
        <div className="scr-status__item">
          <CalendarClock size={18} aria-hidden className="text-mint" />
          <div>
            <p className="mono-label text-ink-3">Next scheduled</p>
            <p className="font-display font-bold">{when(nextRun().toISOString())}</p>
          </div>
        </div>
        <div className="scr-status__item">
          <Database size={18} aria-hidden className="text-sky" />
          <div>
            <p className="mono-label text-ink-3">Library updated</p>
            <p className="font-display font-bold">{updatedAt ? ago(updatedAt) : <Skeleton className="h-4 w-24" />}</p>
          </div>
        </div>
        <div className="scr-status__actions">
          <button type="button" className="btn-3d scr-run" onClick={runNow} disabled={runState.kind === 'busy'}>
            {runState.kind === 'busy' ? <RefreshCw size={16} aria-hidden className="animate-spin" /> : <Play size={16} aria-hidden />}
            {runState.kind === 'busy' ? 'Starting…' : 'Run now'}
          </button>
          <a href={REPO_ACTIONS} target="_blank" rel="noreferrer noopener" className="btn-3d btn-3d--ghost btn-3d--sm">
            <Github size={15} aria-hidden /> Runs on GitHub <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
        <div aria-live="polite" className="scr-status__msg">
          {'message' in runState && (
            <p className={`scr-msg scr-msg--${runState.kind}`}>
              {runState.message}{' '}
              {runState.url && (
                <a href={runState.url} target="_blank" rel="noreferrer noopener" className="underline">
                  View on GitHub
                </a>
              )}
            </p>
          )}
        </div>
      </section>

      {loadError && <p className="scr-msg scr-msg--error mt-4">The video library couldn’t be loaded. Refresh to try again.</p>}

      {/* library stats */}
      <section className="mt-6" aria-labelledby="scr-lib">
        <h2 id="scr-lib" className="scr-h2">
          <Radar size={18} aria-hidden /> Library
        </h2>
        <div className="scr-stats">
          {[
            ['Videos', stats ? nf.format(stats.total) : null],
            ['Combined views', stats ? nf.format(stats.views) : null],
            ['Avg. quality', stats ? `${stats.avg}/100` : null],
            ['Runs recorded', runs ? String(runs.length) : null],
          ].map(([label, value]) => (
            <div key={label} className="scr-stat panel">
              <p className="mono-label text-ink-3">{label}</p>
              <p className="scr-stat__value">{value ?? <Skeleton className="mt-1 h-7 w-20" />}</p>
            </div>
          ))}
        </div>
        {stats && (
          <div className="scr-bars panel">
            {[
              ['By tool', stats.tools],
              ['By level', stats.levels],
            ].map(([title, map]) => (
              <div key={title as string}>
                <p className="mono-label text-ink-3">{title as string}</p>
                <ul className="mt-2 space-y-2">
                  {Object.entries(map as Record<string, number>)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, n]) => (
                      <li key={k} className="scr-bar">
                        <span className="scr-bar__label">{LABELS[k] ?? k}</span>
                        <span className="scr-bar__track" aria-hidden>
                          <span className="scr-bar__fill" style={{ width: `${(n / stats.total) * 100}%` }} />
                        </span>
                        <span className="scr-bar__n">{n}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* run history */}
      <section className="mt-6" aria-labelledby="scr-runs">
        <h2 id="scr-runs" className="scr-h2">
          <Clock size={18} aria-hidden /> Run history
        </h2>
        <div className="panel overflow-x-auto">
          <table className="scr-table">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Trigger</th>
                <th scope="col">Result</th>
                <th scope="col" className="text-right">Found</th>
                <th scope="col" className="text-right">New</th>
                <th scope="col" className="text-right">Updated</th>
                <th scope="col" className="text-right">Library</th>
              </tr>
            </thead>
            <tbody>
              {!runs &&
                [0, 1, 2].map((i) => (
                  <tr key={i}>
                    <td colSpan={7}>
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {runs?.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 hover:underline">
                        {when(r.startedAt)} <ExternalLink size={12} aria-hidden />
                      </a>
                    ) : (
                      when(r.startedAt)
                    )}
                  </td>
                  <td className="capitalize">{r.trigger}</td>
                  <td>
                    {r.status === 'success' ? (
                      <span className="scr-pill scr-pill--ok">
                        <CheckCircle2 size={13} aria-hidden /> Success
                      </span>
                    ) : (
                      <span className="scr-pill scr-pill--bad" title={r.error}>
                        <XCircle size={13} aria-hidden /> Failed
                      </span>
                    )}
                    {(r.note || r.error) && <p className="mt-1 text-xs text-ink-3">{r.note || r.error}</p>}
                  </td>
                  <td className="text-right">{r.found ?? '–'}</td>
                  <td className="text-right">{r.added ?? '–'}</td>
                  <td className="text-right">{r.updated ?? '–'}</td>
                  <td className="text-right">{r.total ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* newest videos */}
      <section className="mt-6" aria-labelledby="scr-new">
        <h2 id="scr-new" className="scr-h2">Newest in the library</h2>
        <ul className="scr-videos">
          {!videos && [0, 1, 2].map((i) => <li key={i}><Skeleton className="aspect-video w-full rounded-xl" /></li>)}
          {newest.map((v) => (
            <li key={v.id}>
              <a href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer noopener" className="scr-video panel">
                <img src={v.thumbnail} alt="" width={480} height={270} loading="lazy" decoding="async" className="scr-video__img" />
                <div className="p-3">
                  <p className="line-clamp-2 text-[0.92rem] font-semibold leading-snug text-ink">{v.title}</p>
                  <p className="mt-1 text-xs text-ink-3">
                    {v.channelTitle} · {nf.format(v.viewCount)} views
                  </p>
                  <p className="mono-label mt-2 flex gap-2 text-ink-3">
                    <span>{v.tool}</span>·<span>{v.difficulty}</span>·<span className="text-mint">Q{v.quality_score}</span>
                  </p>
                </div>
                <span className="sr-only">(opens YouTube in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-6 text-sm text-ink-3">
        How it works: a GitHub Action searches YouTube every night for n8n and Zapier tutorials, scores each video (views, tutorial signals, length,
        freshness), merges them into <code className="font-mono">/data/videos.json</code> and logs the run here. The site redeploys with the new data, and
        Workflow Challenger reads the same file.
      </p>
    </div>
  );
}
