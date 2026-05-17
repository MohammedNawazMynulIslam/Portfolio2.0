"use client";

import gsap from "gsap";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileCode2,
  FileText,
  FolderOpen,
  HardDrive,
  Home,
  Link2,
  Monitor,
  Search,
} from "lucide-react";
import Image from "next/image";
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

const WORK_ITEMS: FinderItem[] = [
  {
    name: "Project 1 (SnapCast)",
    kind: "folder",
    dateModified: "May 1, 2026",
    size: "--",
  },
  {
    name: "Project 2 (Converso)",
    kind: "folder",
    dateModified: "May 2, 2026",
    size: "--",
  },
  {
    name: "Project 3 (PrepWise)",
    kind: "folder",
    dateModified: "May 3, 2026",
    size: "--",
  },
  {
    name: "Project 4 (Bookwise)",
    kind: "folder",
    dateModified: "May 4, 2026",
    size: "--",
  },
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

  if (key === "Home/Projects") {
    return WORK_ITEMS;
  }

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
  const windowTitle = getPathKey(currentPath) === "Home/Projects" ? "Work" : currentPath.at(-1) ?? "Work";

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
    <div className="finder-surface flex h-full overflow-hidden text-white">
      <aside className="finder-sidebar flex w-[220px] shrink-0 flex-col border-r px-3 py-4">
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
          <header className="finder-toolbar flex h-[70px] items-center gap-5 border-b px-6">
            <button
              type="button"
              onClick={goBack}
              className="finder-nav-button flex h-9 w-9 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-35"
              disabled={currentPath.length <= 1}
              aria-label="Go back"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              type="button"
              className="finder-nav-button flex h-9 w-9 items-center justify-center opacity-40"
              aria-label="Go forward"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            <h2 className="finder-title min-w-0 flex-1 truncate text-[24px] font-bold">
              {windowTitle}
            </h2>
            <button
              type="button"
              onClick={() => setViewMode((mode) => (mode === "grid" ? "list" : "grid"))}
              className="finder-search-button flex h-10 w-10 items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="h-7 w-7" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1">
            <div className="finder-content min-w-0 flex-1 overflow-y-auto px-10 py-14">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 gap-x-24 gap-y-24 2xl:gap-x-32">
                  {items.map((item) => {
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={(event) =>
                          gsap.to(event.currentTarget, {
                            scale: 1.04,
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
                        className="finder-grid-item flex min-h-[130px] flex-col items-center justify-start text-center transition"
                      >
                        {item.kind === "folder" ? (
                          <Image
                            src="/images/folder.png"
                            alt=""
                            width={92}
                            height={86}
                            className="h-[74px] w-[92px] object-contain"
                            draggable={false}
                          />
                        ) : (
                          renderItemIcon(item.kind, "h-[74px] w-[74px]")
                        )}
                        <span className="finder-item-label mt-4 line-clamp-2 max-w-[230px] text-[21px] font-semibold leading-tight">
                          {item.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="finder-list overflow-hidden rounded-2xl border">
                  <div className="finder-list-header grid grid-cols-[minmax(0,1.5fr)_140px_100px_180px] gap-3 border-b px-4 py-3 text-xs uppercase tracking-[0.16em]">
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
                        className={`finder-list-row grid w-full grid-cols-[minmax(0,1.5fr)_140px_100px_180px] gap-3 border-b px-4 py-3 text-left text-sm transition last:border-b-0 ${
                          isSelected ? "is-selected" : ""
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          {renderItemIcon(item.kind, "h-5 w-5 shrink-0")}
                          <span className="truncate">{item.name}</span>
                        </span>
                        <span className="truncate opacity-70">{item.dateModified}</span>
                        <span className="opacity-70">{item.size}</span>
                        <span className="truncate opacity-70">{KIND_LABELS[item.kind]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="finder-preview hidden w-[280px] shrink-0 border-l p-4 lg:flex lg:flex-col">
              {selectedItem ? (
                <>
                  <div className="finder-preview-card rounded-2xl border p-4">
                    {renderItemIcon(selectedItem.kind, "h-10 w-10")}
                    <h3 className="finder-preview-title mt-4 text-xl font-semibold">
                      {selectedItem.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 opacity-70">
                      {selectedItem.description}
                    </p>
                  </div>
                  <div className="finder-preview-card mt-4 rounded-2xl border p-4">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-50">
                      Tech Stack
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedItem.techStack?.map((tech) => (
                        <span
                          key={tech}
                          className="finder-chip rounded-full border px-3 py-1 text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="finder-preview-card mt-4 rounded-2xl border p-4">
                    <p className="text-xs uppercase tracking-[0.18em] opacity-50">
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
                <div className="finder-preview-empty flex h-full flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center">
                  <FolderOpen className="h-10 w-10 opacity-40" />
                  <p className="mt-4 text-lg font-medium">Quick Look</p>
                  <p className="mt-2 text-sm leading-6 opacity-60">
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
      <p className="finder-sidebar-title px-2 text-sm font-semibold">{title}</p>
      <div className="mt-2 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = getPathKey(currentPath) === getPathKey(item.path);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onSelect(item.path)}
              className={`finder-sidebar-item flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[18px] transition ${
                isActive
                  ? "is-active"
                  : ""
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
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
  defaultSize: { w: 1170, h: 700 },
});
