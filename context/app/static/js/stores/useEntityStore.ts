import { createStore } from 'zustand';
import { useSprings } from '@react-spring/web';

import { createStoreContext } from 'js/helpers/zustand';
import { AssayMetadata } from 'js/components/detailPage/entityHeader/EntityHeaderContent/EntityHeaderContent';

export type SummaryViewsType = 'narrow' | 'summary' | 'diagram';

interface EntityStoreState {
  summaryComponentObserver: {
    summaryInView: boolean;
    summaryEntry: IntersectionObserverEntry | undefined;
  };
  assayMetadata: Partial<AssayMetadata>;
  summaryHeight: number;
  view: SummaryViewsType;
  springs: ReturnType<typeof useSprings>;
}

interface EntityStoreActions {
  setSummaryComponentObserver: (inView: boolean, entry: IntersectionObserverEntry) => void;
  setAssayMetadata: (val: Partial<AssayMetadata>) => void;
  setSummaryHeight: (val: number) => void;
  setView: (val: SummaryViewsType) => void;
}

export type EntityStore = EntityStoreState & EntityStoreActions;

export const createEntityStore = ({ springs }: { springs: ReturnType<typeof useSprings> }) =>
  createStore<EntityStore>((set) => ({
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
    summaryHeight: 0,
    setSummaryHeight: (val: number) => set({ summaryHeight: val }),
    view: 'narrow' as const,
    setView: (val) => set({ view: val }),
    springs,
    assayMetadata: {},
    setAssayMetadata: (val) => set({ assayMetadata: val }),
  }));

const [EntityStoreProvider, useEntityStore, EntityStoreContext] = createStoreContext(createEntityStore, 'Entity Store');

export { EntityStoreProvider, EntityStoreContext };
export default useEntityStore;
