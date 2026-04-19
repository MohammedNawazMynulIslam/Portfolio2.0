"use client";

import { ArrowDownToLine, FileText as FileTextIcon } from "lucide-react";

import {
  RESUME_EDUCATION,
  RESUME_EXPERIENCE,
  RESUME_PROFILE,
  RESUME_PROJECTS,
  RESUME_SKILLS,
} from "@/constants/data";
import { withWindow } from "@/hoc/withWindow";

function ResumeWindow() {
  return (
    <div className="h-full overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,250,255,0.88))] text-slate-800">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="rounded-[28px] border border-sky-200/60 bg-gradient-to-br from-sky-50 via-white to-indigo-50 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">
                Resume
              </p>
              <h1 className="mt-3 font-georama text-4xl font-semibold tracking-tight text-slate-900">
                {RESUME_PROFILE.name}
              </h1>
              <p className="mt-2 text-lg text-slate-600">{RESUME_PROFILE.role}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
                <a href={`mailto:${RESUME_PROFILE.email}`} className="hover:text-slate-900">
                  {RESUME_PROFILE.email}
                </a>
                <a
                  href={RESUME_PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900"
                >
                  LinkedIn
                </a>
                <a
                  href={RESUME_PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-slate-900"
                >
                  GitHub
                </a>
              </div>
            </div>

            <a
              href="/resume.pdf"
              download
              className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-slate-200 bg-white/90 px-4 text-sm font-medium text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:border-slate-300 hover:text-slate-900"
            >
              <ArrowDownToLine className="h-4 w-4" />
              Download PDF
            </a>
          </div>
        </div>

        <div className="mt-6 grid gap-6">
          <ResumeSection title="Experience">
            <div className="space-y-5">
              {RESUME_EXPERIENCE.map((entry) => (
                <article
                  key={`${entry.company}-${entry.role}`}
                  className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                >
                  <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{entry.company}</h3>
                      <p className="text-sm font-medium text-slate-600">{entry.role}</p>
                    </div>
                    <p className="text-sm text-slate-500">{entry.period}</p>
                  </div>
                  <ul className="mt-4 space-y-2 pl-5 text-sm leading-6 text-slate-700">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="list-disc">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </ResumeSection>

          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <ResumeSection title="Education">
              <div className="space-y-4">
                {RESUME_EDUCATION.map((entry) => (
                  <article
                    key={`${entry.school}-${entry.degree}`}
                    className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{entry.school}</h3>
                    <p className="mt-1 text-sm text-slate-600">{entry.degree}</p>
                    <p className="mt-2 text-sm text-slate-500">{entry.period}</p>
                  </article>
                ))}
              </div>
            </ResumeSection>

            <ResumeSection title="Skills">
              <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]">
                {Object.entries(RESUME_SKILLS).map(([group, skills]) => (
                  <div key={group}>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {group}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ResumeSection>
          </div>

          <ResumeSection title="Projects">
            <div className="grid gap-4 md:grid-cols-3">
              {RESUME_PROJECTS.map((project) => (
                <article
                  key={project.name}
                  className="rounded-3xl border border-slate-200/70 bg-white/85 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
                >
                  <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {project.description}
                  </p>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-sky-700 transition hover:text-sky-900"
                  >
                    {project.label}
                  </a>
                </article>
              ))}
            </div>
          </ResumeSection>
        </div>
      </div>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-300/70" />
        <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-300/70" />
      </div>
      {children}
    </section>
  );
}

export default withWindow(ResumeWindow, {
  id: "resume",
  title: "Resume",
  icon: FileTextIcon,
  defaultSize: { w: 680, h: 600 },
});
