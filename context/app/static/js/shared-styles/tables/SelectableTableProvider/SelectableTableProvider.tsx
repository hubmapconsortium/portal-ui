import React, { useRef, PropsWithChildren, useContext } from 'react';

import { createContext } from 'js/helpers/context';
import { createStore, type SelectableTableStore } from './store';

type SelectableTableContextType = ReturnType<typeof createStore>;

const SelectableTableContext = createContext<SelectableTableContextType>('SelectableTableContext');

type SelectableTableContextProviderProps = PropsWithChildren<Pick<SelectableTableStore, 'tableLabel'>>;

function SelectableTableProvider({ children, tableLabel }: SelectableTableContextProviderProps) {
  const store = useRef(createStore(tableLabel));
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

export const useSelectableTableStore = () => useContext(SelectableTableContext);

export default SelectableTableProvider;
