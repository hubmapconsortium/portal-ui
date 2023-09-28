import { createStore as createZustandStore } from 'zustand';

import { createStoreContext } from 'js/helpers/zustand';

interface ExpandableRowState {
  isExpanded: boolean;
}

interface ExpandableRowActions {
  toggleIsExpanded: () => void;
}

interface ExpandableRowStore extends ExpandableRowState, ExpandableRowActions {}

interface ExpandableRowStoreInput {
  isExpandedToStart?: boolean;
}

const createStore = ({ isExpandedToStart }: ExpandableRowStoreInput) =>
  createZustandStore<ExpandableRowStore>((set) => ({
    isExpanded: Boolean(isExpandedToStart),
    toggleIsExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  }));

const [ExpandableRowProvider, useExpandableRowStore] = createStoreContext<ExpandableRowStore, ExpandableRowStoreInput>(
  createStore,
  'ExpandableRowStore',
);

export { createStore, ExpandableRowProvider, useExpandableRowStore };
