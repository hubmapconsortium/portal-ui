import { includeOnlyDatasetsClause } from 'js/helpers/queries';

import type { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { getOrganTypesCompositeAggsQuery } from 'js/shared-styles/charts/HorizontalStackedBarChart/utils';

const organTypesQuery = {
  size: 0,
  aggs: {
    organ_types: { terms: { field: 'origin_samples.mapped_organ.keyword', size: 10000 } },
  },
};

const techniquesQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('dataset_type.keyword', 'dataset_type'),
};
const donorSexQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('donor.mapped_metadata.sex.keyword', 'donor_sex'),
};
const molecularEntityQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('analyte_class.keyword', 'molecular_entity'),
};
const processingStatusQuery: SearchRequest = {
  query: includeOnlyDatasetsClause,
  ...getOrganTypesCompositeAggsQuery('processing.keyword', 'processing_status'),
};

// const filterOutDataTypesWithBracket = (bucket) => !bucket.key.dataset_type.includes('[');

interface QueryAggs<T> {
  organs: {
    buckets: {
      doc_count: number;
      key: T & { organ: string };
    }[];
  };
}

interface TechniquesQueryKey {
  dataset_type: string;
}

interface DonorSexQueryKey {
  donor_sex: string;
}

interface MolecularEntityQueryKey {
  molecular_entity: string;
}

interface ProcessingStatusQueryKey {
  processing_status: string;
}

type TechniquesQueryAggs = QueryAggs<TechniquesQueryKey>;

type DonorSexQueryAggs = QueryAggs<DonorSexQueryKey>;

type MolecularEntityQueryAggs = QueryAggs<MolecularEntityQueryKey>;

type ProcessingStatusQueryAggs = QueryAggs<ProcessingStatusQueryKey>;

export { organTypesQuery, techniquesQuery, donorSexQuery, molecularEntityQuery, processingStatusQuery };
export type {
  TechniquesQueryAggs,
  DonorSexQueryAggs,
  MolecularEntityQueryAggs,
  ProcessingStatusQueryAggs,
  QueryAggs,
  TechniquesQueryKey,
  DonorSexQueryKey,
  MolecularEntityQueryKey,
  ProcessingStatusQueryKey,
};
