import useSearchData from 'js/hooks/useSearchData';

const query = {
  size: 0,
  query: {
    bool: {
      must: { term: { 'entity_type.keyword': 'Dataset' } },
    },
  },
  aggs: {
    'origin_samples.mapped_organ': { terms: { field: 'origin_samples.mapped_organ.keyword', size: 10000 } },
  },
};

function buildOrganToCountMap(aggsBuckets) {
  return aggsBuckets.reduce((acc, { key, doc_count }) => {
    acc[key] = doc_count;
    return acc;
  }, {});
}

function addSearchTermsCount(search, organToCountMap) {
  return search.reduce((sum, searchTerm) => sum + organToCountMap[searchTerm], 0);
}

function addDatasetCountsToOrgans(organs, aggsBuckets) {
  const organToCountMap = buildOrganToCountMap(aggsBuckets);
  return Object.entries(organs).reduce((acc, [k, { search }]) => {
    acc[k] = { ...acc[k], descendantCounts: { Dataset: addSearchTermsCount(search, organToCountMap) } };
    return acc;
  }, organs);
}

function useOrgansDatasetCounts(organs) {
  const { searchData, isLoading } = useSearchData(query);

  if (isLoading) {
    return { isLoading };
  }

  const organsWithDatasetCounts = addDatasetCountsToOrgans(
    organs,
    searchData.aggregations['origin_samples.mapped_organ'].buckets,
  );

  return { organsWithDatasetCounts, isLoading };
}

export { useOrgansDatasetCounts, buildOrganToCountMap, addDatasetCountsToOrgans, addSearchTermsCount };
