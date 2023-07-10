import { useAppContext } from 'js/components/Contexts';
import { getAuthHeader } from 'js/helpers/functions';

import useSWR from 'swr';

const fetcher = async (entityEndpoint, uuid, groupsToken) => {
  const requestHeaders = getAuthHeader(groupsToken);
  const response = await fetch(`${entityEndpoint}/entities/dataset/globus-url/${uuid}`, {
    headers: requestHeaders,
  });
  if (!response.ok) {
    if (response.status === 403) {
      // eslint-disable-next-line no-console
      console.info('No error: 403 is an expected API response');
      return true;
    }
  }
  return false;
};

export const useIsProtectedFile = (uuid) => {
  const { entityEndpoint, groupsToken } = useAppContext();

  const { data } = useSWR([entityEndpoint, uuid, groupsToken], fetcher);

  return data;
};
