"use client";

import { Lock } from "lucide-react";
import { useActionState } from "react";

import { login, type LoginState } from "@/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState | undefined, FormData>(
    login,
    undefined,
  );

  return (
    <form action={action} className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Admin password
        </span>
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3">
          <Lock className="h-4 w-4 text-muted" />
          <input
            name="password"
            type="password"
            autoFocus
            required
            placeholder="Enter password"
            className="w-full bg-transparent py-3 text-foreground outline-none placeholder:text-muted"
          />
        </div>
      </label>

      {state?.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
