// The six hub destinations. Accent colour is the destination's identity in the
// map, the dock, page headers and transition wipes.
export type Accent = 'violet' | 'sky' | 'orange' | 'mint' | 'white';

export interface Destination {
  id: 'hub' | 'projects' | 'skills' | 'experience' | 'lab' | 'contact';
  key: string; // keyboard shortcut
  name: string;
  short: string;
  path: string;
  accent: Accent;
  blurb: string;
  icon: 'Home' | 'LayoutGrid' | 'GraduationCap' | 'Building2' | 'FlaskConical' | 'Send';
}

export const destinations: Destination[] = [
  { id: 'hub', key: '1', name: 'Central Hub', short: 'Hub', path: '/about', accent: 'white', icon: 'Home', blurb: 'Meet the developer behind the verse.' },
  { id: 'projects', key: '2', name: 'Project District', short: 'Work', path: '/projects', accent: 'violet', icon: 'LayoutGrid', blurb: 'Case studies of shipped work.' },
  { id: 'skills', key: '3', name: 'Skill Academy', short: 'Skills', path: '/skills', accent: 'sky', icon: 'GraduationCap', blurb: 'The tech stack, backed by projects.' },
  { id: 'experience', key: '4', name: 'Experience Tower', short: 'Career', path: '/experience', accent: 'orange', icon: 'Building2', blurb: 'One floor per role, since 2014.' },
  { id: 'lab', key: '5', name: 'Experiment Lab', short: 'Lab', path: '/lab', accent: 'mint', icon: 'FlaskConical', blurb: 'Simulators, AI chat and live tools.' },
  { id: 'contact', key: '6', name: 'Contact Portal', short: 'Contact', path: '/contact', accent: 'white', icon: 'Send', blurb: 'Start a project or say hello.' },
];

export const destinationById = Object.fromEntries(destinations.map((d) => [d.id, d])) as Record<Destination['id'], Destination>;

/** Which destination a pathname belongs to (for breadcrumbs, accents, map zoom). */
export function destinationForPath(pathname: string): Destination | null {
  if (pathname === '/about' || pathname === '/resume') return destinationById.hub;
  const seg = '/' + (pathname.split('/')[1] ?? '');
  return destinations.find((d) => d.path === seg) ?? null;
}

export const accentVar: Record<Accent, string> = {
  violet: '#6C63FF',
  sky: '#42BDF5',
  orange: '#FFAD5A',
  mint: '#79D8A0',
  white: '#FFFFFF',
};
