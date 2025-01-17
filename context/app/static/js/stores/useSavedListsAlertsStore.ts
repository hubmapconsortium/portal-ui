import { create, StoreApi } from 'zustand';

interface SavedListsAlerts {
  transferredToProfile: boolean;
  setTransferredToProfile: (transferredToProfile: boolean) => void;
}

const storeDefinition = (set: StoreApi<SavedListsAlerts>['setState']) => ({
  transferredToProfile: false,
  setTransferredToProfile: (transferredToProfile: boolean) => set({ transferredToProfile }),
});

export const useSavedListsAlerts = create<SavedListsAlerts>(storeDefinition);
