import { create } from 'zustand';

interface OpenInWorkspacesPending {
  ids: string[];
  nonce: number;
}

interface OpenInWorkspacesTriggerStore {
  pending: OpenInWorkspacesPending | null;
  trigger: (ids: string[]) => void;
  reset: () => void;
}

const useOpenInWorkspacesTrigger = create<OpenInWorkspacesTriggerStore>((set) => ({
  pending: null,
  trigger: (ids: string[]) => set({ pending: { ids, nonce: Date.now() } }),
  reset: () => set({ pending: null }),
}));

export default useOpenInWorkspacesTrigger;
