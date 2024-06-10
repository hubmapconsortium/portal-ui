import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';

import { SWRConfiguration } from 'swr';

interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

interface SourceField {
  label: string;
}

interface ChildTerm {
  values: Set<string>;
  field: string;
}

interface Term {
  values: Set<string>;
  childTerm: ChildTerm;
}

export interface SearchStoreState {
  terms: Record<string, Set<string>>;
  termz: Record<string, Term>;
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
  filterHierarchicalChildTerm: ({ parentTerm, value }: { parentTerm: string; value: string }) => void;
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

        const { values, childTerm } = termState;

        if (values.has(value)) {
          values.delete(value);

          if (childTerm) {
            childTerm.values = new Set([]);
          }
        } else {
          values.add(value);

          if (childTerm) {
            childTerm.values = new Set(childValues);
          }
        }
      });
    },
    filterHierarchicalChildTerm: ({ parentTerm, value }) => {
      set((state) => {
        const termState = state?.termz?.[parentTerm];

        if (!termState) {
          return;
        }

        const childValues = termState?.childTerm?.values;

        if (!childValues) {
          return;
        }

        if (childValues.has(value)) {
          childValues.delete(value);
        } else {
          childValues.add(value);
        }
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
