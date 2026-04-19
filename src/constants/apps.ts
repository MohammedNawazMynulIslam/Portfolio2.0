import {
  FileText,
  FolderOpen,
  Globe,
  Image,
  Mail,
} from "lucide-react";

import type { AppId, AppWindow, DockApp } from "@/types";

export const APP_IDS: AppId[] = [
  "finder",
  "safari",
  "resume",
  "contact",
  "photos",
  "fileviewer",
];

const WINDOW_TITLES: Record<AppId, string> = {
  finder: "Finder",
  safari: "Safari",
  resume: "Resume",
  contact: "Contact",
  photos: "Photos",
  fileviewer: "Preview",
};

const WINDOW_SIZES: Record<AppId, AppWindow["size"]> = {
  finder: { w: 860, h: 580 },
  safari: { w: 960, h: 640 },
  resume: { w: 820, h: 560 },
  contact: { w: 720, h: 520 },
  photos: { w: 900, h: 600 },
  fileviewer: { w: 560, h: 480 },
};

const WINDOW_START_X = 120;
const WINDOW_START_Y = 96;
const WINDOW_OFFSET = 30;

export const INITIAL_WINDOWS: Record<AppId, AppWindow> = APP_IDS.reduce(
  (windows, id, index) => {
    windows[id] = {
      id,
      title: WINDOW_TITLES[id],
      isOpen: false,
      isMinimized: false,
      zIndex: index + 1,
      position: {
        x: WINDOW_START_X + WINDOW_OFFSET * index,
        y: WINDOW_START_Y + WINDOW_OFFSET * index,
      },
      size: WINDOW_SIZES[id],
    };

    return windows;
  },
  {} as Record<AppId, AppWindow>,
);

export const DOCK_APPS: DockApp[] = [
  {
    id: "finder",
    label: "Finder",
    icon: FolderOpen,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
  },
  {
    id: "safari",
    label: "Safari",
    icon: Globe,
    gradient: "from-teal-300 via-cyan-400 to-blue-500",
  },
  {
    id: "resume",
    label: "Resume",
    icon: FileText,
    gradient: "from-fuchsia-400 via-violet-500 to-purple-600",
  },
  {
    id: "contact",
    label: "Contact",
    icon: Mail,
    gradient: "from-orange-300 via-rose-400 to-pink-500",
  },
  {
    id: "photos",
    label: "Photos",
    icon: Image,
    gradient: "from-emerald-300 via-lime-400 to-yellow-400",
  },
];
