"use client";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import dynamic from "next/dynamic";
import {
  FileText,
  FolderOpen,
  Globe,
  Image as ImageIcon,
  Info,
  MonitorSmartphone,
  PlusSquare,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Dock } from "@/components/Dock";
import { Navbar } from "@/components/Navbar";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useWindowStore } from "@/store/windowStore";

gsap.registerPlugin(Draggable);

type DesktopShortcut = {
  id: string;
  label: string;
  appId: "finder" | "resume" | "photos" | "safari";
  icon: typeof FolderOpen;
  position: {
    x: number;
    y: number;
  };
};

const INITIAL_SHORTCUTS: DesktopShortcut[] = [
  {
    id: "finder-shortcut",
    label: "Projects",
    appId: "finder",
    icon: FolderOpen,
    position: { x: 36, y: 44 },
  },
  {
    id: "resume-shortcut",
    label: "Resume",
    appId: "resume",
    icon: FileText,
    position: { x: 36, y: 154 },
  },
  {
    id: "photos-shortcut",
    label: "Gallery",
    appId: "photos",
    icon: ImageIcon,
    position: { x: 36, y: 264 },
  },
  {
    id: "safari-shortcut",
    label: "Browser",
    appId: "safari",
    icon: Globe,
    position: { x: 36, y: 374 },
  },
];

function WindowLoadingSkeleton() {
  return (
    <div className="absolute left-24 top-16 h-[420px] w-[640px] overflow-hidden rounded-[28px] border border-white/12 bg-white/6 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <div className="glass-dark h-12 border-b border-white/10" />
      <div className="space-y-4 p-6">
        <div className="h-6 w-48 rounded-full bg-white/10" />
        <div className="h-32 rounded-3xl bg-white/8" />
        <div className="h-20 rounded-3xl bg-white/8" />
      </div>
    </div>
  );
}

const WINDOW_COMPONENTS = {
  finder: dynamic(() => import("@/windows/FinderWindow"), {
    ssr: false,
    loading: WindowLoadingSkeleton,
  }),
  safari: dynamic(() => import("@/windows/SafariWindow"), {
    ssr: false,
    loading: WindowLoadingSkeleton,
  }),
  resume: dynamic(() => import("@/windows/ResumeWindow"), {
    ssr: false,
    loading: WindowLoadingSkeleton,
  }),
  contact: dynamic(() => import("@/windows/ContactWindow"), {
    ssr: false,
    loading: WindowLoadingSkeleton,
  }),
  photos: dynamic(() => import("@/windows/PhotosWindow"), {
    ssr: false,
    loading: WindowLoadingSkeleton,
  }),
  fileviewer: dynamic(() => import("@/windows/FileViewerWindow"), {
    ssr: false,
    loading: WindowLoadingSkeleton,
  }),
} as const;

const DESKTOP_APPS = [
  "finder",
  "safari",
  "resume",
  "contact",
  "photos",
  "fileviewer",
] as const;

export function Desktop() {
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const shortcutRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dragStartRef = useRef<Record<string, { x: number; y: number }>>({});
  const [shortcuts, setShortcuts] = useState(INITIAL_SHORTCUTS);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const windows = useWindowStore((state) => state.windows);
  const openWindow = useWindowStore((state) => state.openWindow);

  const visibleWindows = useMemo(
    () =>
      DESKTOP_APPS.filter((id) => windows[id].isOpen && !windows[id].isMinimized).map(
        (id) => ({
          id,
          Component: WINDOW_COMPONENTS[id],
          zIndex: windows[id].zIndex,
        }),
      ),
    [windows],
  );

  useIsomorphicLayoutEffect(() => {
    const context = gsap.context(() => {
      const created = shortcuts
        .map((shortcut) => {
          const element = shortcutRefs.current[shortcut.id];

          if (!element) {
            return null;
          }

          gsap.set(element, {
            x: shortcut.position.x,
            y: shortcut.position.y,
          });

          return Draggable.create(element, {
            type: "x,y",
            bounds: surfaceRef.current ?? undefined,
            onPress() {
              dragStartRef.current[shortcut.id] = { ...shortcut.position };
            },
            onDragEnd() {
              const start = dragStartRef.current[shortcut.id] ?? shortcut.position;

              setShortcuts((current) =>
                current.map((item) =>
                  item.id === shortcut.id
                    ? {
                        ...item,
                        position: {
                          x: Math.max(16, start.x + this.x),
                          y: Math.max(16, start.y + this.y),
                        },
                      }
                    : item,
                ),
              );

              gsap.set(element, { x: 0, y: 0 });
            },
          })[0];
        })
        .filter(Boolean);

      return () => {
        created.forEach((instance) => instance?.kill());
      };
    }, surfaceRef);

    return () => context.revert();
  }, [shortcuts]);

  useEffect(() => {
    const handleWindowClick = () => {
      setContextMenu(null);
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const handleDesktopContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  };

  const openAppFromShortcut = (appId: DesktopShortcut["appId"]) => {
    openWindow(appId);
  };

  const menuItems = [
    {
      label: "New Folder",
      icon: PlusSquare,
      onClick: () => setContextMenu(null),
    },
    {
      label: "Change Wallpaper",
      icon: MonitorSmartphone,
      onClick: () => setContextMenu(null),
    },
    {
      label: "About This Mac",
      icon: Info,
      onClick: () => {
        setContextMenu(null);
        setShowAboutModal(true);
      },
    },
  ];

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="md:hidden">
        <MobileLanding />
      </div>

      <div className="hidden md:block">
        <Navbar />

        <div
          ref={surfaceRef}
          className="absolute inset-x-0 top-7 bottom-[90px] overflow-hidden"
          onContextMenu={handleDesktopContextMenu}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a3a5c_0%,_#0d1b2a_40%,_#0a0a1a_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_30%)]" />

          <div className="absolute inset-0">
            {shortcuts.map((shortcut) => {
              const Icon = shortcut.icon;

              return (
                <button
                  key={shortcut.id}
                  ref={(element) => {
                    shortcutRefs.current[shortcut.id] = element;
                  }}
                  type="button"
                  onDoubleClick={() => openAppFromShortcut(shortcut.appId)}
                  className="absolute flex w-20 cursor-default flex-col items-center text-center text-white drop-shadow-[0_6px_16px_rgba(0,0,0,0.32)]"
                >
                  <span className="glass flex h-14 w-14 items-center justify-center rounded-2xl">
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="mt-2 rounded-md bg-black/25 px-2 py-0.5 text-xs font-medium">
                    {shortcut.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="absolute inset-0">
            {visibleWindows.map(({ id, Component, zIndex }) => (
              <div key={id} className="absolute inset-0" style={{ zIndex }}>
                <Component />
              </div>
            ))}
          </div>

          {contextMenu ? (
            <div
              ref={menuRef}
              className="glass-dark absolute z-[9997] min-w-[220px] rounded-2xl p-2 text-sm text-white shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onClick={(event) => event.stopPropagation()}
            >
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.onClick}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-white/10"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>

        <Dock />

        {showAboutModal ? (
          <div className="absolute inset-0 z-[10001] flex items-center justify-center bg-slate-950/45 backdrop-blur-sm">
            <div className="glass-dark w-full max-w-md rounded-[28px] p-6 text-white shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white">
                <MonitorSmartphone className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-center font-georama text-2xl font-semibold">
                About This Mac
              </h2>
              <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                <p>
                  <span className="font-semibold text-white">System:</span> Portfolio OS 2025
                </p>
                <p>
                  <span className="font-semibold text-white">Owner:</span> Mynul Islam
                </p>
                <p>
                  <span className="font-semibold text-white">Machine:</span> MacBook Portfolio Pro
                </p>
                <p>
                  <span className="font-semibold text-white">Memory:</span> 8 GB RAM of creativity
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="mt-6 w-full rounded-full bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/15"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function MobileLanding() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a3a5c_0%,_#0d1b2a_40%,_#0a0a1a_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.14),transparent_30%)]" />
      <div className="glass relative z-10 w-full max-w-sm rounded-[32px] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
          Mobile View
        </p>
        <h1 className="mt-4 font-georama text-4xl font-semibold tracking-tight">
          Mynul Islam
        </h1>
        <p className="mt-2 text-lg text-white/80">Full Stack Developer</p>
        <p className="mt-5 text-sm leading-7 text-white/72">
          I design and build polished digital products with a strong focus on motion,
          interaction, and narrative. For the full desktop portfolio experience, visit on
          a larger screen.
        </p>
        <div className="mt-6 grid gap-3">
          <a
            href="https://github.com/mynul"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/12 px-4 py-3 text-center text-sm font-medium transition hover:bg-white/18"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/mynul-islam"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/12 px-4 py-3 text-center text-sm font-medium transition hover:bg-white/18"
          >
            LinkedIn
          </a>
          <a
            href="/resume.pdf"
            download
            className="rounded-full bg-sky-500 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-400"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
