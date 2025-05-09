import { ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useDownloadTable } from 'js/helpers/download';
import { usePublicationsSearchState } from 'js/components/publications/PublicationsSearchContext';

export interface Publication {
  uuid: string;
  title: string;
  publication_status: string;
  publication_venue: string;
  publication_date: string;
  contributors?: ContributorAPIResponse[];
}

const query = {
  query: {
    bool: {
      must: [
        {
          term: {
            'entity_type.keyword': 'Publication',
          },
        },
      ],
    },
  },
  size: 10000,
  _source: ['uuid', 'publication_status', 'title', 'contributors', 'publication_venue', 'publication_date'],
};

export function usePublicationHits() {
  const { searchHits, isLoading } = useSearchHits<Publication>(query);
  const publications = searchHits.map((hit) => hit._source);

  return { publications, isLoading };
}

function usePublications() {
  const { publications = [], isLoading } = usePublicationHits();
  const search = usePublicationsSearchState();

  const downloadTable = useDownloadTable({
    fileName: 'publications.tsv',
    columnNames: ['Title', 'Contributors', 'Publication Venue', 'Published Date'],
    rows: publications.map(({ title, contributors, publication_venue, publication_date }) => {
      const contributorsList = contributors
        ? contributors.map(({ first_name, last_name }) => `${first_name} ${last_name}`).join(', ')
        : '';
      return [title, contributorsList, publication_venue, publication_date];
    }),
  });

  const filteredPublications = publications
    .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());

  return {
    publications,
    filteredPublications,
    isLoading,
    downloadTable,
  };
}

export { usePublications };
