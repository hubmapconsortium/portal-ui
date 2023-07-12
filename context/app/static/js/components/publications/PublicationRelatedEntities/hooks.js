import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import {
  lastModifiedTimestampCol,
  organCol,
  dataTypesCol,
  statusCol,
} from 'js/components/detailPage/derivedEntities/columns';

import { getAncestorsQuery } from 'js/helpers/queries';

function useAncestorSearchHits(descendantUUID) {
  const query = useMemo(
    () => ({
      query: getAncestorsQuery(descendantUUID, 'dataset'),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'mapped_data_types',
        'mapped_status',
        'descendant_counts',
        'last_modified_timestamp',
        'mapped_metadata',
        'origin_samples_unique_mapped_organs',
        'sample_category',
      ],
      size: 10000,
    }),
    [descendantUUID],
  );

  return useSearchHits(query);
}

function usePublicationsRelatedEntities(uuid) {
  const { searchHits: ancestorHits, isLoading } = useAncestorSearchHits(uuid);

  const ancestorsSplitByEntityType = ancestorHits.reduce(
    (acc, ancestor) => {
      const {
        _source: { entity_type },
      } = ancestor;

      if (!entity_type || !(entity_type in acc)) {
        return acc;
      }

      acc[entity_type].push(ancestor);
      return acc;
    },
    { Donor: [], Sample: [], Dataset: [] },
  );

  const entities = [
    {
      entityType: 'Donor',
      tabLabel: 'Donors',
      data: ancestorsSplitByEntityType.Donor,
      columns: [
        {
          id: 'mapped_metadata.age_value',
          label: 'Age',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.age_value,
        },
        {
          id: 'mapped_metadata.body_mass_index_value',
          label: 'BMI',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.body_mass_index_value,
        },
        {
          id: 'mapped_metadata.sex',
          label: 'Sex',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.sex,
        },
        {
          id: 'mapped_metadata.race',
          label: 'Race',
          renderColumnCell: ({ mapped_metadata }) => mapped_metadata?.race,
        },
        lastModifiedTimestampCol,
      ],
    },
    {
      entityType: 'Sample',
      tabLabel: 'Samples',
      data: ancestorsSplitByEntityType.Sample,
      columns: [
        organCol,
        { id: 'sample_category', label: 'Sample Category', renderColumnCell: ({ sample_category }) => sample_category },
        lastModifiedTimestampCol,
      ],
    },

    {
      entityType: 'Dataset',
      tabLabel: 'Datasets',
      data: ancestorsSplitByEntityType.Dataset,
      columns: [dataTypesCol, organCol, statusCol, lastModifiedTimestampCol],
    },
  ];

  return { entities, isLoading };
}

export { usePublicationsRelatedEntities };
