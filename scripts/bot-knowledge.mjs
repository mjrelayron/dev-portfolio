// Builds api/knowledge.json: everything MelBot is allowed to say, generated from
// the same data the site renders (profile, projects, career, skills, pages,
// services). Called from scripts/prerender.mjs on every build; the file is also
// committed so the serverless function always has it.
import fs from 'node:fs';

const SERVICES = [
  { name: 'SEO Optimization', what: 'Analyze a website, research keywords and optimize it for search engines.', estimate: '/lab/simulators' },
  { name: 'WordPress Development', what: 'Responsive, custom WordPress and WooCommerce sites.', estimate: '/lab/simulators' },
  { name: 'Full Stack Development', what: 'Databases, APIs and full-featured web applications.', estimate: '/lab/simulators' },
  { name: 'AI & Automation', what: 'Custom AI agents, chatbots and automated workflows.', estimate: '/lab/simulators' },
  { name: 'UI/UX Design', what: 'Intuitive interfaces and user experiences.', estimate: null },
  { name: 'Digital Marketing', what: 'Campaigns, performance analysis and conversions.', estimate: null },
  { name: 'Tech Consultation', what: 'Advice on technology choices and business strategy.', estimate: null },
];

const PAGES = [
  { path: '/', what: 'The hub map: an explorable world with six islands (one per section).' },
  { path: '/projects', what: 'The Showroom: gallery and exhibition hall of every project.' },
  { path: '/skills', what: 'Skill Academy: skills, each backed by the projects that use it.' },
  { path: '/experience', what: 'Experience Tower: one floor per role.' },
  { path: '/about', what: 'About Melvin: story, stats and how he works.' },
  { path: '/resume', what: 'Resume viewer and PDF download.' },
  { path: '/contact', what: 'Contact Portal: contact form, direct links, and project quotes.' },
  { path: '/lab', what: 'Experiment Lab: project simulators with quote estimates, the scraping dashboard, AI chat, English practice.' },
  { path: '/lab/simulators', what: 'Pick a service, configure a project, and get a quote estimate.' },
  { path: '/arcade', what: 'Arcade: Stack Builder, Bug Hunter, Project Explorer and Workflow Challenger.' },
  { path: '/os', what: 'Developer OS: the portfolio as a desktop with windows and a terminal.' },
  { path: '/classic', what: 'Classic view: a plain, fast index of all content.' },
];

const trim = (s, n = 600) => (s && s.length > n ? s.slice(0, n - 1) + '…' : s || undefined);

export function buildKnowledge({ profile, projects, experience, skillGroups }) {
  return {
    generatedAt: new Date().toISOString(),
    site: profile.siteUrl,
    person: {
      name: profile.fullName,
      goesBy: profile.name,
      headline: profile.headline,
      bio: profile.shortBio,
      story: profile.story,
      roles: profile.roles,
      stats: profile.stats,
    },
    contact: {
      email: profile.email,
      phone: profile.phone,
      linkedin: profile.links.linkedin,
      github: profile.links.github,
      facebook: profile.links.facebook,
      resume: profile.resumeUrl,
      contactPage: '/contact',
    },
    experience: experience.map((r) => ({ period: r.period, title: r.title, company: r.company, summary: r.summary, highlights: r.highlights })),
    projects: projects.map((p) => ({
      title: p.title,
      caseStudy: `/projects/${p.slug}`,
      subtitle: p.subtitle,
      category: p.category,
      year: p.year,
      status: p.status,
      featured: p.featured || undefined,
      summary: p.summary,
      overview: trim(p.overview),
      problem: trim(p.problem, 300),
      solution: trim(p.solution, 300),
      impact: trim(p.impact, 300),
      role: p.role,
      tech: p.tech,
      features: p.features?.length ? p.features : undefined,
      metrics: p.metrics?.length ? p.metrics.map((m) => `${m.label}: ${m.value}`) : undefined,
      liveUrl: p.liveUrl,
      hasDemoLogin: p.demoLogin ? 'yes, shown on the case study page' : undefined,
    })),
    skills: skillGroups.map((g) => ({
      group: g.name,
      skills: g.skills.map((s) => ({ name: s.name, level: `${s.level}/5`, usedIn: s.projects.map((p) => p.title) })),
    })),
    services: SERVICES,
    pages: PAGES,
  };
}

export function writeKnowledge(data, file = 'api/knowledge.json') {
  fs.writeFileSync(file, JSON.stringify(buildKnowledge(data), null, 1) + '\n');
  return fs.statSync(file).size;
}
