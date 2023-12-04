import { useCallback } from 'react';
import { useGeneList } from '../genes/hooks';
import { useBiomarkersSearchState } from './BiomarkersSearchContext';

function useCurrentGenesList() {
  const { search } = useBiomarkersSearchState();
  return useGeneList(search);
}

export function useResultsList() {
  const { data, ...rest } = useCurrentGenesList();

  const genesList = data?.flatMap((page) => page.genes) ?? [];

  const { pagination } = data?.at(-1) ?? {};

  const hasMore = pagination?.page !== pagination?.total_pages;

  // TODO: Once proteins are added to the API, we'll need to add them here as well

  return { genesList, hasMore, ...rest };
}

export function useViewMore() {
  const { size, setSize, isLoading, isValidating } = useCurrentGenesList();
  return useCallback(async () => {
    if (isLoading || isValidating) return;
    await setSize(size + 1);
  }, [isLoading, isValidating, setSize, size]);
}
