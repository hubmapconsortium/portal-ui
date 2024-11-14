import React, { useEffect, useState } from 'react';
import {
  AggregationsTermsAggregateBase,
  AggregationsSingleMetricAggregateBase,
} from '@elastic/elasticsearch/lib/api/types';
import { produce } from 'immer';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import LZString from 'lz-string';
import merge from 'deepmerge';
import history from 'history/browser';

import { useAppContext } from 'js/components/Contexts';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';
import {
  SearchStoreProvider,
  useSearchStore,
  SearchStoreState,
  FACETS,
  SearchURLState,
  FiltersType,
  FacetsType,
  isTermFilter,
  isRangeFilter,
  isHierarchicalFilter,
  parseURLState,
  Facet,
  isDateFilter,
  isExistsFilter,
} from './store';
import Results from './Results';
import Facets from './Facets/Facets';
import SearchBar from './SearchBar';
import { useScrollSearchHits } from './useScrollSearchHits';
import FilterChips from './Facets/FilterChips';
import { Entity } from '../types';
import { DefaultSearchViewSwitch } from './SearchViewSwitch';
import { TilesSortSelect } from './Results/ResultsTiles';
import MetadataMenu from '../searchPage/MetadataMenu';
import SearchNote from './SearchNote';

interface OuterBucket {
  doc_count: number;
  sum_other_doc_count?: number;
}
export interface InnerBucket extends OuterBucket {
  key: string;
  key_as_string?: string;
}

export type HierarchicalBucket = InnerBucket & Partial<Record<string, AggregationsTermsAggregateBase<InnerBucket>>>;

type Aggregations = Record<
  string,
  OuterBucket &
    Record<string, AggregationsTermsAggregateBase<HierarchicalBucket> | AggregationsSingleMetricAggregateBase>
>;

export function useSearch() {
  const {
    endpoint,
    swrConfig = {},
    filters,
    facets,
    search,
    size,
    searchFields,
    sourceFields,
    sortField,
    defaultQuery,
  }: SearchStoreState = useSearchStore();

  return useScrollSearchHits<Partial<Entity>, Aggregations>({
    endpoint,
    swrConfig,
    filters,
    facets,
    search,
    size,
    searchFields,
    sourceFields,
    sortField,
    defaultQuery,
  });
}

export type FacetGroups = Record<string, Facet[]>;

function buildFacets({ facetGroups }: { facetGroups: FacetGroups }) {
  const allFacets = Object.values(facetGroups).flat();

  return allFacets.reduce<{ filters: FiltersType; facets: FacetsType }>(
    (acc, curr) => {
      return produce(acc, (draft) => {
        if (curr.type === FACETS.term) {
          draft.filters[curr.field] = { values: new Set([]), type: curr.type };
          draft.facets[curr.field] = { ...curr };
        }

        if (curr.type === FACETS.hierarchical) {
          draft.filters[curr.field] = { values: {}, type: curr.type };
          draft.facets[curr.field] = curr;
        }

        if (curr.type === FACETS.range) {
          draft.filters[curr.field] = { values: { min: curr.min, max: curr.max }, type: curr.type };
          draft.facets[curr.field] = curr;
        }

        if (curr.type === FACETS.date) {
          draft.filters[curr.field] = { values: { min: undefined, max: undefined }, type: curr.type };
          draft.facets[curr.field] = curr;
        }

        if (curr.type === FACETS.exists) {
          draft.filters[curr.field] = { values: curr.default, type: curr.type };
          draft.facets[curr.field] = curr;
        }

        return draft;
      });
    },
    { filters: {}, facets: {} },
  );
}

type SearchConfig = Pick<
  SearchStoreState,
  | 'searchFields'
  | 'sourceFields'
  | 'endpoint'
  | 'swrConfig'
  | 'sortField'
  | 'size'
  | 'type'
  | 'defaultQuery'
  | 'analyticsCategory'
> & {
  facets: FacetGroups;
};

function buildInitialSearchState({ facets, sourceFields, swrConfig = {}, ...rest }: SearchConfig) {
  return {
    search: '',
    ...buildFacets({ facetGroups: facets }),
    swrConfig,
    sourceFields,
    view: Object.keys(sourceFields)[0],
    ...rest,
  };
}

const EntityIcon = styled(SvgIcon)<SvgIconProps>({
  fontSize: '2.5rem',
});

interface TypeProps {
  type: keyof Pick<typeof entityIconMap, 'Dataset' | 'Donor' | 'Sample'>;
}

function Header({ type }: TypeProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <EntityIcon component={entityIconMap[type]} color="primary" />
      <Typography component="h1" variant="h2">
        {type}s
      </Typography>
    </Stack>
  );
}

function Bar({ type }: TypeProps) {
  const view = useSearchStore((state) => state.view);

  return (
    <Stack direction="row" spacing={1}>
      <Box flexGrow={1}>
        <SearchBar />
      </Box>
      <MetadataMenu type={type} />
      <WorkspacesDropdownMenu type={type} />
      {view === 'tile' && <TilesSortSelect />}
      <DefaultSearchViewSwitch />
    </Stack>
  );
}

function Body({ facetGroups }: { facetGroups: FacetGroups }) {
  return (
    <Stack direction="row" spacing={2}>
      <Facets facetGroups={facetGroups} />
      <Box flexGrow={1}>
        <Results />
      </Box>
    </Stack>
  );
}

const Search = React.memo(function Search({ type, facetGroups }: TypeProps & { facetGroups: FacetGroups }) {
  return (
    <Stack spacing={2} mb={4}>
      <Header type={type} />
      <Stack direction="column" spacing={1} mb={2}>
        <Box>
          <SearchNote />
          <Bar type={type} />
        </Box>
        <FilterChips />
        <Body facetGroups={facetGroups} />
      </Stack>
    </Stack>
  );
});

const mergeFilters = (filterState: FiltersType, filterURLState: FiltersType<string[]>) => {
  const mergedFilters = Object.entries({ ...filterURLState, ...filterState }).reduce<FiltersType>((acc, [k, v]) => {
    return produce(acc, (draft) => {
      const URLStateFilter = filterURLState?.[k];

      if (isTermFilter<string[] | Set<string>>(v)) {
        const urlStateValues = URLStateFilter && isTermFilter<string[]>(URLStateFilter) ? URLStateFilter.values : [];
        draft[k] = { ...v, values: new Set([...v.values, ...urlStateValues]) };
      }

      if (isHierarchicalFilter<string[] | Set<string>>(v)) {
        const urlStateValues =
          URLStateFilter && isHierarchicalFilter<string[]>(URLStateFilter) ? URLStateFilter.values : {};
        draft[k] = {
          ...v,
          values: Object.fromEntries(
            Object.entries(urlStateValues).map(([parentValue, childValues]) => [
              parentValue,
              new Set([...childValues, ...urlStateValues[parentValue]]),
            ]),
          ),
        };
      }

      if (isRangeFilter<string[] | Set<string>>(v)) {
        draft[k] = {
          ...v,
          values: URLStateFilter && isRangeFilter<string[]>(URLStateFilter) ? URLStateFilter?.values : v.values,
        };
      }

      if (isDateFilter<string[] | Set<string>>(v)) {
        draft[k] = {
          ...v,
          values:
            URLStateFilter && isDateFilter<string[] | Set<string>>(URLStateFilter) ? URLStateFilter?.values : v.values,
        };
      }

      if (isExistsFilter<string[] | Set<string>>(v)) {
        draft[k] = {
          ...v,
          values:
            URLStateFilter && isExistsFilter<string[] | Set<string>>(URLStateFilter)
              ? URLStateFilter?.values
              : v.values,
        };
      }

      return draft;
    });
  }, {});
  return mergedFilters;
};

const options = {
  customMerge: (key: string) => {
    if (key === 'filters') {
      return mergeFilters;
    }
    return undefined;
  },
};

function useInitialURLState() {
  const [hasLoadedURLState, setHasLoadedURLState] = useState(false);
  const [initialUrlState, setInitialUrlState] = useState<Partial<SearchURLState>>({ filters: {} });

  useEffect(() => {
    const searchParams = history?.location?.search
      ? parseURLState(LZString.decompressFromEncodedURIComponent(history?.location?.search?.slice(1)))
      : {};

    if (Object.keys(searchParams).length) {
      setInitialUrlState({ filters: {}, ...searchParams });
    }
    setHasLoadedURLState(true);
  }, []);

  return { initialUrlState, hasLoadedURLState };
}

function SearchWrapper({ config }: { config: Omit<SearchConfig, 'endpoint' | 'analyticsCategory'> }) {
  const { elasticsearchEndpoint } = useAppContext();
  const { type, facets } = config;

  const { search, sortField, filters, ...rest } = buildInitialSearchState({
    ...config,
    endpoint: elasticsearchEndpoint,
    analyticsCategory: `${type}s Search Page Interactions`,
  });

  const { initialUrlState, hasLoadedURLState } = useInitialURLState();

  if (!hasLoadedURLState) {
    return null;
  }

  const initialState = {
    ...merge({ search, sortField, filters }, initialUrlState, options),
    ...rest,
    initialFilters: filters,
  };

  return (
    <SelectableTableProvider tableLabel={type}>
      <SearchStoreProvider initialState={initialState}>
        <Search type={type} facetGroups={facets} />
      </SearchStoreProvider>
    </SelectableTableProvider>
  );
}

export default SearchWrapper;
