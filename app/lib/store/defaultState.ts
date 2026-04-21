import { NeovimTree, defaultState as defaultNeovimTreeState } from "./slices/neovim-tree";
import { Neovim, defaultState as defaultNeovimState } from "./slices/neovim";
import { Window, defaultState as defaultWindowState } from "./slices/window";
import { Workspace, defaultState as defaultWorkspaceState } from "./slices/workspace";

export type StoreState = NeovimTree & Neovim & Window & Workspace

export const defaultState = {
  ...defaultNeovimTreeState,
  ...defaultNeovimState,
  ...defaultWindowState,
  ...defaultWorkspaceState
};
