import savedEntitiiesStoreInitializer from 'js/components/savedLists/SavedEntitiesStoreInitializer';
import { useAppContext } from 'js/components/Contexts';
import { SavedEntitiesList, SavedEntitiesStore, SavedEntity } from 'js/components/savedLists/types';
import { fetcher } from 'js/helpers/swr/fetchers';
import useSWR from 'swr';
import { useEffect } from 'react';
import { createImmer, createImmerPersist } from 'js/helpers/zustand/middleware';

const useSavedEntitiesSelector = (state: SavedEntitiesStore) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  setEntities: state.setEntities,
  deleteQueuedLists: state.deleteQueuedLists,
  deleteEntity: state.deleteEntity,
  deleteEntities: state.deleteEntities,
  removeEntitiesFromList: state.removeEntitiesFromList,
  saveEntity: state.saveEntity,
  createList: state.createList,
  editList: state.editList,
});

/**
 * Generates API URLs for various saved list API actions
 * @param ukvEndpoint endpoint to use as the base for API URLs
 * @returns an API URL generator
 */
export const apiUrls = (ukvEndpoint: string) => ({
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

export function useUkvApiURLs() {
  const { ukvEndpoint } = useAppContext();
  return apiUrls(ukvEndpoint);
}

async function sendResponse({
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

// REMOTE FUNCTIONS

function useFetchSavedEntitiesAndLists({
  urls,
  groupsToken,
}: {
  urls: ReturnType<typeof apiUrls>;
  groupsToken: string;
}) {
  const { data, isLoading } = useSWR([urls.keys, groupsToken], ([url, token]: string[]) =>
    fetcher<{ key: string; value: SavedEntitiesList }[]>({
      url,
      requestInit: { headers: { Authorization: `Bearer ${token}` } },
    }),
  );

  let savedEntities: Record<string, SavedEntity> = {};
  let savedLists: Record<string, SavedEntitiesList> = {};

  if (data && !isLoading) {
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

  return { savedLists, savedEntities, isLoading };
}

function saveEntityRemote({
  urls,
  groupsToken,
  savedEntities,
  entityUUID,
}: {
  urls: ReturnType<typeof apiUrls>;
  groupsToken: string;
  savedEntities: Record<string, SavedEntity>;
  entityUUID: string;
}): void {
  const savedEntitiesCopy = { ...savedEntities };
  savedEntitiesCopy[entityUUID] = {
    dateSaved: Date.now(),
    dateAddedToList: Date.now(),
  };

  const url = urls.key('savedEntities');
  const body = JSON.stringify({
    title: 'Saved Entities',
    description: 'Entities saved by the user',
    dateSaved: Date.now(),
    dateModified: Date.now(),
    savedEntities: savedEntitiesCopy,
  });

  (async () => {
    await sendResponse({ url, token: groupsToken, method: 'PUT', body });
  })().catch((error) => {
    console.error('Failed to save entity:', error);
  });
}

function useSavedLists() {
  const urls = useUkvApiURLs();
  const { groupsToken, isAuthenticated } = useAppContext();
  const { savedEntities, isLoading } = useFetchSavedEntitiesAndLists({ urls, groupsToken });

  const initializer = savedEntitiiesStoreInitializer;
  const useSavedEntitiesStore = isAuthenticated
    ? createImmer<SavedEntitiesStore>((set, get) => ({
        ...savedEntitiiesStoreInitializer(set, get),
        savedEntities: savedEntities || {},
      }))
    : createImmerPersist<SavedEntitiesStore>(initializer, { name: 'saved_entities' });

  const store = useSavedEntitiesStore(useSavedEntitiesSelector);

  useEffect(() => {
    if (isAuthenticated && !isLoading && savedEntities) {
      store.setEntities(savedEntities);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, savedEntities]);

  const params = { urls, groupsToken, savedEntities };

  return {
    ...store,
    saveEntity: (entityUUID: string) => {
      store.saveEntity(entityUUID);
      if (isAuthenticated) {
        saveEntityRemote({ ...params, entityUUID });
      }
    },
  };
}

export { useSavedLists };
