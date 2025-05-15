import React, { createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState } from 'react';

export function createSearchContext() {
  const StateContext = createContext<string | undefined>(undefined);
  const ActionsContext = createContext<Dispatch<SetStateAction<string>> | undefined>(undefined);

  function SearchProvider({ children }: PropsWithChildren) {
    const [search, setSearch] = useState('');

    return (
      <StateContext.Provider value={search}>
        <ActionsContext.Provider value={setSearch}>{children}</ActionsContext.Provider>
      </StateContext.Provider>
    );
  }

  function useSearchState() {
    const context = useContext(StateContext);
    if (context === undefined) {
      throw new Error('useSearchState must be used within a SearchProvider');
    }
    return context;
  }

  function useSearchActions() {
    const context = useContext(ActionsContext);
    if (context === undefined) {
      throw new Error('useSearchActions must be used within a SearchProvider');
    }
    return context;
  }

  return {
    SearchProvider,
    useSearchState,
    useSearchActions,
  };
}
