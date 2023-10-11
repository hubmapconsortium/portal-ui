import { create } from 'zustand';

const savedAlertStatus = 'savedAlert';
const editedAlertStatus = 'editedAlert';

interface EntityStoreState {
  summaryComponentObserver: {
    summaryInView: boolean;
    summaryEntry: IntersectionObserverEntry | undefined;
  };
  assayMetadata: Record<string, unknown>;
  shouldDisplaySavedOrEditedAlert: boolean;
}

interface EntityStoreActions {
  setSummaryComponentObserver: (inView: boolean, entry: IntersectionObserverEntry) => void;
  setAssayMetadata: (val: Record<string, unknown>) => void;
  setShouldDisplaySavedOrEditedAlert: (val: boolean) => void;
}

export type EntityStore = EntityStoreState & EntityStoreActions;

const useEntityStore = create<EntityStore>((set) => ({
  summaryComponentObserver: {
    summaryInView: true,
    summaryEntry: undefined,
  },
  setSummaryComponentObserver: (inView, entry) =>
    set({
      summaryComponentObserver: {
        summaryInView: inView,
        summaryEntry: entry,
      },
    }),
  assayMetadata: {},
  setAssayMetadata: (val) => set({ assayMetadata: val }),
  shouldDisplaySavedOrEditedAlert: false,
  setShouldDisplaySavedOrEditedAlert: (val) => set({ shouldDisplaySavedOrEditedAlert: val }),
}));

export { savedAlertStatus, editedAlertStatus };
export default useEntityStore;
