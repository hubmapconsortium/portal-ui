import { useMemo } from 'react';
import {
  BarStackGroup,
  BarStackValues,
} from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalGroupedStackedBarChart';

export interface CompositeBucket {
  key: Record<string, string | number>;
  doc_count: number;
}

export interface CompositeAggregations {
  composite_data: {
    buckets: CompositeBucket[];
  };
}

export interface DonorSearchData {
  aggregations?: CompositeAggregations;
}

type SingleStackKey = 'count';

/**
 * Transforms Elasticsearch composite aggregation buckets into BarStackGroup format
 * for the VerticalGroupedStackedBarChart component.
 *
 * @param buckets - Array of composite aggregation buckets from Elasticsearch
 * @param xKey - The key in bucket.key that represents the X-axis grouping (e.g., 'mapped_metadata.age')
 * @param yKey - The key in bucket.key that represents the comparison grouping (e.g., 'mapped_metadata.race')
 * @param xAxisLabels - Ordered array of X-axis labels to display
 * @param compareByKeys - Array of comparison keys (e.g., ['White', 'Black or African American', 'Hispanic'])
 * @returns Array of BarStackGroup objects with a single 'count' stack key
 */
function transformCompositeDataToBarStackGroups<CompareByKey extends string, XAxisKey extends string>(
  buckets: CompositeBucket[],
  xKey: string,
  yKey: string,
  xAxisLabels: XAxisKey[],
  compareByKeys: CompareByKey[],
): BarStackGroup<SingleStackKey, CompareByKey, XAxisKey>[] {
  // Create a map of x-axis values to comparison keys to counts
  const grouped = new Map<string | number, Map<string | number, number>>();

  buckets.forEach((bucket) => {
    const xValue = bucket.key[xKey];
    const yValue = bucket.key[yKey];
    const count = bucket.doc_count;

    if (!grouped.has(xValue)) {
      grouped.set(xValue, new Map());
    }
    grouped.get(xValue)!.set(yValue, count);
  });

  // Transform to BarStackGroup format
  return xAxisLabels.map((xLabel) => {
    const stacks: Record<CompareByKey, BarStackValues<SingleStackKey>> = {} as Record<
      CompareByKey,
      BarStackValues<SingleStackKey>
    >;

    compareByKeys.forEach((compareKey) => {
      // Get the original x-axis value (before label transformation)
      // We need to search for the bucket that matches this label
      const matchingBucket = buckets.find((b) => {
        const xValue = b.key[xKey];
        // For age, we need to match the transformed label
        if (typeof xValue === 'number') {
          const transformedLabel = xValue === 0 ? '<10' : `${xValue}-${xValue + 9}`;
          return transformedLabel === xLabel;
        }
        // For other fields, we need to check for label transformations
        // Blood type: remove "Blood Type" prefix
        const transformedValue =
          typeof b.key[xKey] === 'string' && b.key[xKey].includes('Blood Type')
            ? b.key[xKey].replace('Blood Type', '').trim()
            : b.key[xKey];
        return transformedValue === xLabel;
      });

      const xValue = matchingBucket?.key[xKey];
      const count = grouped.get(xValue as string | number)?.get(compareKey) ?? 0;

      stacks[compareKey] = { count };
    });

    return {
      group: xLabel,
      stacks,
    };
  });
}

export interface UseDonorChartDataParams {
  searchData: DonorSearchData;
  xKey: string;
  yKey: string;
  xAxisLabels: string[];
  compareByKeys: string[];
}

export interface UseDonorChartDataResult {
  data: BarStackGroup<SingleStackKey, string, string>[];
  maxCount: number;
}

/**
 * Custom hook to transform donor chart search data into the format expected by VerticalGroupedStackedBarChart.
 *
 * @param searchData - The search data from useSearchData hook
 * @param xKey - The key for X-axis grouping (e.g., 'mapped_metadata.age')
 * @param yKey - The key for comparison grouping (e.g., 'mapped_metadata.race')
 * @param xAxisLabels - Array of X-axis labels to display
 * @param compareByKeys - Array of comparison keys for grouping
 * @returns Object containing transformed data and maxCount for Y-axis scaling
 */
export function useDonorChartData({
  searchData,
  xKey,
  yKey,
  xAxisLabels,
  compareByKeys,
}: UseDonorChartDataParams): UseDonorChartDataResult {
  return useMemo(() => {
    if (!searchData.aggregations?.composite_data?.buckets) {
      return {
        data: [],
        maxCount: 0,
      };
    }

    const { buckets } = searchData.aggregations.composite_data;

    const data = transformCompositeDataToBarStackGroups(buckets, xKey, yKey, xAxisLabels, compareByKeys);

    // Calculate max count for Y-axis scaling
    const maxCount = Math.max(...data.flatMap((group) => compareByKeys.map((key) => group.stacks[key]?.count ?? 0)), 0);

    return {
      data,
      maxCount,
    };
  }, [searchData, xKey, yKey, xAxisLabels, compareByKeys]);
}
