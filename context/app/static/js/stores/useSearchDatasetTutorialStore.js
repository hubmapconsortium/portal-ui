import create from 'zustand';

const useSearchDatasetTutorialStore = create((set) => ({
  runSearchDatasetTutorial: false,
  setRunSearchDatasetTutorial: (val) => set({ runSearchDatasetTutorial: val }),
  searchDatasetTutorialStep: 0,
  incrementSearchDatasetTutorialStep: () =>
    set((state) => ({
      searchDatasetTutorialStep: state.searchDatasetTutorialStep + 1,
    })),
  decrementSearchDatasetTutorialStep: () =>
    set((state) => ({
      searchDatasetTutorialStep: state.searchDatasetTutorialStep - 1,
    })),
  closeSearchDatasetTutorial: () => set({ runSearchDatasetTutorial: false }),
}));

export default useSearchDatasetTutorialStore;
