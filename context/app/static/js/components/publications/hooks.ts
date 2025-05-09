import { ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useDownloadTable } from 'js/helpers/download';
import { format } from 'date-fns/format';

export interface Publication {
  uuid: string;
  title: string;
  contributors: ContributorAPIResponse[];
  status: string;
  publication_venue: string;
  publication_date: string;
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
  _source: ['uuid', 'status', 'title', 'contributors', 'publication_venue', 'publication_date'],
};

export function usePublicationHits() {
  const { searchHits, isLoading } = useSearchHits<Publication>(query);
  const publications = searchHits.map((hit) => hit._source);

  return { publications, isLoading };
}

function usePublications() {
  const { publications, isLoading } = usePublicationHits();

  const downloadTable = useDownloadTable({
    fileName: 'publications.tsv',
    columnNames: ['Title', 'Contributors', 'Publication Venue', 'Published Date'],
    rows: publications.map(({ title, contributors, publication_venue, publication_date }) => {
      const contributorsList = contributors.map(({ first_name, last_name }) => `${first_name} ${last_name}`).join(', ');
      const creationDate = format(new Date(publication_date), 'yyyy-MM-dd').toString();
      return [title, contributorsList, publication_venue, creationDate];
    }),
  });

  return {
    publications,
    isLoading,
    downloadTable,
  };
}

export { usePublications };
