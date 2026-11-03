import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, ExternalLink, ArrowRight, BarChart3, Code2, Target, Lightbulb } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { CoverPlaceholder } from '../showroom/covers';
import '../showroom/showroom.css';

/**
 * "Quick look" dialog. Accepts either a raw entry from data/projects.js or a
 * normalised Project from data/portfolio.ts.
 */
const ProjectModal = ({ project, onClose }) => {
    const navigate = useNavigate();
    const reduced = useReducedMotion();
    const closeRef = useRef(null);

    // Lock body scroll when modal is open; Esc closes; focus goes in and comes back
    useEffect(() => {
        if (!project) return;
        const prev = document.activeElement;
        document.body.style.overflow = 'hidden';
        closeRef.current?.focus();
        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                onClose();
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => {
            window.removeEventListener('keydown', onKey, true);
            document.body.style.overflow = 'unset';
            prev?.focus?.();
        };
    }, [project, onClose]);

    if (!project || typeof document === 'undefined') return null;

    const image = project.cover ?? project.image;
    const tech = project.tech ?? project.technologies ?? [];
    const rawLive = project.liveUrl ?? project.links?.live;
    const live = rawLive && !/github\.com\/username\//.test(rawLive) ? rawLive : null;
    const internalLive = live?.startsWith('/');

    const handleViewFullCaseStudy = () => {
        onClose();
        navigate(`/projects/${project.slug}`);
    };

    const enter = reduced ? { initial: false } : { initial: { opacity: 0, y: 16, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 } };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6" data-accent="violet">
            {/* Backdrop */}
            <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onClose}
                className="absolute inset-0 bg-[rgba(9,11,28,0.82)]"
                aria-hidden
            />

            {/* Modal Container */}
            <motion.div
                {...enter}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="quicklook-title"
                className="qk"
            >
                {/* Close Button */}
                <button ref={closeRef} type="button" onClick={onClose} className="lb__btn absolute right-3 top-3 z-10" aria-label="Close quick look">
                    <X size={20} aria-hidden />
                </button>

                {/* Header Image/Video */}
                <div className="qk__media">
                    {project.video && !reduced ? (
                        <video
                            src={project.video}
                            poster={image}
                            className="h-full w-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                        />
                    ) : image ? (
                        <img src={image} alt="" className="h-full w-full object-cover object-top" width={1280} height={800} decoding="async" />
                    ) : (
                        <CoverPlaceholder project={project} alt="" />
                    )}
                    <div className="qk__shade" aria-hidden />

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="chip qk__chip">{project.category}</span>
                            {project.status && (
                                <span className={`chip qk__chip ${project.status === 'Live' ? 'qk__chip--live' : 'qk__chip--warn'}`}>
                                    {project.status}
                                </span>
                            )}
                        </div>
                        <h2 id="quicklook-title" className="font-display text-[clamp(1.6rem,4vw,2.3rem)] font-bold leading-tight text-ink">{project.title}</h2>
                        {project.subtitle && <p className="mt-1 font-medium text-ink-2">{project.subtitle}</p>}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto">
                    <div className="space-y-7 p-5 sm:p-7">

                        {/* Metrics Grid */}
                        {project.metrics && project.metrics.length > 0 && (
                            <dl className="cs-metrics">
                                {project.metrics.map((metric, idx) => (
                                    <div key={idx} className="cs-metric">
                                        <dt className="cs-metric__k">{metric.label}</dt>
                                        <dd className="cs-metric__v">{metric.value}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        <div className="grid gap-7 md:grid-cols-2">
                            {/* Problem & Solution */}
                            <div className="space-y-6">
                                {project.problem && (
                                    <div>
                                        <h3 className="qk__h3">
                                            <Target size={18} aria-hidden className="text-[var(--orange)]" />
                                            The Challenge
                                        </h3>
                                        <p className="leading-relaxed text-ink-2">{project.problem}</p>
                                    </div>
                                )}

                                {project.solution && (
                                    <div>
                                        <h3 className="qk__h3">
                                            <Lightbulb size={18} aria-hidden className="text-[var(--mint)]" />
                                            The Solution
                                        </h3>
                                        <p className="leading-relaxed text-ink-2">{project.solution}</p>
                                    </div>
                                )}
                            </div>

                            {/* Tech Stack & Quick Info */}
                            <div className="space-y-6">
                                {tech.length > 0 && (
                                    <div>
                                        <h3 className="qk__h3">
                                            <Code2 size={18} aria-hidden className="text-accent-text" />
                                            Tech Stack
                                        </h3>
                                        <ul className="flex flex-wrap gap-2">
                                            {tech.map((t, i) => (
                                                <li key={i} className="cs-tech">{t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {project.impact && (
                                    <div className="qk__impact">
                                        <h3 className="qk__h3 !mb-2 !text-base">
                                            <BarChart3 size={16} aria-hidden className="text-gold" />
                                            Key Impact
                                        </h3>
                                        <p className="text-sm leading-relaxed text-ink-2">{project.impact}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="qk__foot">
                    {live ? (
                        internalLive ? (
                            <button type="button" onClick={() => { onClose(); navigate(live); }} className="btn-3d btn-3d--ghost w-full sm:w-auto">
                                <ArrowRight size={16} aria-hidden />
                                Visit live
                            </button>
                        ) : (
                            <a href={live} target="_blank" rel="noopener noreferrer" className="btn-3d btn-3d--ghost w-full sm:w-auto">
                                <ExternalLink size={16} aria-hidden />
                                Visit live <span className="sr-only">(opens in a new tab)</span>
                            </a>
                        )
                    ) : <span className="hidden sm:block" />}

                    <button type="button" onClick={handleViewFullCaseStudy} className="btn-3d w-full sm:w-auto">
                        View full case study
                        <ArrowRight size={16} aria-hidden />
                    </button>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default ProjectModal;
