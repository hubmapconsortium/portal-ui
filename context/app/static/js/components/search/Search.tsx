import React, { useMemo } from 'react';
import useSWR from 'swr';
import { SearchRequest, SearchResponseBody } from '@elastic/elasticsearch/lib/api/types';
import esb from 'elastic-builder';

import { fetcher } from 'js/helpers/swr';
import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { SearchStoreProvider, useSearchStore, SearchStoreState } from './store';

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
    .source(sourceFields.size ? [...sourceFields] : false)
    .sort(esb.sort(sortField.field, sortField.direction));

  Object.entries(terms).forEach(([field, values]) => query.postFilter(esb.termsQuery(field, [...values])));

  return query.toJSON();
}

function useSearch<Document, Aggs>() {
  const { endpoint, swrConfig, ...rest }: SearchStoreState = useSearchStore();

  const query = buildQuery({ ...rest });

  const requestInit = useRequestInit({ body: query });
  const { data, isLoading } = useSWR<SearchResponseBody<Document, Aggs>>(
    { requestInit, url: endpoint },
    fetcher,
    swrConfig,
  );
  return { data, isLoading };
}

function Search() {
  const { data, isLoading } = useSearch();

  // eslint-disable-next-line no-console
  console.log(data, isLoading);
  return null;
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
        sourceFields: new Set([]),
        size: 10,
      }}
    >
      <Search />
    </SearchStoreProvider>
  );
}

export default SearchWrapper;
