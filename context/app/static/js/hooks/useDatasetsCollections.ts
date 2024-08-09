import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { Collection } from 'js/pages/Collections/types';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

function buildCollectionsWithDatasetQuery(datasetUUIDs: string[]): SearchRequest {
  return {
    ...getAllCollectionsQuery,
    query: {
      terms: {
        'datasets.uuid': datasetUUIDs,
      },
    },
  };
}

function useDatasetsCollections(datasetUUIDs: string[]) {
  const query = buildCollectionsWithDatasetQuery(datasetUUIDs);
  const { searchHits: collections } = useSearchHits<Collection>(query);

  return collections;
}

export { useDatasetsCollections, buildCollectionsWithDatasetQuery };
