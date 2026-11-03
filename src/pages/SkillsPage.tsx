import { LayoutGrid } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo } from '../app/Seo';
import { ButtonLink } from '../components/ui/Button';
import { allSkills, skillGroups } from '../data/skills';
import { profile } from '../data/profile';
import { StatStrip, SkillGroups } from '../professional/SkillSheet';
import { LevelPips } from '../professional/common';
import '../professional/professional.css';

const evidenceProjects = new Set(allSkills.flatMap((s) => s.projects.map((p) => p.slug))).size;

export default function SkillsPage() {
  return (
    <PageFrame
      accent="sky"
      eyebrow="Skill Academy"
      title="Character sheet"
      intro={
        <p>
          {allSkills.length} skills across {skillGroups.length} stats, each one backed by shipped work. Tap any skill to see the projects that prove it.
        </p>
      }
      actions={
        <ButtonLink to="/projects" variant="ghost" size="sm" icon={<LayoutGrid size={16} aria-hidden />}>
          See all projects
        </ButtonLink>
      }
      bot={{ state: 'point', bubble: 'Tap a skill for the receipts.' }}
    >
      <Seo
        title="Skills"
        description={`The tech stack of ${profile.name}: ${allSkills
          .slice()
          .sort((a, b) => b.level - a.level)
          .slice(0, 8)
          .map((s) => s.name)
          .join(', ')} and more — every skill linked to the projects that use it.`}
        path="/skills"
      />

      <section className="pro-section" aria-label="Stats overview">
        <StatStrip />
        <div className="pro-card mt-4 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex shrink-0 items-center gap-3">
            <LevelPips level={3} />
            <span className="mono-label text-accent-text">How levels work</span>
          </div>
          <p className="text-sm text-ink-2">
            Levels aren't a self-rating. Each one is earned from evidence: the shipped projects that list the skill, plus this site's own code. More projects, higher level, max 5.{' '}
            <span className="text-ink-3">{evidenceProjects} projects count as evidence on this sheet. Stat numbers are each category's average level out of 100.</span>
          </p>
        </div>
      </section>

      <section className="pro-section" aria-label="Skill categories">
        <SkillGroups />
      </section>
    </PageFrame>
  );
}
