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
      const index = get().steps.findIndex((step) => step.outputs[0].name === nodeName);
      const outputsArray = descendantSteps.map((step) => ({ step: step.name, name: nodeName }));
      set((state) => {
        state.steps[index].outputs[0].target = outputsArray;
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
