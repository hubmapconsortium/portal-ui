/* eslint-disable no-param-reassign */

import create from 'zustand';

import immer from './middleware';

const useProvenanceStore = create(
  immer((set, get) => ({
    uuid: '',
    hasRendered: false,
    setHasRendered: () => {
      if (get().hasRendered === false) {
        set((state) => {
          state.hasRendered = true;
        });
      }
    },
    setUUID: (uuid) =>
      set((state) => {
        state.uuid = uuid;
      }),
    steps: [],
    setSteps: (steps) =>
      set((state) => {
        state.steps = steps;
      }),
    addSteps: (steps) =>
      set((state) => {
        state.steps = [...state.steps, ...steps];
      }),
    stitchEntityDescendantSteps: (descendantSteps) => {
      // check new steps inputs to see if they exist in current steps
      descendantSteps.forEach((descendantStep) => {
        descendantStep.inputs.forEach((input) => {
          get().steps.forEach((step, stepIndex) => {
            const outputIndex = step.outputs.findIndex((output) => output.name === input.name);
            // if input exists as an output of an existing step add new step as target
            if (outputIndex >= 0) {
              const output = { step: descendantStep.name, name: input.name };
              set((state) => {
                state.steps[stepIndex].outputs[outputIndex].target.push(output);
              });
            }
          });
        });
      });
    },
    addDescendantSteps: (descendantSteps) => {
      get().stitchEntityDescendantSteps(descendantSteps);
      get().addSteps(descendantSteps);
    },
  })),
);

export default useProvenanceStore;
