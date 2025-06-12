import { NeovimTree, defaultState as defaultNeovimTreeState } from "./slices/NeovimTree";
import { Neovim, defaultState as defaultNeovimState } from "./slices/Neovim";

export type StoreState = NeovimTree & Neovim

export const defaultState = {
  ...defaultNeovimTreeState,
  ...defaultNeovimState
};
