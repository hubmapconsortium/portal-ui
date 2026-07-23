import React, { useMemo } from 'react';

import PublicationCollections from 'js/components/publications/PublicationCollections';
import IntegratedDataTables from 'js/components/detailPage/IntegratedData/IntegratedDataTables';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';
import { Collection, Dataset, isDataset } from 'js/components/types';
import { CollapsibleDetailPageSection } from 'js/components/detailPage/DetailPageSection';
import RetractedAlert from 'js/components/detailPage/RetractedAlert';
import { isRetractedStatus } from 'js/components/detailPage/utils';
import { useEntitiesData } from 'js/hooks/useEntityData';

interface PublicationsDataSectionProps {
  ancestorIds: string[];
  associatedCollectionUUID?: string;
}

function useEffectiveDatasetUUIDs({
  ancestorIds = [],
  associatedCollectionUUID,
}: Pick<PublicationsDataSectionProps, 'ancestorIds' | 'associatedCollectionUUID'>) {
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

  if (collections && collections.length > 0) {
    return {
      collections,
      datasetUUIDs: collections.flatMap((c) => c._source.datasets.map((d) => d.uuid)).filter(Boolean),
      isLoading,
    };
  }

  return {
    collections,
    datasetUUIDs: ancestorIds.filter(Boolean),
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
      // Without an explicit size, ES caps results at 10. Publications can reference
      // hundreds of ancestors, so all of them must be fetched.
      size: 10000,
    }),
    [datasetUUIDs],
  );

  const { searchHits: datasets, isLoading: isLoadingAncestorIds } = useSearchHits<Dataset>(datasetsQuery, {
    shouldFetch: !isLoadingDatasetUUIDs,
    useDefaultQuery: false,
  });

  const allAncestorIds = useMemo(() => {
    if (!datasets) return [];
    return [...new Set(datasets.flatMap((ds) => [ds._id, ...ds._source.ancestor_ids]))];
  }, [datasets]);

  return {
    datasets,
    allAncestorIds,
    isLoading: isLoadingAncestorIds || isLoadingDatasetUUIDs,
  };
}

function PublicationsDataSection({ ancestorIds, associatedCollectionUUID }: PublicationsDataSectionProps) {
  // Extract dataset UUIDs from collection or use provided ones
  const {
    collections,
    datasetUUIDs: effectiveDatasetUUIDs,
    isLoading: isLoadingEffectiveDatasetUUIDs,
  } = useEffectiveDatasetUUIDs({
    ancestorIds,
    associatedCollectionUUID,
  });

  const { allAncestorIds, isLoading: isLoadingAncestorIds } = useAllAncestors(
    effectiveDatasetUUIDs.filter(Boolean), // remove any nulls
    isLoadingEffectiveDatasetUUIDs || effectiveDatasetUUIDs.length === 0,
  );

  // Fetch ancestor entities (datasets, samples, donors). Only the fields needed to build the
  // per-type table queries, retracted-sort map, and download defaults are requested -- the tables
  // themselves lazily fetch full display data for the open tab, so full `_source` here would be a
  // redundant, expensive up-front load of every tab's entities.
  const [allEntities, isLoadingEntities] = useEntitiesData(
    allAncestorIds,
    ['uuid', 'entity_type', 'mapped_status', 'status'],
    {
      shouldFetch: !isLoadingAncestorIds,
      useDefaultQuery: false,
    },
  );

  // The datasets the publication directly references are always shown; their ancestor datasets are
  // hidden behind a toggle in IntegratedDataTables.
  const directDatasetIds = useMemo(() => new Set(effectiveDatasetUUIDs.filter(Boolean)), [effectiveDatasetUUIDs]);

  const loadingTableEntities = isLoadingEntities || allEntities.length === 0;

  // Maps each dataset's uuid (its ES doc _id) to a retracted-first sort value so the datasets table
  // can place retracted datasets at the top by default.
  const { datasetRetractedSortMap, hasRetractedDatasets } = useMemo(() => {
    const datasets = allEntities.filter(isDataset);
    return {
      datasetRetractedSortMap: Object.fromEntries(
        datasets.map((d) => [d.uuid, isRetractedStatus(d.mapped_status ?? d.status) ? 0 : 1]),
      ),
      hasRetractedDatasets: datasets.some((d) => isRetractedStatus(d.mapped_status ?? d.status)),
    };
  }, [allEntities]);

  return (
    <CollapsibleDetailPageSection id="data" title="Data">
      {hasRetractedDatasets && (
        <RetractedAlert>
          This publication references retracted datasets, which should no longer be used. Issues affecting the
          reliability of these datasets were identified, and all processed data derived from them have also been
          retracted. Replacement datasets may be available with updated data.
        </RetractedAlert>
      )}
      {/*
        Publications reference specific dataset versions, including older ones whose
        next_revision_uuid points to newer versions. Disable the default-query filter
        so those referenced versions aren't dropped from the table.
      */}
      <IntegratedDataTables
        entities={allEntities}
        isLoading={loadingTableEntities}
        useDefaultQuery={false}
        datasetRetractedSortMap={datasetRetractedSortMap}
        directDatasetIds={directDatasetIds}
      />
      {associatedCollectionUUID && <PublicationCollections collectionsData={collections} isCollectionPublication />}
    </CollapsibleDetailPageSection>
  );
}

export default PublicationsDataSection;
