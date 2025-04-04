import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import useSearchData from 'js/hooks/useSearchData';
import { ESEntityType } from 'js/components/types';
import {
  DatasetTypeMapQueryAggs,
  datasetTypeMapQuery,
  organTypesQuery,
  type OrganTypesQueryAggs,
  type QueryAggs,
} from './queries';

export interface AggregatedDatum {
  organ: string;
  // Used to display `Multiple` instead of specific categories in the legend
  displayLabels: Record<string, string>;
  data: Record<string, number>;
}

export type AggregatedData = AggregatedDatum[];

// Categorizes the data by organ, showing a count for each paired key
export function aggregateByOrgan<T extends object>(
  buckets: QueryAggs<T>['organs']['buckets'] | undefined,
  aggregateByDonorCount?: boolean,
) {
  if (!buckets?.length) return [] as AggregatedData;

  // if we are aggregating by donor, we need to capture overlaps between donors that may have datasets that fit into multiple subcategories
  // For example, a donor may have both a processed and raw dataset for the same organ.
  if (aggregateByDonorCount) {
    // Map the donor UUID to the category they should be counted under
    const organDonorMap = new Map<string, Record<string, Set<string>>>();

    buckets.forEach((bucket) => {
      const { organ, ...otherKeys } = bucket.key;

      const organKey = String(organ);
      if (!organDonorMap.has(organKey)) {
        organDonorMap.set(organKey, {});
      }
      const currentOrganDonors = organDonorMap.get(organKey)!;
      Object.entries(otherKeys).forEach(([_, value]) => {
        const key = value as string;
        bucket.donor_uuids.buckets.forEach(({ key: donorId }) => {
          if (!currentOrganDonors[donorId]) {
            currentOrganDonors[donorId] = new Set<string>();
          }
          currentOrganDonors[donorId].add(key);
        });
      });
    });

    /**
     * Resulting aggregated data in organDonorMap looks like this:
     * {
     *   'Heart': {
     *    'abc123': ['processed', 'raw'], // donor abc123 has both processed and raw datasets for Heart
     *    'def456': [''raw'], // donor abc123 has only raw datasets for heart
     *   },
     * }
     * Now we need to convert this map into the final aggregated data format, where the combinations of categories are each their own keys within the
     * organ object and the number of donors that belong to each unique combination is counted.
     * Sample target output: {
     *  'Heart': {
     *    'processed, raw': 1, // 1 donor has both processed and raw datasets for Heart
     *    'raw': 1, // 1 donor has only raw datasets for Heart
     *  }
     * }
     */
    const categoryDonorCounts = organDonorMap.entries().reduce((acc, currentOrganData) => {
      const [organ, donors] = currentOrganData;
      const aggregatedOrganData: Record<string, number> = {};

      // Iterate over each donor's categories
      Object.values(donors).forEach((categories) => {
        if (categories.size === 0) return; // Safety check, skip if no categories are present - should never happen
        const categoryArray = Array.from(categories); // Convert Set to Array
        // More complicated category key generation: join categories with a comma
        // This leads to too many categories
        const categoryKey = categoryArray.sort().join(', '); // Sort to ensure consistent key order
        // Simplified category key generation: if more than one category, label as 'Multiple', else use the single category
        // const categoryKey = categoryArray.length > 1 ? 'Multiple' : categoryArray[0]; // If more than one category, label as 'Multiple', else use the single category
        if (!aggregatedOrganData[categoryKey]) {
          aggregatedOrganData[categoryKey] = 0;
        }
        aggregatedOrganData[categoryKey] += 1; // Increment the count for this category key
      });

      // Now merge this into the final aggregated data map
      const existingOrganData = acc.get(organ) ?? ({ organ, data: {}, displayLabels: {} } satisfies AggregatedDatum);
      Object.entries(aggregatedOrganData).forEach(([key, count]) => {
        existingOrganData.data[key] = count;
        const displayLabel = key.includes(', ') ? 'Multiple' : key; // If the key contains a comma, label as 'Multiple'
        existingOrganData.displayLabels[key] = displayLabel; // Store the display label for the category
      });

      acc.set(organ, existingOrganData);
      return acc;
    }, new Map<string, AggregatedDatum>());

    return Array.from(categoryDonorCounts.values());
  }

  const bucketMap = buckets.reduce((acc, bucket) => {
    const { organ, ...otherKeys } = bucket.key;

    const currentOrganData = acc.get(organ) ?? ({ organ, data: {}, displayLabels: {} } satisfies AggregatedDatum);

    const otherKeyValues = Object.values(otherKeys) as string[];

    otherKeyValues.forEach((value) => {
      currentOrganData.data[value] = bucket.doc_count;
      currentOrganData.displayLabels[value] = value; // Store the display label for the category
    });

    acc.set(organ, currentOrganData);

    return acc;
  }, new Map<string, AggregatedDatum>());
  return Array.from(bucketMap.values());
}

export function useAggregatedChartData<T extends object>(
  query: SearchRequest,
  selectedEntityType: ESEntityType,
): AggregatedData {
  const {
    searchData: { aggregations },
  } = useSearchData<unknown, QueryAggs<T>>(query);
  const aggregatedData = aggregateByOrgan(aggregations?.organs.buckets, selectedEntityType === 'Donor');

  return aggregatedData ?? [];
}

export function getKeysFromAggregatedData(aggregatedData: AggregatedData): string[] {
  return aggregatedData
    .reduce((acc, data) => {
      const keys = Object.keys(data.data);
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

export function useSearchDataRange(selectedEntityType: ESEntityType) {
  const { searchData: organData } = useSearchData<unknown, OrganTypesQueryAggs>(organTypesQuery);

  if (!organData?.aggregations) {
    return [0, 0];
  }

  const { buckets } = organData.aggregations.organ_types;

  const getDonorCount = selectedEntityType === 'Donor';

  const max = buckets.reduce(
    (acc, bucket) => Math.max(acc, getDonorCount ? bucket.unique_donor_count.value : bucket.doc_count),
    0,
  );

  return [0, max];
}

export function useDatasetTypeMap() {
  const { searchData: datasetTypeMapData } = useSearchData<unknown, DatasetTypeMapQueryAggs>(datasetTypeMapQuery);
  if (!datasetTypeMapData?.aggregations) {
    return {};
  }
  const { dataset_type_map } = datasetTypeMapData.aggregations;
  const { buckets: rawDatasetTypes } = dataset_type_map.raw_dataset_type;
  const datasetTypeMap = rawDatasetTypes.reduce(
    (acc, bucket) => {
      const assayDisplayNames = bucket.assay_display_name.buckets.map((b) => b.key);
      acc[bucket.key] = assayDisplayNames;
      return acc;
    },
    {} as Record<string, string[]>,
  );
  return datasetTypeMap;
}
