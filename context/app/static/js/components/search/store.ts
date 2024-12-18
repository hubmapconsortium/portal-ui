import esb from 'elastic-builder';
import LZString from 'lz-string';
import { createStoreImmer, createStoreContext } from 'js/helpers/zustand';
import history from 'history/browser';
import { SWRConfiguration } from 'swr';
import { z } from 'zod';

export interface SortField {
  field: string;
  direction: 'asc' | 'desc';
  secondarySort?: SortField;
}

export const FACETS = {
  hierarchical: 'HIERARCHICAL',
  term: 'TERM',
  range: 'RANGE',
  date: 'DATE',
  exists: 'EXISTS',
} as const;

export interface FacetConfig {
  field: string;
}

interface AggregationOrder {
  type: '_count' | '_term';
  dir: 'asc' | 'desc';
}
export interface TermConfig extends FacetConfig {
  type: typeof FACETS.term;
  order?: AggregationOrder;
}

export interface TermValues<V = Set<string>> {
  values: V;
  type: typeof FACETS.term;
}

export interface ExistsConfig extends FacetConfig {
  default: boolean;
  invert?: boolean;
  type: typeof FACETS.exists;
}

export interface ExistsValues {
  values: boolean;
  type: typeof FACETS.exists;
}

export interface HierarchicalTermConfig extends FacetConfig {
  childField: string;
  order?: AggregationOrder;
  type: typeof FACETS.hierarchical;
}

export interface HierarchicalTermValues<V = Set<string>> {
  values: Record<string, V>;
  type: typeof FACETS.hierarchical;
}

export interface RangeConfig extends FacetConfig {
  min?: number;
  max?: number;
  interval?: number;
  type: typeof FACETS.range;
}

export interface RangeValues {
  values: {
    min?: number;
    max?: number;
  };
  type: typeof FACETS.range;
}

export interface DateConfig extends Omit<RangeConfig, 'type' | 'interval'> {
  type: typeof FACETS.date;
}

export interface DateValues extends Omit<RangeValues, 'type'> {
  type: typeof FACETS.date;
  values: {
    min?: number;
    max?: number;
  };
}

export type Filter<V = Set<string>> =
  | TermValues<V>
  | HierarchicalTermValues<V>
  | RangeValues
  | DateValues
  | ExistsValues;
export type Facet = TermConfig | HierarchicalTermConfig | RangeConfig | DateConfig | ExistsConfig;

export type FiltersType<V = Set<string>> = Record<string, Filter<V>>;
export type FacetsType = Record<string, Facet>;

type SourceFields = Record<string, string[]>;

export interface SearchState<V> {
  filters: FiltersType<V>;
  initialFilters: FiltersType<V>;
  facets: FacetsType;
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

// Used to validate URL Search

const rangeFilterSchema = z.object({
  values: z.object({
    min: z.number(),
    max: z.number(),
  }),
  type: z.literal(FACETS.range),
});

const dateFilterSchema = z.object({
  values: z.object({
    min: z.number(),
    max: z.number(),
  }),
  type: z.literal(FACETS.date),
});

const termFilterSchema = z.object({
  values: z.array(z.string()),
  type: z.literal(FACETS.term),
});

const hierarchicalTermFilterSchema = z.object({
  values: z.record(z.string(), z.array(z.string())),
  type: z.literal(FACETS.hierarchical),
});

const existsFilterSchema = z.object({
  values: z.boolean(),
  type: z.literal(FACETS.exists),
});

const filtersSchema = z.record(
  z.string(),
  z.union([dateFilterSchema, rangeFilterSchema, termFilterSchema, hierarchicalTermFilterSchema, existsFilterSchema]),
);

const sortFieldSchema = z.object({
  field: z.string(),
  direction: z.union([z.literal('asc'), z.literal('desc')]),
});

const searchURLStateSchema = z
  .object({
    search: z.string(),
    sortField: sortFieldSchema,
    filters: filtersSchema,
  })
  .partial();

export function parseURLState(stateJSON: string) {
  try {
    const parsed = searchURLStateSchema.parse(JSON.parse(stateJSON));
    return parsed;
  } catch {
    return {};
  }
}

export type SearchStoreState = SearchState<Set<string>>;
export type SearchURLState = Partial<SearchState<string[]>>;

export interface SearchStoreActions {
  resetFilters: () => void;
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
  filterRange: ({ field, min, max }: { field: string; min?: number; max?: number }) => void;
  filterDate: ({ field, min, max }: { field: string; min?: number; max?: number }) => void;
  filterExists: ({ field }: { field: string }) => void;
}

export interface SearchStore extends SearchStoreState, SearchStoreActions {}

export function isTermFilter<V = Set<string>>(filter: Filter<V>): filter is TermValues<V> {
  return filter.type === 'TERM';
}

export function isTermFacet(facet: Facet): facet is TermConfig {
  return facet.type === 'TERM';
}

export function isRangeFilter<V = Set<string>>(filter: Filter<V>): filter is RangeValues {
  return filter.type === 'RANGE';
}

export function isRangeFacet(facet: Facet): facet is RangeConfig {
  return facet.type === 'RANGE';
}

export function isDateFacet(facet: Facet): facet is DateConfig {
  return facet.type === 'DATE';
}

export function isDateFilter<V = Set<string>>(filter: Filter<V>): filter is DateValues {
  return filter.type === 'DATE';
}

export function isHierarchicalFilter<V = Set<string>>(filter: Filter<V>): filter is HierarchicalTermValues<V> {
  return filter.type === 'HIERARCHICAL';
}

export function isHierarchicalFacet(facet: Facet): facet is HierarchicalTermConfig {
  return facet.type === 'HIERARCHICAL';
}

export function isExistsFacet(facet: Facet): facet is ExistsConfig {
  return facet.type === 'EXISTS';
}

export function isExistsFilter<V = Set<string>>(filter: Filter<V>): filter is ExistsValues {
  return filter.type === 'EXISTS';
}

export function filterHasValues({ filter }: { filter: Filter }) {
  if (isTermFilter(filter)) {
    return filter.values.size;
  }

  if (isHierarchicalFilter(filter)) {
    return Object.keys(filter.values).length;
  }

  if (isRangeFilter(filter)) {
    return !(filter.values.min === undefined && filter.values.max === undefined);
  }

  if (isDateFilter(filter)) {
    return filter.values.min && filter.values.max;
  }

  if (isExistsFilter(filter)) {
    return filter.values;
  }
  return false;
}

export function buildSearchLink({
  entity_type,
  filters,
}: {
  entity_type: 'Donor' | 'Dataset' | 'Sample';
  filters?: FiltersType<string[]>;
}) {
  const search = filters ? `?${LZString.compressToEncodedURIComponent(JSON.stringify({ filters }))}` : '';
  return `/search/${entity_type.toLowerCase()}s${search}`;
}

function replaceURLSearchParams(state: SearchStoreState) {
  const { search, sortField, filters } = state;

  const filtersWithValues = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => filterHasValues({ filter: v })),
  );

  const urlState = {
    search,
    sortField,
    filters: filtersWithValues,
  };

  const urlStateWithArrays: string = JSON.stringify(urlState, (_key, value: unknown) =>
    value instanceof Set ? [...value] : value,
  );

  const { pathname } = history.location;

  history.push(`${pathname}?${LZString.compressToEncodedURIComponent(urlStateWithArrays)}`);
}

export const createStore = ({ initialState }: { initialState: SearchStoreState }) =>
  createStoreImmer<SearchStore>((set) => ({
    ...initialState,
    resetFilters: () => {
      set((state) => {
        state.filters = state.initialFilters;
        replaceURLSearchParams(state);
      });
    },
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
        const filter = state?.filters?.[term];

        if (!isTermFilter(filter)) {
          return;
        }
        const { values } = filter;

        if (values.has(value)) {
          values.delete(value);
        } else {
          values.add(value);
        }
        replaceURLSearchParams(state);
      });
    },
    filterHierarchicalParentTerm: ({ term, value, childValues }) => {
      set((state) => {
        const filter = state?.filters?.[term];

        if (!isHierarchicalFilter(filter)) {
          return;
        }
        const { values } = filter;

        if (values?.[value]) {
          delete values[value];
        } else {
          values[value] = new Set([...childValues]);
        }
        replaceURLSearchParams(state);
      });
    },
    filterHierarchicalChildTerm: ({ parentTerm, parentValue, value }) => {
      set((state) => {
        const filter = state?.filters?.[parentTerm];

        if (!isHierarchicalFilter(filter)) {
          return;
        }

        const { values } = filter;

        const childValues = values[parentValue] ?? new Set([]);

        if (childValues.has(value)) {
          childValues.delete(value);
        } else {
          childValues.add(value);
        }

        if (childValues.size === 0) {
          delete filter.values[parentValue];
        } else {
          filter.values[parentValue] = childValues;
        }

        replaceURLSearchParams(state);
      });
    },
    filterRange: ({ field, min, max }) => {
      set((state) => {
        const filter = state?.filters[field];

        if (!isRangeFilter(filter)) {
          return;
        }

        filter.values = { min, max };
        replaceURLSearchParams(state);
      });
    },
    filterDate: ({ field, min, max }) => {
      set((state) => {
        const filter = state?.filters[field];

        if (!isDateFilter(filter)) {
          return;
        }

        filter.values = { min, max };
        replaceURLSearchParams(state);
      });
    },
    filterExists: ({ field }) => {
      set((state) => {
        const filter = state?.filters[field];

        if (!isExistsFilter(filter)) {
          return;
        }

        filter.values = !filter.values;
        replaceURLSearchParams(state);
      });
    },
  }));

const [SearchStoreProvider, useSearchStore, SearchStoreContext] = createStoreContext(createStore, 'Search');

export { SearchStoreProvider, useSearchStore, SearchStoreContext };
