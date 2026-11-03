// Single source for identity + contact details. Every value here is taken from
// the pre-existing site (HeroSection, AboutSection, ContactSection, index.html).
import { profileAssets } from '../utils/assets';

export const profile = {
  name: 'MJR Elayron',
  fullName: 'Melvin Jr. Elayron',
  handle: 'mjr',
  headline: 'Full-Stack Developer, Automation Architect & COO of SkillFoundri',
  shortBio:
    'I design and build web products, AI tools and automations — and I lead the teams that ship them.',
  roles: [
    'Startup Co-Founder',
    'Tech Director',
    'SEO Strategist',
    'UI/UX Designer',
    'WordPress Developer',
    'Automation Architect',
    'Product Innovator',
  ],
  story: [
    'My journey began in 2015 when I was recognized as "Programmer-of-the-Year" at Davao Oriental State University. This early recognition fueled my passion for technology and innovation.',
    "Over the years, I've evolved from a passionate programmer to a Tech Director, leading teams and driving digital transformation across various organizations.",
    "Today, I'm co-founding and leading SkillFoundri as COO and Lead Developer — an ed-tech startup built around project-based learning and industry-relevant skill development.",
  ],
  stats: [
    { label: 'Years experience', value: '7+' },
    { label: 'Websites managed', value: '50+' },
    { label: 'Team members led', value: '15+' },
    { label: 'Projects completed', value: '100+' },
  ],
  photo: profileAssets.photo as string,
  email: 'mjr.elayron@gmail.com',
  phone: '+63 994 5063 085',
  resumeUrl: '/resume/MJR-Elayron-Resume.pdf',
  links: {
    linkedin: 'https://www.linkedin.com/in/melvin-jr-elayron/',
    github: 'https://github.com/bonch223',
    facebook: 'https://www.facebook.com/bonch223/',
  },
  siteUrl: 'https://mjre-portfolio.vercel.app',
} as const;

export type Profile = typeof profile;
