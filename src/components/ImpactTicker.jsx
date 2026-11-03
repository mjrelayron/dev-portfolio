import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { featuredProjects } from '../data/projects';
import { useReducedMotion } from '../hooks/useReducedMotion';
import '../showroom/showroom.css';

/**
 * Slow marquee of headline numbers from the featured projects.
 * Reduced motion: a static, wrapping row. Hover/focus or the button pauses it.
 */
const ImpactTicker = () => {
    const reduced = useReducedMotion();
    const [paused, setPaused] = useState(false);

    // Extract all metrics from featured projects
    const allMetrics = featuredProjects.flatMap(project =>
        project.metrics ? project.metrics.map(metric => ({
            ...metric,
            projectId: project.id,
            projectTitle: project.title,
            color: project.color
        })) : []
    );

    // Filter for high-impact numbers to ensure quality
    const impactfulMetrics = allMetrics.filter(m =>
        m.value.includes('k') ||
        m.value.includes('M') ||
        m.value.includes('%') ||
        m.value.includes('ms') ||
        m.value.includes('+')
    );

    if (!impactfulMetrics.length) return null;

    const item = (m, index, hidden) => (
        <li key={`${m.projectId}-${index}`} className="sr-tick" aria-hidden={hidden || undefined}>
            <span className="sr-tick__v" style={{ '--tick': m.color }}>{m.value}</span>
            <span className="flex flex-col leading-tight">
                <span className="sr-tick__k">{m.label}</span>
                <span className="sr-tick__p">{m.projectTitle}</span>
            </span>
        </li>
    );

    if (reduced) {
        return (
            <section className="sr-ticker sr-ticker--static" aria-label="Impact across featured projects">
                <ul className="flex flex-wrap gap-x-8 gap-y-4 px-5 py-4">
                    {impactfulMetrics.slice(0, 8).map((m, i) => item(m, i, false))}
                </ul>
            </section>
        );
    }

    return (
        <section className="sr-ticker" aria-label="Impact across featured projects">
            <div className="sr-ticker__clip">
                {/* two identical sets; translating -50% loops seamlessly */}
                <ul className={`sr-ticker__track ${paused ? 'is-paused' : ''}`}>
                    {impactfulMetrics.map((m, i) => item(m, i, false))}
                    {impactfulMetrics.map((m, i) => item(m, i + impactfulMetrics.length, true))}
                </ul>
            </div>
            <button
                type="button"
                className="sr-ticker__toggle"
                onClick={() => setPaused((p) => !p)}
                aria-pressed={paused}
                aria-label={paused ? 'Play impact ticker' : 'Pause impact ticker'}
            >
                {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
            </button>
        </section>
    );
};

export default ImpactTicker;
