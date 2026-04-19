"use client";

import gsap from "gsap";
import {
  ChevronLeft,
  Download,
  FileCode2,
  FileText,
  FolderOpen,
  Grid2X2,
  HardDrive,
  Home,
  LayoutList,
  Link2,
  Monitor,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  FINDER_DATA,
  type FinderItem,
  type FinderItemKind,
} from "@/constants/data";
import { withWindow } from "@/hoc/withWindow";
import { useFileViewerStore } from "@/store/fileViewerStore";
import { useLocationStore } from "@/store/locationStore";
import { useWindowStore } from "@/store/windowStore";

type ViewMode = "grid" | "list";

interface SidebarItem {
  label: string;
  icon: typeof Home;
  path: string[];
}

const FAVORITES: SidebarItem[] = [
  { label: "Home", icon: Home, path: ["Home"] },
  { label: "Desktop", icon: Monitor, path: ["Home", "Desktop"] },
  { label: "Downloads", icon: Download, path: ["Home", "Downloads"] },
  { label: "Projects", icon: FolderOpen, path: ["Home", "Projects"] },
];

const LOCATIONS: SidebarItem[] = [
  { label: "Portfolio Drive", icon: HardDrive, path: ["Home"] },
];

const KIND_LABELS: Record<FinderItemKind, string> = {
  folder: "Folder",
  tsx: "TypeScript React Document",
  jsx: "JavaScript React Document",
  md: "Markdown Document",
};

const ITEM_ICON_STYLES: Record<FinderItemKind, string> = {
  folder: "text-amber-300",
  tsx: "text-sky-300",
  jsx: "text-cyan-300",
  md: "text-emerald-300",
};

const CONTENT_TOP_LEVEL = new Set(["About", "Skills", "Resume", "Desktop", "Downloads"]);

function getPathKey(path: string[]) {
  return path.join("/");
}

function getFinderItems(path: string[]) {
  const key = getPathKey(path);
  const directMatch = FINDER_DATA[key];

  if (directMatch) {
    return directMatch.items;
  }

  const lastSegment = path[path.length - 1];

  if (CONTENT_TOP_LEVEL.has(lastSegment)) {
    return [
      {
        name: `${lastSegment.toLowerCase()}-overview.md`,
        kind: "md" as const,
        dateModified: "Apr 19, 2026",
        size: "8 KB",
        description: `A quick overview of ${lastSegment} content for the portfolio Finder experience.`,
        techStack: ["Markdown", "Content Strategy"],
        githubUrl: "https://github.com/mynul/portfolio2.0",
        liveDemoUrl: "https://portfolio.example.com",
      },
    ];
  }

  return [];
}

function FinderWindow() {
  const currentPath = useLocationStore((state) => state.currentPath);
  const selectedFile = useLocationStore((state) => state.selectedFile);
  const navigate = useLocationStore((state) => state.navigate);
  const goBack = useLocationStore((state) => state.goBack);
  const selectFile = useLocationStore((state) => state.selectFile);
  const reset = useLocationStore((state) => state.reset);
  const openFile = useFileViewerStore((state) => state.openFile);
  const openWindow = useWindowStore((state) => state.openWindow);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const items = useMemo(() => getFinderItems(currentPath), [currentPath]);
  const selectedItem =
    items.find((item) => item.name === selectedFile && item.kind !== "folder") ?? null;
  const breadcrumb = currentPath.join(" > ");

  const jumpToPath = (targetPath: string[]) => {
    reset();

    targetPath.slice(1).forEach((segment) => {
      navigate(segment);
    });
  };

  const handleItemClick = (item: FinderItem) => {
    if (item.kind === "folder") {
      navigate(item.name);
      return;
    }

    selectFile(item.name);

    if (item.viewerFile) {
      openFile(item.viewerFile);
      openWindow("fileviewer");
    }
  };

  const renderItemIcon = (kind: FinderItemKind, className: string) => {
    if (kind === "folder") {
      return <FolderOpen className={`${className} ${ITEM_ICON_STYLES[kind]}`} />;
    }

    if (kind === "md") {
      return <FileText className={`${className} ${ITEM_ICON_STYLES[kind]}`} />;
    }

    return <FileCode2 className={`${className} ${ITEM_ICON_STYLES[kind]}`} />;
  };

  return (
    <div className="flex h-full bg-slate-950/20 text-white">
      <aside className="glass-dark flex w-[200px] shrink-0 flex-col border-r border-white/10 px-3 py-4">
        <SidebarSection
          title="Favorites"
          items={FAVORITES}
          currentPath={currentPath}
          onSelect={jumpToPath}
        />
        <SidebarSection
          title="Locations"
          items={LOCATIONS}
          currentPath={currentPath}
          onSelect={jumpToPath}
        />
      </aside>

      <div className="flex min-w-0 flex-1">
        <section className="flex min-w-0 flex-1 flex-col">
          <header className="glass-dark flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={goBack}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white/90 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={currentPath.length <= 1}
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
              <span className="truncate">{breadcrumb}</span>
            </div>

            <div className="flex items-center rounded-full border border-white/10 bg-white/10 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  viewMode === "grid" ? "bg-white/20 text-white" : "text-white/70"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Grid2X2 className="h-4 w-4" />
                  Grid
                </span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  viewMode === "list" ? "bg-white/20 text-white" : "text-white/70"
                }`}
              >
                <span className="flex items-center gap-2">
                  <LayoutList className="h-4 w-4" />
                  List
                </span>
              </button>
            </div>

            <div className="flex min-w-[170px] items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/50">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>
          </header>

          <div className="flex min-h-0 flex-1">
            <div className="min-w-0 flex-1 overflow-y-auto px-4 py-4">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-4">
                  {items.map((item) => {
                    const isSelected = selectedItem?.name === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={(event) =>
                          gsap.to(event.currentTarget, {
                            scale: 1.05,
                            duration: 0.15,
                            ease: "power2.out",
                          })
                        }
                        onMouseLeave={(event) =>
                          gsap.to(event.currentTarget, {
                            scale: 1,
                            duration: 0.15,
                            ease: "power2.out",
                          })
                        }
                        className={`flex h-[90px] flex-col items-center justify-center rounded-2xl border px-2 text-center transition ${
                          isSelected
                            ? "border-sky-300/50 bg-sky-400/15"
                            : "border-white/8 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        {renderItemIcon(item.kind, "h-9 w-9")}
                        <span className="mt-2 line-clamp-2 text-xs text-white/90">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/10">
                  <div className="grid grid-cols-[minmax(0,1.5fr)_140px_100px_180px] gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.16em] text-white/45">
                    <span>Name</span>
                    <span>Date Modified</span>
                    <span>Size</span>
                    <span>Kind</span>
                  </div>
                  {items.map((item) => {
                    const isSelected = selectedItem?.name === item.name;

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={`grid w-full grid-cols-[minmax(0,1.5fr)_140px_100px_180px] gap-3 border-b border-white/5 px-4 py-3 text-left text-sm transition last:border-b-0 ${
                          isSelected ? "bg-sky-400/15" : "hover:bg-white/6"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          {renderItemIcon(item.kind, "h-5 w-5 shrink-0")}
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="truncate text-white/65">{item.dateModified}</span>
                        <span className="text-white/65">{item.size}</span>
                        <span className="truncate text-white/65">{KIND_LABELS[item.kind]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="glass-dark hidden w-[280px] shrink-0 border-l border-white/10 p-4 lg:flex lg:flex-col">
              {selectedItem ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    {renderItemIcon(selectedItem.kind, "h-10 w-10")}
                    <h3 className="mt-4 text-xl font-semibold text-white">
                      {selectedItem.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {selectedItem.description}
                    </p>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Tech Stack
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedItem.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Links
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                      {selectedItem.githubUrl ? (
                        <a
                          href={selectedItem.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-sky-300 transition hover:text-sky-200"
                        >
                          <Link2 className="h-4 w-4" />
                          GitHub
                        </a>
                      ) : null}
                      {selectedItem.liveDemoUrl ? (
                        <a
                          href={selectedItem.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-emerald-300 transition hover:text-emerald-200"
                        >
                          <Link2 className="h-4 w-4" />
                          Live Demo
                        </a>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-white/5 px-6 text-center">
                  <FolderOpen className="h-10 w-10 text-white/35" />
                  <p className="mt-4 text-lg font-medium text-white/85">Quick Look</p>
                  <p className="mt-2 text-sm leading-6 text-white/55">
                    Select a project file to preview its description, stack, and links.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}

function SidebarSection({
  title,
  items,
  currentPath,
  onSelect,
}: {
  title: string;
  items: SidebarItem[];
  currentPath: string[];
  onSelect: (path: string[]) => void;
}) {
  return (
    <div className="mb-6">
      <p className="px-2 text-xs uppercase tracking-[0.18em] text-white/35">{title}</p>
      <div className="mt-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = getPathKey(currentPath) === getPathKey(item.path);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-sky-400/18 text-white"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default withWindow(FinderWindow, {
  id: "finder",
  title: "Finder",
  icon: FolderOpen,
  defaultSize: { w: 760, h: 500 },
});
