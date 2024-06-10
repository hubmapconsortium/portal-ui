import React, { useMemo } from 'react';
import useSWR from 'swr';
import {
  SearchRequest,
  SearchResponseBody,
  AggregationsTermsAggregateBase,
} from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';
import Stack from '@mui/material/Stack';

import { fetcher } from 'js/helpers/swr';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SearchStoreProvider, useSearchStore, SearchStoreState } from './store';
import { HitDoc } from './types';
import { ResultsTable } from './Results';
import { getPortalESField } from './buildTypesMap';
import Facets from './Facets/Facets';

function useAuthHeader() {
  const { groupsToken } = useAppContext();
  return useMemo(() => getAuthHeader(groupsToken), [groupsToken]);
}

interface BuildSearchRequestInitArgs {
  body: SearchRequest;
  authHeader: { Authorization?: string };
}

function buildSearchRequestInit({ body, authHeader }: BuildSearchRequestInitArgs): RequestInit {
  return {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      ...(authHeader ?? {}),
    },
  };
}

function useRequestInit({ body }: { body: SearchRequest }) {
  const authHeader = useAuthHeader();

  return buildSearchRequestInit({ body, authHeader });
}

function buildQuery({ terms, termz, size, sourceFields, sortField }: Omit<SearchStoreState, 'endpoint' | 'swrConfig'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source(Object.keys(sourceFields).length ? Object.keys(sourceFields) : false)
    .sort(esb.sort(getPortalESField(sortField.field), sortField.direction));

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

  const requestInit = useRequestInit({ body: query });
  const { data, isLoading } = useSWR<SearchResponseBody<HitDoc, Aggregations>>(
    { requestInit, url: endpoint },
    fetcher,
    swrConfig,
  );
  return { data, isLoading };
}

function Search() {
  return (
    <Stack direction="row" spacing={2}>
      <Facets />
      <ResultsTable />;
    </Stack>
  );
}

function SearchWrapper() {
  const { elasticsearchEndpoint } = useAppContext();

  return (
    <SearchStoreProvider
      initialState={{
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
