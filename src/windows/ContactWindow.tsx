"use client";

import {
  AtSign,
  Globe,
  Link2,
  Mail,
  Mail as MailIcon,
  MapPin,
  MessageCircleMore,
} from "lucide-react";

import { CONTACT_PROFILE } from "@/constants/data";
import { withWindow } from "@/hoc/withWindow";

const INITIAL = CONTACT_PROFILE.name.charAt(0).toUpperCase();

function ContactWindow() {
  return (
    <div className="flex h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,247,255,0.9))] text-slate-800">
      <aside className="flex w-[200px] shrink-0 flex-col border-r border-slate-200/80 bg-white/65 p-4 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          All Contacts
        </p>
        <button
          type="button"
          className="mt-4 flex items-center gap-3 rounded-2xl border border-sky-200/70 bg-sky-50 px-3 py-3 text-left shadow-[0_10px_30px_rgba(14,116,217,0.08)]"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-lg font-semibold text-white">
            {INITIAL}
          </span>
          <span>
            <span className="block font-medium text-slate-900">{CONTACT_PROFILE.name}</span>
            <span className="block text-xs text-slate-500">{CONTACT_PROFILE.jobTitle}</span>
          </span>
        </button>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 text-3xl font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,0.24)]">
                  {INITIAL}
                </span>
                <div>
                  <h1 className="font-georama text-3xl font-semibold tracking-tight text-slate-900">
                    {CONTACT_PROFILE.name}
                  </h1>
                  <p className="mt-1 text-sm text-slate-600">{CONTACT_PROFILE.jobTitle}</p>
                </div>
              </div>

              <a
                href={`mailto:${CONTACT_PROFILE.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-sky-600 px-4 text-sm font-medium text-white transition hover:bg-sky-700"
              >
                <MessageCircleMore className="h-4 w-4" />
                Send Message
              </a>
            </div>

            <div className="mt-8 grid gap-4">
              <ContactRow
                icon={Mail}
                label="Email"
                href={`mailto:${CONTACT_PROFILE.email}`}
                value={CONTACT_PROFILE.email}
              />
              <ContactRow
                icon={Link2}
                label="GitHub"
                href={CONTACT_PROFILE.github}
                value={CONTACT_PROFILE.github.replace("https://", "")}
                external
              />
              <ContactRow
                icon={Globe}
                label="LinkedIn"
                href={CONTACT_PROFILE.linkedin}
                value={CONTACT_PROFILE.linkedin.replace("https://", "")}
                external
              />
              <ContactRow
                icon={AtSign}
                label="Twitter / X"
                href={CONTACT_PROFILE.twitter}
                value={CONTACT_PROFILE.twitter.replace("https://", "")}
                external
              />
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Location</p>
                  <p className="text-sm font-medium text-slate-700">{CONTACT_PROFILE.location}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200/80 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Social
              </p>
              <div className="mt-4 flex items-center gap-3">
                <SocialButton href={`mailto:${CONTACT_PROFILE.email}`} label="Email">
                  <MailIcon className="h-5 w-5" />
                </SocialButton>
                <SocialButton href={CONTACT_PROFILE.github} label="GitHub" external>
                  <Link2 className="h-5 w-5" />
                </SocialButton>
                <SocialButton href={CONTACT_PROFILE.linkedin} label="LinkedIn" external>
                  <Globe className="h-5 w-5" />
                </SocialButton>
                <SocialButton href={CONTACT_PROFILE.twitter} label="Twitter / X" external>
                  <AtSign className="h-5 w-5" />
                </SocialButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  href,
  value,
  external = false,
}: {
  icon: typeof Mail;
  label: string;
  href: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 transition hover:border-slate-300 hover:bg-white"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
        <p className="truncate text-sm font-medium text-slate-700">{value}</p>
      </div>
    </a>
  );
}

function SocialButton({
  href,
  label,
  children,
  external = false,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
    >
      {children}
    </a>
  );
}

export default withWindow(ContactWindow, {
  id: "contact",
  title: "Contacts",
  icon: MailIcon,
  defaultSize: { w: 600, h: 480 },
});
