import { useMemo } from 'react';
import { AggregationsAggregationContainer, SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import useSearchData from 'js/hooks/useSearchData';

export interface DatasetsOverviewType {
  totalDonors: number;
  averageDonorAge: number;
  totalDatasets: number;
  isLoading: boolean;
  maleDonors: number;
  femaleDonors: number;
}

interface NestedDonorAggs {
  count: {
    value: number;
  };
  ages: {
    buckets: {
      key: number;
      doc_count: number;
    }[];
  };
  races: {
    buckets: {
      key: string;
      doc_count: number;
    }[];
  };
}

interface DatasetsOverviewAggs {
  unique_donors: {
    value: number;
  };
  average_donor_age: {
    value: number;
  };
  total_datasets: {
    value: number;
  };
  male_donors: NestedDonorAggs;
  female_donors: NestedDonorAggs;
}

const nestedDonorAggs = {
  count: {
    cardinality: {
      field: 'donor.uuid.keyword',
    },
  },
  ages: {
    histogram: {
      field: 'donor.mapped_metadata.age_value',
      interval: 10,
      min_doc_count: 0,
    },
  },
  races: {
    terms: {
      field: 'donor.mapped_metadata.race.keyword',
    },
  },
};

const aggs: Record<string, AggregationsAggregationContainer> = {
  unique_donors: {
    cardinality: {
      field: 'donor.uuid.keyword',
    },
  },
  male_donors: {
    filter: {
      term: {
        'donor.mapped_metadata.sex.keyword': 'Male',
      },
    },
    aggs: nestedDonorAggs,
  },
  female_donors: {
    filter: {
      term: {
        'donor.mapped_metadata.sex.keyword': 'Female',
      },
    },
    aggs: nestedDonorAggs,
  },
  average_donor_age: {
    avg: {
      field: 'donor.mapped_metadata.age_value',
    },
  },
  total_datasets: {
    cardinality: {
      field: 'hubmap_id.keyword',
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
export function useDatasetsOverview(hubmap_ids?: string[]): DatasetsOverviewType {
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

  const {
    unique_donors: { value: uniqueDonors },
    average_donor_age: { value: averageDonorAge },
    total_datasets: { value: totalDatasets },
    male_donors: {
      count: { value: maleDonors },
    },
    female_donors: {
      count: { value: femaleDonors },
    },
  } = searchData.aggregations ?? {
    unique_donors: { value: 0 },
    average_donor_age: { value: 0 },
    total_datasets: { value: 0 },
    male_donors: {
      count: { value: 0 },
    },
    female_donors: {
      count: { value: 0 },
    },
  };

  return { totalDonors: uniqueDonors, averageDonorAge, totalDatasets, maleDonors, femaleDonors, isLoading };
}
