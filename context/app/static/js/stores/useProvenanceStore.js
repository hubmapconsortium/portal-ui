/* eslint-disable no-param-reassign */

import create from 'zustand';

import immer from './immerMiddleware';

const useProvenanceStore = create(
  immer((set, get) => ({
    steps: [],
    setSteps: (steps) =>
      set((state) => {
        state.steps = steps;
      }),
    addSteps: (steps) =>
      set((state) => {
        state.steps = [...state.steps, ...steps];
      }),
    stitchEntityDescendantSteps: (nodeName, descendantSteps) => {
      descendantSteps.forEach((descendantStep) => {
        descendantStep.inputs.forEach((input) => {
          get().steps.forEach((step, stepIndex) => {
            const outputIndex = step.outputs.findIndex((output) => output.name === input.name);
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
    addDescendantSteps: (nodeName, descendantSteps) => {
      if (descendantSteps.length > 0) {
        get().stitchEntityDescendantSteps(nodeName, descendantSteps);
        get().addSteps(descendantSteps);
      }
    },
  })),
);

export default useProvenanceStore;
