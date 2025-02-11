import { useSearchHits } from 'js/hooks/useSearchData';
import { getAllCollectionsQuery } from 'js/helpers/queries';
import { Collection, CollectionHit } from 'js/pages/Collections/types';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { useMemo } from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useProcessedDatasetTabs } from 'js/components/detailPage/ProcessedData/ProcessedDataset/hooks';

function buildCollectionsWithDatasetQuery(datasetUUIDs: string[]): SearchRequest {
  return {
    ...getAllCollectionsQuery,
    query: {
      terms: {
        'datasets.uuid': datasetUUIDs,
      },
    },
    _source: ['uuid', 'title', 'hubmap_id', 'datasets.uuid'],
  };
}

function useDatasetsCollections(datasetUUIDs: string[]) {
  const query = buildCollectionsWithDatasetQuery(datasetUUIDs);
  const { searchHits: collections } = useSearchHits<Collection>(query);

  return collections;
}

function useDatasetsCollectionsTabs() {
  const processedDatasetTabs = useProcessedDatasetTabs();
  const datasetUUIDs = useMemo(() => processedDatasetTabs.map((tab) => tab.uuid), [processedDatasetTabs]);
  const collections = useDatasetsCollections(datasetUUIDs);
  const {
    entity: { uuid: primaryDatasetId },
  } = useFlaskDataContext();

  const collectionsMap = useMemo(
    () =>
      datasetUUIDs.reduce(
        (acc, datasetUUID) => {
          const collectionsContainingDataset = collections.filter((collection) => {
            const { datasets } = collection._source;
            if (!datasets) {
              return false;
            }
            return datasets.some((dataset) => dataset.uuid === datasetUUID);
          });
          if (collectionsContainingDataset.length > 0 || datasetUUID === primaryDatasetId) {
            acc[datasetUUID] = collectionsContainingDataset;
          }
          return acc;
        },
        { [primaryDatasetId]: [] } as Record<string, CollectionHit[]>,
      ),
    [collections, datasetUUIDs, primaryDatasetId],
  );

  return useMemo(() => {
    let atLeastOneCollection = false;
    return processedDatasetTabs
      .map((processedDatasetTab) => {
        const { uuid } = processedDatasetTab;
        const collectionsForDataset = collectionsMap[uuid];
        if (collectionsForDataset?.length > 0) {
          atLeastOneCollection = true;
        }
        return {
          ...processedDatasetTab,
          collections: collectionsForDataset,
        };
      })
      .filter((tab) => tab.collections?.length > 0 || (atLeastOneCollection && tab.uuid === primaryDatasetId));
  }, [collectionsMap, processedDatasetTabs, primaryDatasetId]);
}

export { useDatasetsCollections, useDatasetsCollectionsTabs, buildCollectionsWithDatasetQuery };
