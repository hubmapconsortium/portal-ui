import create from 'zustand';
import ReactGA from 'react-ga';

const localStorageKey = 'has_exited_dataset_search_tutorial';

const useSearchDatasetTutorialStore = create((set, get) => ({
  runSearchDatasetTutorial: false,
  setRunSearchDatasetTutorial: (val) => {
    ReactGA.event({
      category: 'Dataset Search Tutorial',
      action: 'Clicked start button',
    });
    set({ runSearchDatasetTutorial: val });
  },
  searchDatasetTutorialStep: 0,
  incrementSearchDatasetTutorialStep: () => {
    ReactGA.event({
      category: 'Dataset Search Tutorial',
      action: 'Clicked next step',
      value: get().searchDatasetTutorialStep,
    });
    set((state) => ({
      searchDatasetTutorialStep: state.searchDatasetTutorialStep + 1,
    }));
  },
  decrementSearchDatasetTutorialStep: () => {
    ReactGA.event({
      category: 'Dataset Search Tutorial',
      action: 'Clicked previous step',
      value: get().searchDatasetTutorialStep,
    });
    set((state) => ({
      searchDatasetTutorialStep: state.searchDatasetTutorialStep - 1,
    }));
  },
  tutorialHasExited: localStorage.getItem(localStorageKey),
  setTutorialHasExited: (val) => localStorage.setItem(localStorageKey, val),
  closeSearchDatasetTutorial: () => {
    ReactGA.event({
      category: 'Dataset Search Tutorial',
      action: 'Clicked to close',
      value: get().searchDatasetTutorialStep,
    });
    localStorage.setItem(localStorageKey, true);
    set({ runSearchDatasetTutorial: false, tutorialHasExited: true });
  },
}));

export default useSearchDatasetTutorialStore;
