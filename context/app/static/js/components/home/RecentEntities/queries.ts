export const recentPublicationsQuery = {
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
export const recentDatasetsQuery = {
  size: 0,
  query: {
    bool: {
      filter: {
        term: {
          visualization: 'true',
        },
      },
    },
  },
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
              includes: ['uuid', 'group_name', 'last_modified_timestamp', 'dataset_type', 'visualization'],
            },
            size: 1,
          },
        },
      },
    },
  },
};
