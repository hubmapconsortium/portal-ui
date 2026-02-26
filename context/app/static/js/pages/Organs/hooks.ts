import { SearchRequest } from 'js/typings/elasticsearch';
import { OrganFile, OrganFileWithDescendants } from 'js/components/organ/types';
import useSearchData from 'js/hooks/useSearchData';

const datasetQuery: SearchRequest = {
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

const sampleQuery: SearchRequest = {
  size: 0,
  query: {
    bool: {
      must: { term: { 'entity_type.keyword': 'Sample' } },
    },
  },
  aggs: {
    mapped_organ: { terms: { field: 'mapped_organ.keyword', size: 10000 } },
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

function addCountsToOrgan(
  organ: OrganFile,
  datasetCountMap: Record<string, number>,
  sampleCountMap: Record<string, number>,
) {
  const { name, search } = organ;
  const searchWithName = Array.from(new Set([...search, name]));
  return {
    ...organ,
    descendantCounts: {
      Dataset: addSearchTermsCount(searchWithName, datasetCountMap),
      Sample: addSearchTermsCount(searchWithName, sampleCountMap),
    },
  };
}

function addCountsToOrgans(
  organs: Record<string, OrganFile>,
  datasetBuckets: TermsBucket[],
  sampleBuckets: TermsBucket[],
): Record<string, OrganFileWithDescendants> {
  const datasetCountMap = buildOrganToCountMap(datasetBuckets);
  const sampleCountMap = buildOrganToCountMap(sampleBuckets);
  return Object.entries(organs).reduce<Record<string, OrganFileWithDescendants>>((acc, [k, organ]) => {
    acc[k] = addCountsToOrgan(organ, datasetCountMap, sampleCountMap);
    return acc;
  }, {});
}

function useOrgansDatasetCounts(organs: Record<string, OrganFile>) {
  const { searchData: datasetData, isLoading: isLoadingDatasets } = useSearchData<
    unknown,
    Record<string, { buckets: TermsBucket[] }>
  >(datasetQuery);
  const { searchData: sampleData, isLoading: isLoadingSamples } = useSearchData<
    unknown,
    Record<string, { buckets: TermsBucket[] }>
  >(sampleQuery);

  const isLoading = isLoadingDatasets || isLoadingSamples;

  if (isLoading || !datasetData?.aggregations || !sampleData?.aggregations) {
    return { organsWithDatasetCounts: {}, isLoading };
  }

  const organsWithDatasetCounts = addCountsToOrgans(
    organs,
    datasetData.aggregations['origin_samples.mapped_organ'].buckets,
    sampleData.aggregations.mapped_organ.buckets,
  );

  return { organsWithDatasetCounts, isLoading };
}

function organNotFoundMessageTemplate(redirectedOrganName: string) {
  return `The organ "${redirectedOrganName}" was not found. You have been redirected to the list of available organs.`;
}

export {
  useOrgansDatasetCounts,
  buildOrganToCountMap,
  addCountsToOrgans,
  addSearchTermsCount,
  organNotFoundMessageTemplate,
};
