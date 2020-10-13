import create from 'zustand';

const useEntityStore = create((set) => ({
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
}));

export default useEntityStore;
