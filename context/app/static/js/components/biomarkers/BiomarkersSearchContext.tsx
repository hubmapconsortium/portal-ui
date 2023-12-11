import React, { Dispatch, PropsWithChildren, useMemo, useState } from 'react';
import { createContext, useContext } from 'js/helpers/context';

type FilterType = 'gene' | 'protein';

interface BiomarkersSearchStateContext {
  search: string;
  filterType?: FilterType;
}

interface BiomarkersSearchActionsContext {
  setSearch: Dispatch<React.SetStateAction<string>>;
  toggleFilterByGenes: () => void;
  toggleFilterByProteins: () => void;
}

const BiomarkersSearchStateContext = createContext<BiomarkersSearchStateContext>('BiomarkersSearchContext');
const BiomarkersSearchActionsContext = createContext<BiomarkersSearchActionsContext>('BiomarkersSearchActionsContext');

function BiomarkersSearchProvider({ children }: PropsWithChildren) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<FilterType>();

  const searchState = useMemo(
    () => ({
      search,
      filterType,
    }),
    [search, filterType],
  );

  const searchActions = useMemo(
    () => ({
      setSearch,
      toggleFilterByGenes: () => setFilterType((c) => (c === 'gene' ? undefined : 'gene')),
      toggleFilterByProteins: () => setFilterType((c) => (c === 'protein' ? undefined : 'protein')),
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
