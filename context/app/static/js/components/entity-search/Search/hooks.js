import { useState, useCallback, useContext } from 'react';
import { AppContext } from 'js/components/Providers';

import useDeepCompareEffect from 'use-deep-compare-effect';

import { fetchSearchData } from 'js/hooks/useSearchData';

function useAllResultsUUIDs() {
  const [queryBody, setQueryBody] = useState({});
  const [allResultsUUIDs, setAllResultsUUIDS] = useState([]);
  const { elasticsearchEndpoint, groupsToken } = useContext(AppContext);

  const setQueryBodyAndReturnBody = useCallback(
    (body) => {
      setQueryBody(body);
      return body;
    },
    [setQueryBody],
  );

  useDeepCompareEffect(() => {
    async function getAndSetAllUUIDs() {
      const { query, post_filter } = queryBody;
      const allResults = await fetchSearchData(
        { query, post_filter, _source: false, size: 10000 },
        elasticsearchEndpoint,
        groupsToken,
      );
      // eslint-disable-next-line no-underscore-dangle
      setAllResultsUUIDS(allResults.hits.hits.map((hit) => hit._id));
    }
    getAndSetAllUUIDs();
  }, [queryBody]);

  return { allResultsUUIDs, setQueryBodyAndReturnBody };
}

export { useAllResultsUUIDs };
