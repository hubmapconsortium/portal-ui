import create from 'zustand';

const useSearchDatasetTutorialStore = create((set) => ({
  runSearchDatasetTutorial: false,
  setRunSearchDatasetTutorial: (val) => set({ searchView: val }),
}));

export default useSearchDatasetTutorialStore;
