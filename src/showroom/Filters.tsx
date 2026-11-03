import { Search, X } from 'lucide-react';
import { playSound } from '../hooks/useSound';
import './showroom.css';

export function CategoryChips({
  categories,
  counts,
  value,
  onChange,
}: {
  categories: string[];
  counts: Record<string, number>;
  value: string | null;
  onChange: (c: string | null) => void;
}) {
  const all = Object.values(counts).reduce((a, b) => a + b, 0);
  const pick = (c: string | null) => {
    playSound('tick');
    onChange(c);
  };
  return (
    <div className="sr-chips" role="group" aria-label="Filter by category">
      <button type="button" className="sr-chip" aria-pressed={value === null} onClick={() => pick(null)}>
        All <span className="sr-chip__n">{all}</span>
      </button>
      {categories.map((c) => (
        <button key={c} type="button" className="sr-chip" aria-pressed={value === c} onClick={() => pick(value === c ? null : c)}>
          {c} <span className="sr-chip__n">{counts[c] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}

export function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="sr-search">
      <Search size={16} aria-hidden className="sr-search__icon" />
      <label htmlFor="sr-search-input" className="sr-only">
        Search projects by title, summary or tech
      </label>
      <input
        id="sr-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search projects or tech…"
        autoComplete="off"
        spellCheck={false}
        className="sr-search__input"
      />
      {value && (
        <button type="button" className="sr-search__clear" onClick={() => onChange('')} aria-label="Clear search">
          <X size={14} aria-hidden />
        </button>
      )}
    </div>
  );
}
