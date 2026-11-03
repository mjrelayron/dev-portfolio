import { Link } from 'react-router-dom';
import { Seo } from '../app/Seo';
import { profile } from '../data/profile';
import { sortedProjects } from '../data/portfolio';
import { experience } from '../data/career';
import { skillGroups } from '../data/skills';

/**
 * Plain, fast index of every piece of professional content — no map, no games,
 * no animation. The guaranteed two-click route to everything.
 */
export default function ClassicPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pb-[calc(var(--hud-dock)+40px)] pt-[calc(var(--hud-top)+16px)]">
      <Seo title="Classic view — everything on one page" description={`A plain index of ${profile.name}'s projects, experience, skills and contact details.`} path="/classic" />
      <p className="mono-label text-ink-3">Classic view</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{profile.name}</h1>
      <p className="mt-1 text-lg text-ink-2">{profile.headline}</p>
      <p className="mt-4 text-ink-2">{profile.shortBio}</p>

      <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
        {['projects', 'experience', 'skills', 'contact'].map((id) => (
          <a key={id} href={`#${id}`} className="chip hover:text-white">
            {id}
          </a>
        ))}
        <Link to="/about" className="chip hover:text-white">
          about
        </Link>
        <Link to="/resume" className="chip hover:text-white">
          resume
        </Link>
        <Link to="/lab" className="chip hover:text-white">
          lab tools
        </Link>
        <Link to="/arcade" className="chip hover:text-white">
          arcade
        </Link>
      </nav>

      <section id="projects" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Projects</h2>
        <ul className="mt-4 divide-y divide-[rgba(255,255,255,0.08)]">
          {sortedProjects.map((p) => (
            <li key={p.slug} className="py-3">
              <Link to={`/projects/${p.slug}`} className="font-display font-semibold text-white underline-offset-4 hover:underline">
                {p.title}
              </Link>
              <span className="ml-2 text-sm text-ink-3">
                {p.category}
                {p.year ? ` · ${p.year}` : ''}
              </span>
              <p className="text-[0.95rem] text-ink-2">{p.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Experience</h2>
        <ul className="mt-4 space-y-4">
          {experience.map((r) => (
            <li key={r.id}>
              <p className="font-display font-semibold">
                {r.title} — {r.company}
              </p>
              <p className="font-mono text-xs text-ink-3">{r.period}</p>
              <p className="text-[0.95rem] text-ink-2">{r.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="skills" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Skills</h2>
        <dl className="mt-4 space-y-3">
          {skillGroups.map((g) => (
            <div key={g.id}>
              <dt className="font-display font-semibold">{g.name}</dt>
              <dd className="text-[0.95rem] text-ink-2">{g.skills.map((s) => s.name).join(', ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="contact" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Contact</h2>
        <ul className="mt-4 space-y-1.5 text-ink-2">
          <li>
            Email: <a className="text-white underline" href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>Phone: {profile.phone}</li>
          <li>
            <a className="text-white underline" href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> ·{' '}
            <a className="text-white underline" href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a> ·{' '}
            <a className="text-white underline" href={profile.links.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </li>
          <li>
            <Link className="text-white underline" to="/contact">Contact form & project quotes</Link> ·{' '}
            <a className="text-white underline" href={profile.resumeUrl} download>Download resume (PDF)</a>
          </li>
        </ul>
      </section>
    </div>
  );
}
