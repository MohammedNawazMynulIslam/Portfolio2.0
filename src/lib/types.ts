export interface SocialLinks {
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  heroImage: string;
  resumeUrl: string;
  location: string;
  availability: string;
  social: SocialLinks;
}

export interface About {
  currentStatus: string;
  bio: string;
  futureGoal: string;
  stats: { id: string; label: string; value: string }[];
}

export interface SkillGroup {
  id: string;
  category: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  team: string;
  period: string;
  current: boolean;
  currentProject: string;
  achievements: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  details: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  image: string;
  featured: boolean;
}

export interface PortfolioData {
  profile: Profile;
  about: About;
  skills: SkillGroup[];
  experience: ExperienceItem[];
  projects: Project[];
}
