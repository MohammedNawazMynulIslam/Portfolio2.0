"use client";

import { create } from "zustand";

import { INITIAL_WINDOWS } from "@/constants/apps";
import type { AppId, AppWindow } from "@/types";

interface WindowStoreState {
  windows: Record<AppId, AppWindow>;
  activeWindowId: AppId | null;
}

interface WindowStoreActions {
  openWindow: (id: AppId) => void;
  closeWindow: (id: AppId) => void;
  minimizeWindow: (id: AppId) => void;
  restoreWindow: (id: AppId) => void;
  focusWindow: (id: AppId) => void;
  updatePosition: (id: AppId, x: number, y: number) => void;
  updateSize: (id: AppId, w: number, h: number) => void;
}

type WindowStore = WindowStoreState & WindowStoreActions;

const getNextZIndex = (windows: Record<AppId, AppWindow>) =>
  Math.max(...Object.values(windows).map((window) => window.zIndex), 0) + 1;

export const useWindowStore = create<WindowStore>((set) => ({
  windows: INITIAL_WINDOWS,
  activeWindowId: null,
  openWindow: (id) =>
    set((state) => {
      const nextZIndex = getNextZIndex(state.windows);
      const targetWindow = state.windows[id];

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...targetWindow,
            isOpen: true,
            isMinimized: false,
            zIndex: nextZIndex,
          },
        },
        activeWindowId: id,
      };
    }),
  closeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isOpen: false,
          isMinimized: false,
        },
      },
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),
  minimizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          isMinimized: true,
        },
      },
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),
  restoreWindow: (id) =>
    set((state) => {
      const nextZIndex = getNextZIndex(state.windows);

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            isOpen: true,
            isMinimized: false,
            zIndex: nextZIndex,
          },
        },
        activeWindowId: id,
      };
    }),
  focusWindow: (id) =>
    set((state) => {
      const nextZIndex = getNextZIndex(state.windows);

      return {
        windows: {
          ...state.windows,
          [id]: {
            ...state.windows[id],
            zIndex: nextZIndex,
          },
        },
        activeWindowId: id,
      };
    }),
  updatePosition: (id, x, y) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: { x, y },
        },
      },
    })),
  updateSize: (id, w, h) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size: { w, h },
        },
      },
    })),
}));
