import { Building2, Download, ExternalLink, GraduationCap, Mail } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo } from '../app/Seo';
import { ButtonLink } from '../components/ui/Button';
import { profile } from '../data/profile';
import { experience } from '../data/career';
import { allSkills } from '../data/skills';
import { LevelPips } from '../professional/common';
import '../professional/professional.css';

const FILE = profile.resumeUrl;
const FILE_NAME = FILE.split('/').pop() ?? 'resume.pdf';
const latestRoles = experience.slice(0, 4);
const topSkills = [...allSkills].sort((a, b) => b.level - a.level || b.projects.length - a.projects.length).slice(0, 10);

function DownloadButtons({ ghostOpen = true }: { ghostOpen?: boolean }) {
  return (
    <>
      <ButtonLink href={FILE} download={FILE_NAME} icon={<Download size={16} aria-hidden />}>
        Download PDF
      </ButtonLink>
      <ButtonLink href={FILE} target="_blank" rel="noopener" variant={ghostOpen ? 'ghost' : 'primary'} icon={<ExternalLink size={16} aria-hidden />}>
        Open in new tab
      </ButtonLink>
    </>
  );
}

export default function ResumePage() {
  return (
    <PageFrame
      accent="white"
      eyebrow="Central Hub · Resume"
      title="Resume"
      intro={<p>The one-page version of the story. Read it here, download it, or skim the summary below.</p>}
      actions={<DownloadButtons />}
    >
      <Seo
        title="Resume"
        description={`Resume of ${profile.fullName}: ${latestRoles
          .slice(0, 2)
          .map((r) => `${r.title} at ${r.company}`)
          .join(', ')}. Skills include ${topSkills
          .slice(0, 6)
          .map((s) => s.name)
          .join(', ')}.`}
        path="/resume"
      />

      {/* tablet + desktop: inline viewer */}
      <section className="rs-viewer pro-card overflow-hidden" aria-label="Resume PDF">
        <div className="rs-viewer__chrome">
          <span className="rs-viewer__dot" aria-hidden />
          <span className="rs-viewer__dot" aria-hidden />
          <span className="rs-viewer__dot" aria-hidden />
          <span className="mono-label ml-2 truncate text-ink-3">{FILE_NAME}</span>
          <a href={FILE} target="_blank" rel="noopener" className="pro-link mono-label ml-auto shrink-0">
            Full screen
          </a>
        </div>
        <object data={`${FILE}#view=FitH`} type="application/pdf" aria-label={`Resume of ${profile.fullName} (PDF)`}>
          <div className="rs-fallback">
            <p>Your browser can't show the PDF inline.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <DownloadButtons />
            </div>
          </div>
        </object>
      </section>

      {/* phones: inline PDFs are unreliable, so offer the file directly */}
      <section className="rs-mobile pro-card rs-doc" aria-label="Resume file">
        <span className="rs-doc__icon" aria-hidden>
          PDF
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{FILE_NAME}</p>
          <p className="text-sm text-ink-2">Opens in your phone's PDF viewer.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <ButtonLink href={FILE} target="_blank" rel="noopener" size="sm" icon={<ExternalLink size={15} aria-hidden />}>
              Open PDF
            </ButtonLink>
            <ButtonLink href={FILE} download={FILE_NAME} variant="ghost" size="sm" icon={<Download size={15} aria-hidden />}>
              Download
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="pro-section" aria-labelledby="glance-h">
        <h2 id="glance-h" className="pro-h2">
          At a glance
        </h2>
        <p className="pro-sub">{profile.headline}.</p>
        <div className="rs-summary mt-4">
          <div className="pro-card">
            <p className="mono-label flex items-center gap-2 text-ink-3">
              <Building2 size={14} aria-hidden /> Latest roles
            </p>
            <ul className="rs-roles">
              {latestRoles.map((r) => (
                <li key={r.id}>
                  <strong>{r.title}</strong>
                  <em>{r.period}</em>
                  <span>{r.company}</span>
                </li>
              ))}
            </ul>
            <ButtonLink to="/experience" variant="ghost" size="sm" className="mt-4">
              All {experience.length} roles
            </ButtonLink>
          </div>
          <div className="pro-card">
            <p className="mono-label flex items-center gap-2 text-ink-3">
              <GraduationCap size={14} aria-hidden /> Top skills
            </p>
            <ul className="mt-3 grid list-none gap-2 p-0">
              {topSkills.map((s) => (
                <li key={s.name} className="flex items-center justify-between gap-3">
                  <span className="text-ink">{s.name}</span>
                  <span className="flex items-center gap-2">
                    <LevelPips level={s.level} />
                    <span className="mono-label text-ink-3">
                      <span className="sr-only">Level </span>LV{s.level}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <ButtonLink to="/skills" variant="ghost" size="sm" className="mt-4">
              Full skill sheet
            </ButtonLink>
          </div>
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-2 text-ink-2">
          <Mail size={16} aria-hidden />
          <a className="pro-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <span className="text-ink-3">·</span>
          <a className="pro-link" href={profile.links.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn
          </a>
        </p>
      </section>
    </PageFrame>
  );
}
