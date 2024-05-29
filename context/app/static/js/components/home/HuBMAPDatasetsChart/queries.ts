import { includeOnlyDatasetsClause } from 'js/helpers/queries';

import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { getOrganTypesCompositeAggsQuery } from 'js/shared-styles/charts/HorizontalStackedBarChart/utils';

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

const assayTypeQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('raw_dataset_type.keyword', 'assay_type'),
};
const donorSexQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('donor.mapped_metadata.sex.keyword', 'donor_sex'),
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

// const filterOutDataTypesWithBracket = (bucket) => !bucket.key.dataset_type.includes('[');

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

interface AnalyteClassQueryKey {
  analyte_class: string;
}

interface ProcessingStatusQueryKey {
  processing_status: string;
}

type AssaysQueryAggs = QueryAggs<AssaysQueryKey>;

type DonorSexQueryAggs = QueryAggs<DonorSexQueryKey>;

type AnalyteClassQueryAggs = QueryAggs<AnalyteClassQueryKey>;

type ProcessingStatusQueryAggs = QueryAggs<ProcessingStatusQueryKey>;

type HomepageQueryKeys = AssaysQueryKey | DonorSexQueryKey | AnalyteClassQueryKey | ProcessingStatusQueryKey;

export { organTypesQuery, assayTypeQuery, donorSexQuery, analyteClassQuery, processingStatusQuery };
export type {
  OrganTypesQueryAggs,
  AssaysQueryAggs,
  DonorSexQueryAggs,
  AnalyteClassQueryAggs,
  ProcessingStatusQueryAggs,
  QueryAggs,
  AssaysQueryKey,
  DonorSexQueryKey,
  AnalyteClassQueryKey,
  ProcessingStatusQueryKey,
  HomepageQueryKeys,
};
