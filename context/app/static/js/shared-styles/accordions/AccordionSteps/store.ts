import { createStoreContext } from 'js/helpers/zustand';
import { createStore } from 'zustand';

export interface AccordionStepsState {
  openStepIndex: number;
  completedStepsText: Record<number, string>;
  stepsLength: number;
}

interface AccordionStepsActions {
  setOpenStepIndex: (stepIndex: number) => void;
  expandStep: (stepIndex: number) => void;
  setCompletedStepsText: (completedStepsText: Record<number, string>) => void;
  completeStep: (stepIndex: number, completedStepText: string) => void;
  resetStore: () => void;
}

interface AccordionStepsStore extends AccordionStepsState, AccordionStepsActions {}

const defaultState = {
  openStepIndex: 0,
  completedStepsText: {},
};

export function getSpecificObjectEntries<Obj extends object, Key extends keyof Obj>(
  keys: Key[],
  object: Obj,
): [Key, Obj[Key]][] {
  return keys.map((key) => [key, object[key]]);
}

function handleExpand(openStepIndex: number, stepIndex: number) {
  if (openStepIndex !== stepIndex) {
    return { openStepIndex: stepIndex };
  }
  return {};
}

function handleCompleteStep({
  payload: { stepIndex, completedStepText },
  state,
}: {
  payload: { stepIndex: number; completedStepText: string };
  state: AccordionStepsState;
}) {
  const previousStepIndexes = [...Array(stepIndex).keys()];
  const updatedCompletedStepsText = Object.fromEntries([
    ...getSpecificObjectEntries(previousStepIndexes, state.completedStepsText),
    [stepIndex, completedStepText],
  ]);

  const nextStepIndex = state.openStepIndex === state.stepsLength - 1 ? state.openStepIndex : state.openStepIndex + 1;

  return { completedStepsText: updatedCompletedStepsText, openStepIndex: nextStepIndex };
}

const createAccordionStepsStore = ({
  stepsLength,
  initialState,
}: {
  stepsLength: number;
  initialState?: Partial<AccordionStepsState>;
}) =>
  createStore<AccordionStepsStore>((set) => ({
    stepsLength,
    ...defaultState,
    ...initialState,
    setOpenStepIndex: (stepIndex) => set({ openStepIndex: stepIndex }),
    expandStep: (stepIndex) => set((state) => handleExpand(state.openStepIndex, stepIndex)),
    setCompletedStepsText: (completedStepsText) => set({ completedStepsText }),
    completeStep: (stepIndex, completedStepText) =>
      set((state) => handleCompleteStep({ payload: { stepIndex, completedStepText }, state })),
    resetStore: () => set(defaultState),
  }));

const [AccordionStepsContext, AccordionStepsProvider, useAccordionStepsStore] = createStoreContext(
  createAccordionStepsStore,
  'Accordion Steps',
);

export {
  createAccordionStepsStore as createStore,
  AccordionStepsContext,
  AccordionStepsProvider,
  useAccordionStepsStore,
};
