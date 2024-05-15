import { fetcher } from 'js/helpers/swr';
import { SWRError } from 'js/helpers/swr/errors';
import useSWRImmutable from 'swr/immutable';

// The globus auth helper from hubmap_commons omits the group descriptions, so we need to fetch the full list of groups from the repo.
const globusGroupsURL =
  'https://raw.githubusercontent.com/hubmapconsortium/commons/main/hubmap_commons/21f293b0-globus-groups.json';

interface GlobusGroupInfo {
  description: string;
  data_provider: boolean;
  has_subgroups: boolean;
  identity_set_properties: null; // This is always null in the data.
  uuid: string;
  group_type: 'regular' | 'data-read' | 'protected-data' | 'data-admin';
  name: string;
  displayname: string;
  shortname: string;
  generateuuid: boolean;
  tmc_prefix: string;
}

export function useGlobusGroups() {
  const { data, error } = useSWRImmutable<GlobusGroupInfo[], SWRError>(globusGroupsURL, (url: string) =>
    fetcher<GlobusGroupInfo[]>({ url }),
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
}
