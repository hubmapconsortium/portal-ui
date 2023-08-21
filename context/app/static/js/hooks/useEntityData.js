import { useMemo } from 'react';
import { useSearchHits } from 'js/hooks/useSearchData';

function useEntityData(uuid) {
  const query = useMemo(() => ({ query: { ids: { values: [uuid] } } }), [uuid]);

  const { searchHits } = useSearchHits(query);

  // eslint-disable-next-line no-underscore-dangle
  return searchHits[0]?._source;
}

export default useEntityData;
