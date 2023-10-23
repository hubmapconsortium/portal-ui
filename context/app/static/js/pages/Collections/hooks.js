import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { buildCollectionsPanelsProps } from './utils';

const query = { ...getAllCollectionsQuery, _source: ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id'] };

function useCollections() {
  const { searchHits: collectionsData } = useSearchHits(query);
  return buildCollectionsPanelsProps(collectionsData);
}

export { useCollections };
