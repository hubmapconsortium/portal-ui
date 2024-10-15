import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Entity } from 'js/components/types';

export const useEntityQuery = (uuid: string | string[], source?: string[]) => {
  return useMemo(
    () => ({
      query: { ids: { values: typeof uuid === 'string' ? [uuid] : uuid } },
      _source: source,
    }),
    [uuid, source],
  );
};

export function useEntityData(uuid: string, source?: string[]): [Entity, boolean] {
  const query = useEntityQuery(uuid, source);

  const { searchHits, isLoading } = useSearchHits<Entity>(query);

  return [searchHits[0]?._source, isLoading];
}

export function useEntitiesData<T extends Entity = Entity>(uuids: string[], source?: string[]): [T[], boolean] {
  const query = useEntityQuery(uuids, source);

  const { searchHits, isLoading } = useSearchHits<T>(query);

  return [searchHits.map((hit) => hit._source), isLoading];
}

export default useEntityData;
