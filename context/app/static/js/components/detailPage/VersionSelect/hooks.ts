import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { useAppContext } from 'js/components/Contexts';
import { getAuthHeader } from 'js/helpers/functions';
import { getCleanVersions } from './utils';
import { useSelectedVersionStore } from './SelectedVersionStore';
import { Version } from './types';

export function useVersions(uuid: string) {
  const { groupsToken, entityEndpoint } = useAppContext();
  const setVersions = useSelectedVersionStore((state) => state.setVersions);
  const { data: versions = [], isLoading } = useSWR<Version[], unknown, [string, string]>(
    [uuid, groupsToken],
    ([id, token]) =>
      fetcher<Version[]>({
        url: `${entityEndpoint}/datasets/${id}/revisions`,
        requestInit: { headers: getAuthHeader(token) },
      }).then((response) => getCleanVersions(response).sort((a, b) => b.revision_number - a.revision_number)),
    {
      onSuccess: (data) => {
        setVersions(uuid, data);
      },
    },
  );
  const selectedVersionIndex = versions.findIndex((version) => version.uuid === uuid);

  return { versions, selectedVersionIndex, isLoading };
}
