import React from 'react';
import { AggregationsTermsAggregateBase } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import { useAppContext } from 'js/components/Contexts';
import { SearchStoreProvider, useSearchStore, SearchStoreState } from './store';
import { HitDoc } from './types';
import { ResultsTable } from './Results';
import { getPortalESField } from './buildTypesMap';
import Facets from './Facets/Facets';
import SearchBar from './SearchBar';
import { useScrollSearchHits } from './useScrollSearchHits';

function buildQuery({
  terms,
  termz,
  size,
  search,
  searchFields,
  sourceFields,
  sortField,
}: Omit<SearchStoreState, 'endpoint' | 'swrConfig'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source(Object.keys(sourceFields).length ? Object.keys(sourceFields) : false)
    .sort(esb.sort(getPortalESField(sortField.field), sortField.direction));

  if (search.length) {
    query.query(esb.simpleQueryStringQuery(search).fields(searchFields)).highlight(esb.highlight(searchFields));
  }

  Object.entries(terms).forEach(([field, values]) => {
    const portalField = getPortalESField(field);
    query.postFilter(esb.termsQuery(portalField, [...values]));
    query.agg(esb.termsAggregation(field, portalField));
  });

  Object.entries(termz).forEach(([field, { values, childField }]) => {
    if (!childField) {
      return;
    }
    const parentPortalField = getPortalESField(field);
    const childPortalField = getPortalESField(childField);

    if (Object.keys(values).length) {
      query.postFilter(esb.termsQuery(parentPortalField, Object.keys(values)));

      const childValues = Object.values(values)
        .map((v) => [...v])
        .flat();
      query.postFilter(esb.termsQuery(childPortalField, childValues));
    }
    query.agg(esb.termsAggregation(field, parentPortalField).agg(esb.termsAggregation(childField, childPortalField)));
  });

  return query.toJSON();
}

interface Bucket {
  key: string;
  doc_count: number;
}

type Aggregations = Record<
  string,
  AggregationsTermsAggregateBase<Bucket & Partial<Record<string, AggregationsTermsAggregateBase<Bucket>>>>
>;

export function useSearch() {
  const { endpoint, swrConfig, ...rest }: SearchStoreState = useSearchStore();

  const query = buildQuery({ ...rest });

  return useScrollSearchHits<HitDoc, Aggregations>({ query, endpoint, swrConfig });
}

function Search() {
  return (
    <Box>
      <SearchBar />
      <Stack direction="row" spacing={2}>
        <Facets />
        <ResultsTable />
      </Stack>
    </Box>
  );
}

function SearchWrapper() {
  const { elasticsearchEndpoint } = useAppContext();

  return (
    <SearchStoreProvider
      initialState={{
        search: '',
        searchFields: ['all_text', 'description'],
        endpoint: elasticsearchEndpoint,
        swrConfig: {},
        terms: { entity_type: new Set(['Dataset']) },
        termz: {
          dataset_type: { values: {}, childField: 'assay_display_name' },
        },
        sortField: { field: 'last_modified_timestamp', direction: 'desc' },
        sourceFields: {
          hubmap_id: { label: 'HuBMAP ID' },
          group_name: { label: 'Group' },
          assay_display_name: { label: 'Data Types' },
          'origin_samples.mapped_organ': { label: 'Organ' },
          mapped_status: { label: 'Status' },
          last_modified_timestamp: { label: 'Last Modified' },
        },
        size: 10,
      }}
    >
      <Search />
    </SearchStoreProvider>
  );
}

export default SearchWrapper;
