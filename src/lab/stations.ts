// The Experiment Lab's stations. Descriptions are written from what each tool
// actually does (see the component named in `source`).
import type { LucideIcon } from 'lucide-react';
import { Boxes, Radar, MessagesSquare, GraduationCap, Workflow } from 'lucide-react';

export interface Station {
  slug: string;
  path: string;
  name: string;
  kicker: string;
  description: string;
  cta: string;
  icon: LucideIcon;
  tags: string[];
  /** the page intro on /lab/:tool */
  intro?: string;
  /** a tool that lives elsewhere (the arcade) */
  external?: boolean;
}

export const stations: Station[] = [
  {
    slug: 'simulators',
    path: '/lab/simulators',
    name: 'Project Simulators',
    kicker: 'Station 01 · Quote builder',
    description:
      'Pick a service — SEO, WordPress, full-stack or AI automation — play through a hands-on simulator, then turn the result into an itemised quote.',
    cta: 'Start a simulation',
    icon: Boxes,
    tags: ['4 simulators', 'Quote generators', 'Process timelines'],
    intro:
      'Choose a service, try a simplified version of the real process, and leave with a ballpark quote you can send straight to me.',
  },
  {
    slug: 'scraping-dashboard',
    path: '/lab/scraping-dashboard',
    name: 'Scraping Dashboard',
    kicker: 'Station 02 · Live backend',
    description:
      'The control room for a video-scraping service I run: live job stats, create, start, pause or cancel jobs, toggle schedules and inspect results.',
    cta: 'Open the dashboard',
    icon: Radar,
    tags: ['Live API', 'Jobs & schedules', 'Node on Railway'],
    intro: 'A working control panel wired to the scraping backend. Stats and jobs load live from the API.',
  },
  {
    slug: 'chat',
    path: '/lab/chat',
    name: 'AI Chat',
    kicker: 'Station 03 · MelBot',
    description:
      'A full-page chat with MelBot, an assistant briefed on my skills, projects and experience. Supports voice input and read-aloud replies.',
    cta: 'Ask MelBot',
    icon: MessagesSquare,
    tags: ['LLM chat', 'Voice input', 'Text-to-speech'],
    intro: 'Ask anything about my work, stack or availability. History is kept on this device for 48 hours.',
  },
  {
    slug: 'practice',
    path: '/lab/practice',
    name: 'English Practice',
    kicker: 'Station 04 · Tutor mode',
    description:
      'MelBot in tutor mode: chat about tech, life or anything else and get feedback on your grammar and vocabulary as you go.',
    cta: 'Start practising',
    icon: GraduationCap,
    tags: ['Tutor mode', 'Grammar feedback', 'Voice input'],
    intro: 'A conversation partner that corrects as it chats. Type or use the mic.',
  },
  {
    slug: 'workflow-challenger',
    path: '/arcade/workflow-challenger',
    name: 'Workflow Challenger',
    kicker: 'Arcade cabinet · Automation',
    description:
      'Choose an automation tool — Zapier, n8n, Power Automate and more — and get a curated feed of tutorials and real-world challenges.',
    cta: 'Play in the arcade',
    icon: Workflow,
    tags: ['Automation', 'Curated tutorials'],
    external: true,
  },
];

export const stationBySlug = Object.fromEntries(stations.filter((s) => !s.external).map((s) => [s.slug, s])) as Record<string, Station>;
