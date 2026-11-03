import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Code2 } from 'lucide-react';
import { skillGroups, groupPower, type Skill, type SkillGroup } from '../data/skills';
import { useAchievements } from '../store/useAchievements';
import { playSound } from '../hooks/useSound';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { LevelPips } from './common';
import './professional.css';

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

function scrollToGroup(id: string) {
  const el = document.getElementById(`group-${id}`);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  el.querySelector<HTMLButtonElement>('.sk-row__btn')?.focus({ preventScroll: true });
}

/** Top strip: one tile per RPG stat; jumps to that panel. */
export function StatStrip() {
  return (
    <nav className="sk-statrow" aria-label="Jump to a stat">
      {skillGroups.map((g) => (
        <button key={g.id} type="button" className="sk-stat" onClick={() => scrollToGroup(g.id)} title={`${g.name}: average level ${groupPower(g)}% of max`}>
          <span className="sk-stat__code">{g.stat}</span>
          <span className="sk-stat__val">{groupPower(g)}</span>
          <span className="sk-stat__name">{g.name}</span>
        </button>
      ))}
    </nav>
  );
}

function StatBadge({ stat }: { stat: string }) {
  return (
    <span className="sk-badge" aria-hidden>
      <svg viewBox="0 0 52 58">
        {/* two-tone shield: light left face, dark right face */}
        <path d="M26 2 L49 10 V30 C49 44 39 52 26 56 Z" fill="var(--accent-dark)" />
        <path d="M26 2 L3 10 V30 C3 44 13 52 26 56 Z" fill="var(--accent)" />
        <path d="M26 2 L49 10 L26 14 L3 10 Z" fill="var(--accent-light)" />
      </svg>
      <span>{stat}</span>
    </span>
  );
}

function SkillRow({ skill, open, onToggle, index }: { skill: Skill; open: boolean; onToggle: () => void; index: number }) {
  const reduce = useReducedMotion();
  const panelId = `proof-${skill.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  const evidence = skill.projects.length + (skill.inThisSite ? 1 : 0);
  return (
    <li className="sk-row">
      <button type="button" className="sk-row__btn" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span className="min-w-0">
          <span className="sk-row__name">
            {skill.name}
            {skill.inThisSite && <span className="sk-site">this site</span>}
          </span>
          <span className="sk-row__meta">
            {skill.projects.length ? plural(skill.projects.length, 'project') : 'this site only'}
            {skill.inThisSite && skill.projects.length ? ' + this site' : ''}
          </span>
        </span>
        <span className="sk-row__lv">
          <LevelPips level={skill.level} delay={index * 40} />
          <span className="sk-row__lvnum">
            <span className="sr-only">Level </span>LV{skill.level}
          </span>
          <ChevronRight size={16} className="sk-chev" aria-hidden />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            className="sk-proof"
            initial={reduce ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mono-label mb-2 text-ink-3">
              Evidence · {plural(evidence, 'source')}
            </p>
            <ul>
              {skill.projects.map((p) => (
                <li key={p.slug}>
                  <Link to={`/projects/${p.slug}`}>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{p.title}</span>
                      <span className="sk-proof__year">
                        {p.category}
                        {p.year ? ` · ${p.year}` : ''}
                      </span>
                    </span>
                    <ArrowRight size={16} className="sk-proof__arrow" aria-hidden />
                  </Link>
                </li>
              ))}
              {skill.inThisSite && (
                <li>
                  <span className="sk-proof__site">
                    <Code2 size={16} className="text-gold" aria-hidden />
                    <span>Used in this portfolio's own code</span>
                  </span>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

function GroupPanel({ group, openSkill, setOpenSkill }: { group: SkillGroup; openSkill: string | null; setOpenSkill: (s: string | null) => void }) {
  const power = groupPower(group);
  return (
    <section id={`group-${group.id}`} className="pro-card sk-group" aria-labelledby={`gh-${group.id}`}>
      <div className="sk-group__head">
        <StatBadge stat={group.stat} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id={`gh-${group.id}`} className="text-lg font-bold text-ink">
              {group.name}
            </h2>
            <span className="mono-label shrink-0 text-accent-text">
              {group.stat} {power}
            </span>
          </div>
          <p className="text-sm text-ink-2">{group.blurb}</p>
          <div className="pro-bar mt-2" role="img" aria-label={`${group.stat} ${power} out of 100`}>
            <i style={{ width: `${power}%` }} />
          </div>
        </div>
      </div>
      <ul className="sk-list m-0 list-none p-0">
        {group.skills.map((s, i) => (
          <SkillRow
            key={s.name}
            skill={s}
            index={i}
            open={openSkill === s.name}
            onToggle={() => {
              playSound('tick');
              if (openSkill === s.name) return setOpenSkill(null);
              setOpenSkill(s.name);
              useAchievements.getState().viewSkill(s.name);
            }}
          />
        ))}
      </ul>
    </section>
  );
}

export function SkillGroups() {
  const [openSkill, setOpenSkill] = useState<string | null>(null);
  return (
    <div className="sk-groups">
      {skillGroups.map((g) => (
        <GroupPanel key={g.id} group={g} openSkill={openSkill} setOpenSkill={setOpenSkill} />
      ))}
    </div>
  );
}
