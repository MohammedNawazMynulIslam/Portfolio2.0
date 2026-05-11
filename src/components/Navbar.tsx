"use client";

import gsap from "gsap";
import { Check, CircleUserRound, Search, SlidersHorizontal, Wifi } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useWindowStore } from "@/store/windowStore";

const MENU_ITEMS = ["Projects", "Testimonials", "Contact", "Resume"] as const;
const BRAND_NAME = "Mynul's Portfolio";

function AppleLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4 fill-current"
    >
      <path d="M15.61 2.03c.1 1.08-.29 2.15-.86 2.87-.62.8-1.67 1.42-2.7 1.34-.13-1.05.35-2.13.95-2.82.65-.77 1.77-1.32 2.61-1.39ZM18.74 12.98c-.02-2.35 1.92-3.48 2.01-3.53-1.09-1.6-2.79-1.82-3.39-1.84-1.44-.15-2.81.85-3.54.85-.75 0-1.89-.83-3.11-.81-1.6.03-3.09.93-3.91 2.35-1.67 2.87-.43 7.12 1.19 9.47.79 1.14 1.73 2.42 2.97 2.37 1.19-.05 1.64-.76 3.08-.76 1.43 0 1.84.76 3.11.73 1.29-.02 2.1-1.16 2.88-2.31.91-1.33 1.28-2.62 1.3-2.69-.03-.01-2.56-.99-2.59-3.83Z" />
    </svg>
  );
}

function formatClock(date: Date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${weekday} ${month} ${day}  ${time}`;
}

export function Navbar() {
  const navbarRef = useRef<HTMLElement | null>(null);
  const [showThemeMenu, setShowThemeMenu] = useState(true);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const activeWindowTitle = useWindowStore((state) =>
    state.activeWindowId ? state.windows[state.activeWindowId].title : BRAND_NAME,
  );
  const [clock, setClock] = useState(() => formatClock(new Date()));

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setClock(formatClock(new Date()));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!navbarRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        navbarRef.current,
        { y: -28, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power2.out",
        },
      );
    }, navbarRef);

    return () => context.revert();
  }, []);

  return (
    <header
      ref={navbarRef}
      className="fixed inset-x-0 top-0 z-[9999] h-8 border-b border-black/10 bg-white/76 font-georama text-[13px] text-black shadow-[0_1px_10px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
    >
      <div className="relative flex h-full items-center justify-between gap-3 px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-4">
          <button
            type="button"
            aria-label="Apple menu"
            className="flex h-5 w-5 items-center justify-center rounded-md text-black transition hover:bg-black/[0.08]"
          >
            <AppleLogo />
          </button>
          <span className="truncate text-[15px] font-bold text-black">
            {activeWindowId ? activeWindowTitle : BRAND_NAME}
          </span>
          <nav className="hidden items-center gap-6 text-[13px] font-semibold text-black md:flex">
            {MENU_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                className="transition hover:text-black/60"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-3 text-black sm:gap-4">
          <Wifi className="h-4 w-4 stroke-[2.4]" />
          <button
            type="button"
            aria-label="Search"
            className="flex h-5 w-5 items-center justify-center rounded-md transition hover:bg-black/[0.08]"
          >
            <Search className="h-4 w-4 stroke-[2.4]" />
          </button>
          <CircleUserRound className="h-4 w-4 stroke-[2.4]" />
          <button
            type="button"
            aria-label="Theme menu"
            className="relative flex h-5 w-5 items-center justify-center rounded-md transition hover:bg-black/[0.08]"
            onClick={() => setShowThemeMenu((current) => !current)}
          >
            <SlidersHorizontal className="h-4 w-4 stroke-[2.4]" />
          </button>
          <span className="font-semibold tracking-normal text-black">
            {clock}
          </span>
        </div>

        {showThemeMenu ? (
          <div className="absolute right-[94px] top-[35px] w-[154px] overflow-hidden rounded-lg border border-black/10 bg-white/82 p-1 text-[13px] text-black shadow-[0_18px_42px_rgba(15,23,42,0.28)] backdrop-blur-2xl">
            <button
              type="button"
              className="flex w-full items-center rounded-md px-3 py-1.5 text-left hover:bg-black/5"
            >
              Light Mode
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md bg-[#0a84ff] px-3 py-1.5 text-left text-white"
            >
              <span>Dark Mode</span>
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
