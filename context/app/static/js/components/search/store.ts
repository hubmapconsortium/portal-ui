import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';

import { SWRConfiguration } from 'swr';

interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

interface SourceField {
  label: string;
}

interface HierarchicalTerm {
  values: Record<string, Set<string>>;
  childField: string;
}

export interface SearchStoreState {
  terms: Record<string, Set<string>>;
  termz: Record<string, HierarchicalTerm>;
  sortField: SortField;
  sourceFields: Record<string, SourceField>;
  size: number;
  endpoint: string;
  swrConfig: SWRConfiguration;
}

export interface SearchStoreActions {
  setSortField: (sortField: SortField) => void;
  filterTerm: ({ term, value }: { term: string; value: string }) => void;
  filterHierarchicalParentTerm: ({
    term,
    value,
    childValues,
  }: {
    term: string;
    value: string;
    childValues: string[];
  }) => void;
  filterHierarchicalChildTerm: ({
    parentTerm,
    parentValue,
    value,
  }: {
    parentTerm: string;
    parentValue: string;
    value: string;
  }) => void;
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
    filterHierarchicalParentTerm: ({ term, value, childValues }) => {
      set((state) => {
        const termState = state?.termz?.[term];

        if (!termState) {
          return;
        }

        const { values } = termState;

        if (value in values) {
          delete values[value];
        } else {
          values[value] = new Set(childValues);
        }
      });
    },
    filterHierarchicalChildTerm: ({ parentTerm, parentValue, value }) => {
      set((state) => {
        const termState = state?.termz?.[parentTerm];

        if (!termState) {
          return;
        }

        const childValues = termState?.values?.[parentValue];

        if (!childValues) {
          return;
        }

        if (childValues.has(value)) {
          childValues.delete(value);
          if (childValues.size === 0) {
            delete termState.values[parentValue];
          }
        } else {
          childValues.add(value);
        }
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
