import type { ComponentProps, ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function inputClass() {
  return "w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent";
}

export function Input(props: ComponentProps<"input">) {
  return <input {...props} className={`${inputClass()} ${props.className ?? ""}`} />;
}

export function Textarea(props: ComponentProps<"textarea">) {
  return (
    <textarea
      {...props}
      className={`${inputClass()} min-h-24 resize-y leading-relaxed ${props.className ?? ""}`}
    />
  );
}

export function Checkbox({
  label,
  ...props
}: { label: string } & ComponentProps<"input">) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        {...props}
        className="h-4 w-4 rounded border-border bg-card accent-accent"
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

export function SubmitButton({
  children,
  pending,
}: {
  children: ReactNode;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function Button({
  children,
  variant = "ghost",
  ...props
}: { variant?: "ghost" | "danger" | "outline" } & ComponentProps<"button">) {
  const variants = {
    ghost: "text-muted hover:text-foreground",
    outline: "rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground hover:border-accent hover:text-accent",
    danger: "inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-500/10",
  };
  return (
    <button
      {...props}
      className={`${variants[variant]} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-surface p-6 ${className ?? ""}`}>{children}</div>
  );
}

export function FormStatus({ ok, message }: { ok: boolean; message: string }) {
  if (!message) return null;
  return (
    <p
      className={`rounded-lg border px-3 py-2 text-sm ${
        ok
          ? "border-accent/30 bg-accent-dim text-accent"
          : "border-red-500/30 bg-red-500/10 text-red-300"
      }`}
    >
      {message}
    </p>
  );
}
