import { createContext, useContext } from 'js/helpers/context';
import { SortState, useSortState } from 'js/hooks/useSortState';
import React, { PropsWithChildren, useMemo, useState } from 'react';

interface OrgansSearchState {
  search: string;
  sortState: SortState;
}

type OrgansSearchStateContextType = OrgansSearchState;

interface OrgansSearchActions {
  setSearch: (search: string) => void;
  setSort: (columnId: string) => void;
}

const OrgansSearchStateContext = createContext<OrgansSearchStateContextType>('OrgansSearchStateContext');
const OrgansSearchActionsContext = createContext<OrgansSearchActions>('OrgansSearchActionsContext');

export function useOrgansSearchState() {
  return useContext(OrgansSearchStateContext);
}

export function useOrgansSearchActions() {
  return useContext(OrgansSearchActionsContext);
}

interface OrgansSearchProviderProps extends PropsWithChildren {
  initialState?: Partial<OrgansSearchState>;
}

const defaultInitialState: OrgansSearchState = {
  search: '',
  sortState: {
    columnId: 'datasets',
    direction: 'desc',
  },
};

export default function OrgansSearchProvider({
  children,
  initialState = defaultInitialState,
}: OrgansSearchProviderProps) {
  const [search, setSearch] = useState(initialState.search ?? defaultInitialState.search);

  const { sortState, setSort } = useSortState(
    {
      name: 'name',
      uberon: 'uberon',
      description: 'description',
      datasets: 'datasets',
      samples: 'samples',
    },
    initialState.sortState ?? defaultInitialState.sortState,
  );

  const state: OrgansSearchStateContextType = useMemo(
    () => ({
      search,
      sortState,
    }),
    [search, sortState],
  );

  const actions = useMemo(
    () => ({
      setSearch,
      setSort,
    }),
    [setSort],
  );

  return (
    <OrgansSearchStateContext.Provider value={state}>
      <OrgansSearchActionsContext.Provider value={actions}>{children}</OrgansSearchActionsContext.Provider>
    </OrgansSearchStateContext.Provider>
  );
}
