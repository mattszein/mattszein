import { NeovimTree, defaultState as defaultNeovimTreeState } from "./slices/NeovimTree";
import { Neovim, defaultState as defaultNeovimState } from "./slices/Neovim";
import { Window, defaultState as defaultWindowState } from "./slices/Window";

export type StoreState = NeovimTree & Neovim & Window

export const defaultState = {
  ...defaultNeovimTreeState,
  ...defaultNeovimState,
  ...defaultWindowState
};
