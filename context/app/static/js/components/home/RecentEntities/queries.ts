import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { includeOnlyDatasetsClause } from 'js/helpers/queries';

export const recentPublicationsQuery: SearchRequest = {
  query: {
    bool: {
      must: [
        {
          bool: {
            must: [
              {
                term: {
                  'entity_type.keyword': 'Publication',
                },
              },
              {
                term: {
                  publication_status: 'true',
                },
              },
            ],
          },
        },
        {
          bool: {
            must_not: [
              {
                exists: {
                  field: 'next_revision_uuid',
                },
              },
              {
                exists: {
                  field: 'sub_status',
                },
              },
            ],
          },
        },
      ],
    },
  },
  sort: [
    {
      last_modified_timestamp: {
        order: 'desc',
      },
    },
  ],
  size: 6,
  _source: [
    'uuid',
    'title',
    'contributors',
    'publication_status',
    'publication_venue',
    'publication_date',
    'last_modified_timestamp',
  ],
};

// Fetches the most recent datasets with a visualization
export const recentDatasetsQuery: SearchRequest = {
  size: 0,
  query: includeOnlyDatasetsClause,
  sort: [
    {
      last_modified_timestamp: 'desc',
    },
  ],
  aggs: {
    unique_dataset_types: {
      terms: {
        field: 'dataset_type.keyword',
        size: 100,
      },
      aggs: {
        latest_datasets: {
          top_hits: {
            _source: {
              includes: [
                'uuid',
                'title',
                'hubmap_id',
                'group_name',
                'last_modified_timestamp',
                'dataset_type',
                'visualization',
                'origin_samples_unique_mapped_organs',
              ],
            },
            size: 5, // Include more than one dataset per type to account for logged out case where less than 6 total datasets may be returned
          },
        },
      },
    },
  },
};
