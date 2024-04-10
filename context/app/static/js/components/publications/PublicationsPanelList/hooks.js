import useSearchData from 'js/hooks/useSearchData';
import { fetcher } from 'js/helpers/swr';
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

async function fetchPublicationsPanelData(args) {
  const results = await fetcher(args);
  return results?.hits?.hits.map((publicationHit) => buildPublicationPanelProps(publicationHit));
}

function usePublicationsPanelList(publicationStatus) {
  const query = getPublicationsByStatusQuery(publicationStatus);

  const { searchData: publicationPanelsProps, isLoading } = useSearchData(query, {
    useDefaultQuery: true,
    fetcher: fetchPublicationsPanelData,
    fallbackData: [],
  });

  return { publicationPanelsProps, isLoading };
}

export { usePublicationsPanelList };
