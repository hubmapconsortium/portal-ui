import { Dataset } from 'js/components/types';
import { getIDsQuery } from 'js/helpers/queries';
import { useSearchHits } from 'js/hooks/useSearchData';

function useHubmapIds(uuids: string[]) {
  // Fetch HuBMAP ids for the selected uuids
  const datasetQuery = {
    query: getIDsQuery([...uuids]),
    _source: ['hubmap_id'],
    size: 10000,
  };
  const { searchHits, isLoading } = useSearchHits<Dataset>(datasetQuery);
  const hubmapIds = searchHits.map(({ _source }) => _source.hubmap_id);

  return {
    hubmapIds,
    isLoading,
  };
}

export default useHubmapIds;
