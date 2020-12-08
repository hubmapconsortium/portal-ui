import create from 'zustand';

const useSearchDatasetTutorialStore = create((set) => ({
  runSearchDatasetTutorial: false,
  setRunSearchDatasetTutorial: (val) => set({ runSearchDatasetTutorial: val }),
}));

export default useSearchDatasetTutorialStore;
