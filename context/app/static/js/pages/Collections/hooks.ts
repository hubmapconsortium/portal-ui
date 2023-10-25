import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { buildCollectionsPanelsProps } from './utils';
import { CollectionSearchHits } from './types';

const query = {
  ...getAllCollectionsQuery,
  query: { exists: { field: 'doi_url' } },
  _source: ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id'],
};

function useCollections() {
  const { searchHits: collectionsData } = useSearchHits(query) as CollectionSearchHits;
  return buildCollectionsPanelsProps(collectionsData);
}

export { useCollections };
