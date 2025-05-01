"use client";

import { createContext, ReactNode, useContext } from "react";
import { StoreApi, useStore as useZustandStore } from "zustand";
import { createAppStore, initStore, Store } from "@/app/lib/stores/store";
import { StoreState } from "@/app/lib/stores/defaultState";

export type AppStoreProviderProps = {
  initialState?: Partial<StoreState>;
  children: ReactNode;
};

export let AppStore: StoreApi<Store> | null = null;
export const AppStoreContext = createContext<StoreApi<Store> | null>(null);

export const AppStoreProvider = (props: AppStoreProviderProps) => {
  const { initialState, children } = props;

  if (!AppStore) {
    AppStore = createAppStore(initStore(initialState));
  }
  return (
    <AppStoreContext.Provider value={AppStore}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: Store) => T): T => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error("useStore must be use within AppStoreProvider");
  }

  return useZustandStore(appStoreContext, selector);
};
