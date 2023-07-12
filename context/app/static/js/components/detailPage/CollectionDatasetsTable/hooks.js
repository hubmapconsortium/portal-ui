import { useSearchHits } from 'js/hooks/useSearchData';
import { getIDsQuery } from 'js/helpers/queries';

function useCollectionsDatasets({ ids, sourceFields }) {
  const query = {
    query: {
      ...getIDsQuery(ids),
    },
    _source: sourceFields,
  };

  const { searchHits: datasets } = useSearchHits(query);
  return datasets;
}

export { useCollectionsDatasets };
