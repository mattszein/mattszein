import { StateCreator } from "zustand/vanilla";
import { Store } from "../store";
import { StoreState } from "../defaultState";

export const WINDOW_APPS = {
  NVIM: "NVIM",
  TERMINAL: "TERMINAL",
} as const;
export type WindowFocusType = typeof WINDOW_APPS[keyof typeof WINDOW_APPS] | null;

export type Window = {
  windowFocus: WindowFocusType;
};

export type WindowActions = {
  setWindowFocus: (windowFocus: WindowFocusType) => void;
};

export type WindowSlice = Window & WindowActions;

export const defaultState: Window = {
  windowFocus: WINDOW_APPS.NVIM,
};

export const createWindowSlice =
  (initial: Partial<StoreState>): StateCreator<Store, [], [], WindowSlice> =>
    (set) => {
      return {
        ...initial,
        windowFocus: initial.windowFocus ?? defaultState.windowFocus,
        setWindowFocus: (windowFocus) => {
          set({ ["windowFocus"]: windowFocus })
        }
      };
    };
