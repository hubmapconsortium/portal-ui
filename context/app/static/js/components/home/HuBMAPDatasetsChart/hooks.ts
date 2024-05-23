import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import useSearchData from 'js/hooks/useSearchData';
import type { QueryAggs } from './queries';

type AggregatedData = Record<string, Record<string, number>>;

// Categorizes the data by organ, showing a count for each paired key
export function aggregateByOrgan<T extends object>(
  buckets: QueryAggs<T>['organs']['buckets'] | undefined,
  keyToAggregate: keyof T,
) {
  if (!buckets) return {} as AggregatedData;
  return buckets.reduce<AggregatedData>((acc, bucket) => {
    const { organ } = bucket.key;
    const key = bucket.key[keyToAggregate] as string;
    const count = bucket.doc_count;

    if (!acc[organ]) {
      acc[organ] = {} as Record<string, number>;
    }

    if (!acc[organ][key]) {
      acc[organ][key] = 0;
    }

    acc[organ][key] = count;

    return acc;
  }, {});
}

export function useAggregatedChartData<T extends object>(
  query: SearchRequest,
  keyToAggregate: keyof T,
): AggregatedData {
  const {
    searchData: { aggregations },
  } = useSearchData<unknown, QueryAggs<T>>(query);
  const aggregatedData = aggregateByOrgan(aggregations?.organs.buckets, keyToAggregate);
  return aggregatedData;
}
