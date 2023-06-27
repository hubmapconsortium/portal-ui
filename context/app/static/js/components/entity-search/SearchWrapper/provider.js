import React from 'react';

import { Provider, createStore } from './store';

function SearchConfigProvider({ children, initialConfig }) {
  return <Provider createStore={() => createStore(initialConfig)}>{children}</Provider>;
}

export const withSearchConfigProvider = (Component, initialConfig) =>
  function ({ ...props }) {
    return (
      <SearchConfigProvider initialConfig={initialConfig}>
        <Component {...props} />
      </SearchConfigProvider>
    );
  };

export default SearchConfigProvider;
