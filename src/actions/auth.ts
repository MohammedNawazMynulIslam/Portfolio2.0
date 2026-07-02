"use server";

import crypto from "node:crypto";
import { redirect } from "next/navigation";

import {
  createAdminSession,
  deleteAdminSession,
} from "@/lib/auth";

export interface LoginState {
  error?: string;
}

function getAdminPassword(): string | undefined {
  return process.env.ADMIN_PASSWORD;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function login(
  state: LoginState | undefined,
  formData: FormData,
): Promise<LoginState> {
  const password = formData.get("password");
  const expected = getAdminPassword();

  if (!expected) {
    return { error: "Admin password is not configured. Set ADMIN_PASSWORD in your .env file." };
  }

  if (typeof password !== "string" || password.length === 0 || !safeEqual(password, expected)) {
    return { error: "Incorrect password. Please try again." };
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await deleteAdminSession();
  redirect("/admin/login");
}
