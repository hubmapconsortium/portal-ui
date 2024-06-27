import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';

import { SWRConfiguration } from 'swr';

interface SortField {
  field: string;
  direction: 'asc' | 'desc';
}

export const FACETS = {
  hierarchical: 'HIERARCHICAL',
  term: 'TERM',
  range: 'RANGE',
} as const;

export interface FacetConfig {
  field: string;
  type: (typeof FACETS)[keyof typeof FACETS];
}

export interface TermConfig extends FacetConfig {
  type: typeof FACETS.term;
}

export interface HierarchicalTermConfig extends FacetConfig {
  childField: string;
  type: typeof FACETS.hierarchical;
}

export interface RangeConfig extends FacetConfig {
  min: number;
  max: number;
  type: typeof FACETS.range;
}

export interface Term extends TermConfig {
  values: Set<string>;
}

export interface HierarchicalTerm extends HierarchicalTermConfig {
  values: Record<string, Set<string>>;
}

interface Range extends RangeConfig {
  values: { min: number; max: number };
}

export interface FacetsState {
  terms: Record<string, Term>;
  hierarchicalTerms: Record<string, HierarchicalTerm>;
  ranges: Record<string, Range>;
}

type SourceFields = Record<string, string[]>;

export interface SearchStoreState extends FacetsState {
  search: string;
  searchFields: string[];
  sortField: SortField;
  sourceFields: SourceFields;
  view: string;
  size: number;
  endpoint: string;
  swrConfig?: SWRConfiguration;
}

export interface SearchStoreActions {
  setSearch: (search: string) => void;
  setView: (view: string) => void;
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
  filterRange: ({ field, min, max }: { field: string; min: number; max: number }) => void;
}

export interface SearchStore extends SearchStoreState, SearchStoreActions {}

export const createStore = ({ initialState }: { initialState: SearchStoreState }) =>
  createStoreImmer<SearchStore>((set) => ({
    ...initialState,
    setSearch: (search) => {
      set((state) => {
        state.search = search;
      });
    },
    setView: (view) => {
      set((state) => {
        state.view = view;
      });
    },
    setSortField: (sortField) => {
      set((state) => {
        state.sortField = sortField;
      });
    },
    filterTerm: ({ term, value }) => {
      set((state) => {
        const termSet = state?.terms?.[term].values;
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
        const termState = state?.hierarchicalTerms?.[term];

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
        const termState = state?.hierarchicalTerms?.[parentTerm];

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
    filterRange: ({ field, min, max }) => {
      set((state) => {
        const range = state?.ranges[field];

        if (!range) {
          return;
        }
        range.values = { min, max };
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
