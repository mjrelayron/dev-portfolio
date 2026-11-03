// Experience timeline, newest first. Named career.ts (not experience.ts) so it never shadows experience.js. Copied from the previous site's About
// section (the longest verified version); `src/data/experience.js` stays as-is
// because api/chat.js imports it.
import { companyAssets } from '../utils/assets';

export interface Role {
  id: string;
  period: string;
  title: string;
  company: string;
  logo?: string;
  summary: string;
  highlights: string[];
}

export const experience: Role[] = [
  {
    id: 'skillfoundri',
    period: '2024 – Present',
    title: 'CTO & Lead Developer',
    company: 'SkillFoundri · LodsTech.io',
    logo: companyAssets.skillfoundriLogo,
    summary:
      'Co-founder and CTO / Lead Developer of SkillFoundri — an ed-tech platform combining features of Upwork, Asana, Blackboard and Coursera — which now continues as LodsTech.',
    highlights: ['Co-founded the ed-tech startup', 'Led full-stack development', 'Securing strategic partnerships', 'Building a comprehensive learning platform'],
  },
  {
    id: 'accc',
    period: 'Jan 2026 – Aug 2026',
    title: 'Patient Coordinator',
    company: 'ACCC · American Critical Care Consult',
    summary: 'Patient coordination for ACCC — and developed MedOps, the internal app the team used for patients, visits and recertifications.',
    highlights: ['Developed MedOps (Next.js, TypeScript, Supabase)'],
  },
  {
    id: 'armet',
    period: '2023 – 2024',
    title: 'Tech Director · Web Dev Team Lead',
    company: 'Armet Limited',
    logo: companyAssets.armetLimited,
    summary: 'Led web development projects specializing in WordPress and Shopify, providing technical guidance to improve system performance and user experience.',
    highlights: ['Led 15+ web projects', 'Improved team efficiency by 40%', 'Mentored 8 developers'],
  },
  {
    id: 'atci-sas',
    period: '2022 – 2023',
    title: 'SAS Director',
    company: 'Aces Tagum College, Inc.',
    logo: companyAssets.atci,
    summary: 'Student Affairs Services Director, overseeing student services, activities and support programs, with initiatives to improve student experience and engagement.',
    highlights: ['Directed student affairs services', 'Enhanced student engagement', 'Led support programs'],
  },
  {
    id: 'atci-coord',
    period: '2021 – 2022',
    title: 'BSIT Program Coordinator',
    company: 'Aces Tagum College, Inc.',
    logo: companyAssets.atci,
    summary: 'Coordinated the BS Information Technology program: curriculum development, student guidance and program quality assurance.',
    highlights: ['Coordinated the BSIT program', 'Managed curriculum development', 'Ensured program quality'],
  },
  {
    id: 'atci-mis',
    period: '2019 – 2023',
    title: 'MIS Manager',
    company: 'Aces Tagum College, Inc.',
    logo: companyAssets.atci,
    summary: 'Managed IT infrastructure including servers, workstations and networking; improved web systems and provided IT support.',
    highlights: ['Managed 200+ workstations', 'Reduced downtime by 60%', 'Trained 50+ staff members'],
  },
  {
    id: 'atci-instructor',
    period: '2019 – 2023',
    title: 'BSIT Instructor',
    company: 'Aces Tagum College, Inc.',
    logo: companyAssets.atci,
    summary: 'Taught Data Structures, Programming 1 & 2, Web Development, Multimedia and Capstone Project, mentoring students through their final projects.',
    highlights: ['Data Structures & Algorithms', 'Programming 1 & 2', 'Supervised Capstone projects'],
  },
  {
    id: 'whitehat',
    period: '2016 – 2019',
    title: 'SEO Specialist',
    company: 'White-Hat SEO',
    logo: companyAssets.whiteHat,
    summary: 'Managed 50+ websites, social media accounts and online shops; created graphics and video content for marketing campaigns.',
    highlights: ['Managed 50+ websites', 'Increased organic traffic by 300%', 'Created 200+ marketing assets'],
  },
  {
    id: 'dorsu',
    period: '2015 – 2016',
    title: 'Part-time Lecturer',
    company: 'Davao Oriental State University',
    summary: 'Delivered programming lectures to undergraduate students. "Programmer-of-the-Year", batch of 2015.',
    highlights: ['Taught 200+ students', 'Programmer-of-the-Year 2015', 'Developed curriculum materials'],
  },
  {
    id: 'dopmc',
    period: '2014 – 2015',
    title: 'OJT Developer',
    company: 'DOPMC',
    summary: 'On-the-job training building a Fixed Assets Management System.',
    highlights: ['Developed a Fixed Assets Management System', 'Hands-on system design'],
  },
];

/** Other companies shown in the previous site's logo wall. */
export const otherClients = [{ name: 'Traveling Californian', role: 'SEO & Web Development', period: '2016 – 2019', logo: companyAssets.travelingCalifornian }];
