import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import { useSearchStore } from './store';
import { buildQuery } from './utils';
import useESmapping, { isESMapping } from './useEsMapping';

interface FacetAggregationsResponse<Aggs> {
  aggregations: Aggs;
}

/**
 * Fetches facet aggregations separately from the result hits.
 *
 * Two reasons this is its own request rather than riding along with the hits:
 *
 * 1. Cost. Against the ~10M-document files index, per-facet `filter` aggregations take
 *    2.7-4.4s, while `collapse` + `inner_hits` takes ~110ms. Combined in one request they
 *    take 7.5-16s -- markedly worse than the sum of the parts. Split, only the aggregations
 *    are slow, and they are identical for every user in a scope, so the Flask endpoint this
 *    posts to caches them.
 * 2. Correctness. `inner_hits` ignore `post_filter`, so the hits request has to put filters
 *    in the main query (`filterMode: 'query'`). One request cannot then also produce the
 *    unfiltered aggregations the facet counts need.
 *
 * Returns `undefined` aggregations until loaded, matching what the hits request returns
 * while in flight, so facet components need no special handling.
 */
export default function useFacetAggregations<Aggs>() {
  const facetsEndpoint = useSearchStore((state) => state.facetsEndpoint);
  const mappingIndex = useSearchStore((state) => state.mappingIndex);
  const filters = useSearchStore((state) => state.filters);
  const facets = useSearchStore((state) => state.facets);
  const search = useSearchStore((state) => state.search);
  const searchFields = useSearchStore((state) => state.searchFields);
  const sortField = useSearchStore((state) => state.sortField);
  const defaultQuery = useSearchStore((state) => state.defaultQuery);
  const collapse = useSearchStore((state) => state.collapse);
  const hubmapIdField = useSearchStore((state) => state.hubmapIdField);
  const uuidField = useSearchStore((state) => state.uuidField);

  const mappings = useESmapping(mappingIndex);

  const body = useMemo(() => {
    if (!facetsEndpoint || !isESMapping(mappings)) {
      return null;
    }
    const query = buildQuery({
      filters,
      facets,
      search,
      // Aggregations only: no hits, so no source fields and no sort are needed. The Flask
      // endpoint rejects bodies that ask for hits.
      size: 0,
      searchFields,
      sourceFields: {},
      sortField,
      defaultQuery,
      mappings,
      buildAggregations: true,
      // With collapsed hits, the row count is the number of groups rather than `hits.total`.
      groupCountField: collapse?.field,
      hubmapIdField,
      uuidField,
    }) as Record<string, unknown> | null;

    if (!query) {
      return null;
    }
    // `sort` is always emitted by buildQuery (it carries the search_after tiebreaker) but is
    // meaningless with `size: 0`, and the endpoint refuses it since a sort implies hits.
    const { sort, ...aggregationsOnly } = query;
    return aggregationsOnly;
  }, [
    facetsEndpoint,
    mappings,
    filters,
    facets,
    search,
    searchFields,
    sortField,
    defaultQuery,
    collapse,
    hubmapIdField,
    uuidField,
  ]);

  const { data, error, isLoading } = useSWR<FacetAggregationsResponse<Aggs>, SWRError>(
    body
      ? {
          url: facetsEndpoint,
          requestInit: {
            method: 'POST',
            // Flask's `get_json` requires the JSON content type; without it the body is ignored.
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          },
        }
      : null,
    fetcher,
  );

  return {
    aggregations: data?.aggregations,
    error,
    isLoading,
  };
}
