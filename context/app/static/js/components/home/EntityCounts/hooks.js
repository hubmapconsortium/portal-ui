import useSearchData from 'js/hooks/useSearchData';

const entityCountsQuery = {
  size: 0,
  aggs: { entity_type: { terms: { field: 'entity_type.keyword' } } },
};

function useEntityCounts() {
  const { searchData: elasticsearchData } = useSearchData(entityCountsQuery);
  if (Object.keys(elasticsearchData).length) {
    return elasticsearchData.aggregations.entity_type.buckets.reduce((acc, entity) => {
      return { ...acc, [entity.key]: entity.doc_count };
    }, {});
  }

  return {};
}

export { useEntityCounts };
