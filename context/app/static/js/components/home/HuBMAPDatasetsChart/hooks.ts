import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import useSearchData from 'js/hooks/useSearchData';
import { organTypesQuery, type OrganTypesQueryAggs, type QueryAggs } from './queries';

export type AggregatedDatum = {
  organ: string | number; // Actually just a string, but the union with Record below is necessary for TS to infer the type correctly
} & Record<string, number>;

export type AggregatedData = AggregatedDatum[];

// Categorizes the data by organ, showing a count for each paired key
export function aggregateByOrgan<T extends object>(buckets: QueryAggs<T>['organs']['buckets'] | undefined) {
  if (!buckets?.length) return [] as AggregatedData;

  const bucketMap = buckets.reduce((acc, bucket) => {
    const { organ, ...otherKeys } = bucket.key;

    const currentOrganData = acc.get(organ) ?? ({ organ } as AggregatedDatum);

    const otherKeyValues = Object.values(otherKeys) as string[];

    otherKeyValues.forEach((value) => {
      currentOrganData[value] = bucket.doc_count;
    });
    acc.set(organ, currentOrganData);

    return acc;
  }, new Map<string, AggregatedDatum>());
  return Array.from(bucketMap.values());
}

export function useAggregatedChartData<T extends object>(query: SearchRequest): AggregatedData {
  const {
    searchData: { aggregations },
  } = useSearchData<unknown, QueryAggs<T>>(query);
  const aggregatedData = aggregateByOrgan(aggregations?.organs.buckets);

  return aggregatedData ?? [];
}

export function getKeysFromAggregatedData(aggregatedData: AggregatedData): string[] {
  return aggregatedData
    .reduce((acc, data) => {
      const keys = Object.keys(data).filter((key) => key !== 'organ');
      return [...acc, ...keys];
    }, [] as string[])
    .filter((key, index, self) => self.indexOf(key) === index);
}

export function useOrganOrder() {
  const { searchData: organData, ...rest } = useSearchData<unknown, OrganTypesQueryAggs>(organTypesQuery);

  const buckets = organData?.aggregations?.organ_types.buckets ?? [];

  const organOrder = buckets.sort((a, b) => a.doc_count - b.doc_count).map((bucket) => bucket.key);

  return { organOrder, ...rest };
}

export function useSearchDataRange() {
  const { searchData: organData } = useSearchData<unknown, OrganTypesQueryAggs>(organTypesQuery);

  if (!organData?.aggregations) {
    return [0, 0];
  }

  const { buckets } = organData.aggregations.organ_types;

  const max = buckets.reduce((acc, bucket) => Math.max(acc, bucket.doc_count), 0);

  return [0, max];
}
