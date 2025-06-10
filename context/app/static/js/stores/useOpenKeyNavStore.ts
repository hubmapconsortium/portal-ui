import { createStore } from 'zustand';

import { createStoreContext } from 'js/helpers/zustand';

interface OpenKeyNavStoreState {
  initialize: boolean;
}

interface OpenKeyNavStoreActions {
  setInitialize: (b: boolean) => void;
}

export type OpenKeyNavStore = OpenKeyNavStoreState & OpenKeyNavStoreActions;

export const createOpenKeyNavStore = ({ initialize }: { initialize: boolean }) =>
  createStore<OpenKeyNavStore>((set) => ({
    initialize,
    setInitialize: (val) => set({ initialize: val }),
  }));

const [OpenKeyNavStoreProvider, useOpenKeyNavStore, OpenKeyNavStoreContext] = createStoreContext(
  createOpenKeyNavStore,
  'Open Key Nav',
);

export { OpenKeyNavStoreProvider, OpenKeyNavStoreContext };
export default useOpenKeyNavStore;
