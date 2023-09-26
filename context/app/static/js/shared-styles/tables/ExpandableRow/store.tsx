import React, { PropsWithChildren, useRef } from 'react';
import { createStore as createZustandStore, useStore } from 'zustand';

import { createContext, useContext } from 'js/helpers/context';

interface ExpandableRowState {
  isExpanded: boolean;
}

interface ExpandableRowActions {
  toggleIsExpanded: () => void;
}

interface ExpandableRowStore extends ExpandableRowState, ExpandableRowActions {}

const createStore = (isExpandedToStart = false) =>
  createZustandStore<ExpandableRowStore>((set) => ({
    isExpanded: isExpandedToStart,
    toggleIsExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  }));

type ExpandableRowStoreType = ReturnType<typeof createStore>;

const ExpandableRowContext = createContext<ExpandableRowStoreType>('ExpandableRowContext');

function ExpandableRowProvider({
  children,
  isExpandedToStart = false,
}: PropsWithChildren<{ isExpandedToStart?: boolean }>) {
  const store = useRef<ExpandableRowStoreType>();
  if (!store.current) {
    store.current = createStore(isExpandedToStart);
  }
  return <ExpandableRowContext.Provider value={store.current}>{children}</ExpandableRowContext.Provider>;
}

export const useExpandableRowStore = () => useStore(useContext(ExpandableRowContext));

export { createStore, ExpandableRowProvider };
