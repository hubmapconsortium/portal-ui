import { useCallback } from 'react';
import useSWRMutation from 'swr/mutation';
import useSWR from 'swr';

import { fetcher } from 'js/helpers/swr/fetchers';
import { SWRError } from 'js/helpers/swr/errors';
import { useAppContext } from 'js/components/Contexts';
import { SavedEntitiesList, SavedPreferences } from 'js/components/savedLists/types';
import { SAVED_PREFERENCES_KEY } from 'js/components/savedLists/constants';

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

function useUkvHeaders(): HeadersInit {
  const { groupsToken } = useAppContext();
  return {
    Authorization: `Bearer ${groupsToken}`,
    'Content-Type': 'application/json',
  };
}

function useHasUkvAccess() {
  const { isHubmapUser } = useAppContext();
  return Boolean(isHubmapUser);
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

/** **************************************************
 *                Saved Lists Helpers                *
 * ************************************************* */

function useFetchSavedListsAndEntities(listUUID?: string) {
  const urls = useUkvApiURLs();
  const listsURL = listUUID ? urls.key(listUUID) : urls.keys;
  const { buildKey, hasAccess } = useBuildUkvSWRKey();

  const { data, isLoading, ...rest } = useSWR(
    buildKey({ url: listsURL }),
    async ([url, head]) => {
      try {
        return await fetcher<{ key: string; value: SavedEntitiesList }[]>({
          url,
          requestInit: { headers: head },
          errorMessages: {
            404: listUUID ? `No list with UUID ${listUUID} found.` : 'No lists for the current user were found.',
          },
        });
      } catch (err) {
        // A user with no UKV entries gets a 404 from `/user/keys` — that's a valid
        // "no entries yet" state, not an error. Without this, SWR retries forever
        // with exponential backoff, causing isLoading to flicker and consumers
        // (e.g. SaySeePanel) to unmount/remount their children on every retry.
        // The listUUID-scoped variant still treats 404 as a real error.
        if (!listUUID && err instanceof SWRError && err.status === 404) {
          return [];
        }
        throw err;
      }
    },
    { revalidateOnFocus: hasAccess, shouldRetryOnError: false },
  );
  const savedListsAndEntities = data ?? [];
  return { savedListsAndEntities, isLoading, ...rest };
}

interface UpdateSavedListArgs {
  url: string;
  body: SavedEntitiesList;
  method: 'PUT' | 'POST';
  headers?: HeadersInit;
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

  const updateSavedList = useCallback(
    ({ body, listUUID }: { body: SavedEntitiesList; listUUID: string }) => {
      return trigger({
        url: api.key(listUUID),
        body,
        headers,
        method: 'PUT',
      });
    },
    [trigger, api, headers],
  );

  return {
    updateSavedList,
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

/** **************************************************
 *            Saved Preferences Helpers              *
 * ************************************************* */

interface UpdateSavedPreferencesArgs {
  url: string;
  body: SavedPreferences;
  method: 'PUT' | 'POST';
  headers?: HeadersInit;
}
async function updateSavedPreferencesFetcher(
  _key: string,
  { arg: { body, url, headers, method } }: { arg: UpdateSavedPreferencesArgs },
) {
  const response = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers,
  });

  if (!response.ok) {
    console.error('Updating saved preferences failed', response);
  }
}

function useUpdateSavedPreferences() {
  const api = useUkvApiURLs();
  const headers = useUkvHeaders();
  const { trigger, isMutating } = useSWRMutation('update-preferences', updateSavedPreferencesFetcher);

  const updateSavedPreferences = useCallback(
    (body: SavedPreferences) => {
      return trigger({
        url: api.key(SAVED_PREFERENCES_KEY),
        body,
        headers,
        method: 'PUT',
      });
    },
    [trigger, api, headers],
  );

  return {
    updateSavedPreferences,
    isUpdating: isMutating,
  };
}

export {
  useBuildUkvSWRKey,
  useUkvApiURLs,
  useFetchSavedListsAndEntities,
  useUpdateSavedList,
  useDeleteList,
  useUpdateSavedPreferences,
};
