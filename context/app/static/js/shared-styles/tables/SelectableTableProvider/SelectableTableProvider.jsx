import React from 'react';

import { Provider, createStore } from './store';

function SelectableTableProvider({ children, tableLabel }) {
  return <Provider createStore={() => createStore(tableLabel)}>{children}</Provider>;
}

export default SelectableTableProvider;
