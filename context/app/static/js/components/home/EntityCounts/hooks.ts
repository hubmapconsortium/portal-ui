import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import useSearchData from 'js/hooks/useSearchData';

const entityCountsQuery: SearchRequest = {
  size: 0,
  query: {
    bool: {
      // Only include collections with a DOI in count
      should: [
        { bool: { must_not: { term: { 'entity_type.keyword': 'Collection' } } } },
        { bool: { must: [{ exists: { field: 'doi_url' } }, { exists: { field: 'registered_doi' } }] } },
      ],
    },
  },
  aggs: {
    entity_type: {
      terms: { field: 'entity_type.keyword' },
    },
  },
};

interface EntityCounts {
  entity_type: {
    buckets: Record<string, number>[];
  };
}

function useEntityCounts() {
  const { searchData: elasticsearchData } = useSearchData<unknown, EntityCounts>(entityCountsQuery);
  if (elasticsearchData?.aggregations) {
    return elasticsearchData.aggregations.entity_type.buckets.reduce((acc, entity) => {
      return { ...acc, [entity.key]: entity.doc_count };
    }, {});
  }

  return {};
}

export { useEntityCounts };
