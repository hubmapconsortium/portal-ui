import { createContext, useContext } from 'js/helpers/context';
import { trackEvent } from 'js/helpers/trackers';
import { SortState, useSortState } from 'js/hooks/useSortState';
import React, { PropsWithChildren, useMemo, useState } from 'react';

interface CellTypesSearchState {
  search: string;
  organs: string[];
  sortState: SortState;
}

interface CellTypesSearchDerivedState {
  organCount: number;
  organIsSelected: (organ: string) => boolean;
  filterIsInactive: boolean;
}

type CellTypeSearchStateContextType = CellTypesSearchState & CellTypesSearchDerivedState;

interface CellTypesSearchActions {
  setSearch: (search: string) => void;
  setOrgans: (organs: string[]) => void;
  deselectAllOrgans: () => void;
  selectAllOrgans: () => void;
  toggleOrgan: (organ: string) => void;
  setSort: (columnId: string) => void;
}

const CellTypesSearchStateContext = createContext<CellTypeSearchStateContextType>('CellTypesSearchStateContext');
const CellTypesSearchActionsContext = createContext<CellTypesSearchActions>('CellTypesSearchActionsContext');

export function useCellTypesSearchState() {
  return useContext(CellTypesSearchStateContext);
}

export function useCellTypesSearchActions() {
  return useContext(CellTypesSearchActionsContext);
}

interface CellTypesSearchProviderProps extends PropsWithChildren {
  initialState?: Partial<CellTypesSearchState>;
}

const defaultInitialState: CellTypesSearchState = {
  search: '',
  organs: [],
  sortState: {
    columnId: 'name',
    direction: 'asc',
  },
};

export default function CellTypesSearchProvider({
  children,
  initialState = defaultInitialState,
}: CellTypesSearchProviderProps) {
  const [search, setSearch] = useState(initialState.search ?? defaultInitialState.search);
  const [organs, setOrgans] = useState(initialState.organs ?? (defaultInitialState.organs || []));

  const { sortState, setSort } = useSortState(
    {
      name: 'label',
      clid: 'clid',
    },
    initialState.sortState ?? defaultInitialState.sortState,
  );

  const state: CellTypeSearchStateContextType = useMemo(
    () => ({
      search,
      organs,
      organIsSelected: (organ: string) => organs.length === 0 || organs.includes(organ),
      organCount: organs.length,
      sortState,
      get filterIsInactive() {
        return organs.length === 0;
      },
    }),
    [search, organs, sortState],
  );

  const actions = useMemo(
    () => ({
      setSearch,
      setOrgans,
      deselectAllOrgans: () => setOrgans([]),
      selectAllOrgans: () => setOrgans(initialState?.organs ?? defaultInitialState.organs),
      toggleOrgan: (organ: string) => {
        setOrgans((prevOrgans) => {
          const includesOrgan = prevOrgans.includes(organ);
          const newValue = includesOrgan ? prevOrgans.filter((o) => o !== organ) : [...prevOrgans, organ];
          trackEvent({
            category: 'Cell Type Landing Page',
            action: 'Select Table Filter',
            label: `Organ: ${[...newValue].sort().join(', ')}`,
            value: includesOrgan ? -1 : 1,
          });
          return newValue;
        });
      },
      setSort,
    }),
    [initialState.organs, setSort],
  );

  return (
    <CellTypesSearchStateContext.Provider value={state}>
      <CellTypesSearchActionsContext.Provider value={actions}>{children}</CellTypesSearchActionsContext.Provider>
    </CellTypesSearchStateContext.Provider>
  );
}
