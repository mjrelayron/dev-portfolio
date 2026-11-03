export type AchievementId = 'first-contact' | 'explorer' | 'project-hunter' | 'tech-enthusiast' | 'mission-complete';

export interface Achievement {
  id: AchievementId;
  name: string;
  how: string;
  icon: 'Send' | 'Map' | 'Crosshair' | 'Cpu' | 'Flag';
}

// Achievements are a bonus layer — they never gate content.
export const achievements: Achievement[] = [
  { id: 'first-contact', name: 'First Contact', how: 'Open the Contact Portal or send a message.', icon: 'Send' },
  { id: 'explorer', name: 'Explorer', how: 'Visit all six destinations.', icon: 'Map' },
  { id: 'project-hunter', name: 'Project Hunter', how: 'Open five case studies.', icon: 'Crosshair' },
  { id: 'tech-enthusiast', name: 'Tech Enthusiast', how: 'Visit the Skill Academy and inspect three skills.', icon: 'Cpu' },
  { id: 'mission-complete', name: 'Mission Complete', how: 'Finish every Project Explorer mission.', icon: 'Flag' },
];

export const achievementById = Object.fromEntries(achievements.map((a) => [a.id, a])) as Record<AchievementId, Achievement>;
