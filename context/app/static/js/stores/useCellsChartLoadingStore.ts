import { create } from 'zustand';

interface CellsChartLoadingStoreState {
  fetchedUUIDs: Set<string>;
  loadingUUID: string | null;
}

interface CellsChartLoadingStoreActions {
  setLoadingUUID: (uuid: string) => void;
  addFetchedUUID: (uuid: string) => void;
  resetFetchedUUIDs: () => void;
}

export type CellsChartLoadingStore = CellsChartLoadingStoreState & CellsChartLoadingStoreActions;

const useCellsChartLoadingStore = create<CellsChartLoadingStore>((set) => ({
  fetchedUUIDs: new Set(),
  setLoadingUUID: (uuid) => set({ loadingUUID: uuid }),
  loadingUUID: null,
  addFetchedUUID: (uuid) => {
    set((state) => {
      state.fetchedUUIDs.add(uuid);
      return state;
    });
  },
  resetFetchedUUIDs: () => set({ fetchedUUIDs: new Set() }),
}));

export default useCellsChartLoadingStore;
