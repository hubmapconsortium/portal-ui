import { OrganFile } from 'js/components/organ/types';
import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import useSWR from 'swr/immutable';

export const useOrganApiLinks = () => ({
  organDetails(organName: string) {
    return `/organ/${organName}.json`;
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
