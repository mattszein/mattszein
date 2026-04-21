import { StateCreator } from "zustand/vanilla";
import { Store } from "..";
import { StoreState } from "../defaultState";

export type Workspace = {
  activeWorkspace: number;
  workspaces: number[];
};

export type WorkspaceActions = {
  setActiveWorkspace: (activeWorkspace: number) => void;
};

export type WorkspaceSlice = Workspace & WorkspaceActions;

export const defaultState: Workspace = {
  activeWorkspace: 1,
  workspaces: [1, 2],
};

export const createWorkspaceSlice =
  (initial: Partial<StoreState>): StateCreator<Store, [], [], WorkspaceSlice> =>
    (set, get) => {
      return {
        ...initial,
        activeWorkspace: initial.activeWorkspace ?? defaultState.activeWorkspace,
        workspaces: initial.workspaces ?? defaultState.workspaces,
        setActiveWorkspace: (activeWorkspace) => {
          if (get().activeWorkspace === activeWorkspace) return;
          set({ activeWorkspace });
        }
      };
    };
