export type GameSlug = 'stack-builder' | 'bug-hunter' | 'project-explorer' | 'workflow-challenger';

export interface GameMeta {
  slug: GameSlug;
  name: string;
  tagline: string;
  blurb: string;
  accent: 'violet' | 'sky' | 'orange' | 'mint';
  controls: string;
  /** localStorage key of the best score, if the game keeps one */
  bestKey?: string;
  bestLabel?: (n: number) => string;
}

export const games: GameMeta[] = [
  {
    slug: 'stack-builder',
    name: 'Stack Builder',
    tagline: 'Physics · one-button',
    blurb: 'Drop tech blocks off a swinging crane and build the tallest stack you can. One wobble too many and it all comes down.',
    accent: 'orange',
    controls: 'Tap, click or Space',
    bestKey: 'dv-stack-best',
    bestLabel: (n) => `Best ${n} floor${n === 1 ? '' : 's'}`,
  },
  {
    slug: 'bug-hunter',
    name: 'Bug Hunter',
    tagline: 'Code puzzle · 10 rounds',
    blurb: 'Ten short JavaScript, React, Python and SQL snippets. Each hides exactly one bug — tap the guilty line.',
    accent: 'mint',
    controls: 'Tap a line or use Tab + Enter',
    bestKey: 'dv-bug-best',
    bestLabel: (n) => `Best ${n}/10`,
  },
  {
    slug: 'project-explorer',
    name: 'Project Explorer',
    tagline: 'Scavenger hunt',
    blurb: 'Read a clue, head into the Project District and find the matching case study. Every clue comes from a real project.',
    accent: 'violet',
    controls: 'Start a mission, then explore',
  },
  {
    slug: 'workflow-challenger',
    name: 'Workflow Challenger',
    tagline: 'Automation dojo',
    blurb: 'Pick an automation tool and work through curated tutorials and real-world workflow challenges.',
    accent: 'sky',
    controls: 'Pick a tool to begin',
  },
];

export const gameBySlug = Object.fromEntries(games.map((g) => [g.slug, g])) as Record<GameSlug, GameMeta>;

/** localStorage helpers that never throw (private mode, prerender). */
export function readBest(key: string): number {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}
export function writeBest(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* storage unavailable */
  }
}
