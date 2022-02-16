import React from 'react';

import { Provider, createStore } from './store';

function SearchConfigProvider({ children, initalConfig }) {
  return <Provider createStore={() => createStore(initalConfig)}>{children}</Provider>;
}

export const withSearchConfigProvider = (Component, initialConfig) => ({ ...props }) => (
  <SearchConfigProvider initalConfig={initialConfig}>
    <Component {...props} />
  </SearchConfigProvider>
);

export default SearchConfigProvider;
