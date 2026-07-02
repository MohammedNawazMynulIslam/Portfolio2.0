"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth";
import {
  deleteExperience,
  deleteProject,
  deleteSkillGroup,
  saveExperience,
  saveProject,
  saveSkillGroup,
  updateAbout,
  updateProfile,
} from "@/lib/data";
import type {
  About,
  ExperienceItem,
  Profile,
  Project,
  SkillGroup,
} from "@/lib/types";

function refresh(): void {
  revalidatePath("/");
}

export async function updateProfileAction(formData: FormData): Promise<Profile> {
  await requireAdmin();
  const profile = await updateProfile(formData);
  refresh();
  return profile;
}

export async function updateAboutAction(formData: FormData): Promise<About> {
  await requireAdmin();
  const about = await updateAbout(formData);
  refresh();
  return about;
}

export async function saveSkillGroupAction(formData: FormData): Promise<SkillGroup[]> {
  await requireAdmin();
  const skills = await saveSkillGroup(formData);
  refresh();
  return skills;
}

export async function deleteSkillGroupAction(id: string): Promise<SkillGroup[]> {
  await requireAdmin();
  const skills = await deleteSkillGroup(id);
  refresh();
  return skills;
}

export async function saveExperienceAction(formData: FormData): Promise<ExperienceItem[]> {
  await requireAdmin();
  const experience = await saveExperience(formData);
  refresh();
  return experience;
}

export async function deleteExperienceAction(id: string): Promise<ExperienceItem[]> {
  await requireAdmin();
  const experience = await deleteExperience(id);
  refresh();
  return experience;
}

export async function saveProjectAction(formData: FormData): Promise<Project[]> {
  await requireAdmin();
  const projects = await saveProject(formData);
  refresh();
  return projects;
}

export async function deleteProjectAction(id: string): Promise<Project[]> {
  await requireAdmin();
  const projects = await deleteProject(id);
  refresh();
  return projects;
}
