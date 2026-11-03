import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Package } from 'lucide-react';
import { serviceProcesses } from './processData';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { playSound } from '../hooks/useSound';
import './professional.css';

/** "How I work": the per-service process from the previous site, as a 5-stop quest path. */
export function ProcessPath() {
  const reduce = useReducedMotion();
  const [svcId, setSvcId] = useState(serviceProcesses[0].id);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const svc = serviceProcesses.find((s) => s.id === svcId) ?? serviceProcesses[0];
  const phase = svc.phases[phaseIdx] ?? svc.phases[0];
  const last = svc.phases.length - 1;

  return (
    <div>
      <div className="ab-tabs" role="tablist" aria-label="Service">
        {serviceProcesses.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            id={`svc-${s.id}`}
            aria-selected={s.id === svcId}
            aria-controls="process-panel"
            className="ab-tab"
            onClick={() => {
              playSound('tick');
              setSvcId(s.id);
              setPhaseIdx(0);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div id="process-panel" role="tabpanel" aria-labelledby={`svc-${svc.id}`} className="mt-4">
        <p className="text-ink-2">{svc.subtitle}.</p>

        <div className="ab-path" role="tablist" aria-label={`${svc.title} phases`}>
          <span className="ab-path__line" aria-hidden>
            <span className="ab-path__fill" style={{ transform: `scaleX(${last ? phaseIdx / last : 0})` }} />
          </span>
          {svc.phases.map((p, i) => (
            <button
              key={p.phase}
              type="button"
              role="tab"
              aria-selected={i === phaseIdx}
              aria-controls="phase-detail"
              aria-label={`Phase ${i + 1}: ${p.phase}`}
              className={`ab-node ${i < phaseIdx ? 'ab-node--done' : ''}`}
              onClick={() => {
                playSound('tick');
                setPhaseIdx(i);
              }}
            >
              <span className="ab-node__dot">{i < phaseIdx ? <Check size={18} aria-hidden /> : i + 1}</span>
              <span className="ab-node__label">{p.phase}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${svc.id}-${phaseIdx}`}
            id="phase-detail"
            role="tabpanel"
            className="pro-card pro-card--raised ab-phase"
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: 0.12 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="mono-label text-ink-3">
                Phase {phaseIdx + 1} / {svc.phases.length}
              </span>
              <span className="chip">{phase.duration}</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-ink">{phase.phase}</h3>
            <div className="ab-phase__cols">
              <div>
                <p className="mono-label text-ink-3">What happens</p>
                <ul>
                  {phase.steps.map((s) => (
                    <li key={s}>
                      <Check size={14} aria-hidden />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mono-label text-ink-3">You receive</p>
                <ul>
                  {phase.deliverables.map((d) => (
                    <li key={d}>
                      <Package size={14} aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-5 flex gap-2">
              <button type="button" className="btn-3d btn-3d--ghost btn-3d--sm" disabled={phaseIdx === 0} onClick={() => setPhaseIdx((i) => Math.max(0, i - 1))}>
                Previous
              </button>
              <button type="button" className="btn-3d btn-3d--ghost btn-3d--sm" disabled={phaseIdx === last} onClick={() => setPhaseIdx((i) => Math.min(last, i + 1))}>
                Next phase
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
