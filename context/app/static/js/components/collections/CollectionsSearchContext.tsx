import React, { Dispatch, PropsWithChildren, useMemo, useState } from 'react';
import { createContext, useContext } from 'js/helpers/context';

interface CollectionsSearchStateContext {
  search: string;
}

interface CollectionsSearchActionsContext {
  setSearch: Dispatch<React.SetStateAction<string>>;
}

const CollectionsSearchStateContext = createContext<CollectionsSearchStateContext>('CollectionsSearchContext');
const CollectionsSearchActionsContext = createContext<CollectionsSearchActionsContext>(
  'CollectionsSearchActionsContext',
);

function CollectionsSearchProvider({ children }: PropsWithChildren) {
  const [search, setSearch] = useState('');

  const searchState = useMemo(
    () => ({
      search,
    }),
    [search],
  );

  const searchActions = useMemo(
    () => ({
      setSearch,
    }),
    [],
  );

  return (
    <CollectionsSearchStateContext.Provider value={searchState}>
      <CollectionsSearchActionsContext.Provider value={searchActions}>
        {children}
      </CollectionsSearchActionsContext.Provider>
    </CollectionsSearchStateContext.Provider>
  );
}

function useCollectionsSearchState() {
  return useContext(CollectionsSearchStateContext);
}

function useCollectionsSearchActions() {
  return useContext(CollectionsSearchActionsContext);
}

export default CollectionsSearchProvider;
export { useCollectionsSearchState, useCollectionsSearchActions };
