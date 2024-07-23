import { AssayMetadata } from 'js/components/detailPage/entityHeader/EntityHeaderContent/EntityHeaderContent';
import { create } from 'zustand';

const savedAlertStatus = 'savedAlert';
const editedAlertStatus = 'editedAlert';

interface EntityStoreState {
  summaryComponentObserver: {
    summaryInView: boolean;
    summaryEntry: IntersectionObserverEntry | undefined;
  };
  assayMetadata: Partial<AssayMetadata>;
  shouldDisplaySavedOrEditedAlert: boolean | string;
}

interface EntityStoreActions {
  setSummaryComponentObserver: (inView: boolean, entry: IntersectionObserverEntry) => void;
  setAssayMetadata: (val: Partial<AssayMetadata>) => void;
  setShouldDisplaySavedOrEditedAlert: (val: boolean | string) => void;
}

export type EntityStore = EntityStoreState & EntityStoreActions;

export const useEntityStore = create<EntityStore>((set) => ({
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
