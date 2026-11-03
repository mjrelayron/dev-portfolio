import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo, absUrl } from '../app/Seo';
import { ButtonLink } from '../components/ui/Button';
import { neighbours, projectBySlug } from '../data/portfolio';
import { profile } from '../data/profile';
import { useAchievements } from '../store/useAchievements';
import { CaseStudy } from '../showroom/CaseStudy';
import NotFoundPage from './NotFoundPage';

export default function CaseStudyPage() {
  const { slug = '' } = useParams();
  const project = projectBySlug[slug];

  useEffect(() => {
    if (project) useAchievements.getState().openCaseStudy(project.slug);
  }, [project]);

  const jsonLd = useMemo(
    () =>
      project && {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        ...(project.cover ? { image: absUrl(project.cover) } : {}),
        ...(project.year ? { dateCreated: String(project.year) } : {}),
        keywords: project.tech.join(', '),
        genre: project.category,
        author: { '@type': 'Person', name: profile.fullName, url: profile.siteUrl },
        url: absUrl(`/projects/${project.slug}`),
      },
    [project],
  );

  if (!project) return <NotFoundPage />;
  const { prev, next } = neighbours(project.slug);

  return (
    <PageFrame
      accent="violet"
      eyebrow={`Case study · ${project.category}`}
      title={project.title}
      intro={
        <>
          {project.subtitle && <p className="font-display font-semibold text-accent-text">{project.subtitle}</p>}
          <p className={project.subtitle ? 'mt-1' : ''}>{project.summary}</p>
        </>
      }
      actions={
        <ButtonLink to="/projects" variant="ghost" size="sm" icon={<LayoutGrid size={15} aria-hidden />}>
          All projects
        </ButtonLink>
      }
    >
      <Seo
        title={`${project.title} — case study`}
        description={project.summary}
        path={`/projects/${project.slug}`}
        image={`/og/${project.slug}.jpg`}
        type="article"
        jsonLd={jsonLd}
      />
      <CaseStudy key={project.slug} project={project} prev={prev} next={next} />
    </PageFrame>
  );
}
