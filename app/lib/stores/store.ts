import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { StoreState, defaultState } from "./defaultState";
import { NeovimTreeSlice, createNeovimTreeSlice } from "./slices/NeovimTree";
import { NeovimSlice, createNeovimSlice } from "./slices/Neovim";
import { WindowSlice, createWindowSlice } from "./slices/Window";

export type Store = NeovimTreeSlice & NeovimSlice & WindowSlice;

export const initStore = (initialState?: Partial<StoreState>): StoreState => {
  return { ...defaultState, ...initialState };
};

export const createAppStore = (initState: Partial<StoreState> = defaultState) => {
  return createStore<Store>()(
    persist(
      (set, get, store) => ({
        ...initState,
        ...createNeovimTreeSlice(initState)(set, get, store),
        ...createNeovimSlice(initState)(set, get, store),
        ...createWindowSlice(initState)(set, get, store)
      }),
      {
        name: "app",
        partialize: () => ({
        }),
      },
    ),
  );
};
