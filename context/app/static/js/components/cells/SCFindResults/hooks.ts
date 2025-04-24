import useFindDatasetsForCellTypes from 'js/api/scfind/useFindDatasetForCellTypes';
import { useMemo } from 'react';
import { SearchRequest, AggregationsAggregationContainer } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import useSearchData from 'js/hooks/useSearchData';
import { useCellVariableNames } from '../MolecularDataQueryForm/hooks';

export function useSCFindCellTypeResults() {
  const cellVariableNames = useCellVariableNames();

  // The index of the dataset results matches the index of the cell types
  // in the original cellVariableNames array.
  const datasetsWithCellTypes = useFindDatasetsForCellTypes({
    cellTypes: cellVariableNames,
  });

  const { data = [], ...rest } = datasetsWithCellTypes;

  // Map datasets to the cell type they contain
  const datasets = useMemo(() => {
    return cellVariableNames.reduce(
      (acc, cellType, index) => {
        const dataset = data[index];
        if (dataset) {
          acc[cellType] = dataset.datasets.map((d) => ({
            hubmap_id: d,
          }));
        }
        return acc;
      },
      {} as Record<string, { hubmap_id: string }[]>,
    );
  }, [data, cellVariableNames]);

  return { datasets, ...rest };
}

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
    aggs: {
      count: {
        cardinality: {
          field: 'donor.uuid.keyword',
        },
      },
    },
  },
  female_donors: {
    filter: {
      term: {
        'donor.mapped_metadata.sex.keyword': 'Female',
      },
    },
    aggs: {
      count: {
        cardinality: {
          field: 'donor.uuid.keyword',
        },
      },
    },
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

interface DatasetsOverviewResponse {
  unique_donors: {
    value: number;
  };
  average_donor_age: {
    value: number;
  };
  total_datasets: {
    value: number;
  };
  male_donors: {
    count: {
      value: number;
    };
  };
  female_donors: {
    count: {
      value: number;
    };
  };
}

export interface DatasetsOverviewType {
  totalDonors: number;
  averageDonorAge: number;
  totalDatasets: number;
  isLoading: boolean;
  maleDonors: number;
  femaleDonors: number;
}

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

  const { searchData, isLoading } = useSearchData<unknown, DatasetsOverviewResponse>(query);

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
