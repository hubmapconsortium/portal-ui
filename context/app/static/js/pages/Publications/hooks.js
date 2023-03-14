import { useState } from 'react';

import { useSearchHits } from 'js/hooks/useSearchData';
import { buildPublicationPanelProp } from './utils';

const getAllPublicationsQuery = {
  post_filter: { term: { 'entity_type.keyword': 'Publication' } },
  size: 10000,
};

const publicationStatusMap = {
  true: 'published',
  false: 'preprint',
};

function usePublications() {
  const { searchHits: publications } = useSearchHits(getAllPublicationsQuery);

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenTabIndex(newIndex);
  };

  const publicationsPanelsPropsSeparatedByStatus = publications.reduce(
    (acc, publication) => {
      const {
        _source: { publication_status },
      } = publication;

      if (!publication_status) {
        return acc;
      }

      acc[publicationStatusMap[publication_status]].push(buildPublicationPanelProp(publication));
      return acc;
    },
    { published: [], preprint: [] },
  );

  return {
    publicationsPanelsPropsSeparatedByStatus,
    publicationsCount: publications.length,
    openTabIndex,
    handleChange,
  };
}

export { usePublications };
