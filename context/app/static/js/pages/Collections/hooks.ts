import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { useAppContext } from 'js/components/Contexts';
import { buildCollectionsPanelsProps } from './utils';
import { CollectionSearchHits } from './types';

const query = { ...getAllCollectionsQuery, _source: ['uuid', 'title', 'hubmap_id', 'datasets.hubmap_id'] };

const mustHaveDOIClause = { query: { exists: { field: 'doi_url' } } };

function useCollections() {
  const { isHubmapUser } = useAppContext();

  const { searchHits: collectionsData } = useSearchHits(
    isHubmapUser ? query : { ...query, ...mustHaveDOIClause },
  ) as CollectionSearchHits;
  return buildCollectionsPanelsProps(collectionsData);
}

export { useCollections };
