import { NeovimTree, defaultState as defaultNeovimTreeState } from "./slices/neovim-tree";
import { Neovim, defaultState as defaultNeovimState } from "./slices/neovim";
import { Window, defaultState as defaultWindowState } from "./slices/window";

export type StoreState = NeovimTree & Neovim & Window

export const defaultState = {
  ...defaultNeovimTreeState,
  ...defaultNeovimState,
  ...defaultWindowState
};
