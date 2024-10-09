import useSearchData from 'js/hooks/useSearchData';
import { fetcher } from 'js/helpers/swr';
import { SearchRequest, SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { buildPublicationPanelProps, PublicationHit } from './utils';

const getPublicationsByStatusQuery: (publicationStatus: string) => SearchRequest = (publicationStatus) => ({
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
  sort: [
    {
      'publication_date.keyword': {
        order: 'desc',
      },
    },
  ],
  size: 10000,
  _source: ['uuid', 'title', 'contributors', 'publication_status', 'publication_venue', 'publication_date'],
});

async function fetchPublicationsPanelData(args: Parameters<typeof fetcher>[0]) {
  const results = await fetcher<SearchResponse<PublicationHit['_source']>>(args);
  const unwrappedResults = results?.hits?.hits.map((hit) => hit._source!);
  if (!unwrappedResults) {
    return [];
  }
  return unwrappedResults.map((hit) => buildPublicationPanelProps({ _source: hit }));
}

function usePublicationsPanelList(publicationStatus: string) {
  const query = getPublicationsByStatusQuery(publicationStatus);

  const { searchData: publicationPanelsProps, isLoading } = useSearchData<PublicationHit, unknown>(query, {
    useDefaultQuery: true,
    fetcher: fetchPublicationsPanelData,
    fallbackData: [],
  });

  return { publicationPanelsProps, isLoading };
}

export { usePublicationsPanelList };
