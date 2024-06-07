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

export interface SearchStoreActions {
  setSortField: (sortField: SortField) => void;
  filterTerm: ({ term, value }: { term: string; value: string }) => void;
}

export interface SearchStore extends SearchStoreState, SearchStoreActions {}

export const createStore = ({ initialState }: { initialState: SearchStoreState }) =>
  createStoreImmer<SearchStore>((set) => ({
    ...initialState,
    setSortField: (sortField) => {
      set((state) => {
        state.sortField = sortField;
      });
    },
    filterTerm: ({ term, value }) => {
      set((state) => {
        const termSet = state?.terms?.[term];
        if (!termSet) {
          return;
        }
        if (termSet.has(value)) {
          termSet.delete(value);
        } else {
          termSet.add(value);
        }
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
