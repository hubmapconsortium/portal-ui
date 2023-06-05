import { useState } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import { buildPublicationsSeparatedByStatus } from './utils';

const getAllPublicationsQuery = {
  post_filter: { term: { 'entity_type.keyword': 'Publication' } },
  size: 10000,
  _source: ['uuid', 'title', 'contributors', 'publication_status', 'publication_venue', 'publication_date'],
};

function usePublications() {
  const { searchHits: publications } = useSearchHits(getAllPublicationsQuery);

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenTabIndex(newIndex);
  };

  const publicationsPanelsPropsSeparatedByStatus = buildPublicationsSeparatedByStatus(publications);

  return {
    publicationsPanelsPropsSeparatedByStatus,
    publicationsCount: publications.length,
    openTabIndex,
    handleChange,
  };
}

export { usePublications };
