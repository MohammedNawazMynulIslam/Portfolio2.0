import "server-only";

import { cookies } from "next/headers";

import {
  ADMIN_COOKIE,
  createAdminToken,
  verifyToken,
} from "@/lib/token";

export { ADMIN_COOKIE, verifyToken };

const SESSION_MAX_AGE_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_MAX_AGE_DAYS * MS_PER_DAY),
  });
}

export async function deleteAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error("Unauthorized");
  }
}
