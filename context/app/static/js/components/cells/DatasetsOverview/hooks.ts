import { useMemo, useState } from 'react';
import { AggregationsAggregationContainer, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import useSearchData from 'js/hooks/useSearchData';
import { decimal, percent } from 'js/helpers/number-format';

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
