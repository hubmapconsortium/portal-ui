import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

export const getAncestorsQuery = (uuid: string) => ({
  query: {
    bool: {
      must: [
        {
          term: {
            'entity_type.keyword': 'Dataset',
          },
        },
        {
          term: {
            'processing.keyword': 'raw',
          },
        },
        {
          term: {
            descendant_ids: uuid,
          },
        },
        {
          terms: {
            'mapped_status.keyword': ['QA', 'Published'],
          },
        },
        {
          bool: {
            must_not: {
              exists: {
                field: 'next_revision_uuid',
              },
            },
          },
        },
        {
          bool: {
            must_not: {
              exists: {
                field: 'sub_status',
              },
            },
          },
        },
        {
          bool: {
            must_not: {
              term: {
                'ancestors.entity_type.keyword': 'Dataset',
              },
            },
          },
        },
      ],
    },
  },
  _source: {
    includes: ['uuid'],
  },
  size: 10000,
});

export const getDescendantsQuery = (uuid: string | string[]): SearchRequest => ({
  query: {
    bool: {
      must_not: {
        exists: {
          field: 'descendant_ids',
        },
      },
      must: [
        {
          terms: {
            ancestor_ids: uuid,
          },
        },
        {
          terms: {
            'mapped_status.keyword': ['QA', 'Published'],
          },
        },
      ],
    },
  },
  _source: {
    includes: ['uuid'],
  },
  size: 10000,
});
