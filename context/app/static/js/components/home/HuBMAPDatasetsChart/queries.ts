import { includeOnlyDatasetsClause } from 'js/helpers/queries';

import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { getOrganTypesCompositeAggsQuery } from 'js/shared-styles/charts/HorizontalStackedBarChart/utils';

// Query for looking up the list of organs for the Y axis
const organTypesQuery = {
  size: 0,
  query: includeOnlyDatasetsClause,
  aggs: {
    organ_types: { terms: { field: 'origin_samples.mapped_organ.keyword', size: 10000 } },
  },
};

interface OrganTypesQueryAggs {
  organ_types: {
    buckets: {
      doc_count: number;
      key: string;
    }[];
  };
}

// Query for looking up the mapping of dataset types to assay display names
const datasetTypeMapQuery: SearchRequest = {
  size: 0,
  query: includeOnlyDatasetsClause,
  aggs: {
    dataset_type_map: {
      aggs: {
        raw_dataset_type: {
          aggs: {
            assay_display_name: {
              terms: {
                field: 'assay_display_name.keyword',
                order: {
                  _term: 'asc',
                },
                size: 10000,
              },
            },
          },
          terms: {
            field: 'raw_dataset_type.keyword',
            order: {
              _term: 'asc',
            },
            size: 10000,
          },
        },
      },
      filter: {
        term: {
          'entity_type.keyword': 'Dataset',
        },
      },
    },
  },
};

interface DatasetTypeMapQueryAggs {
  dataset_type_map: {
    raw_dataset_type: {
      buckets: {
        doc_count: number;
        key: string;
        assay_display_name: {
          buckets: {
            doc_count: number;
            key: string;
          }[];
        };
      }[];
    };
  };
}

// Queries for looking up aggregations for charts
const assayTypeQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('raw_dataset_type.keyword', 'assay_type'),
};
const donorSexQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('donor.mapped_metadata.sex.keyword', 'donor_sex'),
};

const donorRaceQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('donor.mapped_metadata.race.keyword', 'donor_race'),
};

const analyteClassQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('analyte_class.keyword', 'analyte_class'),
};
const processingStatusQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('processing.keyword', 'processing_status'),
};
// const donorAgeQuery: SearchRequest = {
//   query: includeOnlyDatasetsClause,
//   ...getOrganTypesCompositeAggsQuery('donor.mapped_metadata.age', 'donor_age'),
// };

interface QueryAggs<T> {
  organs: {
    buckets: {
      doc_count: number;
      key: T & { organ: string };
    }[];
  };
}

interface AssaysQueryKey {
  assay_type: string;
}

interface DonorSexQueryKey {
  donor_sex: string;
}

interface DonorRaceQueryKey {
  donor_race: string;
}

interface AnalyteClassQueryKey {
  analyte_class: string;
}

interface ProcessingStatusQueryKey {
  processing_status: string;
}

type AssaysQueryAggs = QueryAggs<AssaysQueryKey>;

type DonorSexQueryAggs = QueryAggs<DonorSexQueryKey>;

type DonorRaceQueryAggs = QueryAggs<DonorRaceQueryKey>;

type AnalyteClassQueryAggs = QueryAggs<AnalyteClassQueryKey>;

type ProcessingStatusQueryAggs = QueryAggs<ProcessingStatusQueryKey>;

export {
  organTypesQuery,
  datasetTypeMapQuery,
  assayTypeQuery,
  donorSexQuery,
  donorRaceQuery,
  analyteClassQuery,
  processingStatusQuery,
};
export type {
  OrganTypesQueryAggs,
  DatasetTypeMapQueryAggs,
  AssaysQueryAggs,
  DonorSexQueryAggs,
  DonorRaceQueryAggs,
  AnalyteClassQueryAggs,
  ProcessingStatusQueryAggs,
  QueryAggs,
  AssaysQueryKey,
  DonorSexQueryKey,
  DonorRaceQueryKey,
  AnalyteClassQueryKey,
  ProcessingStatusQueryKey,
};
