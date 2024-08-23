import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Entity } from 'js/components/types';

export function useEntityData(uuid: string, source?: string[]): [Entity, boolean] {
  const query = useMemo(() => ({ query: { ids: { values: [uuid] } }, _source: source }), [uuid, source]);

  const { searchHits, isLoading } = useSearchHits<Entity>(query);

  return [searchHits[0]?._source, isLoading];
}

export default useEntityData;
