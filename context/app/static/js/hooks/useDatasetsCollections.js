import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';

function useDatasetsCollections(datasetUUIDs) {
  const datasetUUIDsString = JSON.stringify(datasetUUIDs.sort((a, b) => a - b));
  const collectionsWithDatasetQuery = useMemo(
    () => ({
      ...getAllCollectionsQuery,
      query: {
        terms: {
          'datasets.uuid': JSON.parse(datasetUUIDsString),
        },
      },
    }),
    [datasetUUIDsString],
  );

  const { searchHits: collections } = useSearchHits(collectionsWithDatasetQuery);
  return collections;
}

export { useDatasetsCollections };
