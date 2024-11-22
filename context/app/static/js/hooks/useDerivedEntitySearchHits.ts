import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset, Sample } from 'js/components/types';

function getTypeQuery(ancestorUUID: string, type: string) {
  return {
    bool: {
      filter: [
        {
          term: {
            ancestor_ids: ancestorUUID,
          },
        },
        {
          term: {
            entity_type: type,
          },
        },
      ],
    },
  };
}

function useDerivedDatasetSearchHits(ancestorUUID: string) {
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'dataset'),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'mapped_data_types',
        'status',
        'descendant_counts',
        'published_timestamp',
      ],
      size: 10000,
    }),
    [ancestorUUID],
  );

  return useSearchHits<Dataset>(query);
}

function useDerivedSampleSearchHits(ancestorUUID: string) {
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'sample'),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'origin_samples_unique_mapped_organs',
        'sample_category',
        'descendant_counts',
        'created_timestamp',
      ],
      size: 10000,
    }),
    [ancestorUUID],
  );
  return useSearchHits<Sample>(query);
}

export { useDerivedDatasetSearchHits, useDerivedSampleSearchHits };
