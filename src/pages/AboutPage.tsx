import { FileText, Github, Heart, Lightbulb, Linkedin, Send, Zap } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo, personJsonLd } from '../app/Seo';
import { ButtonLink } from '../components/ui/Button';
import { profile } from '../data/profile';
import { SectionHead } from '../professional/common';
import { ProcessPath } from '../professional/ProcessPath';
import '../professional/professional.css';

// Copy from the previous site's WorkingTogetherSection, re-set in the new style.
const features = [
  {
    title: 'Proven Results',
    text: 'From AI-powered platforms to e-commerce solutions, I deliver products that move metrics and delight users.',
    Icon: Zap,
    color: 'var(--sky)',
  },
  {
    title: 'Innovation First',
    text: 'I stay ahead of technology trends, shipping modern, scalable solutions with future-friendly architectures.',
    Icon: Lightbulb,
    color: 'var(--violet-light)',
  },
  {
    title: 'Dedicated Partnership',
    text: 'Expect clear communication, iterative collaboration, and ongoing support long after launch.',
    Icon: Heart,
    color: 'var(--mint)',
  },
];

export default function AboutPage() {
  return (
    <PageFrame
      accent="white"
      eyebrow="Central Hub · About"
      title={<>Hi, I'm {profile.name}</>}
      intro={<p>{profile.shortBio}</p>}
      actions={
        <>
          <ButtonLink to="/resume" size="sm" icon={<FileText size={16} aria-hidden />}>
            Resume
          </ButtonLink>
          <ButtonLink to="/contact" variant="ghost" size="sm" icon={<Send size={16} aria-hidden />}>
            Contact
          </ButtonLink>
          <ButtonLink href={profile.links.linkedin} variant="ghost" size="sm" icon={<Linkedin size={16} aria-hidden />}>
            LinkedIn
          </ButtonLink>
          <ButtonLink href={profile.links.github} variant="ghost" size="sm" icon={<Github size={16} aria-hidden />}>
            GitHub
          </ButtonLink>
        </>
      }
      bot={{ state: 'wave', bubble: 'Welcome to the hub!' }}
    >
      <Seo
        title="About"
        description={`${profile.fullName} (${profile.name}): ${profile.headline}. ${profile.shortBio}`}
        path="/about"
        image={profile.photo}
        type="profile"
        jsonLd={personJsonLd}
      />

      <section className="pro-section ab-intro" aria-labelledby="story-h">
        <figure className="m-0">
          <div className="ab-photo">
            <div className="ab-photo__frame">
              <img src={profile.photo} alt={`Portrait of ${profile.fullName}`} width={600} height={750} decoding="async" />
            </div>
            <div className="ab-photo__plinth" aria-hidden />
          </div>
          <figcaption className="ab-nameplate">
            <span className="block font-display text-lg font-bold text-ink">{profile.fullName}</span>
            <span className="mono-label text-ink-3">{profile.headline.split(',')[0]}</span>
          </figcaption>
        </figure>
        <div>
          <SectionHead eyebrow="The story so far" title={profile.headline} id="story-h" />
          <div className="ab-story mt-4">
            {profile.story.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <ul className="mt-5 flex list-none flex-wrap gap-2 p-0" aria-label="Roles">
            {profile.roles.map((r) => (
              <li key={r} className="chip">
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pro-section" aria-label="By the numbers">
        <ul className="ab-stats m-0 list-none p-0">
          {profile.stats.map((s) => (
            <li key={s.label} className="pro-card ab-stat">
              <div className="ab-stat__val">{s.value}</div>
              <div className="ab-stat__label mono-label">{s.label}</div>
            </li>
          ))}
        </ul>
      </section>

      <section className="pro-section" aria-labelledby="approach-h">
        <SectionHead
          eyebrow="Approach"
          title="Interested in working together?"
          id="approach-h"
          sub="From automation-first products to growth-focused marketing experiences, I build digital platforms that are as strategic as they are beautiful."
        />
        <div className="ab-features">
          {features.map(({ title, text, Icon, color }) => (
            <article key={title} className="pro-card ab-feature">
              <span className="ab-feature__icon" style={{ background: color }} aria-hidden>
                <Icon size={22} strokeWidth={2.2} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pro-section" aria-labelledby="process-h">
        <SectionHead eyebrow="How I work" title="Five phases, every project" id="process-h" sub="Every service runs in five phases, from discovery through launch to ongoing support. Pick a service to see the steps and what you receive at each phase." />
        <ProcessPath />
      </section>

      <section className="pro-section">
        <div className="pro-card ab-cta">
          <div>
            <h2 className="pro-h2">Have a project in mind?</h2>
            <p className="pro-sub">Send a message, or grab the resume for the full picture.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/contact" icon={<Send size={16} aria-hidden />}>
              Start a conversation
            </ButtonLink>
            <ButtonLink to="/resume" variant="ghost" icon={<FileText size={16} aria-hidden />}>
              View resume
            </ButtonLink>
          </div>
        </div>
      </section>
    </PageFrame>
  );
}
