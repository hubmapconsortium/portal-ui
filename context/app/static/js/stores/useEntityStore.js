import create from 'zustand';

const useEntityStore = create((set, get) => ({
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
  shouldDisplaySavedListsAlert: false,
  toggleShouldDisplaySavedListsAlert: () => set({ shouldDisplaySavedListsAlert: !get().shouldDisplaySavedListsAlert }),
}));

export default useEntityStore;
