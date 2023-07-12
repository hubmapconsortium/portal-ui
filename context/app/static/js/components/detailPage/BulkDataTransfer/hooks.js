import useSWR from 'swr';

import { getAuthHeader } from 'js/helpers/functions';
import { useAppContext } from 'js/components/Contexts';

const fetcher = async ([entityEndpoint, uuid, groupsToken]) => {
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

  return { status: response.status, responseUrl };
};

export const useFetchProtectedFile = (uuid) => {
  const { entityEndpoint, groupsToken } = useAppContext();

  const { data: result } = useSWR([entityEndpoint, uuid, groupsToken], fetcher);

  return result ?? { status: undefined, responseUrl: undefined };
};
