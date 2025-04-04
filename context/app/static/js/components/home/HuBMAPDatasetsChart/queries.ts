import { includeOnlyDatasetsClause } from 'js/helpers/queries';
import { useState } from 'react';

import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

// Query for looking up the list of organs for the Y axis
const organTypesQuery = {
  size: 0,
  query: includeOnlyDatasetsClause,
  aggs: {
    organ_types: {
      terms: {
        field: 'origin_samples.mapped_organ.keyword',
        size: 10000,
      },
      aggs: {
        unique_donor_count: {
          cardinality: {
            field: 'donor.uuid.keyword',
          },
        },
      },
    },
  },
};

interface OrganTypesQueryAggs {
  organ_types: {
    buckets: {
      doc_count: number;
      key: string;
      unique_donor_count: {
        value: number;
      };
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
function getOrganTypesCompositeAggs([field, key]: [string, string]): SearchRequest {
  return {
    size: 0,
    aggs: {
      organs: {
        composite: {
          sources: [
            {
              organ: {
                terms: {
                  field: 'origin_samples.mapped_organ.keyword',
                },
              },
            },
            {
              [key]: {
                terms: {
                  field,
                },
              },
            },
          ],
          size: 10000,
        },
        aggs: {
          donor_uuids: {
            terms: {
              field: 'donor.uuid.keyword',
              size: 10000,
            },
          },
        },
      },
    },
  };
}

// Queries for looking up aggregations for charts
const assayTypeQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggs(['raw_dataset_type.keyword', 'assay_type']),
};
const donorSexQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggs(['donor.mapped_metadata.sex.keyword', 'donor_sex']),
};

const donorRaceQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggs(['donor.mapped_metadata.race.keyword', 'donor_race']),
};

const analyteClassQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggs(['analyte_class.keyword', 'analyte_class']),
};
const processingStatusQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggs(['processing.keyword', 'processing_status']),
};
// const donorAgeQuery: SearchRequest = {
//   query: includeOnlyDatasetsClause,
//   ...getOrganTypesCompositeAggsQuery('donor.mapped_metadata.age', 'donor_age'),
// };

export const SELECTED_ENTITY_TYPES = ['Dataset', 'Donor'] as const;

type SelectedEntityType = (typeof SELECTED_ENTITY_TYPES)[number];

export const useSelectedEntityType = () => {
  const [selectedEntityType, setSelectedEntityType] = useState<SelectedEntityType>('Dataset');
  return {
    selectedEntityType,
    setSelectedEntityType,
  };
};

interface QueryAggs<T> {
  organs: {
    buckets: {
      doc_count: number;
      key: T & { organ: string };
      donor_uuids: {
        buckets: {
          doc_count: number;
          key: string;
        }[];
      };
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
