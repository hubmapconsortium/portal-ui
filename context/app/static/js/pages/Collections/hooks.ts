import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { buildCollectionsPanelsProps } from './utils';
import { CollectionSearchHits } from './types';

const sourceFields = ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id'];

const query = { ...getAllCollectionsQuery, _source: sourceFields };

function useCollections() {
  const { searchHits: collectionsData } = useSearchHits(query) as CollectionSearchHits;
  return buildCollectionsPanelsProps(collectionsData);
}

export { useCollections };
