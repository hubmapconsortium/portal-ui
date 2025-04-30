import { useMemo, useState } from 'react';
import { AggregationsAggregationContainer, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import useSearchData from 'js/hooks/useSearchData';
import { BarStackGroup } from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalGroupedStackedBarChart';

export const Y_AXIS_OPTIONS = ['Datasets', 'Donors'] as const;
export type YAxisOptions = (typeof Y_AXIS_OPTIONS)[number];

export const X_AXIS_OPTIONS = ['Age', 'Race', 'Sex'] as const;
export type XAxisOptions = (typeof X_AXIS_OPTIONS)[number];

/**
 * Helper function for managing the state of the axis and compareBy values
 * when the axis and compareBy values are selected from the same set of keys
 * @param options - The options to choose from
 * @param defaultAxisValue - The default value for the axis
 * @param defaultCompareByValue - The default value for the compareBy
 * @returns
 */
export const useAxisAndCompareBy = <T>(options: T[] | readonly T[], defaultAxisValue: T, defaultCompareByValue: T) => {
  const [axis, setAxis] = useState<T>(defaultAxisValue);
  const [compareBy, setCompareBy] = useState<T>(defaultCompareByValue);

  const xAxisOptions = useMemo(() => {
    return options.filter((option) => option !== compareBy);
  }, [options, compareBy]);

  const compareByOptions = useMemo(() => {
    return options.filter((option) => option !== axis);
  }, [options, axis]);

  return {
    axis,
    setAxis,
    compareBy,
    setCompareBy,
    xAxisOptions,
    compareByOptions,
  };
};

type AgeBucket = '0' | '10' | '20' | '30' | '40' | '50' | '60' | '70' | '80' | '90';
type AgeBuckets = AgeBucket[];
const labeledAgeBuckets: Record<AgeBucket, string> = {
  0: '<10',
  10: '10-19',
  20: '20-29',
  30: '30-39',
  40: '40-49',
  50: '50-59',
  60: '60-69',
  70: '70-79',
  80: '80-89',
  90: '90+',
} as const;

export const ageBuckets = Object.keys(labeledAgeBuckets) as AgeBuckets;
export const ageBucketLabels = Object.values(labeledAgeBuckets);

interface NestedDonorBuckets {
  key: string;
  doc_count: number;
  dataset_count: {
    value: number;
  };
  donor_count: {
    value: number;
  };
  age: {
    buckets: {
      key: number;
      doc_count: number;
      donor_count: {
        value: number;
      };
    }[];
  };
  race: {
    buckets: {
      key: string;
      doc_count: number;
      donor_count: {
        value: number;
      };
    }[];
  };
  sex: {
    buckets: {
      key: number;
      doc_count: number;
      donor_count: {
        value: number;
      };
    }[];
  };
}

interface DatasetsOverviewAggs {
  total_datasets: {
    value: number;
  };
  unique_donors: {
    value: number;
  };
  average_donor_age: {
    value: number;
  };
  donors_by_sex: {
    buckets: Omit<NestedDonorBuckets, 'sex'>[];
  };
  donors_by_age: {
    buckets: Omit<NestedDonorBuckets, 'age'>[];
  };
  donors_by_race: {
    buckets: Omit<NestedDonorBuckets, 'race'>[];
  };
}

export interface DatasetsOverviewDigest {
  totalDonors: number;
  averageDonorAge: number;
  totalDatasets: number;
  isLoading: boolean;
  maleDonors: number;
  femaleDonors: number;
  fullAggs?: DatasetsOverviewAggs;
}

const agesAgg: AggregationsAggregationContainer = {
  histogram: {
    field: 'donor.mapped_metadata.age_value',
    interval: 10,
    min_doc_count: 0,
  },
  aggs: {
    donor_count: {
      cardinality: {
        field: 'donor.uuid.keyword',
      },
    },
  },
};

const racesAgg: AggregationsAggregationContainer = {
  terms: {
    field: 'donor.mapped_metadata.race.keyword',
  },
  aggs: {
    donor_count: {
      cardinality: {
        field: 'donor.uuid.keyword',
      },
    },
  },
};

const sexesAgg: AggregationsAggregationContainer = {
  terms: {
    field: 'donor.mapped_metadata.sex.keyword',
  },
  aggs: {
    donor_count: {
      cardinality: {
        field: 'donor.uuid.keyword',
      },
    },
  },
};

const commonAggs: Record<string, AggregationsAggregationContainer> = {
  dataset_count: {
    cardinality: {
      field: 'hubmap_id.keyword',
    },
  },
  donor_count: {
    cardinality: {
      field: 'donor.uuid.keyword',
    },
  },
};

const aggs: Record<string, AggregationsAggregationContainer> = {
  total_datasets: {
    cardinality: {
      field: 'hubmap_id.keyword',
    },
  },
  unique_donors: {
    cardinality: {
      field: 'donor.uuid.keyword',
    },
  },
  average_donor_age: {
    avg: {
      field: 'donor.mapped_metadata.age_value',
    },
  },
  donors_by_sex: {
    terms: {
      field: 'donor.mapped_metadata.sex.keyword',
    },
    aggs: {
      ...commonAggs,
      age: agesAgg,
      race: racesAgg,
    },
  },
  donors_by_age: {
    histogram: {
      field: 'donor.mapped_metadata.age_value',
      interval: 10,
      min_doc_count: 0,
    },
    aggs: {
      ...commonAggs,
      race: racesAgg,
      sex: sexesAgg,
    },
  },
  donors_by_race: {
    terms: {
      field: 'donor.mapped_metadata.race.keyword',
    },
    aggs: {
      ...commonAggs,
      age: agesAgg,
      sex: sexesAgg,
    },
  },
};

/**
 * Retrieves the number of unique donors, average donor age, and total datasets for the specified datasets.
 * If no datasets are provided, it retrieves the same information for all datasets.
 * @param hubmap_ids - An array of HuBMAP IDs for the datasets to retrieve information for.
 * If not provided, retrieves information for all datasets.
 * @returns An object containing the number of unique donors, average donor age, total datasets, and loading state.
 */
export function useDatasetsOverview(hubmap_ids?: string[]): DatasetsOverviewDigest {
  const query: SearchRequest = useMemo(() => {
    if (hubmap_ids) {
      return {
        size: 0,
        query: {
          bool: {
            ...includeOnlyDatasetsClause.bool,
            filter: [
              {
                terms: {
                  'hubmap_id.keyword': hubmap_ids,
                },
              },
            ],
          },
        },
        aggs,
      };
    }
    return {
      size: 0,
      query: includeOnlyDatasetsClause,
      aggs,
    };
  }, [hubmap_ids]);

  const { searchData, isLoading } = useSearchData<unknown, DatasetsOverviewAggs>(query);

  if (!searchData?.aggregations) {
    return {
      totalDonors: 0,
      averageDonorAge: 0,
      totalDatasets: 0,
      maleDonors: 0,
      femaleDonors: 0,
      isLoading,
    };
  }

  const fullAggs = searchData.aggregations;

  const totalDonors = fullAggs.unique_donors.value ?? 0;
  const averageDonorAge = fullAggs.average_donor_age.value ?? 0;
  const totalDatasets = fullAggs.total_datasets.value ?? 0;
  const maleDonors = fullAggs.donors_by_sex.buckets.find((bucket) => bucket.key === 'Male')?.donor_count?.value ?? 0;
  const femaleDonors =
    fullAggs.donors_by_sex.buckets.find((bucket) => bucket.key === 'Female')?.donor_count?.value ?? 0;

  return {
    fullAggs,
    totalDonors,
    averageDonorAge,
    totalDatasets,
    maleDonors,
    femaleDonors,
    isLoading,
  };
}

const getAllRaces = (overview: DatasetsOverviewDigest) => {
  return overview.fullAggs?.donors_by_race.buckets.map((bucket) => bucket.key) ?? [];
};

const getAllSexes = (overview: DatasetsOverviewDigest) => {
  return overview.fullAggs?.donors_by_sex.buckets.map((bucket) => bucket.key) ?? [];
};

const getYValue = (yAxis: YAxisOptions, item?: { doc_count: number; donor_count: { value: number } }) => {
  if (!item) {
    return 0;
  }
  return yAxis === 'Datasets' ? item.doc_count : item.donor_count.value;
};

export interface FormattedOverviewChartData {
  match: number;
  unmatched: number;
  xAxisKey: string;
  group: string | number;
}

interface NestedBucket {
  buckets: {
    key: string | number;
    doc_count: number;
    donor_count: {
      value: number;
    };
  }[];
}

const getFormattedDataFromBuckets = (
  matchBucket: NestedBucket | undefined,
  comparisonBucket: NestedBucket | undefined,
  yAxis: YAxisOptions,
  axisKey: string,
): FormattedOverviewChartData[] => {
  // If no comparison bucket is found, return an empty array
  if (!comparisonBucket) {
    return [];
  }
  // If no match bucket is found but a comparison bucket is present,
  // Then we still need to return the comparison bucket data.

  const compareByKeys = new Set<string | number>();
  matchBucket?.buckets.forEach((b) => compareByKeys.add(b.key));
  comparisonBucket.buckets.forEach((b) => compareByKeys.add(b.key));

  return [...compareByKeys].map((key: string | number) => {
    const matchCount = getYValue(
      yAxis,
      matchBucket?.buckets.find((b) => b.key === key),
    );
    const unmatchedCount = getYValue(
      yAxis,
      comparisonBucket.buckets.find((b) => b.key === key),
    );
    return {
      match: matchCount,
      unmatched: unmatchedCount - matchCount,
      axisKey,
      group: key,
    };
  });
};

/**
 * Function for formatting the scFind result data to enable comparison between a subset of matched datasets
 * and the full set of datasets (either all indexed datasets or all datasets in HuBMAP)
 * @param matches The DatasetsOverviewType object containing the matched datasets
 * @param comparison The DatasetsOverviewType object containing the comparison datasets (either all indexed datasets or all datasets in HuBMAP)
 * @param xAxis The xAxis option to use for the chart (metadata such as age, sex, race)
 * @param yAxis The yAxis option to use for the chart (number of datasets or number of donors)
 * @param compareBy The xAxis option to use for the comparison between different values on the x axis (metadata such as age, sex, or race)
 * @returns
 */
export function useFormattedOverviewChartData(
  matches: DatasetsOverviewDigest,
  comparison: DatasetsOverviewDigest,
  xAxis: XAxisOptions,
  yAxis: YAxisOptions,
  compareBy: XAxisOptions,
): {
  data: Record<XAxisOptions, BarStackGroup<FormattedOverviewChartData[]>;
  max: number;
} {
  const [data, max] = useMemo(() => {
    const formattedData: Record<XAxisOptions, FormattedOverviewChartData[]> = {
      Age: [],
      Sex: [],
      Race: [],
    };
    let maxCount = 0;

    const compareByLowercase = compareBy.toLowerCase() as 'age' | 'race' | 'sex';

    if (matches.fullAggs && comparison.fullAggs) {
      X_AXIS_OPTIONS.forEach((axis) => {
        switch (axis) {
          case 'Age':
            ageBuckets.forEach((bucket) => {
              const compareBySafe = compareByLowercase as 'race' | 'sex';
              const matchBucket = matches.fullAggs!.donors_by_age.buckets.find(
                (b) => Number(b.key) === Number(bucket),
              )?.[compareBySafe];
              const comparisonBucket = comparison.fullAggs!.donors_by_age.buckets.find(
                (b) => Number(b.key) === Number(bucket),
              )?.[compareBySafe];
              formattedData[axis].push(
                ...getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, labeledAgeBuckets[bucket]),
              );
            });
            maxCount = Math.max(...comparison.fullAggs!.donors_by_age.buckets.map((b) => b.doc_count), maxCount);
            break;

          case 'Race':
            getAllRaces(comparison).forEach((race) => {
              const compareBySafe = compareByLowercase as 'age' | 'sex';
              const matchBucket = matches.fullAggs!.donors_by_race.buckets.find((b) => b.key === race)?.[compareBySafe];
              const comparisonBucket = comparison.fullAggs!.donors_by_race.buckets.find((b) => b.key === race)?.[
                compareBySafe
              ];
              formattedData[axis].push(...getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, race));
            });
            maxCount = Math.max(...comparison.fullAggs!.donors_by_race.buckets.map((b) => b.doc_count), maxCount);
            break;
          case 'Sex':
            getAllSexes(comparison).forEach((sex) => {
              const compareBySafe = compareByLowercase as 'age' | 'race';
              const matchBucket = matches.fullAggs!.donors_by_sex.buckets.find((b) => b.key === sex)?.[compareBySafe];
              const comparisonBucket = comparison.fullAggs!.donors_by_sex.buckets.find((b) => b.key === sex)?.[
                compareBySafe
              ];
              formattedData[axis].push(...getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, sex));
            });
            maxCount = Math.max(...comparison.fullAggs!.donors_by_sex.buckets.map((b) => b.doc_count), maxCount);
            break;
          default:
            break;
        }
      });
    }
    return [formattedData, maxCount];
  }, [matches, comparison, yAxis, compareBy]);

  return {
    data,
    max,
  };
}
