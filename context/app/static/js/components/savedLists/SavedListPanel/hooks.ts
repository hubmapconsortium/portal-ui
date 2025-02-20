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

  const counts = useMemo(() => {
    if (!searchData?.aggregations?.entity_counts?.buckets) {
      return { donors: 0, samples: 0, datasets: 0 };
    }

    return searchData.aggregations.entity_counts.buckets.reduce(
      (acc, { key, doc_count }) => {
        switch (key) {
          case 'Donor':
            acc.donors = doc_count;
            break;
          case 'Sample':
            acc.samples = doc_count;
            break;
          case 'Dataset':
            acc.datasets = doc_count;
            break;
          default:
            break;
        }
        return acc;
      },
      { donors: 0, samples: 0, datasets: 0 },
    );
  }, [searchData]);

  return counts;
}

export { useSavedEntityTypeCounts };
