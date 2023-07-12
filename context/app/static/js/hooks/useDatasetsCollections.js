import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';

function buildCollectionsWithDatasetQuery(datasetUUIDs) {
  return {
    ...getAllCollectionsQuery,
    query: {
      terms: {
        'datasets.uuid': datasetUUIDs,
      },
    },
  };
}

function useDatasetsCollections(datasetUUIDs) {
  const query = buildCollectionsWithDatasetQuery(datasetUUIDs);
  const { searchHits: collections } = useSearchHits(query);
  return collections;
}

export { useDatasetsCollections, buildCollectionsWithDatasetQuery };
