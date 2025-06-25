import { createContext, useContext } from 'js/helpers/context';
import React, { PropsWithChildren, useMemo, useState } from 'react';

interface CellTypesSearchState {
  search: string;
  organs: string[];
}

interface CellTypesSearchActions {
  setSearch: (search: string) => void;
  setOrgans: (organs: string[]) => void;
}

const CellTypesSearchStateContext = createContext<CellTypesSearchState>('CellTypesSearchStateContext');
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

  const state = useMemo(() => ({ search, organs }), [search, organs]);

  const actions = useMemo(
    () => ({
      setSearch,
      setOrgans,
    }),
    [],
  );

  return (
    <CellTypesSearchStateContext.Provider value={state}>
      <CellTypesSearchActionsContext.Provider value={actions}>{children}</CellTypesSearchActionsContext.Provider>
    </CellTypesSearchStateContext.Provider>
  );
}
