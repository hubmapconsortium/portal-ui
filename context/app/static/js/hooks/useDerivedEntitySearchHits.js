import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';

function getTypeQuery(ancestorUUID, type) {
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

function useDerivedDatasetSearchHits(ancestorUUID) {
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'dataset'),
      _source: ['uuid', 'hubmap_id', 'mapped_data_types', 'status', 'descendant_counts', 'last_modified_timestamp'],
      size: 10000,
    }),
    [ancestorUUID],
  );

  return useSearchHits(query);
}

function useDerivedSampleSearchHits(ancestorUUID) {
  const query = useMemo(
    () => ({
      query: getTypeQuery(ancestorUUID, 'sample'),
      _source: [
        'uuid',
        'hubmap_id',
        'origin_sample.mapped_organ',
        'mapped_specimen_type',
        'descendant_counts',
        'last_modified_timestamp',
      ],
      size: 10000,
    }),
    [ancestorUUID],
  );
  return useSearchHits(query);
}

export { useDerivedDatasetSearchHits, useDerivedSampleSearchHits };
