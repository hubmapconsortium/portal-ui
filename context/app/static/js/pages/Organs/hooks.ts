import { SearchRequest } from '@elastic/elasticsearch/lib/api/types';
import { OrganFile, OrganFileWithDescendants } from 'js/components/organ/types';
import useSearchData from 'js/hooks/useSearchData';

const query: SearchRequest = {
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

interface TermsBucket {
  key: string;
  doc_count: number;
}

function buildOrganToCountMap(aggsBuckets: TermsBucket[]) {
  return aggsBuckets.reduce<Record<string, number>>((acc, { key, doc_count }) => {
    acc[key] = doc_count;
    return acc;
  }, {});
}

function addSearchTermsCount(search: string[], organToCountMap: Record<string, number>) {
  return search.reduce((sum, searchTerm) => sum + (organToCountMap[searchTerm] ?? 0), 0);
}

function addDatasetCountToOrgan(organ: OrganFile, organToCountMap: Record<string, number>) {
  const { name, search } = organ;
  const searchWithName = [...search, name].filter((v, i, a) => a.indexOf(v) === i);
  return {
    ...organ,
    descendantCounts: { Dataset: addSearchTermsCount(searchWithName, organToCountMap) },
  };
}

function addDatasetCountsToOrgans(
  organs: Record<string, OrganFile>,
  aggsBuckets: TermsBucket[],
): Record<string, OrganFileWithDescendants> {
  const organToCountMap = buildOrganToCountMap(aggsBuckets);
  return Object.entries(organs).reduce<Record<string, OrganFileWithDescendants>>((acc, [k, organ]) => {
    acc[k] = addDatasetCountToOrgan(organ, organToCountMap);
    return acc;
  }, {});
}

function useOrgansDatasetCounts(organs: Record<string, OrganFile>) {
  const { searchData, isLoading } = useSearchData<unknown, Record<string, { buckets: TermsBucket[] }>>(query);

  if (isLoading || !searchData?.aggregations) {
    return { organsWithDatasetCounts: {}, isLoading };
  }

  const organsWithDatasetCounts = addDatasetCountsToOrgans(
    organs,
    searchData.aggregations['origin_samples.mapped_organ'].buckets,
  );

  return { organsWithDatasetCounts, isLoading };
}

function organNotFoundMessageTemplate(redirectedOrganName: string) {
  return `The organ "${redirectedOrganName}" was not found. You have been redirected to the list of available organs.`;
}

export {
  useOrgansDatasetCounts,
  buildOrganToCountMap,
  addDatasetCountsToOrgans,
  addSearchTermsCount,
  organNotFoundMessageTemplate,
};
