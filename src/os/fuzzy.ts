/**
 * Tiny subsequence fuzzy scorer: every query char must appear in order.
 * Rewards consecutive runs, word starts and an early first match.
 * Returns -Infinity for no match.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const t = text.toLowerCase();
  if (t.includes(q)) return 1000 - t.indexOf(q) * 2 - t.length * 0.1 + (t.startsWith(q) ? 200 : 0);
  let score = 0;
  let ti = 0;
  let run = 0;
  for (const ch of q) {
    if (ch === ' ') continue;
    const found = t.indexOf(ch, ti);
    if (found === -1) return -Infinity;
    const wordStart = found === 0 || /[\s\-_/.]/.test(t[found - 1]);
    run = found === ti ? run + 1 : 0;
    score += 10 + run * 8 + (wordStart ? 12 : 0) - Math.min(found - ti, 10);
    ti = found + 1;
  }
  return score - t.length * 0.1;
}
