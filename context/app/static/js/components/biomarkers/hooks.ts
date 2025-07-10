import { useCallback } from 'react';
import { useGeneOntologyList } from 'js/hooks/useUBKG';
import { trackEvent } from 'js/helpers/trackers';
import { useBiomarkersSearchState } from './BiomarkersSearchContext';
import { EventInfo } from '../types';

function useCurrentGenesList() {
  const { search } = useBiomarkersSearchState();
  return useGeneOntologyList(search.toUpperCase());
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

export function useTrackBiomarkerLandingPage() {
  return useCallback((event: Partial<EventInfo>) => {
    trackEvent({
      ...event,
      category: 'Biomarker Landing Page',
    });
  }, []);
}
