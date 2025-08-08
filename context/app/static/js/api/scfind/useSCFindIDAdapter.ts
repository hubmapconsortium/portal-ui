import useSearchData from 'js/hooks/useSearchData';
import { useMemo } from 'react';

/**
 * Takes in a list of scFind results. If the results are in HuBMAP ID format (HBM123.ABCD.456)
 * then a lookup is performed to find the corresponding UUIDs.
 *
 * If the results are already in UUID format, they are returned as-is.
 * @param datasets
 */
export default function useSCFindIDAdapter(datasets: string[] = []) {
  const allAreUUIDs = datasets.every((id) => id.length === 32);

  const uuidQuery = useSearchData(
    {
      query: {
        terms: {
          'hubmap_id.keyword': datasets,
        },
      },
    },
    {
      shouldFetch: !allAreUUIDs,
    },
  );

  return useMemo(() => {
    if (allAreUUIDs) {
      return datasets;
    }
    return uuidQuery.searchData?.hits.hits.map((hit) => hit._id) ?? [];
  }, [allAreUUIDs, datasets, uuidQuery.searchData]);
}
