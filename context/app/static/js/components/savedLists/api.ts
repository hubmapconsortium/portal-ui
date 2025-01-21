import { useAppContext } from 'js/components/Contexts';
import { SavedEntitiesList, SavedEntity } from 'js/components/savedLists/types';
import { fetcher } from 'js/helpers/swr/fetchers';
import useSWR from 'swr';

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

async function fetchResponse({
  url,
  token,
  method,
  body,
}: {
  url: string;
  token: string;
  method: 'PUT' | 'DELETE';
  body?: string;
}) {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body,
  });

  if (!response.ok) {
    console.error('Error: ', await response.text());
  }
}

/** **************************************************
 *                  Remote Actions                   *
 * ************************************************* */

interface RemoteEntitiesProps {
  urls: ReturnType<typeof apiUrls>;
  groupsToken: string;
  savedEntities?: Record<string, SavedEntity>;
  savedLists?: Record<string, SavedEntitiesList>;
}

function useFetchSavedEntitiesAndLists({ urls, groupsToken }: RemoteEntitiesProps) {
  const { data, isLoading } = useSWR([urls.keys, groupsToken], ([url, token]: string[]) =>
    fetcher<{ key: string; value: SavedEntitiesList }[]>({
      url,
      requestInit: { headers: { Authorization: `Bearer ${token}` } },
    }),
  );

  let savedEntities: Record<string, SavedEntity> = {};
  let savedLists: Record<string, SavedEntitiesList> = {};
  let isFirstRemoteFetch = false;

  if (!isLoading) {
    if (!data) {
      isFirstRemoteFetch = true;
    } else {
      const savedEntitiesObject = data.find((item) => item.key === 'savedEntities');

      if (savedEntitiesObject) {
        savedEntities = savedEntitiesObject.value.savedEntities;
      }

      savedLists = data
        .filter((item) => item.key !== 'savedEntities')
        .reduce((acc, item) => {
          return {
            ...acc,
            [item.key]: item.value,
          };
        }, {});
    }
  }

  return { savedLists, savedEntities, isFirstRemoteFetch, isLoading };
}

function CopySavedItemsToRemoteStore({
  urls,
  groupsToken,
  savedEntitiesLocal,
  savedListsLocal,
}: RemoteEntitiesProps & {
  savedEntitiesLocal: Record<string, SavedEntity>;
  savedListsLocal: Record<string, SavedEntitiesList>;
}) {
  const entitiesUrl = urls.key('savedEntities');
  const entitiesBody = JSON.stringify({
    title: 'Saved Entities',
    description: 'Entities saved by the user',
    dateSaved: Date.now(),
    dateModified: Date.now(),
    savedEntities: savedEntitiesLocal,
  });

  fetchResponse({ url: entitiesUrl, token: groupsToken, method: 'PUT', body: entitiesBody }).catch((err) =>
    console.error('Failed to copy saved entities to remote store:', err),
  );

  // Send each saved list to the remote store
  Object.entries(savedListsLocal).forEach(([key, list]) => {
    const listUrl = urls.key(key);
    const listBody = JSON.stringify(list);

    fetchResponse({ url: listUrl, token: groupsToken, method: 'PUT', body: listBody }).catch((err) =>
      console.error(`Failed to copy saved list "${key}" to remote store:`, err),
    );
  });
}

function saveEntitiesRemote({
  urls,
  groupsToken,
  savedEntities,
  entityUUIDs,
}: RemoteEntitiesProps & { entityUUIDs: Set<string> }) {
  const savedEntitiesCopy = { ...savedEntities };
  entityUUIDs.forEach((entityUUID) => {
    savedEntitiesCopy[entityUUID] = {
      dateSaved: Date.now(),
      dateAddedToList: Date.now(),
    };
  });

  const url = urls.key('savedEntities');
  const body = JSON.stringify({
    title: 'Saved Entities',
    description: 'Entities saved by the user',
    dateSaved: Date.now(),
    dateModified: Date.now(),
    savedEntities: savedEntitiesCopy,
  });

  return fetchResponse({ url, token: groupsToken, method: 'PUT', body });
}

function saveEntityRemote({ entityUUID, ...props }: RemoteEntitiesProps & { entityUUID: string }) {
  return saveEntitiesRemote({ ...props, entityUUIDs: new Set([entityUUID]) });
}

function deleteEntitiesRemote({
  urls,
  groupsToken,
  savedEntities,
  entityUUIDs,
}: RemoteEntitiesProps & { entityUUIDs: Set<string> }) {
  const savedEntitiesCopy = { ...savedEntities };
  entityUUIDs.forEach((uuid) => {
    delete savedEntitiesCopy[uuid];
  });

  const url = urls.key('savedEntities');
  const body = JSON.stringify({
    title: 'Saved Entities',
    description: 'Entities saved by the user',
    dateSaved: Date.now(),
    dateModified: Date.now(),
    savedEntities: savedEntitiesCopy,
  });

  return fetchResponse({ url, token: groupsToken, method: 'PUT', body });
}

function deleteEntityRemote({ entityUUID, ...props }: RemoteEntitiesProps & { entityUUID: string }) {
  return deleteEntitiesRemote({
    entityUUIDs: new Set([entityUUID]),
    ...props,
  });
}

function createListRemote({
  urls,
  groupsToken,
  list,
  uuid,
}: {
  urls: { key: (uuid: string) => string };
  groupsToken: string;
  list: Pick<SavedEntitiesList, 'title' | 'description'>;
  uuid: string;
}) {
  const url = urls.key(uuid);
  const body = JSON.stringify({
    ...list,
    dateSaved: Date.now(),
    dateLastModified: Date.now(),
    savedEntities: {},
  });

  return fetchResponse({ url, token: groupsToken, method: 'PUT', body });
}

function addEntitiesToListRemote({
  urls,
  groupsToken,
  savedLists,
  listUUID,
  entityUUIDs,
}: RemoteEntitiesProps & { savedLists: Record<string, SavedEntitiesList>; listUUID: string; entityUUIDs: string[] }) {
  const updatedSavedEntities = { ...savedLists[listUUID].savedEntities };
  entityUUIDs.forEach((uuid) => {
    updatedSavedEntities[uuid] = {
      dateAddedToList: Date.now(),
    };
  });

  const updatedList = {
    ...savedLists[listUUID],
    savedEntities: updatedSavedEntities,
    dateLastModified: Date.now(),
  };

  const url = urls.key(listUUID);
  const body = JSON.stringify(updatedList);

  return fetchResponse({ url, token: groupsToken, method: 'PUT', body });
}

function addEntityToListRemote({
  entityUUID,
  ...props
}: RemoteEntitiesProps & { savedLists: Record<string, SavedEntitiesList>; listUUID: string; entityUUID: string }) {
  return addEntitiesToListRemote({ ...props, entityUUIDs: [entityUUID] });
}

function deleteListRemote({ urls, groupsToken, listUUID }: RemoteEntitiesProps & { listUUID: string }) {
  const url = urls.key(listUUID);
  return fetchResponse({ url, token: groupsToken, method: 'DELETE' });
}

function removeEntitiesFromListRemote({
  urls,
  groupsToken,
  savedLists,
  listUUID,
  entityUUIDs,
}: RemoteEntitiesProps & { savedLists: Record<string, SavedEntitiesList>; listUUID: string; entityUUIDs: string[] }) {
  const updatedSavedEntities = { ...savedLists[listUUID].savedEntities };
  entityUUIDs.forEach((uuid) => {
    delete updatedSavedEntities[uuid];
  });

  const updatedList = {
    ...savedLists[listUUID],
    savedEntities: updatedSavedEntities,
    dateLastModified: Date.now(),
  };

  const url = urls.key(listUUID);
  const body = JSON.stringify(updatedList);

  return fetchResponse({ url, token: groupsToken, method: 'PUT', body });
}

function removeEntityFromListRemote({
  entityUUID,
  ...props
}: RemoteEntitiesProps & { savedLists: Record<string, SavedEntitiesList>; listUUID: string; entityUUID: string }) {
  return removeEntitiesFromListRemote({ ...props, entityUUIDs: [entityUUID] });
}

function editListRemote({
  urls,
  groupsToken,
  savedLists,
  listUUID,
  title,
  description,
}: RemoteEntitiesProps & {
  savedLists: Record<string, SavedEntitiesList>;
  listUUID: string;
  title: string;
  description: string;
}) {
  savedLists[listUUID] = {
    ...savedLists[listUUID],
    title,
    description,
    dateLastModified: Date.now(),
  };

  const url = urls.key(listUUID);
  const body = JSON.stringify(savedLists[listUUID]);

  return fetchResponse({ url, token: groupsToken, method: 'PUT', body });
}

export {
  useUkvApiURLs,
  useFetchSavedEntitiesAndLists,
  CopySavedItemsToRemoteStore,
  saveEntitiesRemote,
  saveEntityRemote,
  deleteEntitiesRemote,
  deleteEntityRemote,
  createListRemote,
  addEntitiesToListRemote,
  addEntityToListRemote,
  deleteListRemote,
  removeEntitiesFromListRemote,
  removeEntityFromListRemote,
  editListRemote,
};
