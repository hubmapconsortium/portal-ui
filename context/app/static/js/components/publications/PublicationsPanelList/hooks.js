import { useMemo } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import { buildPublicationPanelProps } from './utils';

const getPublicationsByStatusQuery = (publicationStatus) => ({
  query: {
    bool: {
      must: [
        {
          term: {
            'entity_type.keyword': 'Publication',
          },
        },
        {
          term: {
            publication_status: publicationStatus,
          },
        },
      ],
    },
  },
  size: 10000,
  _source: ['uuid', 'title', 'contributors', 'publication_status', 'publication_venue', 'publication_date'],
});

function usePublicationsPanelList(publicationStatus) {
  const query = useMemo(() => getPublicationsByStatusQuery(publicationStatus), [publicationStatus]);

  const { searchHits, isLoading } = useSearchHits(query);

  const publicationPanelsProps = searchHits.map((publicationHit) => buildPublicationPanelProps(publicationHit));

  return { publicationPanelsProps, isLoading };
}

export { usePublicationsPanelList };
