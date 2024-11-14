import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import {
  createdTimestampCol,
  organCol,
  dataTypesCol,
  statusCol,
  publishedTimestampCol,
} from 'js/components/detailPage/derivedEntities/columns';

import { getAncestorsQuery } from 'js/helpers/queries';
import { Dataset, Donor, PartialEntity, Sample } from 'js/components/types';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

function useAncestorSearchHits(descendantUUID: string) {
  const query = useMemo(
    () => ({
      query: getAncestorsQuery(descendantUUID),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'mapped_data_types',
        'mapped_status',
        'descendant_counts',
        'created_timestamp',
        'mapped_metadata',
        'origin_samples_unique_mapped_organs',
        'sample_category',
      ],
      size: 10000,
    }),
    [descendantUUID],
  );

  return useSearchHits<Donor | Sample | Dataset>(query);
}

function usePublicationsRelatedEntities(uuid: string) {
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
    { Donor: [], Sample: [], Dataset: [] } as Record<string, Required<SearchHit<PartialEntity>>[]>,
  );

  const entities = [
    {
      entityType: 'Donor' as const,
      tabLabel: 'Donors',
      data: ancestorsSplitByEntityType.Donor,
      columns: [
        {
          id: 'mapped_metadata.age_value',
          label: 'Age',
          renderColumnCell: ({ mapped_metadata }: PartialEntity) => mapped_metadata?.age_value as string,
        },
        {
          id: 'mapped_metadata.body_mass_index_value',
          label: 'BMI',
          renderColumnCell: ({ mapped_metadata }: PartialEntity) => mapped_metadata?.body_mass_index_value as string,
        },
        {
          id: 'mapped_metadata.sex',
          label: 'Sex',
          renderColumnCell: ({ mapped_metadata }: PartialEntity) => mapped_metadata?.sex as string,
        },
        {
          id: 'mapped_metadata.race',
          label: 'Race',
          renderColumnCell: ({ mapped_metadata }: PartialEntity) => mapped_metadata?.race as string,
        },
        createdTimestampCol,
      ],
    },
    {
      entityType: 'Sample' as const,
      tabLabel: 'Samples',
      data: ancestorsSplitByEntityType.Sample,
      columns: [
        organCol,
        {
          id: 'sample_category',
          label: 'Sample Category',
          renderColumnCell: ({ sample_category }: PartialEntity) => sample_category as string,
        },
        createdTimestampCol,
      ],
    },

    {
      entityType: 'Dataset' as const,
      tabLabel: 'Datasets',
      data: ancestorsSplitByEntityType.Dataset,
      columns: [dataTypesCol, organCol, statusCol, publishedTimestampCol],
    },
  ];

  return { entities, isLoading };
}

export { usePublicationsRelatedEntities };
