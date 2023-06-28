import { useState } from 'react';

import useSearchData from 'js/hooks/useSearchData';
import { countPublicationAggs } from './utils';

const publicationsStatusAggsQuery = {
  query: { term: { 'entity_type.keyword': 'Publication' } },
  aggs: {
    publication_status: {
      terms: {
        field: 'publication_status',
      },
    },
  },
  size: 0,
};

function usePublicationStatusAggs() {
  const { searchData, isLoading } = useSearchData(publicationsStatusAggsQuery);
  const publicationsStatusBuckets = searchData?.aggregations?.publication_status?.buckets || [];

  const publicationsCounts = countPublicationAggs(publicationsStatusBuckets);

  return { publicationsCounts, isLoading };
}

function usePublications() {
  const { publicationsCounts } = usePublicationStatusAggs();

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenTabIndex(newIndex);
  };

  return {
    publicationsCounts,
    openTabIndex,
    handleChange,
  };
}

export { usePublications };
