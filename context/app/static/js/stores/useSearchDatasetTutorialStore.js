import { create } from 'zustand';
import { trackEvent } from 'js/helpers/trackers';

const localStorageKey = 'has_exited_dataset_search_tutorial';

function recordEvent(action, value) {
  trackEvent({
    category: 'Dataset Search Tutorial',
    action,
    value,
  });
}

const useSearchDatasetTutorialStore = create((set, get) => ({
  runSearchDatasetTutorial: false,
  setRunSearchDatasetTutorial: (val) => {
    recordEvent('Clicked start button');
    set({ runSearchDatasetTutorial: val });
  },
  searchDatasetTutorialStep: 0,
  incrementSearchDatasetTutorialStep: () => {
    recordEvent('Clicked next step', get().searchDatasetTutorialStep);
    set((state) => ({
      searchDatasetTutorialStep: state.searchDatasetTutorialStep + 1,
    }));
  },
  decrementSearchDatasetTutorialStep: () => {
    recordEvent('Clicked previous step', get().searchDatasetTutorialStep);
    set((state) => ({
      searchDatasetTutorialStep: state.searchDatasetTutorialStep - 1,
    }));
  },
  tutorialHasExited: localStorage.getItem(localStorageKey),
  setTutorialHasExited: (val) => localStorage.setItem(localStorageKey, val),
  closeSearchDatasetTutorial: () => {
    recordEvent('Clicked to close', get().searchDatasetTutorialStep);
    localStorage.setItem(localStorageKey, true);
    set({ runSearchDatasetTutorial: false, tutorialHasExited: true });
  },
}));

export default useSearchDatasetTutorialStore;
