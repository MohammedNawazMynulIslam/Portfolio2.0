"use client";

import { create } from "zustand";

import type { FileViewerPayload } from "@/types";

interface FileViewerStoreState extends FileViewerPayload {
  isReady: boolean;
}

interface FileViewerStoreActions {
  openFile: (file: FileViewerPayload) => void;
  resetFile: () => void;
}

type FileViewerStore = FileViewerStoreState & FileViewerStoreActions;

const INITIAL_FILE: FileViewerStoreState = {
  isReady: false,
  fileType: "markdown",
  filename: "README.md",
  content: "# Preview\n\nSelect a file in Finder to open it here.",
  dimensions: undefined,
  size: undefined,
};

export const useFileViewerStore = create<FileViewerStore>((set) => ({
  ...INITIAL_FILE,
  openFile: (file) =>
    set({
      ...file,
      isReady: true,
    }),
  resetFile: () => set(INITIAL_FILE),
}));
