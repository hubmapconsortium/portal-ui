import { create, StoreApi } from 'zustand';

export const savedAlertStatus = 'savedAlert';
export const editedAlertStatus = 'editedAlert';
export interface SavedListsAlertsState {
  transferredToProfile: boolean;
  setTransferredToProfile: (transferredToProfile: boolean) => void;
  savedOrEditedList: boolean | string;
  setSavedOrEditedList: (val: boolean | string) => void;
}

const storeDefinition = (set: StoreApi<SavedListsAlertsState>['setState']) => ({
  transferredToProfile: false,
  setTransferredToProfile: (transferredToProfile: boolean) => set({ transferredToProfile }),
  savedOrEditedList: false,
  setSavedOrEditedList: (val: boolean | string) => set({ savedOrEditedList: val }),
});

export const useSavedListsAlertsStore = create<SavedListsAlertsState>(storeDefinition);
