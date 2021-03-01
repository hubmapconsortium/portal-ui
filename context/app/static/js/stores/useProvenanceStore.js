/* eslint-disable no-param-reassign */

import create from 'zustand';

import immer from './immerMiddleware';

const useProvenanceStore = create(
  immer((set) => ({
    steps: [],
    setSteps: (steps) =>
      set((state) => {
        state.steps = steps;
      }),
    addSteps: (steps) =>
      set((state) => {
        state.steps = [...state.steps, ...steps];
      }),
  })),
);

export default useProvenanceStore;
