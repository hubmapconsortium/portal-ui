import { useFlaskDataContext } from 'js/components/Contexts';
import { isDataset, type Dataset } from 'js/components/types';
import { excludeComponentDatasetsClause, getIDsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useProcessedDatasets, type ProcessedDatasetInfo } from 'js/pages/Dataset/hooks';
import { ComponentType } from 'react';
import { nodeIcons } from '../../DatasetRelationships/nodeTypes';

export type ProcessedDatasetDetails = ProcessedDatasetInfo &
  Pick<
    Dataset,
    | 'description'
    | 'status'
    | 'group_name'
    | 'created_by_user_displayname'
    | 'created_by_user_email'
    | 'title'
    | 'published_timestamp'
    | 'created_timestamp'
    | 'metadata'
    | 'protocol_url' // TODO: This is present for non-dataset entities, but not for datasets.
    | 'dataset_type'
    | 'mapped_consortium'
    | 'mapped_data_access_level'
  >;

export function useProcessedDatasetDetails(uuid: string) {
  const query = {
    query: {
      bool: {
        must: [getIDsQuery(uuid), excludeComponentDatasetsClause],
      },
    },
    _source: [
      'hubmap_id',
      'entity_type',
      'uuid',
      'assay_display_name',
      'files',
      'pipeline',
      'description',
      'status',
      'group_name',
      'created_by_user_displayname',
      'created_by_user_email',
      'title',
      'published_timestamp',
      'created_timestamp',
      'metadata.dag_provenance_list',
      'metadata.metadata',
      'protocol_url',
      'dataset_type',
      'creation_action',
      'mapped_consortium',
      'contributors',
      'contacts',
      'mapped_data_access_level',
    ],
    size: 10000,
  };

  const { searchHits, isLoading } = useSearchHits<ProcessedDatasetDetails>(query, {
    useDefaultQuery: false,
  });

  const datasetDetails = searchHits[0]?._source;
  return { datasetDetails, isLoading };
}

export function processDatasetLabel(
  dataset: Pick<ProcessedDatasetInfo, 'assay_display_name' | 'pipeline' | 'status' | 'hubmap_id'>,
  hits: { _source: Pick<ProcessedDatasetInfo, 'assay_display_name' | 'pipeline' | 'status'> }[],
) {
  const label = dataset.pipeline ?? dataset.assay_display_name[0];
  const hasMultipleHitsWithSameLabel =
    hits.filter((h) => (h._source.pipeline ?? h._source.assay_display_name[0]) === label).length > 1;

  const hasMultipleHitsWithSameLabelAndStatus =
    hasMultipleHitsWithSameLabel &&
    hits.filter(
      (h) => (h._source.pipeline ?? h._source.assay_display_name[0]) === label && h._source.status === dataset.status,
    ).length > 1;

  if (hasMultipleHitsWithSameLabelAndStatus) {
    return `${label} (${dataset.status}) [${dataset.hubmap_id}]`;
  }
  if (hasMultipleHitsWithSameLabel) {
    return `${label} (${dataset.status})`;
  }

  return label;
}

export function useProcessedDatasetTabs(): { label: string; uuid: string; icon: ComponentType | undefined }[] {
  const { searchHits } = useProcessedDatasets();
  const { entity } = useFlaskDataContext();

  if (!isDataset(entity)) {
    return [];
  }

  const { dataset_type, uuid } = entity;

  const primaryDatasetTab = {
    label: dataset_type,
    uuid,
    icon: nodeIcons.primaryDataset,
  };

  // Include dataset status in the label if more than one processed dataset of this type exists.
  // This allows us to distinguish between published datasets and QA/New/other statuses.
  const processedDatasetTabs = [...searchHits]
    // Prioritize published datasets
    .sort((a, b) => {
      if (a._source.status === 'Published') {
        return -1;
      }
      if (b._source.status === 'Published') {
        return 1;
      }
      return 0;
    })
    .map(({ _source }, _, hits) => ({
      label: processDatasetLabel(_source, hits),
      uuid: _source.uuid,
      icon: nodeIcons.processedDataset,
    }));

  return [primaryDatasetTab, ...processedDatasetTabs];
}
