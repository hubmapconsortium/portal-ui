import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';

function useDatasetsCollections(datasetUUIDs) {
  const collectionsWithDatasetQuery = useMemo(() => {
    return {
      ...getAllCollectionsQuery,
      query: {
        terms: {
          'datasets.uuid': datasetUUIDs,
        },
      },
    };
  }, [datasetUUIDs]);

  const { searchHits: collections } = useSearchHits(collectionsWithDatasetQuery);
  return collections;
}

export { useDatasetsCollections };
