import { trackEvent } from 'js/helpers/trackers';
import { createStoreImmerPersist } from 'js/helpers/zustand';

interface TutorialActions {
  incrementStep: () => void;
  decrementStep: () => void;
  runTutorial: () => void;
  closeTutorial: () => void;
  setNextButtonIsDisabled: (bool: boolean) => void;
  closePrompt: () => void;
}

interface TutorialState {
  tutorial_key: string;
  isTutorialRunning: boolean;
  tutorialStep: number;
  isTutorialPromptOpen: boolean;
  nextButtonIsDisabled: boolean;
}

export interface TutorialStore extends TutorialState, TutorialActions {}

function trackTutorialEvent(state: TutorialState, action: string) {
  trackEvent({
    category: state.tutorial_key,
    action,
    value: state.tutorialStep,
  });
}

interface CreateStoreInput {
  tutorial_key: string;
}

export const createStore = ({ tutorial_key }: CreateStoreInput) => {
  return createStoreImmerPersist<TutorialStore>(
    (set, get) => ({
      tutorial_key: `${tutorial_key}_tutorial`,
      isTutorialRunning: false,
      tutorialStep: 0,
      isTutorialPromptOpen: true,
      nextButtonIsDisabled: false,
      incrementStep: () => {
        trackTutorialEvent(get(), 'Clicked next step');
        set((state) => {
          state.tutorialStep += 1;
        });
      },
      decrementStep: () => {
        trackTutorialEvent(get(), 'Clicked previous step');
        set((state) => {
          state.tutorialStep -= 1;
        });
      },
      runTutorial: () => {
        trackTutorialEvent(get(), 'Clicked start tutorial');
        set((state) => {
          state.isTutorialRunning = true;
          state.isTutorialPromptOpen = false;
        });
      },
      closeTutorial: () => {
        trackTutorialEvent(get(), 'Clicked close tutorial');
        set((state) => {
          state.isTutorialRunning = false;
          state.tutorialStep = 0;
        });
      },
      setNextButtonIsDisabled: (bool: boolean) => {
        set((state) => {
          state.nextButtonIsDisabled = bool;
        });
      },
      closePrompt: () => {
        trackTutorialEvent(get(), 'Clicked closed tutorial prompt');
        set((state) => {
          state.isTutorialPromptOpen = false;
        });
      },
    }),
    {
      name: `${tutorial_key}_tutorial`,
      getStorage: () => localStorage,
    },
  );
};
