import { readCookie } from 'js/helpers/functions';
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

export function useGlobusGroups(shouldRequest = true) {
  const { data, error } = useSWRImmutable<GlobusGroupInfo[], SWRError>(
    shouldRequest ? globusGroupsURL : null,
    (url: string) => fetcher<GlobusGroupInfo[]>({ url }),
  );

  return {
    data,
    error,
    isLoading: !data && !error,
  };
}

export function useCurrentUserGlobusGroups() {
  const groupsCookie = readCookie('user_groups');
  const { data: allGlobusGroups = [] } = useGlobusGroups(isAuthenticated);
  if (!groupsCookie) {
    return [
      {
        key: 'External',
        name: 'External User',
        description: 'You are not part of any HuBMAP access groups.',
      },
    ];
  }

  const groups = groupsCookie.split('|');

  const currentUserGroups = allGlobusGroups
    ?.filter((group) => groups.includes(group.name))
    .map((g) => ({
      key: g.name,
      name: g.displayname,
      description: g.description,
    }));

  const nonHubmapGroups = groups.filter((group) => !currentUserGroups.find((g) => g.key === group));

  if (nonHubmapGroups.length > 0) {
    currentUserGroups.push({
      key: 'Other',
      name: 'Other Groups',
      description: `You are also part of the following groups: ${nonHubmapGroups.join(', ')}`,
    });
  }

  return currentUserGroups;
}
