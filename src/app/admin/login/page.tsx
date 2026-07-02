import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="card-surface p-8">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
            Admin
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-foreground">
            Sign in to manage content
          </h1>
          <p className="mt-2 text-sm text-muted">
            Enter the admin password to edit your portfolio.
          </p>
          <div className="mt-6">
            <LoginForm />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/" className="text-accent hover:underline">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
