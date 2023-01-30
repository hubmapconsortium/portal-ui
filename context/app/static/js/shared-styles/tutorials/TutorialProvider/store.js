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
  return { tutorialIsRunning: true };
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
    default:
      return state;
  }
};

const createStore = (localStorageKey) =>
  create((set, get) => ({
    localStorageKey,
    tutorialIsRunning: false,
    tutorialStep: 0,
    tutorialIsExited: localStorage.getItem(localStorageKey),
    nextButtonIsDisabled: false,
    dispatch: (args) => set((state) => reducer(state, args)),
    incrementStep: () => get().dispatch({ type: types.incrementStep }),
    decrementStep: () => get().dispatch({ type: types.decrementStep }),
    runTutorial: () => get().dispatch({ type: types.runTutorial }),
    closeTutorial: () => get().dispatch({ type: types.closeTutorial }),
    setNextButtonIsDisabled: (bool) => get().dispatch({ type: types.setNextButtonIsDisabled, payload: bool }),
  }));

export { Provider, useStore, createStore, reducer, types };
