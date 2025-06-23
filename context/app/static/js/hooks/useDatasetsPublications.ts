import { useSearchHits } from 'js/hooks/useSearchData';
import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { useMemo } from 'react';
import { useFlaskDataContext } from 'js/components/Contexts';
import { useProcessedDatasetTabs } from 'js/components/detailPage/ProcessedData/ProcessedDataset/hooks';
import { Publication } from 'js/components/types';
import { PublicationHit } from 'js/components/detailPage/PublicationsSection/PublicationsSection';

export function buildPublicationsWithDatasetQuery(datasetUUIDs: string[]): SearchRequest {
  return {
    query: {
      bool: {
        filter: [
          {
            terms: {
              'ancestor_ids.keyword': datasetUUIDs,
            },
          },
          {
            term: {
              'entity_type.keyword': 'Publication',
            },
          },
        ],
      },
    },
    _source: [
      'uuid',
      'title',
      'publication_date',
      'publication_venue',
      'contributors',
      'entity_type',
      'ancestor_ids',
      'publication_status',
    ],
  };
}

function useDatasetsPublications(datasetUUIDs: string[]) {
  const query = buildPublicationsWithDatasetQuery(datasetUUIDs);
  const { searchHits: publications } = useSearchHits<Publication>(query);

  return publications;
}

function useDatasetsPublicationsTabs() {
  const processedDatasetTabs = useProcessedDatasetTabs();
  const datasetUUIDs = useMemo(() => processedDatasetTabs.map((tab) => tab.uuid), [processedDatasetTabs]);
  const publications = useDatasetsPublications(datasetUUIDs);

  const {
    entity: { uuid: primaryDatasetId },
  } = useFlaskDataContext();

  const publicationsMap = useMemo(
    () =>
      datasetUUIDs.reduce(
        (acc, datasetUUID) => {
          const publicationsContainingDataset = publications.filter((pub) => {
            const { ancestor_ids } = pub._source;
            if (!ancestor_ids) {
              return false;
            }
            return ancestor_ids.some((id) => id === datasetUUID);
          });
          if (publicationsContainingDataset.length > 0 || datasetUUID === primaryDatasetId) {
            acc[datasetUUID] = publicationsContainingDataset;
          }
          return acc;
        },
        { [primaryDatasetId]: [] } as Record<string, PublicationHit[]>,
      ),
    [publications, datasetUUIDs, primaryDatasetId],
  );

  return useMemo(() => {
    let atLeastOnePublication = false;
    return processedDatasetTabs
      .map((processedDatasetTab) => {
        const { uuid } = processedDatasetTab;
        const publicationsForDataset = publicationsMap[uuid];
        if (publicationsForDataset?.length > 0) {
          atLeastOnePublication = true;
        }
        return {
          ...processedDatasetTab,
          publications: publicationsForDataset,
        };
      })
      .filter((tab) => tab.publications?.length > 0 || (atLeastOnePublication && tab.uuid === primaryDatasetId));
  }, [publicationsMap, processedDatasetTabs, primaryDatasetId]);
}

export { useDatasetsPublications, useDatasetsPublicationsTabs };
