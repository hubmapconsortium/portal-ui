import React, { useEffect, useState } from 'react';
import { AggregationsTermsAggregateBase } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';
import { produce } from 'immer';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import { parse } from 'qs';
import merge from 'deepmerge';
import { useAppContext } from 'js/components/Contexts';
import SelectableTableProvider from 'js/shared-styles/tables/SelectableTableProvider';
import WorkspacesDropdownMenu from 'js/components/workspaces/WorkspacesDropdownMenu';
import { entityIconMap } from 'js/shared-styles/icons/entityIconMap';

import {
  SearchStoreProvider,
  useSearchStore,
  SearchStoreState,
  FacetsState,
  HierarchicalTermConfig,
  TermConfig,
  RangeConfig,
  FACETS,
  rangeHasValues,
  termHasValues,
  hierarchicalTermHasValues,
  convertState,
  SearchURLState,
  Term,
  HierarchicalTerm,
} from './store';
import Results from './Results';
import { getPortalESField } from './buildTypesMap';
import Facets from './Facets/Facets';
import SearchBar from './SearchBar';
import { useScrollSearchHits } from './useScrollSearchHits';
import FilterChips from './Facets/FilterChips';
import { Entity } from '../types';
import { DefaultSearchViewSwitch } from './SearchViewSwitch';
import { TilesSortSelect } from './Results/ResultsTiles';
import MetadataMenu from '../searchPage/MetadataMenu';

type Filters = Record<string, esb.Query>;

const maxAggSize = 10000;

function buildFilterAggregation({
  field,
  portalFields,
  aggregation,
  filters,
}: {
  field: string;
  portalFields: string[];
  aggregation: esb.Aggregation;
  filters: Filters;
}) {
  portalFields.forEach((f) => {
    if (f in filters) {
      delete filters[f];
    }
  });

  const otherFiltersQuery = Object.keys(filters).length
    ? esb.boolQuery().must(Object.values(filters))
    : esb.boolQuery().must([]);

  return esb.filterAggregation(field, otherFiltersQuery).agg(aggregation);
}

function buildQuery({
  terms,
  hierarchicalTerms,
  ranges,
  size,
  search,
  searchFields,
  sourceFields,
  sortField,
  defaultQuery,
}: Omit<SearchStoreState, 'endpoint' | 'swrConfig'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source([...new Set(Object.values(sourceFields).flat())])
    .sort(esb.sort(getPortalESField(sortField.field), sortField.direction));

  const hasTextQuery = search.length > 0;

  const freeTextQueries = hasTextQuery ? [esb.simpleQueryStringQuery(search).fields(searchFields)] : [];
  const defaultQueries = defaultQuery ? [defaultQuery] : [];

  query.query(esb.boolQuery().must([...defaultQueries, ...freeTextQueries]));

  if (hasTextQuery) {
    query.highlight(esb.highlight(searchFields));
  }

  const termFilters = Object.entries(terms).reduce<Filters>((acc, [field, term]) => {
    return produce(acc, (draft) => {
      const { values } = term;
      const portalField = getPortalESField(field);
      if (termHasValues(term)) {
        draft[portalField] = esb.termsQuery(portalField, [...values]);
      }
    });
  }, {});

  const rangeFilters = Object.entries(ranges).reduce<Filters>((acc, [field, range]) => {
    return produce(acc, (draft) => {
      const { values } = range;
      const portalField = getPortalESField(field);

      if (rangeHasValues(range)) {
        draft[portalField] = esb.rangeQuery(portalField).gte(values.min).lte(values.max);
      }
    });
  }, {});

  const hierarchicalFilters = Object.entries(hierarchicalTerms).reduce<Filters>((acc, [field, hierarchicalTerm]) => {
    return produce(acc, (draft) => {
      const { values, childField } = hierarchicalTerm;
      if (!childField) {
        return acc;
      }
      const parentPortalField = getPortalESField(field);
      const childPortalField = getPortalESField(childField);

      if (hierarchicalTermHasValues(hierarchicalTerm)) {
        draft[parentPortalField] = esb.termsQuery(parentPortalField, Object.keys(values));

        const childValues = Object.values(values)
          .map((v) => [...v])
          .flat();
        draft[childPortalField] = esb.termsQuery(childPortalField, childValues);
      }
      return draft;
    });
  }, {});

  const allFilters = { ...termFilters, ...rangeFilters, ...hierarchicalFilters };

  query.postFilter(esb.boolQuery().must(Object.values(allFilters)));

  Object.keys(terms).forEach((field) => {
    const portalField = getPortalESField(field);

    const filterAggregation = buildFilterAggregation({
      field,
      portalFields: [portalField],
      aggregation: esb.termsAggregation(field, portalField).size(maxAggSize),
      filters: allFilters,
    });

    query.agg(filterAggregation);
  });

  Object.entries(ranges).forEach(([field, { min, max }]) => {
    const portalField = getPortalESField(field);

    const interval = Math.ceil((max - min) / 20);

    const filterAggregation = buildFilterAggregation({
      field,
      portalFields: [portalField],
      aggregation: esb.histogramAggregation(field, portalField, interval).extendedBounds(min, max),
      filters: allFilters,
    });

    query.agg(filterAggregation);
  });

  Object.entries(hierarchicalTerms).forEach(([field, { childField }]) => {
    if (!childField) {
      return;
    }
    const parentPortalField = getPortalESField(field);
    const childPortalField = getPortalESField(childField);

    const filterAggregation = buildFilterAggregation({
      field,
      portalFields: [parentPortalField, childPortalField],
      aggregation: esb
        .termsAggregation(field, parentPortalField)
        .size(maxAggSize)
        .agg(esb.termsAggregation(childField, childPortalField).size(maxAggSize)),
      filters: allFilters,
    });

    query.agg(filterAggregation);
  });

  return query.toJSON();
}

interface OuterBucket {
  doc_count: number;
}
interface InnerBucket {
  key: string;
  doc_count: number;
}

type Aggregations = Record<
  string,
  OuterBucket &
    Record<
      string,
      AggregationsTermsAggregateBase<InnerBucket & Partial<Record<string, AggregationsTermsAggregateBase<InnerBucket>>>>
    >
>;

export function useSearch() {
  const { endpoint, swrConfig = {}, ...rest }: SearchStoreState = useSearchStore();
  const query = buildQuery({ ...rest });

  return useScrollSearchHits<Partial<Entity>, Aggregations>({ query, endpoint, swrConfig });
}

type FacetOption = TermConfig | HierarchicalTermConfig | RangeConfig;

export type FacetGroups = Record<string, FacetOption[]>;

function buildFacets({ facetGroups }: { facetGroups: FacetGroups }) {
  const allFacets = Object.values(facetGroups).flat();

  return allFacets.reduce<FacetsState>(
    (acc, curr) => {
      return produce(acc, (draft) => {
        if (curr.type === FACETS.term) {
          draft.terms[curr.field] = { ...curr, values: new Set([]) };
        }

        if (curr.type === FACETS.hierarchical) {
          draft.hierarchicalTerms[curr.field] = { ...curr, values: {} };
        }

        if (curr.type === FACETS.range) {
          draft.ranges[curr.field] = { ...curr, values: { min: curr.min, max: curr.max } };
        }

        return draft;
      });
    },
    { terms: {}, hierarchicalTerms: {}, ranges: {} },
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
  const { view } = useSearchStore();

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

function Search({ type, facetGroups }: TypeProps & { facetGroups: FacetGroups }) {
  return (
    <Stack spacing={2}>
      <Header type={type} />
      <Stack direction="column" spacing={1} mb={2}>
        <Bar type={type} />
        <FilterChips />
        <Body facetGroups={facetGroups} />
      </Stack>
    </Stack>
  );
}

const mergeTerms = (termState: Record<string, Term>, termURLState: Record<string, Term<string[]>>) => {
  return Object.entries(termState).reduce<Record<string, Term>>((acc, [k, v]) => {
    return produce(acc, (draft) => {
      const urlStateValues = termURLState?.[k]?.values ?? [];
      draft[k] = { ...v, values: new Set([...v.values, ...urlStateValues]) };
    });
  }, {});
};

const mergeHierarchicalTerms = (
  termState: Record<string, HierarchicalTerm>,
  termURLState: Record<string, HierarchicalTerm<string[]>>,
) => {
  return { ...termState, ...termURLState };
};

const options = {
  customMerge: (key: string) => {
    if (key === 'terms') {
      return mergeTerms;
    }
    if (key === 'hierarchicalTerms') {
      return mergeHierarchicalTerms;
    }
    return undefined;
  },
};

function useInitialURLState() {
  const [hasLoadedURLState, setHasLoadedURLState] = useState(false);
  const [initialUrlState, setInitialUrlState] = useState<Partial<SearchStoreState>>({ terms: {} });

  useEffect(() => {
    const searchParams: Partial<SearchURLState> = parse(window.location.search, { ignoreQueryPrefix: true });

    if (Object.keys(searchParams).length) {
      setInitialUrlState(convertState(searchParams));
    }
    setHasLoadedURLState(true);
  }, []);

  return { initialUrlState, hasLoadedURLState };
}

function SearchWrapper({ config }: { config: Omit<SearchConfig, 'endpoint' | 'analyticsCategory'> }) {
  const { elasticsearchEndpoint } = useAppContext();
  const { type, facets } = config;

  const { search, sortField, terms, hierarchicalTerms, ranges, ...rest } = buildInitialSearchState({
    ...config,
    endpoint: elasticsearchEndpoint,
    analyticsCategory: `${type}s Search Page Interactions`,
  });

  const { initialUrlState, hasLoadedURLState } = useInitialURLState();

  if (!hasLoadedURLState) {
    return null;
  }

  const initialState = {
    ...merge({ search, sortField, terms, hierarchicalTerms, ranges }, initialUrlState, options),
    ...rest,
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
