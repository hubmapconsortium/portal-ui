import { create } from 'zustand';
import { trackEvent } from 'js/helpers/trackers';

const localStorageKey = 'has_exited_dataset_search_tutorial';

function recordEvent(action: string, value?: unknown) {
  trackEvent({
    category: 'Dataset Search Tutorial',
    action,
    value,
  });
}

interface SearchDatasetTutorialState {
  runSearchDatasetTutorial: boolean;
  searchDatasetTutorialStep: number;
  tutorialHasExited: boolean;
}

interface SearchDatasetTutorialActions {
  setRunSearchDatasetTutorial: (val: boolean) => void;
  incrementSearchDatasetTutorialStep: () => void;
  decrementSearchDatasetTutorialStep: () => void;
  closeSearchDatasetTutorial: () => void;
  setTutorialHasExited: (val: unknown) => void;
}

type SearchDatasetTutorialStore = SearchDatasetTutorialState & SearchDatasetTutorialActions;

const useSearchDatasetTutorialStore = create<SearchDatasetTutorialStore>((set, get) => ({
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
  tutorialHasExited: Boolean(localStorage.getItem(localStorageKey)),
  setTutorialHasExited: (val) => localStorage.setItem(localStorageKey, String(val)),
  closeSearchDatasetTutorial: () => {
    recordEvent('Clicked to close', get().searchDatasetTutorialStep);
    localStorage.setItem(localStorageKey, String(true));
    set({ runSearchDatasetTutorial: false, tutorialHasExited: true });
  },
}));

export default useSearchDatasetTutorialStore;
