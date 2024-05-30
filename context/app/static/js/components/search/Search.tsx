import React, { useMemo } from 'react';
import useSWR from 'swr';
import { SearchRequest, SearchResponseBody } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';

import { fetcher } from 'js/helpers/swr';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SearchStoreProvider, useSearchStore, SearchStoreState } from './store';
import { HitDoc } from './types';
import { ResultsTable } from './Results';

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

function buildQuery({ terms, size, sourceFields, sortField }: Omit<SearchStoreState, 'endpoint' | 'swrConfig'>) {
  const query = esb
    .requestBodySearch()
    .size(size)
    .source(Object.keys(sourceFields).length ? Object.keys(sourceFields) : false)
    .sort(esb.sort(sortField.field, sortField.direction));

  Object.entries(terms).forEach(([field, values]) => query.postFilter(esb.termsQuery(field, [...values])));

  return query.toJSON();
}

export function useSearch<Aggs>() {
  const { endpoint, swrConfig, ...rest }: SearchStoreState = useSearchStore();

  const query = buildQuery({ ...rest });

  const requestInit = useRequestInit({ body: query });
  const { data, isLoading } = useSWR<SearchResponseBody<HitDoc, Aggs>>(
    { requestInit, url: endpoint },
    fetcher,
    swrConfig,
  );
  return { data, isLoading };
}

function Search() {
  return <ResultsTable />;
}

function SearchWrapper() {
  const { elasticsearchEndpoint } = useAppContext();

  return (
    <SearchStoreProvider
      initialState={{
        endpoint: elasticsearchEndpoint,
        swrConfig: {},
        terms: { 'entity_type.keyword': new Set(['Dataset']) },
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
