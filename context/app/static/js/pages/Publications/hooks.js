import { useState } from 'react';

import useSearchData from 'js/hooks/useSearchData';

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

  const publicationsStatusAggs = publicationsStatusBuckets.reduce(
    (acc, { key_as_string, doc_count }) => {
      if (!['false', 'true'].includes(key_as_string)) {
        return acc;
      }

      /* eslint-disable operator-assignment */
      acc.statuses[key_as_string].count = acc.statuses[key_as_string].count + doc_count;
      acc.publicationsCount = acc.publicationsCount + doc_count;
      /* eslint-enable operator-assignment */

      return acc;
    },
    {
      statuses: { true: { category: 'Peer Reviewed', count: 0 }, false: { category: 'Preprint', count: 0 } },
      publicationsCount: 0,
    },
  );

  return { publicationsStatusAggs, isLoading };
}

function usePublications() {
  const { publicationsStatusAggs } = usePublicationStatusAggs();

  const [openTabIndex, setOpenTabIndex] = useState(0);

  const handleChange = (event, newIndex) => {
    setOpenTabIndex(newIndex);
  };

  return {
    publicationsStatusAggs,
    openTabIndex,
    handleChange,
  };
}

export { usePublications };
