import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';

interface CellTypesSearchState {
  search: string;
  organs: string[];
}

interface CellTypesSearchDerivedState {
  organCount: number;
  organIsSelected: (organ: string) => boolean;
}

interface CellTypesSearchActions {
  setSearch: (search: string) => void;
  setOrgans: (organs: string[]) => void;
  deselectAllOrgans: () => void;
  resetToInitialOrgans: () => void;
  toggleOrgan: (organ: string) => void;
}

const CellTypesSearchStateContext = createContext<CellTypesSearchState & CellTypesSearchDerivedState>(
  'CellTypesSearchStateContext',
);
const CellTypesSearchActionsContext = createContext<CellTypesSearchActions>('CellTypesSearchActionsContext');

export function useCellTypesSearchState() {
  return useContext(CellTypesSearchStateContext);
}

export function useCellTypesSearchActions() {
  return useContext(CellTypesSearchActionsContext);
}

interface CellTypesSearchProviderProps extends PropsWithChildren {
  initialState?: CellTypesSearchState;
}

export default function CellTypesSearchProvider({
  children,
  initialState = {
    search: '',
    organs: [],
  },
}: CellTypesSearchProviderProps) {
  const [search, setSearch] = useState(initialState.search);
  const [organs, setOrgans] = useState(initialState.organs);

  useEffect(() => {
    // Reset organs when initialState changes
    setOrgans(initialState.organs);
  }, [initialState.organs]);

  const state = useMemo(
    () => ({
      search,
      organs,
      organIsSelected: (organ: string) => organs.includes(organ),
      organCount: organs.length,
    }),
    [search, organs],
  );

  const actions = useMemo(
    () => ({
      setSearch,
      setOrgans,
      deselectAllOrgans: () => setOrgans([]),
      resetToInitialOrgans: () => setOrgans(initialState.organs),
      toggleOrgan: (organ: string) => {
        setOrgans((prevOrgans) =>
          prevOrgans.includes(organ) ? prevOrgans.filter((o) => o !== organ) : [...prevOrgans, organ],
        );
      },
    }),
    [initialState.organs],
  );

  return (
    <CellTypesSearchStateContext.Provider value={state}>
      <CellTypesSearchActionsContext.Provider value={actions}>{children}</CellTypesSearchActionsContext.Provider>
    </CellTypesSearchStateContext.Provider>
  );
}
