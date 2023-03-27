import { useMemo } from 'react';

import useSearchData from 'js/hooks/useSearchData';
import { getAncestorsQuery } from 'js/helpers/queries';

function useAncestorSearchAggs(descendantUUID, aggsField) {
  const query = useMemo(
    () => ({
      query: getAncestorsQuery(descendantUUID, 'dataset'),
      aggs: {
        [aggsField]: {
          terms: {
            field: `${aggsField}.keyword`,
            size: 10000,
          },
        },
      },
      size: 0,
    }),
    [aggsField, descendantUUID],
  );

  return useSearchData(query);
}

export { useAncestorSearchAggs };
