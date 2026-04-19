"use client";

import { create } from "zustand";

interface LocationStoreState {
  currentPath: string[];
  selectedFile: string | null;
}

interface LocationStoreActions {
  navigate: (folder: string) => void;
  goBack: () => void;
  selectFile: (name: string) => void;
  reset: () => void;
}

type LocationStore = LocationStoreState & LocationStoreActions;

const ROOT_PATH = ["Home"];

export const useLocationStore = create<LocationStore>((set) => ({
  currentPath: ROOT_PATH,
  selectedFile: null,
  navigate: (folder) =>
    set((state) => ({
      currentPath: [...state.currentPath, folder],
      selectedFile: null,
    })),
  goBack: () =>
    set((state) => ({
      currentPath:
        state.currentPath.length > 1
          ? state.currentPath.slice(0, -1)
          : state.currentPath,
      selectedFile: null,
    })),
  selectFile: (name) => set({ selectedFile: name }),
  reset: () => set({ currentPath: ROOT_PATH, selectedFile: null }),
}));
