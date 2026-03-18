import { useMemo } from 'react';

import { OrganFile } from 'js/components/organ/types';
import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import useSWR from 'swr/immutable';

export const useOrganApiLinks = () => ({
  organDetails(organName: string) {
    return `/organs/${organName}.json`;
  },
  get organList() {
    return `/organs.json`;
  },
});

export const useOrgansAPI = (organsToFetch: string[]) => {
  return useSWR<Record<string, OrganFile>, SWRError, [url: string, organList: string[]]>(
    [useOrganApiLinks().organList, organsToFetch],
    ([url, organList]) =>
      fetcher<Record<string, OrganFile>>({
        url,
        requestInit: {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ organs: organList }),
        },
      }),
  );
};

export function useOrgan(organName: string) {
  const { data, error } = useSWR<OrganFile, SWRError, { url: string }>(
    { url: useOrganApiLinks().organDetails(organName) },
    fetcher,
  );
  return {
    data,
    isLoading: !error && !data,
    isError: Boolean(error),
    error,
  };
}

/**
 * Builds a mapping from normalized tissue names (and search aliases) to organ keys.
 * Mirrors the Python `get_organ_name_mapping()` in utils.py.
 */
export function useOrganNameMapping(organs: Record<string, OrganFile> | undefined) {
  return useMemo(() => {
    if (!organs) return {};
    const mapping: Record<string, string> = {};
    for (const [key, organ] of Object.entries(organs)) {
      mapping[key] = key;
      for (const term of organ.search) {
        mapping[term.toLowerCase()] = key;
      }
    }
    return mapping;
  }, [organs]);
}
