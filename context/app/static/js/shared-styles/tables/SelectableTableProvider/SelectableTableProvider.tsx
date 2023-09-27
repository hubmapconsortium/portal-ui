import React, { useRef, PropsWithChildren } from 'react';

import { createContext, useContext } from 'js/helpers/context';
import { useStore } from 'zustand';
import { createStore, type SelectableTableStore } from './store';

type SelectableTableContextType = ReturnType<typeof createStore>;

const SelectableTableContext = createContext<SelectableTableContextType>('SelectableTableContext');

export type SelectableTableContextProviderProps = PropsWithChildren<
  Pick<SelectableTableStore, 'tableLabel'> & {
    initialState?: Exclude<SelectableTableStore, 'tableLabel'>;
  }
>;

function SelectableTableProvider({ children, tableLabel, initialState }: SelectableTableContextProviderProps) {
  const store = useRef<SelectableTableContextType>();
  if (!store.current) {
    store.current = createStore(tableLabel, initialState);
  }
  return <SelectableTableContext.Provider value={store.current}>{children}</SelectableTableContext.Provider>;
}

export function withSelectableTableProvider<P extends React.JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>,
  tableLabel: string,
) {
  return function ComponentWithSelectableTableProvider(props: React.ComponentProps<typeof Component>) {
    return (
      <SelectableTableProvider tableLabel={tableLabel}>
        <Component {...props} />
      </SelectableTableProvider>
    );
  };
}

export const useSelectableTableStore = <U,>(
  selector: Parameters<typeof useStore<SelectableTableContextType, U>>[1],
) => {
  return useStore(useContext(SelectableTableContext), selector);
};

export default SelectableTableProvider;
