import { Fragment, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile } from '../data/profile';
import { sortedProjects, projectBySlug } from '../data/portfolio';
import { skillGroups } from '../data/skills';
import { experience } from '../data/career';
import { useOs } from './OsContext';
import type { AppId } from '../store/useWindows';
import { playSound } from '../hooks/useSound';

type Line = { id: number; kind: 'in' | 'out' | 'err' | 'ok'; body: ReactNode };

const COMMANDS: { name: string; usage?: string; desc: string }[] = [
  { name: 'help', desc: 'list commands' },
  { name: 'about', desc: 'who built this verse' },
  { name: 'projects', desc: 'list every project (slug · title · category)' },
  { name: 'skills', desc: 'tech stack by group, with evidence level' },
  { name: 'experience', desc: 'career timeline' },
  { name: 'resume', desc: 'résumé link + open the Resume app' },
  { name: 'contact', desc: 'email, phone and profiles' },
  { name: 'open', usage: 'open <slug>', desc: 'open a case study (Tab completes slugs)' },
  { name: 'ls', usage: 'ls [projects]', desc: 'list what lives here' },
  { name: 'whoami', desc: 'print the current user' },
  { name: 'history', desc: 'commands you ran this session' },
  { name: 'clear', desc: 'clear the screen' },
  { name: 'exit', desc: 'close the terminal' },
];
const COMMAND_NAMES = [...COMMANDS.map((c) => c.name), 'sudo'];
const SLUGS = sortedProjects.map((p) => p.slug);
const APP_ALIASES: Record<string, AppId> = {
  about: 'about',
  projects: 'projects',
  skills: 'skills',
  stack: 'skills',
  experience: 'experience',
  resume: 'resume',
  contact: 'contact',
};

function distance(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}
const closest = (word: string, list: string[]) => {
  const best = list.map((c) => [c, distance(word, c)] as const).sort((x, y) => x[1] - y[1])[0];
  return best && best[1] <= 2 ? best[0] : null;
};

const Hl = ({ children, c = 'mint' }: { children: ReactNode; c?: 'mint' | 'sky' | 'orange' | 'violet' | 'gold' | 'dim' }) => (
  <span className={`term-${c}`}>{children}</span>
);

function Banner() {
  return (
    <div>
      <p>
        <Hl c="violet">DEVELOPERVERSE OS</Hl> <Hl c="dim">· shell for {profile.fullName}</Hl>
      </p>
      <p className="term-dim">
        Type <Hl>help</Hl> to see commands. <Hl>Tab</Hl> completes, <Hl>↑</Hl>/<Hl>↓</Hl> walks history.
      </p>
    </div>
  );
}

let lineId = 1;

export default function Terminal() {
  const navigate = useNavigate();
  const os = useOs();
  const [lines, setLines] = useState<Line[]>(() => [{ id: lineId++, kind: 'out', body: <Banner /> }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const print = (...bodies: (ReactNode | [Line['kind'], ReactNode])[]) =>
    setLines((ls) => [
      ...ls,
      ...bodies.map((b) => (Array.isArray(b) && b.length === 2 && typeof b[0] === 'string' && ['out', 'err', 'ok', 'in'].includes(b[0] as string)
        ? { id: lineId++, kind: b[0] as Line['kind'], body: b[1] }
        : { id: lineId++, kind: 'out' as const, body: b as ReactNode })),
    ]);

  const SlugBtn = ({ slug }: { slug: string }) => (
    <button type="button" className="term-link" onClick={() => run(`open ${slug}`)}>
      {slug}
    </button>
  );

  const openSlug = (slug: string) => {
    const p = projectBySlug[slug];
    if (p) {
      print(['ok', <>Opening case study <Hl c="sky">{p.title}</Hl> → /projects/{slug}</>]);
      setTimeout(() => navigate(`/projects/${slug}`), 350);
      return;
    }
    const app = APP_ALIASES[slug];
    if (app) {
      os.openApp(app);
      print(['ok', <>Opening {slug}…</>]);
      return;
    }
    const guess = closest(slug, SLUGS);
    os.openApp('projects');
    print(['err', <>No project called “{slug}”.{guess && <> Did you mean <SlugBtn slug={guess} />?</>} Opened My Projects so you can browse.</>]);
  };

  function exec(raw: string): void {
    const [cmd = '', ...args] = raw.trim().split(/\s+/);
    const arg = args.join(' ');
    switch (cmd.toLowerCase()) {
      case '':
        return;
      case 'help':
        return print(
          <div className="term-grid">
            {COMMANDS.map((c) => (
              <Fragment key={c.name}>
                <Hl>{c.usage ?? c.name}</Hl>
                <span className="term-dim">{c.desc}</span>
              </Fragment>
            ))}
          </div>,
        );
      case 'about':
        return print(
          <div>
            <p>
              <Hl c="gold">{profile.fullName}</Hl> <Hl c="dim">({profile.name})</Hl>
            </p>
            <p>{profile.headline}</p>
            <p className="term-dim">{profile.shortBio}</p>
            <p className="mt-1">
              {profile.stats.map((s, i) => (
                <span key={s.label}>
                  {i > 0 && <Hl c="dim"> · </Hl>}
                  <Hl c="sky">{s.value}</Hl> {s.label.toLowerCase()}
                </span>
              ))}
            </p>
          </div>,
        );
      case 'projects':
        return print(
          <div>
            <div className="term-grid term-grid--3">
              {sortedProjects.map((p) => (
                <Fragment key={p.slug}>
                  <span>
                    {p.featured ? <Hl c="gold">★ </Hl> : '  '}
                    <SlugBtn slug={p.slug} />
                  </span>
                  <span>{p.title}</span>
                  <span className="term-dim">{p.category}</span>
                </Fragment>
              ))}
            </div>
            <p className="term-dim mt-1">
              {sortedProjects.length} projects · <Hl c="gold">★</Hl> featured · run <Hl>open &lt;slug&gt;</Hl>
            </p>
          </div>,
        );
      case 'skills':
        return print(
          <div className="space-y-1">
            {skillGroups.map((g) => (
              <p key={g.id}>
                <Hl c="orange">[{g.stat}]</Hl> <Hl c="sky">{g.name}</Hl>{' '}
                <span>
                  {g.skills.map((s, i) => (
                    <span key={s.name}>
                      {i > 0 && <Hl c="dim">, </Hl>}
                      {s.name}
                      <Hl c="dim">
                        {' '}
                        {'▮'.repeat(s.level)}
                        {'▯'.repeat(5 - s.level)}
                      </Hl>
                    </span>
                  ))}
                </span>
              </p>
            ))}
            <p className="term-dim">level = how many projects use it, not a self-rating.</p>
          </div>,
        );
      case 'experience':
        return print(
          <div className="term-grid">
            {experience.map((r) => (
              <Fragment key={r.id}>
                <Hl c="orange">{r.period}</Hl>
                <span>
                  {r.title} <Hl c="dim">@</Hl> <Hl c="sky">{r.company}</Hl>
                </span>
              </Fragment>
            ))}
          </div>,
        );
      case 'resume':
        os.openApp('resume');
        return print(
          <p>
            Résumé PDF:{' '}
            <a className="term-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              {profile.resumeUrl}
            </a>{' '}
            <Hl c="dim">· opened the Resume app</Hl>
          </p>,
        );
      case 'contact':
        return print(
          <div className="term-grid">
            <Hl>email</Hl>
            <a className="term-link" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
            <Hl>phone</Hl>
            <span>{profile.phone}</span>
            {Object.entries(profile.links).map(([k, v]) => (
              <Fragment key={k}>
                <Hl>{k}</Hl>
                <a className="term-link" href={v} target="_blank" rel="noreferrer">
                  {v.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </Fragment>
            ))}
          </div>,
        );
      case 'open':
        if (!arg) {
          os.openApp('projects');
          return print(['ok', <>Opened My Projects. Tip: <Hl>open &lt;slug&gt;</Hl> jumps straight to a case study.</>]);
        }
        return openSlug(arg.toLowerCase());
      case 'ls':
        if (arg === 'projects' || arg === 'projects/') {
          return print(
            <p className="flex flex-wrap gap-x-4">
              {SLUGS.map((s) => (
                <SlugBtn key={s} slug={s} />
              ))}
            </p>,
          );
        }
        if (arg) return print(['err', <>ls: {arg}: no such directory. Try <Hl>ls projects</Hl>.</>]);
        return print(
          <p className="flex flex-wrap gap-x-4">
            <Hl c="sky">projects/ ({sortedProjects.length})</Hl>
            <Hl c="sky">skills/ ({skillGroups.reduce((a, g) => a + g.skills.length, 0)})</Hl>
            <Hl c="sky">experience/ ({experience.length})</Hl>
            <span>about.txt</span>
            <span>contact.txt</span>
            <span>{profile.resumeUrl.split('/').pop()}</span>
          </p>,
        );
      case 'whoami':
        return print(
          <p>
            guest <Hl c="dim">— visiting the portfolio of</Hl> {profile.fullName} <Hl c="dim">({profile.headline})</Hl>
          </p>,
        );
      case 'history':
        return print(
          history.length ? (
            <div className="term-grid">
              {history.map((h, i) => (
                <Fragment key={i}>
                  <Hl c="dim">{String(i + 1).padStart(3, ' ')}</Hl>
                  <span>{h}</span>
                </Fragment>
              ))}
            </div>
          ) : (
            <span className="term-dim">No history yet.</span>
          ),
        );
      case 'clear':
        setLines([]);
        return;
      case 'exit':
        os.closeApp('terminal');
        return;
      case 'sudo':
        if (arg === 'hire-me' || arg === 'hire me') {
          playSound('chime');
          os.openApp('contact');
          return print(['ok', <>[sudo] permission granted. Opening Contact — {profile.email} is waiting for you.</>]);
        }
        return print(['err', <>Nice try. The only sudo command here is <Hl>sudo hire-me</Hl>.</>]);
      default: {
        const guess = closest(cmd.toLowerCase(), COMMAND_NAMES);
        return print([
          'err',
          <>
            command not found: {cmd}.{' '}
            {guess ? (
              <>
                Did you mean <Hl>{guess}</Hl>?
              </>
            ) : (
              <>
                Type <Hl>help</Hl> to see what I understand.
              </>
            )}
          </>,
        ]);
      }
    }
  }

  function run(raw: string) {
    const value = raw.trim();
    setLines((ls) => [...ls, { id: lineId++, kind: 'in', body: raw }]);
    if (value) setHistory((h) => (h[h.length - 1] === value ? h : [...h, value]));
    setCursor(null);
    setInput('');
    exec(value);
    inputRef.current?.focus({ preventScroll: true });
  }

  function complete() {
    const hasSpace = /\s/.test(input);
    const [cmd, ...rest] = input.split(/\s+/);
    const partial = hasSpace ? rest.join(' ') : cmd;
    const pool = !hasSpace ? COMMAND_NAMES : cmd === 'open' ? [...SLUGS, ...Object.keys(APP_ALIASES)] : cmd === 'ls' ? ['projects'] : cmd === 'sudo' ? ['hire-me'] : [];
    const matches = [...new Set(pool.filter((c) => c.startsWith(partial.toLowerCase())))];
    if (matches.length === 1) {
      setInput(hasSpace ? `${cmd} ${matches[0]}` : `${matches[0]} `);
    } else if (matches.length > 1) {
      // extend to the common prefix, and list the candidates
      let prefix = matches[0];
      for (const m of matches) while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
      if (prefix.length > partial.length) setInput(hasSpace ? `${cmd} ${prefix}` : prefix);
      setLines((ls) => [
        ...ls,
        { id: lineId++, kind: 'in', body: input },
        { id: lineId++, kind: 'out', body: <p className="term-dim flex flex-wrap gap-x-4">{matches.map((m) => <span key={m}>{m}</span>)}</p> },
      ]);
    }
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setInput('');
      } else {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div className="term" onClick={(e) => (e.target as HTMLElement).closest('a,button') || window.getSelection()?.toString() || inputRef.current?.focus({ preventScroll: true })}>
      <div ref={scrollRef} className="term__scroll" role="log" aria-live="polite" aria-label="Terminal output">
        {lines.map((l) => (
          <div key={l.id} className={`term__line term__line--${l.kind}`}>
            {l.kind === 'in' ? (
              <>
                <span className="term__prompt" aria-hidden>
                  guest@dv:~$
                </span>{' '}
                {l.body}
              </>
            ) : (
              l.body
            )}
          </div>
        ))}
        <form
          className="term__input-row"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <label htmlFor="term-input" className="term__prompt">
            guest@dv:~$
          </label>
          <input
            id="term-input"
            ref={inputRef}
            className="term__input"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setCursor(null);
            }}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            aria-label="Terminal command"
          />
        </form>
      </div>
    </div>
  );
}
