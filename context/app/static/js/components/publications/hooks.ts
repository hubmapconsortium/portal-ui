import { useMemo, useState } from 'react';
import { ContributorAPIResponse } from 'js/components/detailPage/ContributorsTable/utils';
import { useSearchHits } from 'js/hooks/useSearchData';
import { useDownloadTable } from 'js/helpers/download';
import { usePublicationsSearchState } from 'js/components/publications/PublicationsSearchContext';
import { useEventCallback } from '@mui/material/utils';

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

  const filteredPublications = useMemo(() => {
    return publications
      .filter((item) => item.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime());
  }, [publications, search]);

  const publicationsByStatus = useMemo(() => {
    const preprints = filteredPublications.filter((pub) => !pub.publication_status);
    const reviewed = filteredPublications.filter((pub) => pub.publication_status);

    return [
      { status: 'Peer-Reviewed', relevantPublications: reviewed },
      { status: 'Preprint', relevantPublications: preprints },
    ];
  }, [filteredPublications]);

  const downloadTable = useDownloadTable({
    fileName: 'publications.tsv',
    columnNames: ['Title', 'Contributors', 'Publication Venue', 'Published Date'],
    rows: useMemo(() => {
      return publications.map(({ title, contributors, publication_venue, publication_date }) => {
        const contributorsList = contributors
          ? contributors.map(({ first_name, last_name }) => `${first_name} ${last_name}`).join(', ')
          : '';
        return [title, contributorsList, publication_venue, publication_date];
      });
    }, [publications]),
  });

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const handleTabChange = useEventCallback((_: Event, newIndex: number) => {
    setOpenTabIndex(newIndex);
  });

  return {
    isLoading,
    filteredPublications,
    publicationsByStatus,
    openTabIndex,
    handleTabChange,
    downloadTable,
  };
}

export { usePublications };
