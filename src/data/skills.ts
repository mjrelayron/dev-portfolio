// Skills are derived, not declared: every skill lists the projects whose
// `technologies` mention it. Level = how many projects use it (evidence), not a
// self-rated percentage. "This site" counts tech used in this repo's own code.
import { projects, type Project } from './portfolio';

export interface Skill {
  name: string;
  aliases: string[];
  /** used in this portfolio's own codebase */
  inThisSite?: boolean;
  projects: Project[];
  level: number; // 1–5
}

export interface SkillGroup {
  id: string;
  name: string;
  stat: string; // RPG stat name
  blurb: string;
  skills: Skill[];
}

type Def = { name: string; aliases?: string[]; inThisSite?: boolean };

const groups: { id: string; name: string; stat: string; blurb: string; defs: Def[] }[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    stat: 'DEX',
    blurb: 'Interfaces people enjoy using.',
    defs: [
      { name: 'React', inThisSite: true },
      { name: 'Next.js' },
      { name: 'TypeScript', inThisSite: true },
      { name: 'JavaScript', inThisSite: true },
      { name: 'Tailwind CSS', inThisSite: true },
      { name: 'CSS', aliases: ['CSS3', 'Responsive Design'], inThisSite: true },
      { name: 'Framer Motion', inThisSite: true },
      { name: 'Vite', inThisSite: true },
      { name: 'React Native', aliases: ['Expo', 'NativeWind'] },
    ],
  },
  {
    id: 'backend',
    name: 'Backend & Data',
    stat: 'STR',
    blurb: 'APIs, databases and the plumbing between.',
    defs: [
      { name: 'Node.js', aliases: ['Express', 'Express.js'], inThisSite: true },
      { name: 'Python', aliases: ['Asyncio', 'Click', 'Pandas'] },
      { name: 'FastAPI' },
      { name: 'NestJS' },
      { name: 'PHP' },
      { name: 'PostgreSQL' },
      { name: 'MongoDB' },
      { name: 'MySQL' },
      { name: 'Redis' },
      { name: 'Prisma' },
      { name: 'Firebase', aliases: ['Firestore'] },
      { name: 'Neo4j' },
      { name: 'Docker' },
    ],
  },
  {
    id: 'ai',
    name: 'AI & Automation',
    stat: 'INT',
    blurb: 'LLMs, agents, scrapers and workflows.',
    defs: [
      { name: 'OpenAI API', aliases: ['AI Integration'] },
      { name: 'Gemini API', inThisSite: true },
      { name: 'LangChain' },
      { name: 'ChromaDB' },
      { name: 'Ollama' },
      { name: 'Voice AI', aliases: ['Deepgram', 'ElevenLabs', 'Twilio'] },
      { name: 'Playwright', inThisSite: true },
      { name: 'Streamlit' },
      { name: 'TensorFlow.js' },
      { name: 'WebSockets', aliases: ['Socket.io'] },
    ],
  },
  {
    id: 'cms',
    name: 'CMS & Commerce',
    stat: 'CON',
    blurb: 'Stores and sites clients can run themselves.',
    defs: [
      { name: 'WordPress' },
      { name: 'WooCommerce' },
      { name: 'Shopify', aliases: ['Liquid'] },
      { name: 'Payments', aliases: ['Stripe API', 'Payment Integration', 'Payment Gateway'] },
      { name: 'AWS SES' },
    ],
  },
  {
    id: 'growth',
    name: 'SEO & Marketing',
    stat: 'CHA',
    blurb: 'Getting the work found, and chosen.',
    defs: [
      { name: 'SEO', aliases: ['SEO Analysis', 'Local SEO Analysis', 'Real Estate SEO', 'Technical Audit'] },
      { name: 'Content Strategy', aliases: ['Content Marketing', 'Content Creation', 'Strategy', 'Brand Strategy'] },
      { name: 'Social Media', aliases: ['Community Management'] },
      { name: 'Analytics', aliases: ['Performance Tracking'], inThisSite: true },
    ],
  },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9.+#]/g, '');

function build(def: Def): Skill {
  const keys = [def.name, ...(def.aliases ?? [])].map(norm);
  const used = projects.filter((p) => p.tech.some((t) => keys.includes(norm(t))));
  const evidence = used.length + (def.inThisSite ? 1 : 0);
  return { name: def.name, aliases: def.aliases ?? [], inThisSite: def.inThisSite, projects: used, level: Math.max(1, Math.min(5, Math.ceil(evidence / 1.4))) };
}

export const skillGroups: SkillGroup[] = groups.map((g) => ({
  id: g.id,
  name: g.name,
  stat: g.stat,
  blurb: g.blurb,
  skills: g.defs.map(build).filter((s) => s.projects.length || s.inThisSite).sort((a, b) => b.level - a.level || b.projects.length - a.projects.length),
}));

export const allSkills: Skill[] = skillGroups.flatMap((g) => g.skills);
export const skillByName = Object.fromEntries(allSkills.map((s) => [s.name, s]));

/** Group "power" for the stat panel: average level, as 0–100. */
export const groupPower = (g: SkillGroup) => Math.round((g.skills.reduce((a, s) => a + s.level, 0) / (g.skills.length * 5)) * 100);
