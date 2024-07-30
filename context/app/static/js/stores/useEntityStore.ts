import { AssayMetadata } from 'js/components/detailPage/entityHeader/EntityHeaderContent/EntityHeaderContent';
import { create } from 'zustand';
import { useSprings } from '@react-spring/web';

const savedAlertStatus = 'savedAlert';
const editedAlertStatus = 'editedAlert';

interface EntityStoreState {
  summaryComponentObserver: {
    summaryInView: boolean;
    summaryEntry: IntersectionObserverEntry | undefined;
  };
  assayMetadata: Partial<AssayMetadata>;
  shouldDisplaySavedOrEditedAlert: boolean | string;
  entityHeaderSprings: ReturnType<typeof useSprings> | null;
}

interface EntityStoreActions {
  setSummaryComponentObserver: (inView: boolean, entry: IntersectionObserverEntry) => void;
  setAssayMetadata: (val: Partial<AssayMetadata>) => void;
  setShouldDisplaySavedOrEditedAlert: (val: boolean | string) => void;
  setEntityHeaderSprings: (springs: ReturnType<typeof useSprings>) => void;
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
  entityHeaderSprings: null,
  setEntityHeaderSprings: (springs) => set({ entityHeaderSprings: springs }),
  assayMetadata: {},
  setAssayMetadata: (val) => set({ assayMetadata: val }),
  shouldDisplaySavedOrEditedAlert: false,
  setShouldDisplaySavedOrEditedAlert: (val) => set({ shouldDisplaySavedOrEditedAlert: val }),
}));

export { savedAlertStatus, editedAlertStatus };
export default useEntityStore;
