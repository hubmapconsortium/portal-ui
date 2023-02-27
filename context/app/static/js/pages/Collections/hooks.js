import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { buildCollectionsPanelsProps } from './utils';

function useCollections() {
  const { searchHits: collectionsData } = useSearchHits(getAllCollectionsQuery);
  return buildCollectionsPanelsProps(collectionsData);
}

export { useCollections };
