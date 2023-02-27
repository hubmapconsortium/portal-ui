import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';

import { getCollectionsWhichContainDataset } from './utils';

function useDatasetCollections(uuid) {
  const { searchHits: collections } = useSearchHits(getAllCollectionsQuery);
  return getCollectionsWhichContainDataset(uuid, collections);
}

export { useDatasetCollections };
