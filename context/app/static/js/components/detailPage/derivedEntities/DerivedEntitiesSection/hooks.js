import { useDerivedDatasetSearchHits, useDerivedSampleSearchHits } from 'js/hooks/useDerivedEntitySearchHits';
import { descendantCountsCol, lastModifiedTimestampCol } from 'js/components/detailPage/derivedEntities/sharedColumns';

function useDerivedEntitiesSection(uuid) {
  const { searchHits: datasets, isLoading: derivedDatasetsAreLoading } = useDerivedDatasetSearchHits(uuid);
  const { searchHits: samples, isLoading: derivedSamplesAreLoading } = useDerivedSampleSearchHits(uuid);

  const isLoading = derivedDatasetsAreLoading || derivedSamplesAreLoading;

  const entities = [
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: samples,
      columns: [
        {
          id: 'origin_samples_unique_mapped_organs',
          label: 'Organ',
          renderColumnCell: ({ origin_samples_unique_mapped_organs }) => origin_samples_unique_mapped_organs.join(', '),
        },
        { id: 'sample_category', label: 'Sample Category', renderColumnCell: ({ sample_category }) => sample_category },
        descendantCountsCol,
        lastModifiedTimestampCol,
      ],
    },
    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: datasets,
      columns: [
        {
          id: 'mapped_data_types',
          label: 'Data Types',
          renderColumnCell: ({ mapped_data_types }) => mapped_data_types.join(', '),
        },
        { id: 'status', label: 'Status', renderColumnCell: ({ status }) => status },
        descendantCountsCol,
        lastModifiedTimestampCol,
      ],
    },
  ];

  return { entities, isLoading };
}

export { useDerivedEntitiesSection };
