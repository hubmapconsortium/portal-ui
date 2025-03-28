import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import useSearchData from 'js/hooks/useSearchData';

const entityCountsQuery: SearchRequest = {
  size: 0,
  query: {
    bool: {
      // Exclude invalid/new datasets from count
      // using `must_not` for this allows entities without a mapped status to still be matched
      must_not: {
        terms: {
          'mapped_status.keyword': ['Invalid', 'Error', 'New', 'Processing', 'Submitted'],
        },
      },
      // Nested musts are necessary to form an AND of ORs (i.e. a MUST of SHOULDs)
      must: {
        bool: {
          must: [
            {
              // Exclude donors/samples with no associated datasets
              bool: {
                should: [
                  // Either not a donor/sample
                  { bool: { must_not: { terms: { 'entity_type.keyword': ['Donor', 'Sample'] } } } },
                  // or has at least one descended dataset
                  { bool: { must: { exists: { field: 'descendant_counts.entity_type.Dataset' } } } },
                ],
              },
            },
            {
              // Only include collections with a DOI in count
              bool: {
                should: [
                  { bool: { must_not: { term: { 'entity_type.keyword': 'Collection' } } } },
                  { bool: { must: [{ exists: { field: 'doi_url' } }, { exists: { field: 'registered_doi' } }] } },
                ],
              },
            },
          ],
        },
      },
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
