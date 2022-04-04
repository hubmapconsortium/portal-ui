import { useState } from 'react';
import Searchkit from '@searchkit/sdk';
import useDeepCompareEffect from 'use-deep-compare-effect';

// Copied from https://github.com/searchkit/searchkit/blob/6d11b204520009a705fe207535bd4f18d083d361/packages/searchkit-sdk/src/react-hooks/index.ts
// Modified to handle initial filters and use our custom transformer

const useSearchkitSDK = (config, variables, transformer, filters) => {
  const [results, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useDeepCompareEffect(() => {
    async function fetchData(v) {
      setLoading(true);
      const request = Searchkit(config, transformer)
        .query(v.query)
        .setFilters([...filters.map((filter) => filter.value), ...v.filters])
        .setSortBy(v.sortBy);

      const response = await request.execute({
        facets: true,
        hits: {
          size: variables.page.size,
          from: variables.page.from,
        },
      });
      setLoading(false);
      setResponse(response);
    }

    if (variables) fetchData(variables);
  }, [config, variables, transformer]);

  return { results, loading };
};

export default useSearchkitSDK;
