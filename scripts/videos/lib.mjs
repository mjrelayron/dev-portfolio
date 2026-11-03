// Shared helpers for the static video library (public/data/videos.json).
import fs from 'node:fs';

export const VIDEOS_FILE = 'public/data/videos.json';
export const RUNS_FILE = 'public/data/scrape-runs.json';
export const TOOLS = ['n8n', 'zapier'];
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

/** RFC 4180 CSV parser (quoted fields may contain commas, quotes and newlines). */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  const [head, ...body] = rows;
  return body.filter((r) => r.length === head.length).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

const words = (s) => (s || '').toLowerCase();
const has = (text, list) => list.some((w) => text.includes(w));

/** Difficulty from title/description keywords (same buckets as the old scraper). */
export function guessDifficulty(title, description) {
  const t = words(`${title} ${description}`);
  if (has(t, ['expert', 'advanced', 'complex', 'sophisticated', 'masterclass'])) return 'advanced';
  if (has(t, ['beginner', 'basic', 'getting started', 'introduction', 'first time', 'for dummies', 'from scratch'])) return 'beginner';
  return 'intermediate';
}

/**
 * 0–100 quality score modeled on the old scraper's weighting:
 * views, tutorial signals, sensible length, recency. Videos under 50 are hidden.
 */
export function qualityScore({ title, description, viewCount, durationSec, publishedAt }) {
  const t = words(`${title} ${description}`);
  let s = 0;
  s += Math.min(30, Math.log10(Math.max(1, viewCount)) * 6); // 1M views ≈ 30
  if (has(t, ['tutorial', 'step-by-step', 'step by step', 'how to', 'guide', 'walkthrough', 'build'])) s += 18;
  if (has(t, ['workflow', 'automation', 'automate', 'agent', 'integration'])) s += 12;
  if (has(t, ['example', 'template', 'use case', 'real-world', 'project'])) s += 8;
  if (durationSec >= 300 && durationSec <= 3600) s += 17;
  else if (durationSec > 120) s += 8;
  const ageDays = (Date.now() - new Date(publishedAt).getTime()) / 86_400_000;
  s += ageDays < 365 ? 15 : ageDays < 730 ? 8 : 2;
  if (has(t, ['#shorts', 'reaction', 'giveaway'])) s -= 25;
  return Math.max(0, Math.min(100, Math.round(s)));
}

export function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(file.replace(/\/[^/]+$/, ''), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 0) + '\n');
}
