import { create } from 'zustand';
import { Workspace } from '../types';

interface EditWorkspaceNameStore {
  isOpen: boolean;
  workspace: Workspace | null;
  open: () => void;
  close: () => void;
  setWorkspace: (workspace: Workspace) => void;
  reset: () => void;
}

const editWorkspaceNameStore = create<EditWorkspaceNameStore>((set) => ({
  isOpen: false,
  workspace: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setWorkspace: (workspace: Workspace) => set({ workspace }),
  reset: () => set({ isOpen: false, workspace: null }),
}));

export const useEditWorkspaceNameStore = editWorkspaceNameStore;
