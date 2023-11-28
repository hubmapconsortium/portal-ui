import { create, StoreApi } from 'zustand';
import { Workspace } from 'js/components/workspaces/types';

interface WorkspaceStore {
  isOpen: boolean;
  workspace: Workspace | null;
  open: () => void;
  close: () => void;
  setWorkspace: (workspace: Workspace) => void;
  reset: () => void;
}

const storeDefinition = (set: StoreApi<WorkspaceStore>['setState']) => ({
  isOpen: false,
  workspace: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setWorkspace: (workspace: Workspace) => set({ workspace }),
  reset: () => set({ isOpen: false, workspace: null }),
});

export const useEditWorkspaceNameStore = create<WorkspaceStore>(storeDefinition);
export const useLaunchWorkspaceStore = create<WorkspaceStore>(storeDefinition);
