import type { LucideIcon } from "lucide-react";

export type AppId =
  | "safari"
  | "finder"
  | "resume"
  | "contact"
  | "photos"
  | "fileviewer";

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  w: number;
  h: number;
}

export interface AppWindow {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  position: WindowPosition;
  size: WindowSize;
}

export interface DockApp {
  id: AppId;
  label: string;
  icon: LucideIcon;
  gradient: string;
}

export type FileViewerType = "text" | "image" | "markdown";

export interface FileViewerPayload {
  fileType: FileViewerType;
  content: string;
  filename: string;
  dimensions?: string;
  size?: string;
}
