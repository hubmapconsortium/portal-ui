import { create } from 'zustand';
import { Workspace } from '../types';

interface LaunchWorkspaceStore {
  isOpen: boolean;
  workspace: Workspace | null;
  open: () => void;
  close: () => void;
  setWorkspace: (workspace: Workspace) => void;
  reset: () => void;
}

const launchWorkspaceStore = create<LaunchWorkspaceStore>((set) => ({
  isOpen: false,
  workspace: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setWorkspace: (workspace: Workspace) => set({ workspace }),
  reset: () => set({ isOpen: false, workspace: null }),
}));

export const useLaunchWorkspaceStore = launchWorkspaceStore;
