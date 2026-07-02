"use client";

import {
  Briefcase,
  Code,
  Cpu,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

import { logout } from "@/actions/auth";
import { AboutEditor } from "@/components/admin/AboutEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { ProjectsEditor } from "@/components/admin/ProjectsEditor";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import type { PortfolioData } from "@/lib/types";

type Tab =
  | "overview"
  | "profile"
  | "about"
  | "skills"
  | "experience"
  | "projects";

const TABS: { id: Tab; label: string; Icon: typeof User }[] = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "profile", label: "Profile", Icon: User },
  { id: "about", label: "About", Icon: Sparkles },
  { id: "skills", label: "Skills", Icon: Cpu },
  { id: "experience", label: "Experience", Icon: Briefcase },
  { id: "projects", label: "Projects", Icon: Code },
];

interface AdminDashboardProps {
  initialData: PortfolioData;
}

export function AdminDashboard({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [tab, setTab] = useState<Tab>("overview");
  const [loggingOut, startLogout] = useTransition();

  function handleLogout() {
    startLogout(async () => {
      await logout();
    });
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="container-px flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-accent">
              Admin
            </span>
            <span className="text-sm text-muted">·</span>
            <span className="text-sm font-medium text-foreground">
              {data.profile.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-red-500/60 hover:text-red-300 disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              {loggingOut ? "…" : "Log out"}
            </button>
          </div>
        </div>
      </header>

      <div className="container-px grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  tab === id
                    ? "border border-border-strong bg-card text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          {tab === "overview" ? (
            <Overview data={data} onNavigate={setTab} />
          ) : null}
          {tab === "profile" ? (
            <Section title="Profile" description="Hero, identity, and social links shown across the site.">
              <ProfileEditor
                profile={data.profile}
                onUpdated={(profile) => setData((d) => ({ ...d, profile }))}
              />
            </Section>
          ) : null}
          {tab === "about" ? (
            <Section title="About" description="Current status, bio, future goal, and stats.">
              <AboutEditor
                about={data.about}
                onUpdated={(about) => setData((d) => ({ ...d, about }))}
              />
            </Section>
          ) : null}
          {tab === "skills" ? (
            <Section title="Skills" description="Group your skills by category.">
              <SkillsEditor
                skills={data.skills}
                onUpdated={(skills) => setData((d) => ({ ...d, skills }))}
              />
            </Section>
          ) : null}
          {tab === "experience" ? (
            <Section title="Experience" description="Company, team, current project, and achievements.">
              <ExperienceEditor
                experience={data.experience}
                onUpdated={(experience) => setData((d) => ({ ...d, experience }))}
              />
            </Section>
          ) : null}
          {tab === "projects" ? (
            <Section title="Projects" description="Live link, GitHub, details, and tech stack.">
              <ProjectsEditor
                projects={data.projects}
                onUpdated={(projects) => setData((d) => ({ ...d, projects }))}
              />
            </Section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Overview({
  data,
  onNavigate,
}: {
  data: PortfolioData;
  onNavigate: (tab: Tab) => void;
}) {
  const cards = [
    { label: "Profile", value: data.profile.role, tab: "profile" as Tab },
    { label: "Skill groups", value: `${data.skills.length}`, tab: "skills" as Tab },
    { label: "Experience entries", value: `${data.experience.length}`, tab: "experience" as Tab },
    { label: "Projects", value: `${data.projects.length}`, tab: "projects" as Tab },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Overview
      </h1>
      <p className="mt-1 text-sm text-muted">
        Manage all dynamic content on your portfolio. Changes go live instantly.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.tab)}
            className="card-surface flex items-center justify-between p-5 text-left transition-colors hover:border-accent"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                {card.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {card.value}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted" />
          </button>
        ))}
      </div>
    </div>
  );
}
