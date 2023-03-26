import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';

function getCollectionsWhichContainDatasets(datasetsUUIDSet, collections) {
  return collections.filter((collection) => {
    // eslint-disable-next-line no-underscore-dangle
    return collection._source?.datasets.some((dataset) => datasetsUUIDSet.has(dataset.uuid));
  });
}

function useDatasetsCollections(datasetUUIDs) {
  const { searchHits: collections } = useSearchHits(getAllCollectionsQuery);
  const datasetUUIDSet = new Set(datasetUUIDs);
  return getCollectionsWhichContainDatasets(datasetUUIDSet, collections);
}

export { useDatasetsCollections };
