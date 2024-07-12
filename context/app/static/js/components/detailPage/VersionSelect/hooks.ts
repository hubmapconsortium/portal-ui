import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { getAuthHeader } from 'js/helpers/functions';
import { getCleanVersions } from './utils';
import { Version } from './types';

export function useVersions(uuid: string) {
  const { groupsToken, entityEndpoint } = useAppContext();
  const { data, isLoading } = useSWR<Version[], unknown, [string, string]>([uuid, groupsToken], ([id, token]) =>
    fetcher({ url: `${entityEndpoint}/datasets/${id}/revisions`, requestInit: { headers: getAuthHeader(token) } }),
  );
  const versions = getCleanVersions(data ?? []).sort((a, b) => b.revision_number - a.revision_number);
  const selectedVersionIndex = versions.findIndex((version) => version.uuid === uuid);

  return { versions, selectedVersionIndex, isLoading };
}
