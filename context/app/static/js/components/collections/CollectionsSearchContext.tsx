import React, { Dispatch, PropsWithChildren, useState } from 'react';
import { createContext, useContext } from 'js/helpers/context';

type CollectionsSearchStateContext = string;
type CollectionsSearchActionsContext = Dispatch<React.SetStateAction<string>>;

const CollectionsSearchStateContext = createContext<CollectionsSearchStateContext>('CollectionsSearchContext');
const CollectionsSearchActionsContext = createContext<CollectionsSearchActionsContext>(
  'CollectionsSearchActionsContext',
);

function CollectionsSearchProvider({ children }: PropsWithChildren) {
  const [search, setSearch] = useState('');

  return (
    <CollectionsSearchStateContext.Provider value={search}>
      <CollectionsSearchActionsContext.Provider value={setSearch}>{children}</CollectionsSearchActionsContext.Provider>
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
