import { create, StoreApi } from 'zustand';
import { Workspace, WorkspaceInvitation } from 'js/components/workspaces/types';

export type DialogType =
  | 'UPDATE_TEMPLATES'
  | 'UPDATE_NAME'
  | 'ADD_DATASETS'
  | 'ADD_DATASETS_FROM_SEARCH'
  | 'ADD_DATASETS_FROM_HEADER'
  | 'ADD_DATASETS_FROM_HELPER_PANEL'
  | 'DELETE_WORKSPACE'
  | 'SHARE_WORKSPACE'
  | 'DECLINE_INVITATION'
  | 'LAUNCH_NEW_WORKSPACE'
  | null;

interface WorkspaceStore {
  isOpen: boolean;
  workspace: Workspace | null;
  invitation: WorkspaceInvitation | null;
  dialogType: DialogType;
  open: () => void;
  close: () => void;
  reset: () => void;
  setWorkspace: (workspace: Workspace) => void;
  setInvitation: (invitation: WorkspaceInvitation) => void;
  setDialogType: (dialogType: DialogType) => void;
}

const storeDefinition = (set: StoreApi<WorkspaceStore>['setState']) => ({
  isOpen: false,
  workspace: null,
  invitation: null,
  dialogType: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, workspace: null, invitation: null, dialogType: null }),
  setWorkspace: (workspace: Workspace) => set({ workspace }),
  setInvitation: (invitation: WorkspaceInvitation) => set({ invitation }),
  setDialogType: (dialogType: DialogType) => set({ dialogType }),
});

export const useLaunchWorkspaceStore = create<WorkspaceStore>(storeDefinition);
export const useEditWorkspaceStore = create<WorkspaceStore>(storeDefinition);
