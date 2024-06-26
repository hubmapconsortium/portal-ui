import React from 'react';
import { AggregationsTermsAggregateBase } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { produce } from 'immer';

import { useAppContext } from 'js/components/Contexts';
import {
  SearchStoreProvider,
  useSearchStore,
  SearchStoreState,
  FacetsState,
  HierarchicalTermConfig,
  TermConfig,
  RangeConfig,
  FACETS,
} from './store';
import { HitDoc } from './types';
import Results from './Results';
import { getPortalESField } from './buildTypesMap';
import Facets from './Facets/Facets';
import SearchBar from './SearchBar';
import { useScrollSearchHits } from './useScrollSearchHits';
import FilterChips from './Facets/FilterChips';

type Filters = Record<string, esb.Query>;

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
}: Omit<SearchStoreState, 'endpoint' | 'swrConfig'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source(sourceFields.length ? sourceFields : false)
    .sort(esb.sort(getPortalESField(sortField.field), sortField.direction));

  if (search.length) {
    query.query(esb.simpleQueryStringQuery(search).fields(searchFields)).highlight(esb.highlight(searchFields));
  }

  const termFilters = Object.entries(terms).reduce<Filters>((acc, [field, { values }]) => {
    return produce(acc, (draft) => {
      const portalField = getPortalESField(field);
      if (values.size) {
        draft[portalField] = esb.termsQuery(portalField, [...values]);
      }
    });
  }, {});

  const rangeFilters = Object.entries(ranges).reduce<Filters>((acc, [field, { values, min, max }]) => {
    return produce(acc, (draft) => {
      const portalField = getPortalESField(field);

      if (values.min !== min || values.max !== max) {
        draft[portalField] = esb.rangeQuery(portalField).gte(values.min).lte(values.max);
      }
    });
  }, {});

  const hierarchicalFilters = Object.entries(hierarchicalTerms).reduce<Filters>(
    (acc, [field, { values, childField }]) => {
      return produce(acc, (draft) => {
        if (!childField) {
          return acc;
        }
        const parentPortalField = getPortalESField(field);
        const childPortalField = getPortalESField(childField);

        if (Object.keys(values).length) {
          draft[parentPortalField] = esb.termsQuery(parentPortalField, Object.keys(values));

          const childValues = Object.values(values)
            .map((v) => [...v])
            .flat();
          draft[childPortalField] = esb.termsQuery(childPortalField, childValues);
        }
        return draft;
      });
    },
    {},
  );

  const allFilters = { ...termFilters, ...rangeFilters, ...hierarchicalFilters };

  query.postFilter(esb.boolQuery().must(Object.values(allFilters)));

  Object.keys(terms).forEach((field) => {
    const portalField = getPortalESField(field);

    const filterAggregation = buildFilterAggregation({
      field,
      portalFields: [portalField],
      aggregation: esb.termsAggregation(field, portalField),
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
        .agg(esb.termsAggregation(childField, childPortalField)),
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

  return useScrollSearchHits<HitDoc, Aggregations>({ query, endpoint, swrConfig });
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
  'searchFields' | 'sourceFields' | 'endpoint' | 'swrConfig' | 'sortField' | 'size'
> & {
  facets: FacetGroups;
};

function buildInitialSearchState({ facets, swrConfig = {}, ...rest }: SearchConfig) {
  return {
    search: '',
    ...buildFacets({ facetGroups: facets }),
    swrConfig,
    ...rest,
  };
}

const facetConfigs = {
  dataset_type: { field: 'dataset_type', childField: 'assay_display_name', type: FACETS.hierarchical },
  mapped_status: { field: 'mapped_status', childField: 'mapped_data_access_level', type: FACETS.hierarchical },
  'donor.mapped_metadata.age_value': { field: 'donor.mapped_metadata.age_value', min: 0, max: 100, type: FACETS.range },
  'donor.mapped_metadata.body_mass_index_value': {
    field: 'donor.mapped_metadata.body_mass_index_value',
    min: 0,
    max: 50,
    type: FACETS.range,
  },
};

const facetGroups: FacetGroups = {
  'Dataset Metadata': [
    facetConfigs.dataset_type,
    {
      field: 'origin_samples_unique_mapped_organs',
      type: FACETS.term,
    },
    {
      field: 'analyte_class',
      type: FACETS.term,
    },
    {
      field: 'source_samples.sample_category',
      type: FACETS.term,
    },
    facetConfigs.mapped_status,
  ],
  'Dataset Processing': [
    {
      field: 'processing',
      type: FACETS.term,
    },
    {
      field: 'pipeline',
      type: FACETS.term,
    },
    {
      field: 'visualization',
      type: FACETS.term,
    },
    {
      field: 'processing_type',
      type: FACETS.term,
    },
    {
      field: 'assay_modality',
      type: FACETS.term,
    },
  ],
  'Donor Metadata': [
    {
      field: 'donor.mapped_metadata.sex',
      type: FACETS.term,
    },
    facetConfigs['donor.mapped_metadata.age_value'],
    {
      field: 'donor.mapped_metadata.race',
      type: FACETS.term,
    },
    facetConfigs['donor.mapped_metadata.body_mass_index_value'],
  ],
};

function Search() {
  return (
    <Stack direction="column" spacing={1} mb={2}>
      <SearchBar />
      <FilterChips />
      <Stack direction="row" spacing={2}>
        <Facets facetGroups={facetGroups} />
        <Box flexGrow={1}>
          <Results />
        </Box>
      </Stack>
    </Stack>
  );
}

const searchConfig = {
  searchFields: ['all_text', 'description'],
  // TODO: figure out how to make assertion unnecessary.
  sortField: { field: 'last_modified_timestamp', direction: 'desc' as const },
  sourceFields: [
    'hubmap_id',
    'group_name',
    'assay_display_name',
    'origin_samples.mapped_organ',
    'mapped_status',
    'last_modified_timestamp',
  ],
  facets: facetGroups,
  size: 10,
};

function SearchWrapper({ config }: { config: Omit<SearchConfig, 'endpoint'> }) {
  const { elasticsearchEndpoint } = useAppContext();

  return (
    <SearchStoreProvider initialState={buildInitialSearchState({ ...config, endpoint: elasticsearchEndpoint })}>
      <Search />
    </SearchStoreProvider>
  );
}

function DatasetsSearch() {
  return <SearchWrapper config={searchConfig} />;
}

export default DatasetsSearch;
