import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';

export const datasetTypeForOrganTermsQuery: SearchRequest = {
  size: 0,
  query: includeOnlyDatasetsClause,
  aggs: {
    dataset_type_map: {
      aggs: {
        raw_dataset_type: {
          aggs: {
            organ: {
              terms: {
                field: 'origin_samples.mapped_organ.keyword',
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

export interface DatasetTypeOrganQueryAggs {
  dataset_type_map: {
    raw_dataset_type: {
      buckets: {
        doc_count: number;
        key: string;
        organ: {
          buckets: {
            doc_count: number;
            key: string;
          }[];
        };
      }[];
    };
  };
}
