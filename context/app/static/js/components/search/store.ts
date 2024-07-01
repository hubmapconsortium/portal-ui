import esb from 'elastic-builder';
import { produce } from 'immer';
import { stringify } from 'qs';
import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';

import { SWRConfiguration } from 'swr';

export interface SortField {
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

export interface Term<V = Set<string>> extends TermConfig {
  values: V;
}

export interface HierarchicalTerm<V = Set<string>> extends HierarchicalTermConfig {
  values: Record<string, V>;
}

interface Range extends RangeConfig {
  values: { min: number; max: number };
}

export interface FacetsState<V = Set<string>> {
  terms: Record<string, Term<V>>;
  hierarchicalTerms: Record<string, HierarchicalTerm<V>>;
  ranges: Record<string, Range>;
}

type SourceFields = Record<string, string[]>;

export interface SearchState<V> extends FacetsState<V> {
  defaultQuery?: esb.Query;
  search: string;
  searchFields: string[];
  sortField: SortField;
  sourceFields: SourceFields;
  view: string;
  size: number;
  endpoint: string;
  swrConfig?: SWRConfiguration;
  type: 'Donor' | 'Sample' | 'Dataset';
  analyticsCategory: string;
}

export type SearchStoreState = SearchState<Set<string>>;
export type SearchURLState = Partial<SearchState<string[]>>;

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

export function termHasValues({ values }: Term) {
  return values.size;
}

export function hierarchicalTermHasValues({ values }: HierarchicalTerm) {
  return Object.keys(values).length;
}

export function rangeHasValues({ values, min, max }: Range) {
  return values.min !== min || values.max !== max;
}

export function convertState(state: SearchURLState) {
  const { terms = {}, hierarchicalTerms = {} } = state;

  const t = Object.entries(terms).reduce<Record<string, Term>>((acc, [k, v]) => {
    return produce(acc, (draft) => {
      draft[k] = { ...v, values: new Set(v.values) };
    });
  }, {});

  const h = Object.entries(hierarchicalTerms).reduce<Record<string, HierarchicalTerm>>((acc, [k, v]) => {
    return produce(acc, (draft) => {
      draft[k] = {
        ...v,
        values: Object.entries(v.values).reduce<Record<string, Set<string>>>((childAcc, [childKey, childValues]) => {
          return produce(childAcc, (childDraft) => {
            childDraft[childKey] = new Set(childValues);
          });
        }, {}),
      };
    });
  }, {});

  return { ...state, terms: t, hierarchicalTerms: h };
}

function replaceURLSearchParams(state: SearchStoreState) {
  const { search, sortField, terms, hierarchicalTerms, ranges } = state;

  const termsWithValues = Object.fromEntries(Object.entries(terms).filter(([_k, v]) => termHasValues(v)));
  const hierarchicalTermsWithValues = Object.fromEntries(
    Object.entries(hierarchicalTerms).filter(([_k, v]) => hierarchicalTermHasValues(v)),
  );
  const rangesWithValues = Object.fromEntries(Object.entries(ranges).filter(([_k, v]) => rangeHasValues(v)));

  const urlState = {
    search,
    sortField,
    terms: termsWithValues,
    hierarchicalTerms: hierarchicalTermsWithValues,
    ranges: rangesWithValues,
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const urlStateWithArrays: URLSearchParams = JSON.parse(
    JSON.stringify(urlState, (_key, value: unknown) => (value instanceof Set ? [...value] : value)),
  );

  const urlCopy = new URL(String(window.location));
  urlCopy.search = stringify(urlStateWithArrays);

  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, '', urlCopy);
}

export const createStore = ({ initialState }: { initialState: SearchStoreState }) =>
  createStoreImmer<SearchStore>((set) => ({
    ...initialState,
    setSearch: (search) => {
      set((state) => {
        state.search = search;
        replaceURLSearchParams(state);
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
        replaceURLSearchParams(state);
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
        replaceURLSearchParams(state);
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
        replaceURLSearchParams(state);
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
        replaceURLSearchParams(state);
      });
    },
    filterRange: ({ field, min, max }) => {
      set((state) => {
        const range = state?.ranges[field];

        if (!range) {
          return;
        }
        range.values = { min, max };
        replaceURLSearchParams(state);
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
