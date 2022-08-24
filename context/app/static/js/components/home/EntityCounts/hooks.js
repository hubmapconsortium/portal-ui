import { useEffect, useState } from 'react';

import useSearchData from 'js/hooks/useSearchData';

const entityCountsQuery = {
  size: 0,
  aggs: { entity_type: { terms: { field: 'entity_type.keyword' } } },
};

function useEntityCounts() {
  const [entityCounts, setEntityCountsData] = useState(undefined);
  const { searchData: elasticsearchData } = useSearchData(entityCountsQuery);
  useEffect(() => {
    if (Object.keys(elasticsearchData).length) {
      const entityCountsObject = elasticsearchData.aggregations.entity_type.buckets.reduce((acc, entity) => {
        const accCopy = acc;
        accCopy[entity.key] = entity.doc_count;
        return accCopy;
      }, {});
      setEntityCountsData(entityCountsObject);
    }
  }, [elasticsearchData]);

  return entityCounts;
}

export { useEntityCounts };
