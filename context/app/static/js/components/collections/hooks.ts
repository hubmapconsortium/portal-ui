import { getAllCollectionsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Collection } from 'js/components/collections/types';
import { useCollectionsSearchState } from './CollectionsSearchContext';

export function useFilteredCollections(collections: Collection[]) {
  const { search } = useCollectionsSearchState();
  return collections.filter((item) => item.title.toLowerCase().includes(search.toLowerCase()));
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
