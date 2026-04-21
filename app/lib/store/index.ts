import { createStore } from "zustand/vanilla";
import { StoreState, defaultState } from "./defaultState";
import { NeovimTreeSlice, createNeovimTreeSlice } from "./slices/neovim-tree";
import { NeovimSlice, createNeovimSlice } from "./slices/neovim";
import { WindowSlice, createWindowSlice } from "./slices/window";

export type Store = NeovimTreeSlice & NeovimSlice & WindowSlice;

export const initStore = (initialState?: Partial<StoreState>): StoreState => {
  return { ...defaultState, ...initialState };
};

export const createAppStore = (initState: Partial<StoreState> = defaultState) => {
  return createStore<Store>()((set, get, store) => ({
    ...initState,
    ...createNeovimTreeSlice(initState)(set, get, store),
    ...createNeovimSlice(initState)(set, get, store),
    ...createWindowSlice(initState)(set, get, store)
  }));
};
