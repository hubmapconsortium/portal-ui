import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr/fetchers';
import { useAppContext } from 'js/components/Contexts';
import { SavedEntitiesList } from 'js/components/savedLists/types';

/** **************************************************
 *                  UKV API Helpers                  *
 * ************************************************* */

/**
 * Generates API URLs for various saved list API actions
 * @param ukvEndpoint endpoint to use as the base for API URLs
 * @returns an API URL generator
 */
const apiUrls = (ukvEndpoint: string) => ({
  get keys(): string {
    return `${ukvEndpoint}/user/keys`;
  },
  get findKeys(): string {
    return `${ukvEndpoint}/user/find/keys`;
  },
  key(key: string): string {
    return `${ukvEndpoint}/user/keys/${key}`;
  },
});

function useUkvApiURLs() {
  const { ukvEndpoint } = useAppContext();
  return apiUrls(ukvEndpoint);
}

/** **************************************************
 *                          New                      *
 * ************************************************* */

interface APIAction {
  url: string;
  headers?: HeadersInit;
}

function useUkvHeaders(): HeadersInit {
  const { groupsToken } = useAppContext();
  return {
    Authorization: `Bearer ${groupsToken}`,
    'Content-Type': 'application/json',
  };
}

function useHasUkvAccess() {
  const { isAuthenticated } = useAppContext();
  return Boolean(isAuthenticated);
}

function useBuildUkvSWRKey(): {
  buildKey: ({ url }: { url: string }) => [string, HeadersInit] | null;
  hasAccess: boolean;
} {
  const hasAccess = useHasUkvAccess();
  const headers = useUkvHeaders();

  return {
    buildKey: useCallback(
      ({ url }: { url: string }) => {
        return hasAccess ? [url, headers] : null;
      },
      [hasAccess, headers],
    ),
    hasAccess,
  };
}

function useFetchSavedListsAndEntities(listUUID?: string) {
  const urls = useUkvApiURLs();
  const listsURL = listUUID ? urls.key(listUUID) : urls.keys;
  const { buildKey, hasAccess } = useBuildUkvSWRKey();

  const { data, isLoading, ...rest } = useSWR(
    buildKey({ url: listsURL }),
    ([url, head]) =>
      fetcher<{ key: string; value: SavedEntitiesList }[]>({
        url,
        requestInit: { headers: head },
        errorMessages: {
          404: listUUID ? `No list with UUID ${listUUID} found.` : 'No lists for the current user were found.',
        },
      }),
    { revalidateOnFocus: hasAccess, refreshInterval: 1000 * 60 },
  );
  const savedListsAndEntities = data ?? [];
  return { savedListsAndEntities, isLoading, ...rest };
}

interface UpdateSavedListArgs extends APIAction {
  body: SavedEntitiesList;
  method: 'PUT' | 'POST';
}

async function updateSavedListFetcher(
  _key: string,
  { arg: { body, url, headers, method } }: { arg: UpdateSavedListArgs },
) {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers,
  });

  if (!response.ok) {
    console.error('Updating saved list failed', response);
  }
}

function useUpdateSavedList() {
  const api = useUkvApiURLs();
  const headers = useUkvHeaders();
  const { trigger, isMutating } = useSWRMutation('update-list', updateSavedListFetcher);

  const handleSavedList = useCallback(
    ({ body, listUUID, method }: { body: SavedEntitiesList; listUUID: string; method: 'PUT' | 'POST' }) => {
      return trigger({
        url: api.key(listUUID),
        body,
        headers,
        method,
      });
    },
    [trigger, api, headers],
  );

  return {
    updateSavedList: (args: { body: SavedEntitiesList; listUUID: string }) =>
      handleSavedList({ ...args, method: 'PUT' }),
    createSavedList: (args: { body: SavedEntitiesList; listUUID: string }) =>
      handleSavedList({ ...args, method: 'POST' }),
    isUpdating: isMutating,
  };
}

async function fetchDeleteList(
  _key: string,
  { arg: { headers, url, listUUID } }: { arg: { headers: HeadersInit; url: string; listUUID: string } },
) {
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) {
    throw Error(`List deletion for list #${listUUID} failed`);
  }
}

function useDeleteList() {
  const { trigger, isMutating } = useSWRMutation('delete-list', fetchDeleteList);
  const api = useUkvApiURLs();
  const headers = useUkvHeaders();

  const deleteList = useCallback(
    async ({ listUUID }: { listUUID: string }) => {
      await trigger({
        listUUID,
        url: api.key(listUUID),
        headers,
      });
    },
    [trigger, api, headers],
  );

  return { deleteList, isDeleting: isMutating };
}

export { useBuildUkvSWRKey, useUkvApiURLs, useFetchSavedListsAndEntities, useUpdateSavedList, useDeleteList };
