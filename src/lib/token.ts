import "server-only";

import crypto from "node:crypto";

export const ADMIN_COOKIE = "portfolio_admin";
const SESSION_MAX_AGE_DAYS = 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set. Add it to your .env file.");
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createAdminToken(): string {
  const expiresAt = Date.now() + SESSION_MAX_AGE_DAYS * MS_PER_DAY;
  const value = `admin.${expiresAt}`;
  return `${value}.${sign(value)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [prefix, expiresAtStr, signature] = parts;
  if (prefix !== "admin") return false;
  const value = `${prefix}.${expiresAtStr}`;
  const expected = sign(value);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;
  return true;
}
