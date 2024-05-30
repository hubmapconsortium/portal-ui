import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';

import { SWRConfiguration } from 'swr';

interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

interface SourceField {
  label: string;
}

export interface SearchStoreState {
  terms: Record<string, Set<string>>;
  sortField: SortField;
  sourceFields: Record<string, SourceField>;
  size: number;
  endpoint: string;
  swrConfig: SWRConfiguration;
}

export const createStore = ({ initialState }: { initialState: SearchStoreState }) =>
  createStoreImmer<SearchStoreState>(() => ({
    ...initialState,
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
