import { useMemo, useState } from 'react';
import { AggregationsAggregationContainer, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import useSearchData from 'js/hooks/useSearchData';
import { decimal, percent } from 'js/helpers/number-format';
import { BarStackGroup } from 'js/shared-styles/charts/VerticalStackedBarChart/VerticalGroupedStackedBarChart';

export const Y_AXIS_OPTIONS = ['Datasets', 'Donors'] as const;
export type YAxisOptions = (typeof Y_AXIS_OPTIONS)[number];

export const X_AXIS_OPTIONS = ['Age', 'Race', 'Sex', 'Organ'] as const;
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
  organ: {
    buckets: {
      key: string;
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
  donors_by_organ: {
    buckets: Omit<NestedDonorBuckets, 'organ'>[];
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

const organsAgg: AggregationsAggregationContainer = {
  terms: {
    field: 'origin_samples_unique_mapped_organs.keyword',
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
      organ: organsAgg,
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
      organ: organsAgg,
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
      organ: organsAgg,
      age: agesAgg,
      sex: sexesAgg,
    },
  },
  donors_by_organ: {
    terms: {
      field: 'origin_samples_unique_mapped_organs.keyword',
    },
    aggs: {
      ...commonAggs,
      race: racesAgg,
      sex: sexesAgg,
      age: agesAgg,
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

const createOverviewRow = (label: string, matched: number, indexed: number, all: number, noPercentage?: boolean) => {
  return {
    label,
    matched: decimal.format(matched),
    indexed: decimal.format(indexed),
    matchedIndexed: noPercentage ? '\u2014' : percent.format(matched / indexed),
    all: decimal.format(all),
    matchedAll: noPercentage ? '\u2014' : percent.format(matched / all),
  };
};

export const useFormattedRows = (
  matched: DatasetsOverviewDigest,
  indexed: DatasetsOverviewDigest,
  all: DatasetsOverviewDigest,
) => {
  const rows = useMemo(() => {
    return [
      createOverviewRow('Datasets', matched.totalDatasets, indexed.totalDatasets, all.totalDatasets),
      createOverviewRow('Unique Donors', matched.totalDonors, indexed.totalDonors, all.totalDonors),
      createOverviewRow(
        'Average Donor Age (Years)',
        matched.averageDonorAge,
        indexed.averageDonorAge,
        all.averageDonorAge,
        true,
      ),
      createOverviewRow('Male Donors', matched.maleDonors, indexed.maleDonors, all.maleDonors),
      createOverviewRow('Female Donors', matched.femaleDonors, indexed.femaleDonors, all.femaleDonors),
    ];
  }, [indexed, matched, all]);

  return rows;
};

export interface DatasetOverviewRow {
  label: string;
  matched: string;
  indexed: string;
  matchedIndexed: string;
  all: string;
  matchedAll: string;
}

export const useDownloadableRows = (rows: DatasetOverviewRow[]) => {
  return rows.map((row) => {
    return [row.label, row.matched, row.indexed, row.matchedIndexed, row.all, row.matchedAll];
  });
};

const getAllRaces = (overview: DatasetsOverviewDigest) => {
  return overview.fullAggs?.donors_by_race.buckets.map((bucket) => bucket.key) ?? [];
};

const getAllSexes = (overview: DatasetsOverviewDigest) => {
  return overview.fullAggs?.donors_by_sex.buckets.map((bucket) => bucket.key) ?? [];
};

const getAllOrgans = (overview: DatasetsOverviewDigest) => {
  return overview.fullAggs?.donors_by_organ.buckets.map((bucket) => bucket.key) ?? [];
};

interface CountBucket {
  doc_count: number;
  donor_count: {
    value: number;
  };
}

/**
 * Extracts the donor or dataset count from the provided object based on the yAxis option.
 * @param yAxis The yAxis option to determine whether to return the number of datasets or donors.
 * @param item  An object containing the counts for datasets and donors.
 * @returns The count of datasets or donors based on the yAxis option.
 * If the item is undefined, it returns 0.
 */
const getYValue = (yAxis: YAxisOptions, item?: CountBucket) => {
  if (!item) {
    return 0;
  }
  return yAxis === 'Datasets' ? item.doc_count : item.donor_count.value;
};

export type FormattedOverviewChartData = BarStackGroup<'matched' | 'unmatched', string, string>;

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
  isAge = false,
  isPercentage = false,
): FormattedOverviewChartData['stacks'] => {
  // If no comparison bucket is found, return an empty array
  if (!comparisonBucket) {
    return {};
  }

  // If no match bucket is found but a comparison bucket is present,
  // Then we still need to return the comparison bucket data.

  // Compile a list of values to compare across both match and comparison buckets
  const compareByKeys = new Set<string>();
  matchBucket?.buckets.forEach((b) => compareByKeys.add(String(b.key)));
  comparisonBucket.buckets.forEach((b) => compareByKeys.add(String(b.key)));

  const toReturn = [...compareByKeys].reduce<FormattedOverviewChartData['stacks']>((acc, group) => {
    const matched = getYValue(
      yAxis,
      matchBucket?.buckets.find((b) => String(b.key) === String(group)),
    );
    const unmatched = getYValue(
      yAxis,
      comparisonBucket.buckets.find((b) => String(b.key) === String(group)),
    );

    if (isPercentage) {
      if (unmatched === 0) {
        acc[group] = { matched: 0, unmatched: 0 }; // Avoid division by zero
      } else {
        acc[group] = {
          matched: matched / unmatched,
          unmatched: (unmatched - matched) / unmatched,
        };
      }
    } else {
      acc[group] = {
        matched,
        unmatched: unmatched - matched,
      };
    }

    return acc;
  }, {});

  // If the comparison is by age, we need to ensure that the keys are remapped to the labeled age buckets
  if (isAge) {
    const remapped: FormattedOverviewChartData['stacks'] = {};
    Object.entries(toReturn).forEach(([key, value]) => {
      const newKey = labeledAgeBuckets[key as AgeBucket] ?? String(key);
      remapped[newKey] = value;
    });
    return remapped;
  }

  return toReturn;
};

interface OverviewChartData {
  max: number;
  data: FormattedOverviewChartData[];
}

type LowercaseXAxisOptions = 'age' | 'race' | 'sex' | 'organ';

/**
 * Function for formatting the scFind result data to enable comparison between a subset of matched datasets
 * and the full set of datasets (either all indexed datasets or all datasets in HuBMAP)
 * @param matches The DatasetsOverviewType object containing the matched datasets
 * @param comparison The DatasetsOverviewType object containing the comparison datasets (either all indexed datasets or all datasets in HuBMAP)
 * @param xAxis The xAxis option to use for the chart (metadata such as age, sex, race). Depending on which xAxis value is selected,
 *               the data will be grouped by that metadata.
 * @param yAxis The yAxis option to use for the chart (number of datasets or number of donors)
 *              If 'Datasets' is selected, the yAxis will represent the number of datasets in each bucket.
 *              If 'Donors' is selected, the yAxis will represent the number of donors in each bucket.
 * @param compareBy The xAxis option to use for the comparison between different values on the x axis (metadata such as age, sex, or race).
 *                  Becomes the `group` in the returned data.
 * @returns {
 *  data: Record<string, BarStackGroup<FormattedOverviewChartData[]>>,
 *  max: number - The maximum value across all buckets for the yAxis
 * }
 */
export function useFormattedOverviewChartData(
  matches: DatasetsOverviewDigest,
  comparison: DatasetsOverviewDigest,
  xAxis: XAxisOptions,
  yAxis: YAxisOptions,
  compareBy: XAxisOptions,
  isPercentage = false,
): OverviewChartData {
  const [data, max] = useMemo(() => {
    const formattedData: FormattedOverviewChartData[] = [];

    const xAxisLowercase = xAxis.toLowerCase() as LowercaseXAxisOptions;
    const compareByLowercase = compareBy.toLowerCase() as LowercaseXAxisOptions;

    if (!matches.fullAggs || !comparison.fullAggs) {
      return [formattedData, 0];
    }

    const matchAggs = matches.fullAggs;
    const comparisonAggs = comparison.fullAggs;

    const findMax = (bucket: Pick<NestedDonorBuckets, 'doc_count' | 'donor_count'>) => {
      return yAxis === 'Datasets' ? bucket.doc_count : bucket.donor_count.value;
    };

    const compareByIsAge = compareByLowercase === 'age';

    switch (xAxis) {
      case 'Age':
        ageBuckets.forEach((bucket) => {
          // Use a type assertion to ensure the key is treated as a valid assignment for the current bucket type
          const compareBySafe = compareByLowercase as 'race' | 'sex';
          // Find the matching bucket in both match and comparison datasets
          // and extract the relevant data for the specified compareBy
          // If the bucket is not found, it will be undefined, which is handled in getFormattedDataFromBuckets
          const findAgeBucket = (b: NestedBucket['buckets'][number]) => Number(b.key) === Number(bucket);
          const matchBucket = matchAggs.donors_by_age.buckets.find(findAgeBucket)?.[compareBySafe];
          const comparisonBucket = comparisonAggs.donors_by_age.buckets.find(findAgeBucket)?.[compareBySafe];
          const newData = {
            group: labeledAgeBuckets[bucket],
            stacks: getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, compareByIsAge, isPercentage),
          };
          formattedData.push(newData);
        });
        break;

      case 'Race':
        getAllRaces(comparison).forEach((race) => {
          const compareBySafe = compareByLowercase as 'age' | 'sex' | 'organ';
          const findRaceBucket = (b: NestedBucket['buckets'][number]) => b.key === race;
          const matchBucket = matchAggs.donors_by_race.buckets.find(findRaceBucket)?.[compareBySafe];
          const comparisonBucket = comparisonAggs.donors_by_race.buckets.find(findRaceBucket)?.[compareBySafe];

          formattedData.push({
            group: race,
            stacks: getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, compareByIsAge, isPercentage),
          });
        });
        break;
      case 'Sex':
        getAllSexes(comparison).forEach((sex) => {
          const compareBySafe = compareByLowercase as 'age' | 'race' | 'organ';
          const findSexBucket = (b: NestedBucket['buckets'][number]) => b.key === sex;
          const matchBucket = matchAggs.donors_by_sex.buckets.find(findSexBucket)?.[compareBySafe];
          const comparisonBucket = comparisonAggs.donors_by_sex.buckets.find(findSexBucket)?.[compareBySafe];

          formattedData.push({
            group: sex,
            stacks: getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, compareByIsAge, isPercentage),
          });
        });
        break;
      case 'Organ':
        getAllOrgans(comparison).forEach((organ) => {
          const compareBySafe = compareByLowercase as 'age' | 'race' | 'sex';
          const findOrganBucket = (b: NestedBucket['buckets'][number]) => b.key === organ;
          const matchBucket = matchAggs.donors_by_organ.buckets.find(findOrganBucket)?.[compareBySafe];
          const comparisonBucket = comparisonAggs.donors_by_organ.buckets.find(findOrganBucket)?.[compareBySafe];
          formattedData.push({
            group: organ,
            stacks: getFormattedDataFromBuckets(matchBucket, comparisonBucket, yAxis, compareByIsAge, isPercentage),
          });
        });
        break;
      default:
        break;
    }

    const compareByAggs = (comparison.fullAggs?.[`donors_by_${compareByLowercase}`]?.buckets ?? []).flatMap((b) => {
      if (xAxisLowercase === 'age' && 'age' in b) {
        const ageBucket = b as { age: NestedBucket };
        return ageBucket.age.buckets;
      }
      if (xAxisLowercase === 'race' && 'race' in b) {
        const raceBucket = b as { race: NestedBucket };
        return raceBucket.race.buckets;
      }
      if (xAxisLowercase === 'sex' && 'sex' in b) {
        const sexBucket = b as { sex: NestedBucket };
        return sexBucket.sex.buckets;
      }

      if (xAxisLowercase === 'organ' && 'organ' in b) {
        const organBucket = b as { organ: NestedBucket };
        return organBucket.organ.buckets;
      }

      return [];
    });
    const maxCount = Math.max(...compareByAggs.map(findMax));

    // Every entry in `stacks` must have the same keys
    const allStackKeys = new Set<string>();
    formattedData.forEach((d) => {
      Object.keys(d.stacks).forEach((key) => {
        allStackKeys.add(key);
      });
    });

    const normalizedData = formattedData.map((d) => {
      d.stacks = Object.fromEntries(
        Array.from(allStackKeys).map((key) => {
          return [key, d.stacks[key] || { matched: 0, unmatched: 0 }];
        }),
      );
      // Ensure that the stacks are always present, even if they have no data
      const stacks: Record<string, { matched: number; unmatched: number }> = {};
      Object.entries(d.stacks).forEach(([key, value]) => {
        stacks[key] = { matched: value.matched, unmatched: value.unmatched };
      });
      // Return the normalized data with the stacks
      return { ...d, stacks };
    });

    return [normalizedData, maxCount];
  }, [xAxis, compareBy, matches.fullAggs, comparison, yAxis, isPercentage]);

  return {
    data,
    max,
  };
}
