import create from 'zustand';
import createContext from 'zustand/context';
import { trackEvent } from 'js/helpers/trackers';

const { Provider, useStore } = createContext();

function getIncrementedStep(state) {
  trackEvent({
    category: state.tutorial_key,
    action: 'Clicked next step',
  });

  return { tutorialStep: state.tutorialStep + 1 };
}

function getDecrementedStep(state) {
  trackEvent({
    category: state.tutorial_key,
    action: 'Clicked previous step',
  });
  return { tutorialStep: state.tutorialStep - 1 };
}

function getRunTutorial(state) {
  trackEvent({
    category: state.tutorial_key,
    action: 'Clicked start tutorial',
  });
  return { isTutorialRunning: true, isTutorialPromptOpen: false };
}

function getCloseTutorial(state) {
  trackEvent({
    category: state.tutorial_key,
    action: 'Clicked close tutorial',
  });
  localStorage.setItem(state.localStorageKey, true);
  return { isTutorialRunning: false, tutorialIsExited: true };
}

function getClosePrompt(state) {
  trackEvent({
    category: state.tutorial_key,
    action: 'Clicked closed tutorial prompt',
  });
  localStorage.setItem(state.localStorageKey, true);
  return { isTutorialPromptOpen: false };
}

const types = {
  incrementStep: 'INCREMENT_STEP',
  decrementStep: 'DECREMENT_STEP',
  runTutorial: 'RUN_TUTORIAL',
  closeTutorial: 'CLOSE_TUTORIAL',
  setNextButtonIsDisabled: 'SET_NEXT_BUTTON_IS_DISABLED',
  closePrompt: 'CLOSE_PROMPT',
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case types.incrementStep:
      return getIncrementedStep(state);
    case types.decrementStep:
      return getDecrementedStep(state);
    case types.runTutorial:
      return getRunTutorial(state);
    case types.closeTutorial:
      return getCloseTutorial(state);
    case types.setNextButtonIsDisabled:
      return { nextButtonIsDisabled: payload };
    case types.closePrompt:
      return getClosePrompt(state);
    default:
      return state;
  }
};

const createStore = (tutorial_key) => {
  const localStorageKey = `has_exited_${tutorial_key}_tutorial`;
  return create((set, get) => ({
    tutorial_key: `${tutorial_key}_tutorial`,
    localStorageKey,
    isTutorialRunning: false,
    tutorialStep: 0,
    isTutorialPromptOpen: !localStorage.getItem(localStorageKey),
    nextButtonIsDisabled: false,
    dispatch: (args) => set((state) => reducer(state, args)),
    incrementStep: () => get().dispatch({ type: types.incrementStep }),
    decrementStep: () => get().dispatch({ type: types.decrementStep }),
    runTutorial: () => get().dispatch({ type: types.runTutorial }),
    closeTutorial: () => get().dispatch({ type: types.closeTutorial }),
    setNextButtonIsDisabled: (bool) => get().dispatch({ type: types.setNextButtonIsDisabled, payload: bool }),
    closePrompt: () => get().dispatch({ type: types.closePrompt }),
  }));
};

export { Provider, useStore, createStore, reducer, types };
