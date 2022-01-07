import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';

function useEntityCounts(listSavedEntities) {
  const query = useMemo(
    () => ({
      query: {
        ids: {
          values: Object.keys(listSavedEntities),
        },
      },
      _source: ['entity_type'],
    }),
    [listSavedEntities],
  );
  const { searchHits } = useSearchHits(query);

  const counts = searchHits.reduce(
    (acc, { _source: { entity_type } }) => {
      if (!(entity_type in acc)) {
        // Support entities may be in the user's list.
        acc[entity_type] = 0;
      }
      const incrementedCount = acc[entity_type] + 1;
      return { ...acc, [entity_type]: incrementedCount };
    },
    { Donor: 0, Sample: 0, Dataset: 0 },
  );

  return counts;
}

export { useEntityCounts };
