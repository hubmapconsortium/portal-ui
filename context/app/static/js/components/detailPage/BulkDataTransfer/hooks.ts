import useSWR from 'swr';

import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';
import { useSearchHits } from 'js/hooks/useSearchData';
import { Dataset } from 'js/components/types';

interface FetchProtectedFileResponse {
  status?: number;
  responseUrl?: string;
}

const fetcher = async ([entityEndpoint, uuid, groupsToken]: [string, string, string]) => {
  const requestHeaders = getAuthHeader(groupsToken);
  const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
    headers: requestHeaders,
  });
  let responseUrl;
  if (!response.ok) {
    if (response.status === 403) {
      // eslint-disable-next-line no-console
      console.info('No error: 403 is an expected API response');
    } else {
      console.error('Entities API failed with status', response.status);
    }
  } else {
    responseUrl = await response.text();
  }

  return { status: response.status, responseUrl } as FetchProtectedFileResponse;
};

export const useFetchProtectedFile = (uuid: string) => {
  const { entityEndpoint, groupsToken } = useAppContext();

  const { data: result, isLoading } = useSWR<FetchProtectedFileResponse, unknown, [string, string, string]>(
    [entityEndpoint, uuid, groupsToken],
    fetcher,
    {
      fallbackData: { status: undefined, responseUrl: undefined },
    },
  );

  return { ...result, isLoading };
};

type DatasetURLs = Pick<
  Dataset,
  'hubmap_id' | 'dbgap_study_url' | 'dbgap_sra_experiment_url' | 'mapped_data_access_level'
>;

export const useStudyURLsQuery = (uuid: string) => {
  return useSearchHits<DatasetURLs>(
    {
      query: {
        bool: {
          must: [{ term: { uuid } }],
        },
      },
      _source: ['hubmap_id', 'dbgap_study_url', 'dbgap_sra_experiment_url', 'mapped_data_access_level'],
    },
    {
      useDefaultQuery: false,
    },
  );
};
