import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

function getIncrementedStep(state) {
  return { tutorialStep: state.tutorialStep + 1 };
}

function getDecrementedStep(state) {
  return { tutorialStep: state.tutorialStep - 1 };
}

function getRunTutorial() {
  return { tutorialIsRunning: true, isTutorialPromptOpen: false };
}

function getCloseTutorial(state) {
  localStorage.setItem(state.localStorageKey, true);
  return { tutorialIsRunning: false, tutorialIsExited: true };
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
      return getRunTutorial();
    case types.closeTutorial:
      return getCloseTutorial(state);
    case types.setNextButtonIsDisabled:
      return { nextButtonIsDisabled: payload };
    case types.closePrompt:
      return { isTutorialPromptOpen: false };
    default:
      return state;
  }
};

const createStore = (localStorageKey) =>
  create((set, get) => ({
    localStorageKey,
    isPromptOpen: true,
    tutorialIsRunning: false,
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

export { Provider, useStore, createStore, reducer, types };
