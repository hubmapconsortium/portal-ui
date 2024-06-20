import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { buildCollectionsPanelsProps } from './utils';
import { Collection } from './types';

const query = {
  ...getAllCollectionsQuery,
  query: { bool: { must: [{ exists: { field: 'doi_url' } }, { exists: { field: 'registered_doi' } }] } },
  _source: ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id'],
};

function useCollections() {
  const { searchHits: collectionsData } = useSearchHits<Collection>(query);
  return buildCollectionsPanelsProps(collectionsData);
}

export { useCollections };
