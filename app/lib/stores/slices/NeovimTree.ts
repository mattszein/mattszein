import { StateCreator } from "zustand/vanilla";
import { Store } from "../store";
import { StoreState } from "../defaultState";

export type NeovimTree = {
  isNeovimTree: boolean;
  neovimTreeLink: number;
};

type StateNeovimTree = "isNeovimTree";

export type NeovimTreeActions = {
  setIsNeovimTree: (isOpen: boolean) => void;
  setNeovimTreeLink: (index: number) => void;
};

export type NeovimTreeSlice = NeovimTree & NeovimTreeActions;

export const defaultState: NeovimTree = {
  isNeovimTree: true,
  neovimTreeLink: -1
};

export const createNeovimTreeSlice =
  (initial: Partial<StoreState>): StateCreator<Store, [], [], NeovimTreeSlice> =>
    (set, get) => {
      return {
        ...initial,
        isNeovimTree: initial.isNeovimTree ?? defaultState.isNeovimTree,
        neovimTreeLink: initial.neovimTreeLink ?? defaultState.neovimTreeLink,
        setIsNeovimTree: (isOpen) => set({ ["isNeovimTree"]: isOpen }),
        setNeovimTreeLink: (index) => {
          set({ ["neovimTreeLink"]: index })
        }
      };
    };
