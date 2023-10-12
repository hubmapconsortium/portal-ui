import { useState } from 'react';
import Searchkit from '@searchkit/sdk';
import useDeepCompareEffect from 'use-deep-compare-effect';
import RequestTransporter from 'js/components/entity-search/searchkit-modifications/RequestTransporter';
import { fetchSearchData } from 'js/hooks/useSearchData';
import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider';

// Copied from https://github.com/searchkit/searchkit/blob/6d11b204520009a705fe207535bd4f18d083d361/packages/searchkit-sdk/src/react-hooks/index.ts
// Modified to handle initial filters, get page size from config, use our custom transformer, and send a follow-up request to fetch IDs for all hits.

const useSearchkitSDK = ({
  config,
  variables,
  filters,
  defaultSort,
  elasticsearchEndpoint,
  groupsToken,
  queryBody,
  persistSelections,
}) => {
  const [results, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allResultsUUIDs, setAllResultsUUIDS] = useState([]);
  const { deselectHeaderAndRows, setSelectedRows, selectedRows } = useSelectableTableStore();

  useDeepCompareEffect(() => {
    const abortController = new AbortController();
    const transporter = new RequestTransporter(config, abortController);

    async function fetchData(v) {
      setLoading(true);
      const request = Searchkit(config, transporter)
        .query(v.query)
        .setFilters([...filters.map((filter) => filter.value), ...v.filters])
        .setSortBy(v.sortBy || defaultSort);

      try {
        const response = await request.execute({
          facets: true,
          hits: {
            size: config.pageSize, // Modification: page size is set from our defined config, not searchkit variables.
            from: variables.page.from,
          },
        });

        // Modification: send follow-up request to fetch uuids for all hits
        const { query, post_filter } = queryBody;
        const allResults = await fetchSearchData(
          { query, post_filter, _source: false, size: 10000 },
          elasticsearchEndpoint,
          groupsToken,
        );

        // eslint-disable-next-line no-underscore-dangle
        const currentResultsUUIDS = allResults.hits.hits.map((hit) => hit._id);

        if (!persistSelections) {
          // if the number of new results is larger, reset selections
          if (currentResultsUUIDS.length > allResultsUUIDs.length) {
            deselectHeaderAndRows();
          } else {
            // retain selections included in the new results
            setSelectedRows(...[currentResultsUUIDS.filter((result) => selectedRows.has(result))]);
          }
        }

        setAllResultsUUIDS(currentResultsUUIDS);

        setLoading(false);
        setResponse(response);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Search API status failed', error);
        }
      }
    }
    if (variables) fetchData(variables);

    return () => {
      abortController.abort();
    };
  }, [config, filters, variables, queryBody]);

  return { results, loading, allResultsUUIDs };
};

export default useSearchkitSDK;
