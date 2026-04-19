"use client";

import { Globe, Lock, RefreshCw, Search } from "lucide-react";

import { withWindow } from "@/hoc/withWindow";

function SafariWindow() {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(243,247,255,0.92))] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/70 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span className="truncate">https://portfolio.mynul.dev</span>
            <Search className="ml-auto h-4 w-4" />
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center p-8">
        <div className="w-full max-w-3xl rounded-[32px] border border-slate-200/70 bg-white/85 p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-[0_18px_40px_rgba(37,99,235,0.22)]">
            <Globe className="h-9 w-9" />
          </span>
          <h2 className="mt-6 font-georama text-3xl font-semibold tracking-tight text-slate-900">
            Portfolio Browser
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A simple Safari-style window for browsing my work, experiments, and
            interactive desktop portfolio experience.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              "Animated UI systems",
              "Story-driven portfolio builds",
              "Motion, state, and polish",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-5 text-sm font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withWindow(SafariWindow, {
  id: "safari",
  title: "Safari",
  icon: Globe,
  defaultSize: { w: 840, h: 560 },
});
