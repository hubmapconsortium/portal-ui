import create from 'zustand';

const useCellsChartLoadingStore = create((set) => ({
  fetchedUUIDs: new Set(),
  setLoadingUUID: (uuid) => set({ loadingUUID: uuid }),
  loadingUUID: null,
  addFetchedUUID: (uuid) =>
    set((state) => {
      state.fetchedUUIDs.add(uuid);
    }),
  resetFetchedUUIDs: () => set({ fetchedUUIDs: new Set() }),
}));

export default useCellsChartLoadingStore;
