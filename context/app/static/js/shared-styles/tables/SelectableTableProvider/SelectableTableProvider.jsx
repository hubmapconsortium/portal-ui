import React from 'react';

import { Provider, createStore } from './store';

function SelectableTableProvider({ children }) {
  return <Provider createStore={createStore}>{children}</Provider>;
}

export default SelectableTableProvider;
