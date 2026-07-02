import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type {
  About,
  ExperienceItem,
  PortfolioData,
  Profile,
  Project,
  SkillGroup,
} from "@/lib/types";

const DATA_FILE = path.join(process.cwd(), "data", "portfolio.json");

export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as PortfolioData;
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error("Portfolio data file not found. Ensure data/portfolio.json exists.");
    }
    throw error;
  }
}

async function savePortfolio(data: PortfolioData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

export function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function parseList(value: FormDataEntryValue | null | undefined): string[] {
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getBool(formData: FormData, key: string): boolean {
  return formData.get(key) === "on";
}

export async function updateProfile(formData: FormData): Promise<Profile> {
  const data = await getPortfolio();
  const profile: Profile = {
    name: getString(formData, "name"),
    role: getString(formData, "role"),
    tagline: getString(formData, "tagline"),
    heroImage: getString(formData, "heroImage"),
    resumeUrl: getString(formData, "resumeUrl"),
    location: getString(formData, "location"),
    availability: getString(formData, "availability"),
    social: {
      email: getString(formData, "social.email"),
      github: getString(formData, "social.github"),
      linkedin: getString(formData, "social.linkedin"),
      twitter: getString(formData, "social.twitter"),
    },
  };
  data.profile = profile;
  await savePortfolio(data);
  return profile;
}

export async function updateAbout(formData: FormData): Promise<About> {
  const data = await getPortfolio();
  const statsRaw = getString(formData, "stats");
  const stats = statsRaw
    .split("\n")
    .map((line) => line.split("|"))
    .filter((parts) => parts.length >= 2)
    .map((parts, index) => ({
      id: `stat-${index}-${Math.random().toString(36).slice(2, 6)}`,
      label: parts[0]?.trim() ?? "",
      value: parts[1]?.trim() ?? "",
    }));
  data.about = {
    currentStatus: getString(formData, "currentStatus"),
    bio: getString(formData, "bio"),
    futureGoal: getString(formData, "futureGoal"),
    stats,
  };
  await savePortfolio(data);
  return data.about;
}

export async function saveSkillGroup(formData: FormData): Promise<SkillGroup[]> {
  const data = await getPortfolio();
  const id = getString(formData, "id");
  const items = parseList(formData.get("items"));
  const group: SkillGroup = {
    id: id || createId("skill"),
    category: getString(formData, "category"),
    items,
  };
  const existingIndex = data.skills.findIndex((item) => item.id === group.id);
  if (existingIndex >= 0) {
    data.skills[existingIndex] = group;
  } else {
    data.skills.push(group);
  }
  await savePortfolio(data);
  return data.skills;
}

export async function deleteSkillGroup(id: string): Promise<SkillGroup[]> {
  const data = await getPortfolio();
  data.skills = data.skills.filter((item) => item.id !== id);
  await savePortfolio(data);
  return data.skills;
}

export async function saveExperience(formData: FormData): Promise<ExperienceItem[]> {
  const data = await getPortfolio();
  const id = getString(formData, "id");
  const item: ExperienceItem = {
    id: id || createId("exp"),
    company: getString(formData, "company"),
    role: getString(formData, "role"),
    team: getString(formData, "team"),
    period: getString(formData, "period"),
    current: getBool(formData, "current"),
    currentProject: getString(formData, "currentProject"),
    achievements: parseList(formData.get("achievements")),
  };
  const existingIndex = data.experience.findIndex((entry) => entry.id === item.id);
  if (existingIndex >= 0) {
    data.experience[existingIndex] = item;
  } else {
    data.experience.unshift(item);
  }
  await savePortfolio(data);
  return data.experience;
}

export async function deleteExperience(id: string): Promise<ExperienceItem[]> {
  const data = await getPortfolio();
  data.experience = data.experience.filter((item) => item.id !== id);
  await savePortfolio(data);
  return data.experience;
}

export async function saveProject(formData: FormData): Promise<Project[]> {
  const data = await getPortfolio();
  const id = getString(formData, "id");
  const project: Project = {
    id: id || createId("proj"),
    name: getString(formData, "name"),
    description: getString(formData, "description"),
    details: getString(formData, "details"),
    techStack: parseList(formData.get("techStack")),
    liveUrl: getString(formData, "liveUrl"),
    githubUrl: getString(formData, "githubUrl"),
    image: getString(formData, "image"),
    featured: getBool(formData, "featured"),
  };
  const existingIndex = data.projects.findIndex((item) => item.id === project.id);
  if (existingIndex >= 0) {
    data.projects[existingIndex] = project;
  } else {
    data.projects.unshift(project);
  }
  await savePortfolio(data);
  return data.projects;
}

export async function deleteProject(id: string): Promise<Project[]> {
  const data = await getPortfolio();
  data.projects = data.projects.filter((item) => item.id !== id);
  await savePortfolio(data);
  return data.projects;
}
