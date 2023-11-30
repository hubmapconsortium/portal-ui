import { useCallback } from 'react';
import { useGeneList } from '../genes/hooks';
import { useBiomarkersSearchState } from './BiomarkersSearchContext';

export function useResultsList() {
  const { search } = useBiomarkersSearchState();
  const { data, ...rest } = useGeneList(search);

  const genesList = data?.flatMap((page) => page.genes) ?? [];

  const hasMore = data?.[0]?.pagination?.page !== data?.[0]?.pagination?.total_pages;

  // TODO: Once proteins are added to the API, we'll need to add them here as well

  return { genesList, hasMore, ...rest };
}

export function useViewMore() {
  const { size, setSize, isLoading, isValidating } = useResultsList();
  return useCallback(async () => {
    if (isLoading || isValidating) return;
    await setSize(size + 1);
  }, [isLoading, isValidating, setSize, size]);
}
