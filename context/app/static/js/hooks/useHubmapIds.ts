import { useMemo } from 'react';

import { Dataset } from 'js/components/types';
import { getIDsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';

function useHubmapIds(uuids: string[]) {
  // Fetch HuBMAP ids for the selected uuids
  const datasetQuery = useMemo(
    () => ({
      query: getIDsQuery([...uuids]),
      _source: ['hubmap_id'],
      size: 10000,
    }),
    [uuids],
  );

  const shouldFetch = uuids.length > 0;
  const searchConfig = useMemo(() => ({ shouldFetch }), [shouldFetch]);
  const { searchHits, isLoading } = useSearchHits<Dataset>(datasetQuery, searchConfig);
  const hubmapIds = useMemo(() => searchHits.map(({ _source }) => _source.hubmap_id), [searchHits]);

  return {
    hubmapIds,
    isLoading,
  };
}

export default useHubmapIds;
