"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { StoreApi, useStore as useZustandStore } from "zustand";
import { createAppStore, initStore, Store } from "@/app/lib/store";
import { StoreState } from "@/app/lib/store/defaultState";

export type AppStoreProviderProps = {
  initialState?: Partial<StoreState>;
  children: ReactNode;
};

const AppStoreContext = createContext<StoreApi<Store> | null>(null);

export const AppStoreProvider = (props: AppStoreProviderProps) => {
  const { initialState, children } = props;

  const [store] = useState(() => createAppStore(initStore(initialState)));

  return (
    <AppStoreContext.Provider value={store}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: Store) => T): T => {
  const appStoreContext = useContext(AppStoreContext);

  if (!appStoreContext) {
    throw new Error("useStore must be used within AppStoreProvider");
  }

  return useZustandStore(appStoreContext, selector);
};
