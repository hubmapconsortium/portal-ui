import { useGeneOntologyList } from 'js/hooks/useUBKG';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Collection } from 'js/components/types';
import { useCollectionsSearchState } from './CollectionsSearchContext';

function useCurrentGenesList() {
  const { search } = useCollectionsSearchState();
  return useGeneOntologyList(search.toUpperCase());
}

export function useResultsList() {
  const { data, ...rest } = useCurrentGenesList();

  const genesList = data?.flatMap((page) => page.genes) ?? [];

  const { pagination } = data?.at(-1) ?? {};

  const hasMore = pagination?.page !== pagination?.total_pages;

  return { genesList, hasMore, ...rest };
}

const query = {
  ...getAllCollectionsQuery,
  query: { bool: { must: [{ exists: { field: 'doi_url' } }, { exists: { field: 'registered_doi' } }] } },
  _source: ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id', 'created_timestamp'],
};

export function useCollections() {
  const { searchHits, isLoading } = useSearchHits<Collection>(query);
  const collections = searchHits.map((hit) => hit._source);

  return { collections, isLoading };
}
