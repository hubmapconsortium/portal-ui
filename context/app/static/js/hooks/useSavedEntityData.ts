import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Entity } from 'js/components/types';
import { getIDsQuery } from '../helpers/queries';

type SavedEntities = Record<string, unknown>;

function useSavedEntityData(savedEntities: SavedEntities, source: string[]) {
  const query = useMemo(
    () => ({
      query: getIDsQuery(Object.keys(savedEntities)),
      _source: source,
    }),
    [savedEntities, source],
  );
  const { searchHits, isLoading } = useSearchHits<Entity>(query);

  return { searchHits, isLoading };
}

export default useSavedEntityData;
