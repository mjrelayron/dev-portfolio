import { FileText, Send } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo } from '../app/Seo';
import { ButtonLink } from '../components/ui/Button';
import { experience } from '../data/career';
import { profile } from '../data/profile';
import { Tower } from '../professional/Tower';
import '../professional/professional.css';

const first = experience[experience.length - 1];
const startYear = first?.period.match(/\d{4}/)?.[0];

export default function ExperiencePage() {
  return (
    <PageFrame
      accent="orange"
      eyebrow="Experience Tower"
      title="One floor per role"
      intro={
        <p>
          {experience.length} floors{startYear ? `, from ${startYear} to today` : ''}: from on-the-job training and teaching to leading web teams and co-founding a startup.
        </p>
      }
      actions={
        <>
          <ButtonLink to="/resume" size="sm" icon={<FileText size={16} aria-hidden />}>
            Resume
          </ButtonLink>
          <ButtonLink to="/contact" variant="ghost" size="sm" icon={<Send size={16} aria-hidden />}>
            Get in touch
          </ButtonLink>
        </>
      }
      bot={{ state: 'wave', bubble: 'Going down? Every floor is a chapter.' }}
    >
      <Seo
        title="Experience"
        description={`Career of ${profile.name}: ${experience
          .slice(0, 3)
          .map((r) => `${r.title} at ${r.company}`)
          .join('; ')} and more.`}
        path="/experience"
      />
      <Tower />
    </PageFrame>
  );
}
