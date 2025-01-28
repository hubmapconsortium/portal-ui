import { useMemo } from 'react';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Entity } from 'js/components/types';
import { SavedEntity } from 'js/components/savedLists/types';
import { getIDsQuery } from '../helpers/queries';

type SavedEntities = Record<string, unknown>;

/* Sorts search hits by date saved (most recent first) */
function sortEntities(searchHits: Required<SearchHit<Entity>>[], savedEntities: SavedEntities) {
  if (!searchHits) return [];

  return [...searchHits].sort((a, b) => {
    const entityA: SavedEntity = savedEntities[a._id] ?? { dateSaved: 0 };
    const entityB: SavedEntity = savedEntities[b._id] ?? { dateSaved: 0 };

    const dateA = entityA.dateSaved ?? 0;
    const dateB = entityB.dateSaved ?? 0;

    return dateB - dateA;
  });
}

function useSavedEntityData(savedEntities: SavedEntities, source: string[]) {
  const query = useMemo(
    () => ({
      query: getIDsQuery(Object.keys(savedEntities)),
      _source: source,
      size: Object.keys(savedEntities).length,
    }),
    [savedEntities, source],
  );

  const { searchHits, isLoading } = useSearchHits<Entity>(query);
  const sortedSearchHits = sortEntities(searchHits, savedEntities);

  return { searchHits: sortedSearchHits, isLoading };
}

export default useSavedEntityData;
