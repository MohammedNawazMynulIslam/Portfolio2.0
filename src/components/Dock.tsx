"use client";

import gsap from "gsap";
import Image from "next/image";
import { useMemo, useRef } from "react";

import { DOCK_APPS } from "@/constants/apps";
import { useLocationStore } from "@/store/locationStore";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useWindowStore } from "@/store/windowStore";
import type { ThemeMode } from "@/components/Navbar";

const GAUSSIAN_SIGMA = 80;
const MAX_SCALE_BOOST = 0.6;
const DOCK_ICON_SRC: Record<string, string> = {
  finder: "/images/finder.png",
  safari: "/images/safari.png",
  photos: "/images/photos.png",
  contact: "/images/contact.png",
};

interface DockProps {
  theme: ThemeMode;
}

export function Dock({ theme }: DockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null);
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const frameRef = useRef<number | null>(null);
  const pointerXRef = useRef<number | null>(null);
  const windows = useWindowStore((state) => state.windows);
  const openWindow = useWindowStore((state) => state.openWindow);
  const restoreWindow = useWindowStore((state) => state.restoreWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const setFinderPath = useLocationStore((state) => state.setPath);

  const apps = useMemo(() => DOCK_APPS, []);

  useIsomorphicLayoutEffect(() => {
    if (!dockRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        dockRef.current,
        { y: 100, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "back.out(1.5)",
          delay: 0.3,
        },
      );
    }, dockRef);

    return () => context.revert();
  }, []);

  const animateScale = (id: string, scale: number) => {
    const element = iconRefs.current[id];

    if (!element) {
      return;
    }

    gsap.to(element, {
      scale,
      duration: 0.15,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    pointerXRef.current = event.clientX;

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const pointerX = pointerXRef.current;

      if (pointerX === null) {
        frameRef.current = null;
        return;
      }

      apps.forEach((app) => {
        const element = iconRefs.current[app.id];

        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(pointerX - centerX);
        const scale =
          1 +
          MAX_SCALE_BOOST *
            Math.exp(-(distance ** 2) / (2 * GAUSSIAN_SIGMA ** 2));

        animateScale(app.id, scale);
      });

      frameRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    apps.forEach((app) => animateScale(app.id, 1));
  };

  const handleAppClick = (id: (typeof apps)[number]["id"]) => {
    const window = windows[id];

    if (!window.isOpen) {
      openWindow(id);
      return;
    }

    if (window.isMinimized) {
      restoreWindow(id);
      return;
    }

    minimizeWindow(id);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[9998] flex justify-center px-4">
      <div
        ref={dockRef}
        className={`pointer-events-auto flex items-end gap-2 rounded-[13px] border px-9 py-3 backdrop-blur-2xl ${
          theme === "dark"
            ? "border-white/20 bg-[#151c53]/62 shadow-[0_18px_54px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.22)]"
            : "border-white/55 bg-white/42 shadow-[0_18px_54px_rgba(30,64,175,0.22),inset_0_1px_0_rgba(255,255,255,0.72)]"
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {apps.map((app) => {
          const isOpen = windows[app.id]?.isOpen;

          return (
            <div key={app.id} className="group relative flex flex-col items-center">
              <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-lg border border-white/10 bg-black/65 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
                {app.label}
              </div>
              <button
                ref={(element) => {
                  iconRefs.current[app.id] = element;
                }}
                type="button"
                aria-label={`Open ${app.label}`}
                className="flex h-[52px] w-[52px] origin-bottom transform-gpu items-center justify-center transition-transform"
                onClick={() => handleAppClick(app.id)}
              >
                <Image
                  src={DOCK_ICON_SRC[app.id]}
                  alt=""
                  width={58}
                  height={58}
                  className="h-[52px] w-[52px] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.24)]"
                  draggable={false}
                />
              </button>
              <span
                className={`mt-2 h-1.5 w-1.5 rounded-full bg-white/90 transition-opacity ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          );
        })}

        <div className="group relative flex flex-col items-center">
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-black/78 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
            Terminal
          </div>
          <button
            type="button"
            aria-label="Terminal"
            className="flex h-[52px] w-[52px] items-center justify-center"
            onClick={() => {
              setFinderPath(["Home", "Skills"]);
              openWindow("finder");
            }}
          >
            <Image
              src="/images/terminal.png"
              alt=""
              width={58}
              height={58}
              className="h-[52px] w-[52px] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.24)]"
              draggable={false}
            />
          </button>
          <span className="mt-2 h-1.5 w-1.5 opacity-0" />
        </div>

        <div className="group relative flex flex-col items-center">
          <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-md bg-black/78 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-lg transition duration-150 group-hover:-translate-y-1 group-hover:opacity-100">
            Trash
          </div>
          <button
            type="button"
            aria-label="Trash"
            className="flex h-[52px] w-[52px] items-center justify-center"
          >
            <Image
              src="/images/trash.png"
              alt=""
              width={58}
              height={58}
              className="h-[52px] w-[52px] object-contain drop-shadow-[0_8px_8px_rgba(0,0,0,0.24)]"
              draggable={false}
            />
          </button>
          <span className="mt-2 h-1.5 w-1.5 opacity-0" />
        </div>
      </div>
    </div>
  );
}
