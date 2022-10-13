import { useState } from 'react';
import Searchkit from '@searchkit/sdk';
import useDeepCompareEffect from 'use-deep-compare-effect';
import RequestTransporter from 'js/components/entity-search/searchkit-modifications/RequestTransporter';

// Copied from https://github.com/searchkit/searchkit/blob/6d11b204520009a705fe207535bd4f18d083d361/packages/searchkit-sdk/src/react-hooks/index.ts
// Modified to handle initial filters and use our custom transformer

const useSearchkitSDK = ({ config, variables, filters, defaultSort }) => {
  const [results, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

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
            size: config.pageSize,
            from: variables.page.from,
          },
        });
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
  }, [config, filters, variables]);

  return { results, loading };
};

export default useSearchkitSDK;
