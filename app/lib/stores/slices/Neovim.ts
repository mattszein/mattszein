import { StateCreator } from "zustand/vanilla";
import { Store } from "../store";
import { StoreState } from "../defaultState";

type NeovimFocusType = 'content' | "tree" | null

export type Neovim = {
  contentLines: number | null;
  focus: NeovimFocusType;
};

export type NeovimActions = {
  setContentLines: (contentLines: number | null) => void;
  setFocus: (focus: NeovimFocusType) => void;
};

export type NeovimSlice = Neovim & NeovimActions;

export const defaultState: Neovim = {
  contentLines: null,
  focus: null
};

export const createNeovimSlice =
  (initial: Partial<StoreState>): StateCreator<Store, [], [], NeovimSlice> =>
    (set) => {
      return {
        ...initial,
        contentLines: initial.contentLines ?? defaultState.contentLines,
        focus: initial.focus ?? defaultState.focus,
        setContentLines: (contentLines) => set({ ["contentLines"]: contentLines }),
        setFocus: (focus) => {
          set({ ["focus"]: focus })
        }
      };
    };
