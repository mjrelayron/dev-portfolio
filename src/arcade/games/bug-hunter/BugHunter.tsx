import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Bug, Check, X, Timer, ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { bugs, type BugLang, type BugSnippet } from '../../../data/bugs';
import { gameBySlug, readBest, writeBest } from '../../games';
import { Button, ButtonLink } from '../../../components/ui/Button';
import { DevBot } from '../../../mascot/DevBot';
import { burst } from '../../../hooks/useConfetti';
import { playSound } from '../../../hooks/useSound';

const ROUND_SECONDS = 30;
const meta = gameBySlug['bug-hunter'];

const KEYWORDS: Record<BugLang, string[]> = {
  JavaScript: ['function', 'const', 'let', 'var', 'return', 'for', 'if', 'else', 'async', 'await', 'new', 'typeof'],
  React: ['function', 'const', 'let', 'return', 'if', 'async', 'await'],
  Python: ['def', 'if', 'else', 'return', 'for', 'in', 'is', 'None', 'not', 'and', 'or'],
  SQL: ['SELECT', 'FROM', 'WHERE', 'ORDER', 'BY', 'GROUP', 'HAVING', 'IS', 'NULL', 'DESC', 'AS', 'AND', 'NOT'],
};
const LANG_ACCENT: Record<BugLang, string> = { JavaScript: '#FFCF6B', React: '#42BDF5', Python: '#79D8A0', SQL: '#FFAD5A' };

/** Very small highlighter: comments, strings, numbers, keywords, JSX tags. */
function highlight(line: string, lang: BugLang): ReactNode[] {
  const kw = new Set(KEYWORDS[lang]);
  const re = lang === 'Python' ? /(#.*$|"[^"]*"|'[^']*'|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|\s+|.)/g : /(\/\/.*$|`[^`]*`|"[^"]*"|'[^']*'|<\/?[A-Z]\w*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*\b|\s+|.)/g;
  const out: ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    const t = m[0];
    let cls = '';
    if (/^(\/\/|#)/.test(t)) cls = 'tk-com';
    else if (/^["'`]/.test(t)) cls = 'tk-str';
    else if (/^<\/?[A-Z]/.test(t)) cls = 'tk-tag';
    else if (/^\d/.test(t)) cls = 'tk-num';
    else if (kw.has(t)) cls = 'tk-kw';
    out.push(cls ? <span key={i++} className={cls}>{t}</span> : <Fragment key={i++}>{t}</Fragment>);
  }
  return out;
}

interface Answer {
  id: string;
  picked: number | null;
  correct: boolean;
  ms: number;
}

export default function BugHunter() {
  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [timed, setTimed] = useState(false);
  const [round, setRound] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [picked, setPicked] = useState<number | null | undefined>(undefined); // undefined = unanswered, null = timed out
  const [left, setLeft] = useState(ROUND_SECONDS);
  const [best, setBest] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const startedAt = useRef(0);
  const nextRef = useRef<HTMLButtonElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => setBest(readBest(meta.bestKey!)), []);

  const snippet: BugSnippet = bugs[round];
  const answered = picked !== undefined;
  const score = answers.filter((a) => a.correct).length;

  // per-round timer
  useEffect(() => {
    if (phase !== 'play' || !timed || answered) return;
    if (left <= 0) {
      answer(null);
      return;
    }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timed, answered, left]);

  useEffect(() => {
    if (answered) requestAnimationFrame(() => nextRef.current?.focus({ preventScroll: true }));
  }, [answered]);

  function begin() {
    setAnswers([]);
    setRound(0);
    setPicked(undefined);
    setLeft(ROUND_SECONDS);
    setNewBest(false);
    setPhase('play');
    startedAt.current = performance.now();
    requestAnimationFrame(() => headRef.current?.focus());
  }

  function answer(line: number | null) {
    if (answered) return;
    const correct = line === snippet.bug;
    setPicked(line);
    playSound(correct ? 'chime' : 'tick');
    setAnswers((a) => [...a, { id: snippet.id, picked: line, correct, ms: performance.now() - startedAt.current }]);
  }

  function next() {
    if (round + 1 >= bugs.length) {
      const final = answers.filter((a) => a.correct).length;
      if (final > best) {
        writeBest(meta.bestKey!, final);
        setBest(final);
        setNewBest(true);
        playSound('chime');
        burst({ origin: { x: 0.5, y: 0.35 } });
      }
      setPhase('done');
      return;
    }
    setRound((r) => r + 1);
    setPicked(undefined);
    setLeft(ROUND_SECONDS);
    startedAt.current = performance.now();
    requestAnimationFrame(() => headRef.current?.focus());
  }

  const totalSeconds = useMemo(() => Math.round(answers.reduce((a, x) => a + x.ms, 0) / 1000), [answers]);

  if (phase === 'intro') {
    return (
      <div className="panel game-card bh-intro">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <DevBot size="md" state="think" />
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">How to play</h2>
            <ul className="mt-3 space-y-1.5 text-ink-2">
              <li>Read what the code is <em>meant</em> to do.</li>
              <li>Tap (or Tab + Enter) the one line that breaks it.</li>
              <li>Every answer comes with an explanation and the fix.</li>
            </ul>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button onClick={begin} icon={<Bug size={16} aria-hidden />}>
                Start hunting
              </Button>
              <button type="button" className={`bh-toggle ${timed ? 'is-on' : ''}`} aria-pressed={timed} onClick={() => setTimed((t) => !t)}>
                <span className="bh-toggle__track" aria-hidden>
                  <span className="bh-toggle__knob" />
                </span>
                <Timer size={15} aria-hidden /> {ROUND_SECONDS}s timer
              </button>
              {best > 0 && <span className="chip">Best {best}/10</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done') {
    const perfect = score === bugs.length;
    return (
      <div className="panel game-card">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <DevBot size="md" state={newBest || perfect ? 'celebrate' : score >= 6 ? 'wave' : 'think'} />
          <div className="min-w-0 flex-1">
            <p className="mono-label text-accent-text">{perfect ? 'Flawless — no bug escaped' : newBest ? 'New personal best' : score >= 6 ? 'Solid hunting' : 'Bugs are sneaky'}</p>
            <p className="mt-1 font-display text-[clamp(2.4rem,6vw,3.6rem)] font-bold leading-none">
              {score}
              <span className="text-ink-3">/{bugs.length}</span>
            </p>
            <p className="mt-2 font-mono text-sm text-ink-2">
              {Math.round((score / bugs.length) * 100)}% accuracy · {totalSeconds}s total{timed ? ' · timed' : ''} · best {best}/10
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={begin} icon={<RotateCcw size={16} aria-hidden />}>
                Play again
              </Button>
              <ButtonLink to="/arcade" variant="ghost" icon={<Trophy size={16} aria-hidden />}>
                Back to the Arcade
              </ButtonLink>
            </div>
          </div>
        </div>
        <ol className="mt-7 grid gap-2 sm:grid-cols-2">
          {bugs.map((b, i) => {
            const a = answers[i];
            return (
              <li key={b.id} className={`bh-result ${a?.correct ? 'is-ok' : 'is-miss'}`}>
                <span className="bh-result__icon" aria-hidden>
                  {a?.correct ? <Check size={14} /> : <X size={14} />}
                </span>
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-semibold">{b.title}</span> <span className="text-ink-3">· {b.lang}</span>
                </span>
                <span className="sr-only">{a?.correct ? 'found' : a?.picked === null ? 'timed out' : 'missed'}</span>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }

  const correct = picked === snippet.bug;
  return (
    <div className="bh-play">
      <div className="bh-status">
        <span className="font-mono text-sm text-ink-2">
          Round <span className="text-ink">{round + 1}</span>/{bugs.length}
        </span>
        <div className="bh-progress" aria-hidden>
          {bugs.map((b, i) => (
            <span key={b.id} className={i < answers.length ? (answers[i].correct ? 'is-ok' : 'is-miss') : i === round ? 'is-now' : ''} />
          ))}
        </div>
        <span className="font-mono text-sm text-ink-2">
          Score <span className="text-ink">{score}</span>
        </span>
      </div>
      {timed && (
        <div className="bh-timer" role="timer" aria-label={`${left} seconds left`}>
          <span style={{ transform: `scaleX(${answered ? 0 : left / ROUND_SECONDS})` }} className={left <= 8 ? 'is-low' : ''} />
        </div>
      )}

      <div className="panel game-card">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip" style={{ color: LANG_ACCENT[snippet.lang], borderColor: LANG_ACCENT[snippet.lang] }}>
            {snippet.lang}
          </span>
          {timed && !answered && <span className="chip font-mono">{left}s</span>}
        </div>
        <h2 ref={headRef} tabIndex={-1} className="mt-3 text-xl font-bold sm:text-2xl">
          {snippet.title}
        </h2>
        <p className="mt-1 text-ink-2">
          <span className="text-ink-3">Goal:</span> {snippet.goal}
        </p>

        <div className="bh-code" role="group" aria-label="Code — choose the buggy line">
          {snippet.code.map((line, i) => {
            const blank = line.trim() === '';
            const state = !answered ? '' : i === snippet.bug ? 'is-bug' : i === picked ? 'is-wrong' : 'is-dim';
            return (
              <button
                key={i}
                type="button"
                className={`bh-line ${state}`}
                onClick={() => answer(i)}
                disabled={answered || blank}
                aria-label={blank ? undefined : `Line ${i + 1}: ${line.trim()}`}
              >
                <span className="bh-line__no" aria-hidden>
                  {i + 1}
                </span>
                <code className="bh-line__code">{blank ? ' ' : highlight(line, snippet.lang)}</code>
                {answered && i === snippet.bug && (
                  <span className="bh-line__flag" aria-hidden>
                    <Bug size={13} /> bug
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`bh-explain ${correct ? 'is-ok' : 'is-miss'}`} role="status">
            <p className="flex items-center gap-2 font-display text-lg font-bold">
              {correct ? <Check size={18} aria-hidden /> : <X size={18} aria-hidden />}
              {correct ? 'Got it!' : picked === null ? 'Time’s up.' : `Not quite — the bug is on line ${snippet.bug + 1}.`}
            </p>
            <p className="mt-1.5 text-ink-2">{renderTicks(snippet.explanation)}</p>
            <p className="mono-label mt-3 text-ink-3">Fix</p>
            <pre className="bh-fix">
              <code>{highlight(snippet.fix, snippet.lang)}</code>
            </pre>
            <div className="mt-4">
              <Button ref={nextRef} onClick={next} icon={<ArrowRight size={16} aria-hidden />}>
                {round + 1 >= bugs.length ? 'See results' : 'Next snippet'}
              </Button>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-sm text-ink-3">
        Snippets are generic textbook bugs, not taken from any real codebase.
      </p>
    </div>
  );
}

/** `code` spans inside explanations */
function renderTicks(s: string) {
  return s.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') ? (
      <code key={i} className="bh-tick">
        {part.slice(1, -1)}
      </code>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
