import React from 'react';

import { createStoreContext } from 'js/helpers/zustand';
import { CreateSelectableTableStoreInput, createStore, type SelectableTableStore } from './store';

const [SelectableTableProvider, useSelectableTableStore] = createStoreContext<
  SelectableTableStore,
  CreateSelectableTableStoreInput
>(createStore, 'Selectable Table Store');

export function withSelectableTableProvider<P>(
  Component: React.ComponentType<P extends JSX.IntrinsicAttributes ? P : never>,
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

export default SelectableTableProvider;

export { useSelectableTableStore };
