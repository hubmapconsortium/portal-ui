import { create } from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const types = {
  setOpenStepIndex: 'SET_OPEN_STEP_INDEX',
  expandStep: 'EXPAND_STEP',
  setCompletedStepsText: 'SET_COMPLETED_STEPS_TEXT',
  completeStep: 'COMPLETE_STEP',
  resetStore: 'RESET_STORE',
};

const defaultState = {
  openStepIndex: 0,
  completedStepsText: {},
};

export function getSpecificObjectEntries(keys, object) {
  return keys.map((key) => [key, object[key]]);
}

function handleExpand(openStepIndex, stepIndex) {
  if (openStepIndex !== stepIndex) {
    return { openStepIndex: stepIndex };
  }
  return {};
}

function handleCompleteStep({ payload: { stepIndex, completedStepText }, state }) {
  const previousStepIndexes = [...Array(stepIndex).keys()];
  const updatedCompletedStepsText = Object.fromEntries([
    ...getSpecificObjectEntries(previousStepIndexes, state.completedStepsText),
    [stepIndex, completedStepText],
  ]);

  const nextStepIndex = state.openStepIndex === state.stepsLength - 1 ? state.openStepIndex : state.openStepIndex + 1;

  return { completedStepsText: updatedCompletedStepsText, openStepIndex: nextStepIndex };
}

const reducer = (state, { type, payload }) => {
  switch (type) {
    case types.setOpenStepIndex:
      return { openStepIndex: payload };
    case types.expandStep:
      return handleExpand(state.openStepIndex, payload);
    case types.setCompletedStepsText:
      return { completedStepsText: payload };
    case types.completeStep:
      return handleCompleteStep({ payload, state });
    case types.resetStore:
      return defaultState;
    default:
      return state;
  }
};

const createStore = ({ stepsLength, initialState }) =>
  create((set, get) => ({
    stepsLength,
    ...{ ...defaultState, ...initialState },
    dispatch: (args) => set((state) => reducer(state, args)),
    setOpenStepIndex: (stepIndex) => get().dispatch({ type: types.setOpenStepIndex, payload: stepIndex }),
    expandStep: (stepIndex) => get().dispatch({ type: types.expandStep, payload: stepIndex }),
    setCompletedStepsText: (completedStepsText) =>
      get().dispatch({ type: types.setCompletedStepsText, payload: completedStepsText }),
    completeStep: (stepIndex, completedStepText) =>
      get().dispatch({ type: types.completeStep, payload: { stepIndex, completedStepText } }),
    resetStore: () => get().dispatch({ type: types.resetStore }),
  }));

export { useStore, createStore, Provider, reducer, types };
