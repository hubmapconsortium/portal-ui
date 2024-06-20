import { useMemo } from 'react';
import { ContributorAPIResponse, normalizeContributor } from './utils';

export function useNormalizedContributors(contributors: ContributorAPIResponse[]) {
  const normalizedContributors = useMemo(() => {
    return contributors.map(normalizeContributor);
  }, [contributors]);
  return normalizedContributors;
}
