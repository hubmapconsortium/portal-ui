import React, { useMemo } from 'react';

import PublicationCollections from 'js/components/publications/PublicationCollections';
import IntegratedDataTables from 'js/components/detailPage/IntegratedData/IntegratedDataTables';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { Collection, Dataset } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import { useEntitiesData } from 'js/hooks/useEntityData';

interface PublicationsDataSectionProps {
  datasetUUIDs: string[];
  associatedCollectionUUID?: string;
}

function useEffectiveDatasetUUIDs({
  datasetUUIDs = [],
  associatedCollectionUUID,
}: Pick<PublicationsDataSectionProps, 'datasetUUIDs' | 'associatedCollectionUUID'>) {
  const collectionQuery = associatedCollectionUUID
    ? {
        query: getIDsQuery(associatedCollectionUUID),
        _source: ['uuid', 'title', 'hubmap_id', 'datasets.uuid'],
      }
    : {};

  const { searchHits: collections = [], isLoading } = useSearchHits<Collection>(collectionQuery, {
    shouldFetch: Boolean(associatedCollectionUUID),
    useDefaultQuery: false,
  });

  if (collections) {
    return {
      collections,
      datasetUUIDs: collections.flatMap((c) => c._source.datasets.map((d) => d.uuid)).filter(Boolean),
      isLoading,
    };
  }

  return {
    collections,
    datasetUUIDs: datasetUUIDs.filter(Boolean),
    isLoading,
  };
}

function useAllAncestors(datasetUUIDs: string[], isLoadingDatasetUUIDs: boolean) {
  // Fetch full dataset entities with ancestor_ids
  const datasetsQuery = useMemo(
    () => ({
      query: {
        bool: {
          must: {
            ids: {
              values: datasetUUIDs,
            },
          },
        },
      },
      _source: 'ancestor_ids',
    }),
    [datasetUUIDs],
  );

  const { searchHits: datasets, isLoading: isLoadingAncestorIds } = useSearchHits<Dataset>(datasetsQuery, {
    shouldFetch: !isLoadingDatasetUUIDs,
    useDefaultQuery: false,
  });

  const allAncestorIds = useMemo(() => {
    if (!datasets) return [];
    const ancestorIds = new Set(datasets.flatMap((ds) => ds._source.ancestor_ids));
    return [...ancestorIds, ...datasets.map((ds) => ds._id)].filter(Boolean);
  }, [datasets]);

  return {
    datasets,
    allAncestorIds,
    isLoading: isLoadingAncestorIds || isLoadingDatasetUUIDs,
  };
}

function PublicationsDataSection({ datasetUUIDs, associatedCollectionUUID }: PublicationsDataSectionProps) {
  // Extract dataset UUIDs from collection or use provided ones
  const {
    collections,
    datasetUUIDs: effectiveDatasetUUIDs,
    isLoading: isLoadingEffectiveDatasetUUIDs,
  } = useEffectiveDatasetUUIDs({
    datasetUUIDs,
    associatedCollectionUUID,
  });

  const { allAncestorIds, isLoading: isLoadingAncestorIds } = useAllAncestors(
    effectiveDatasetUUIDs.filter(Boolean), // remove any nulls
    isLoadingEffectiveDatasetUUIDs || effectiveDatasetUUIDs.length === 0,
  );

  // Fetch ancestor entities (samples and donors)
  const [allEntities, isLoadingEntities] = useEntitiesData(allAncestorIds, undefined, {
    shouldFetch: !isLoadingAncestorIds,
    useDefaultQuery: false,
  });

  const loadingTableEntities = isLoadingEntities || allEntities.length === 0;

  return (
    <CollapsibleDetailPageSection id="data" title="Data">
      <IntegratedDataTables entities={allEntities} isLoading={loadingTableEntities} />
      {associatedCollectionUUID && <PublicationCollections collectionsData={collections} isCollectionPublication />}
    </CollapsibleDetailPageSection>
  );
}

export default PublicationsDataSection;
