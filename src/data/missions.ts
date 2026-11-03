// Project Explorer missions. Every clue paraphrases the target's real
// `summary`, and the hints are read straight from its `category` and `tech`
// in portfolio.ts — nothing here is invented. Missions whose target slug no
// longer exists are dropped, so the game can never point at a missing page.
import { projectBySlug, type Project } from './portfolio';

export interface Mission {
  id: string;
  title: string;
  clue: string;
  target: string;
  hints: string[];
  project: Project;
}

const defs: { id: string; title: string; clue: string; target: string; techHint?: string }[] = [
  { id: 'lesson-plans', title: 'The Teacher’s Helper', clue: 'Find the AI platform that generates personalized lesson plans for Filipino teachers.', target: 'guro-ai', techHint: 'OpenAI API' },
  { id: 'face-attendance', title: 'Who’s Here?', clue: 'Find the multi-tenant PWA that tracks attendance with facial recognition — and works offline.', target: 'whosin', techHint: 'TensorFlow.js' },
  { id: 'million-emails', title: 'Mail Cannon', clue: 'Find the command-line email infrastructure that sends 1.2M+ emails per campaign.', target: 'armet-limited-emailer', techHint: 'AWS SES' },
  { id: 'legal-pdfs', title: 'Paper Mountain', clue: 'Find the local AI system that lets legal teams chat with thousands of PDFs without data leaving the premises.', target: 'documind-rag', techHint: 'Ollama' },
  { id: 'voice-agent', title: 'Please Hold', clue: 'Find the low-latency voice AI agent that handles customer support calls.', target: 'voiceops-agent', techHint: 'Twilio' },
  { id: 'procurement', title: 'Follow the Money', clue: 'Find the open-source platform that analyses government procurement data for corruption risks.', target: 'project-cartel', techHint: 'Neo4j' },
];

export const missions: Mission[] = defs.flatMap((d) => {
  const p = projectBySlug[d.target];
  if (!p) {
    if (import.meta.env?.DEV) console.warn(`[missions] target "${d.target}" not found — mission "${d.id}" skipped`);
    return [];
  }
  const tech = d.techHint && p.tech.includes(d.techHint) ? d.techHint : p.tech[0];
  return [{ id: d.id, title: d.title, clue: d.clue, target: d.target, project: p, hints: [`Category: ${p.category}`, `Built with ${tech}`] }];
});

export const missionById = Object.fromEntries(missions.map((m) => [m.id, m])) as Record<string, Mission>;
