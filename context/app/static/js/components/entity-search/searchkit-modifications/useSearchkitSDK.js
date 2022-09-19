import { useState } from 'react';
import Searchkit from '@searchkit/sdk';
import useDeepCompareEffect from 'use-deep-compare-effect';

// Copied from https://github.com/searchkit/searchkit/blob/6d11b204520009a705fe207535bd4f18d083d361/packages/searchkit-sdk/src/react-hooks/index.ts
// Modified to handle initial filters and use our custom transformer

const useSearchkitSDK = ({ config, variables, transporter, filters, defaultSort }) => {
  const [results, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useDeepCompareEffect(() => {
    let active = true;
    async function fetchData(v) {
      setLoading(true);
      const request = Searchkit(config, transporter)
        .query(v.query)
        .setFilters([...filters.map((filter) => filter.value), ...v.filters])
        .setSortBy(v.sortBy || defaultSort);

      const response = await request.execute({
        facets: true,
        hits: {
          size: variables.page.size,
          from: variables.page.from,
        },
      });
      if (active) {
        setLoading(false);
        setResponse(response);
      }
    }

    if (variables) fetchData(variables);
    return () => {
      active = false;
    };
  }, [config, filters, variables, transporter]);

  return { results, loading };
};

export default useSearchkitSDK;
