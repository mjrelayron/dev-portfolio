import { ArrowRight, Gamepad2 } from 'lucide-react';
import { PageFrame } from '../app/PageFrame';
import { Seo } from '../app/Seo';
import { ButtonLink } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { stations, type Station } from '../lab/stations';
import '../lab/lab.css';

function StationCard({ s, featured }: { s: Station; featured?: boolean }) {
  const Icon = s.icon;
  const titleId = `station-${s.slug}`;
  return (
    <article aria-labelledby={titleId} className={`lab-station group ${featured ? 'lab-station--featured' : ''} ${s.external ? 'lab-station--arcade' : ''}`}>
      <div className="flex items-start gap-4">
        <span className="lab-station__icon" aria-hidden>
          <Icon size={featured ? 26 : 22} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="mono-label text-accent-text">{s.kicker}</p>
          <h2 id={titleId} className={`mt-1 font-display font-bold text-ink ${featured ? 'text-[1.6rem]' : 'text-[1.25rem]'}`}>
            {s.name}
          </h2>
        </div>
      </div>
      <p className={`mt-3 text-ink-2 ${featured ? 'max-w-xl text-[1.02rem]' : 'text-[0.95rem]'}`}>{s.description}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${s.name} features`}>
        {s.tags.map((t) => (
          <li key={t}>
            <Tag>{t}</Tag>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-5">
        <ButtonLink
          to={s.path}
          size={featured ? 'md' : 'sm'}
          variant={featured ? 'primary' : 'ghost'}
          icon={s.external ? <Gamepad2 size={16} aria-hidden /> : undefined}
          aria-describedby={titleId}
        >
          {s.cta}
          <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </ButtonLink>
      </div>
    </article>
  );
}

export default function LabPage() {
  const [featured, ...rest] = stations;
  const lab = rest.filter((s) => !s.external);
  const arcade = rest.filter((s) => s.external);
  return (
    <PageFrame
      accent="mint"
      wide
      eyebrow="Experiment Lab"
      title="Working tools, not screenshots"
      intro="Every station here is a real tool I built — simulators that end in a quote, a live scraping control room and an AI assistant that knows my work. Pick one and poke at it."
      bot={{ state: 'point', bubble: 'Pick a station. Everything here is hands-on.' }}
    >
      <Seo
        title="Experiment Lab"
        description="Interactive project simulators with quote generators, a live scraping dashboard, an AI chat assistant and an English practice tutor."
        path="/lab"
      />

      <p className="mono-label mb-3 text-ink-3">
        {stations.length} stations · {stations.length - arcade.length} in the lab · {arcade.length} arcade cabinet
      </p>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <StationCard s={featured} featured />
        </div>
        {lab.map((s) => (
          <StationCard key={s.slug} s={s} />
        ))}
      </div>

      {arcade.length > 0 && (
        <section aria-labelledby="lab-arcade" className="mt-8">
          <h2 id="lab-arcade" className="mono-label mb-3 text-ink-3">
            Also in the arcade
          </h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {arcade.map((s) => (
              <StationCard key={s.slug} s={s} />
            ))}
          </div>
        </section>
      )}
    </PageFrame>
  );
}
