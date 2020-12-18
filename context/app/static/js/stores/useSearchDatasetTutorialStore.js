import create from 'zustand';

const localStorageKey = 'has_exited_dataset_search_tutorial';

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
  tutorialHasExited: localStorage.getItem(localStorageKey),
  setTutorialHasExited: (val) => localStorage.setItem(localStorageKey, val),
  closeSearchDatasetTutorial: () => {
    localStorage.setItem(localStorageKey, true);
    set({ runSearchDatasetTutorial: false, tutorialHasExited: true });
  },
}));

export default useSearchDatasetTutorialStore;
