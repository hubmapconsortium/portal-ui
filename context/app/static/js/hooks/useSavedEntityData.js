import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';

function useSavedEntityData(savedEntities, source) {
  const query = useMemo(
    () => ({
      query: {
        ids: {
          values: Object.keys(savedEntities),
        },
      },
      _source: source,
    }),
    [savedEntities, source],
  );
  const { searchHits } = useSearchHits(query);

  return searchHits;
}

export default useSavedEntityData;
