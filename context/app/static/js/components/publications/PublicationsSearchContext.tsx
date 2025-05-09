import React, { Dispatch, PropsWithChildren, useState } from 'react';
import { createContext, useContext } from 'js/helpers/context';

type PublicationsSearchStateContext = string;
type PublicationsSearchActionsContext = Dispatch<React.SetStateAction<string>>;

const PublicationsSearchStateContext = createContext<PublicationsSearchStateContext>('PublicationsSearchContext');
const PublicationsSearchActionsContext = createContext<PublicationsSearchActionsContext>(
  'PublicationsSearchActionsContext',
);

function PublicationsSearchProvider({ children }: PropsWithChildren) {
  const [search, setSearch] = useState('');

  return (
    <PublicationsSearchStateContext.Provider value={search}>
      <PublicationsSearchActionsContext.Provider value={setSearch}>
        {children}
      </PublicationsSearchActionsContext.Provider>
    </PublicationsSearchStateContext.Provider>
  );
}

function usePublicationsSearchState() {
  return useContext(PublicationsSearchStateContext);
}

function usePublicationsSearchActions() {
  return useContext(PublicationsSearchActionsContext);
}

export default PublicationsSearchProvider;
export { usePublicationsSearchState, usePublicationsSearchActions };
