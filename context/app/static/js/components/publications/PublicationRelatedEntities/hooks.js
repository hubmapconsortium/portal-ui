import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';

function getAncestorsQuery(descendantUUID) {
  return {
    bool: {
      filter: [
        {
          term: {
            descendant_ids: descendantUUID,
          },
        },
      ],
    },
  };
}

function useAncestorSearchHits(descendantUUID) {
  const query = useMemo(
    () => ({
      query: getAncestorsQuery(descendantUUID, 'dataset'),
      _source: [
        'uuid',
        'hubmap_id',
        'entity_type',
        'mapped_data_types',
        'status',
        'descendant_counts',
        'last_modified_timestamp',
      ],
      size: 10000,
    }),
    [descendantUUID],
  );

  return useSearchHits(query);
}

export { useAncestorSearchHits };
