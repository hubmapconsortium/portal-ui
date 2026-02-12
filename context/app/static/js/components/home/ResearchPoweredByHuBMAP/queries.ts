import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';

export const homepagePublicationsQuery: SearchRequest = {
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
  _source: ['uuid', 'title', 'contributors', 'publication_status', 'publication_venue', 'publication_date'],
  size: 20,
};
