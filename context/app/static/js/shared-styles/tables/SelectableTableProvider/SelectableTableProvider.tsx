import React, { ComponentType } from 'react';

import { createStoreContext } from 'js/helpers/zustand';
import { CreateSelectableTableStoreInput, createStore, type SelectableTableStore } from './store';

const [SelectableTableProvider, useSelectableTableStore] = createStoreContext<
  SelectableTableStore,
  CreateSelectableTableStoreInput
>(createStore, 'Selectable Table Store');

export function withSelectableTableProvider<P extends object>(Component: ComponentType<P>, tableLabel: string) {
  return function ComponentWithSelectableTableProvider(props: P) {
    return (
      <SelectableTableProvider tableLabel={tableLabel}>
        <Component {...props} />
      </SelectableTableProvider>
    );
  };
}

export default SelectableTableProvider;

export { useSelectableTableStore };
