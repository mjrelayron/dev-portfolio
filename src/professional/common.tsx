import './professional.css';

/** Five-segment level bar. Purely visual; the numeric level is always shown next to it. */
export function LevelPips({ level, max = 5, delay = 0 }: { level: number; max?: number; delay?: number }) {
  return (
    <span className="pro-pips" aria-hidden>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className="pro-pip">
          {i < level && <i style={{ animationDelay: `${delay + i * 60}ms` }} />}
        </span>
      ))}
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub, id }: { eyebrow?: string; title: string; sub?: string; id?: string }) {
  return (
    <div>
      {eyebrow && <p className="mono-label text-ink-3">{eyebrow}</p>}
      <h2 id={id} className="pro-h2 mt-1">
        {title}
      </h2>
      {sub && <p className="pro-sub">{sub}</p>}
    </div>
  );
}
