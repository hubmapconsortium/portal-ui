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
          terms: { field: 'entity_type.keyword', size: 10000 },
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

  const counts = { donors: 0, samples: 0, datasets: 0 };

  searchData?.aggregations?.entity_counts?.buckets?.forEach((bucket) => {
    if (bucket.key === 'Donor') counts.donors = bucket.doc_count;
    else if (bucket.key === 'Sample') counts.samples = bucket.doc_count;
    else if (bucket.key === 'Dataset') counts.datasets = bucket.doc_count;
  });

  return counts;
}

export { useSavedEntityTypeCounts };
