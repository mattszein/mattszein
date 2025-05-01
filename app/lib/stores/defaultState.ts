import { NeovimTree, defaultState as defaultTerminalTreeState } from "./slices/NeovimTree";

export type StoreState = NeovimTree

export const defaultState = {
  ...defaultTerminalTreeState,
};
