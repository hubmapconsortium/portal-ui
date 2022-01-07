import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from '../helpers/queries';

function useSavedEntityData(savedEntities, source) {
  const query = useMemo(
    () => ({
      query: getIDsQuery(Object.keys(savedEntities)),
      _source: source,
    }),
    [savedEntities, source],
  );
  const { searchHits } = useSearchHits(query);

  return searchHits;
}

export default useSavedEntityData;
