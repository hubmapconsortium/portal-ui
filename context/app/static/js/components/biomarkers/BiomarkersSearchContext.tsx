import React, { Dispatch, PropsWithChildren, useMemo, useState } from 'react';
import { createContext, useContext } from 'js/helpers/context';

interface BiomarkersSearchStateContext {
  search: string;
}

interface BiomarkersSearchActionsContext {
  setSearch: Dispatch<React.SetStateAction<string>>;
}

const BiomarkersSearchStateContext = createContext<BiomarkersSearchStateContext>('BiomarkersSearchContext');
const BiomarkersSearchActionsContext = createContext<BiomarkersSearchActionsContext>('BiomarkersSearchActionsContext');

function BiomarkersSearchProvider({ children }: PropsWithChildren) {
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
    <BiomarkersSearchStateContext.Provider value={searchState}>
      <BiomarkersSearchActionsContext.Provider value={searchActions}>
        {children}
      </BiomarkersSearchActionsContext.Provider>
    </BiomarkersSearchStateContext.Provider>
  );
}

function useBiomarkersSearchState() {
  return useContext(BiomarkersSearchStateContext);
}

function useBiomarkersSearchActions() {
  return useContext(BiomarkersSearchActionsContext);
}

export default BiomarkersSearchProvider;
export { useBiomarkersSearchState, useBiomarkersSearchActions };
