import create from 'zustand';

const useEntityStore = create((set) => ({
  summaryInView: false,
  setSummaryInView: (val) => set({ summaryInView: val }),
  assayMetadata: {},
  setAssayMetadata: (val) => set({ assayMetadata: val }),
}));

export default useEntityStore;
