import { useMemo } from 'react';
import { SavedEntity } from 'js/components/savedLists/types';
import { getIDsQuery } from 'js/helpers/queries';
import useSearchData from 'js/hooks/useSearchData';

interface EntityCounts {
  entity_counts: {
    buckets: { doc_count: number; key: string }[];
  };
}
function useSavedEntityCountsData(savedEntities: Record<string, SavedEntity>) {
  const query = useMemo(
    () => ({
      size: 0,
      query: getIDsQuery(Object.keys(savedEntities)),
      aggs: {
        entity_counts: {
          terms: { field: 'entity_type.keyword', size: 10 },
        },
      },
    }),
    [savedEntities],
  );

  const { searchData, isLoading } = useSearchData<unknown, EntityCounts>(query);
  return { searchData, isLoading };
}

function useSavedEntityTypeCounts(listSavedEntities: Record<string, SavedEntity>) {
  const { searchData } = useSavedEntityCountsData(listSavedEntities);

  const buckets = searchData?.aggregations?.entity_counts?.buckets ?? [];
  return {
    donors: buckets.find((bucket) => bucket.key === 'Donor')?.doc_count ?? 0,
    samples: buckets.find((bucket) => bucket.key === 'Sample')?.doc_count ?? 0,
    datasets: buckets.find((bucket) => bucket.key === 'Dataset')?.doc_count ?? 0,
  };
}

export { useSavedEntityTypeCounts };
