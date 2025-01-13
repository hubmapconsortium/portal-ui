import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { v4 as uuidv4 } from 'uuid';
import { fetcher } from 'js/helpers/swr';
import { SavedEntitiesList, SavedEntitiesStore, SavedEntity } from 'js/components/savedLists/types';
import { useAppContext } from '../Contexts';

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

interface SavedListsDataProps {
  urls: ReturnType<typeof apiUrls>;
  groupsToken: string;
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
  body: string;
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

function useFetchSavedEntitiesAndLists({ urls, groupsToken }: SavedListsDataProps) {
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

function useCreateList({ urls, groupsToken }: SavedListsDataProps) {
  const uuid = uuidv4();
  const { trigger, isMutating } = useSWRMutation(
    [urls.key(uuid), groupsToken],
    async (
      [url, token]: string[],
      { arg: { list } }: { arg: { list: Pick<SavedEntitiesList, 'title' | 'description'> } },
    ) => {
      await sendResponse({
        url,
        token,
        method: 'PUT',
        body: JSON.stringify({
          ...list,
          dateSaved: Date.now(),
          dateLastModified: Date.now(),
          savedEntities: {},
        }),
      });
    },
  );

  return {
    triggerAction: (list: Pick<SavedEntitiesList, 'title' | 'description'>) => trigger({ list }),
    isMutating,
  };
}

function useUpdateListAction({
  urls,
  groupsToken,
  method,
  savedLists,
  action,
}: SavedListsDataProps & {
  method: 'PUT' | 'DELETE';
  savedLists: Record<string, SavedEntitiesList>;
  action: (listUUID: string, entityUUIDs: string | string[]) => void;
}) {
  let isMutating = false;

  const triggerAction = async (listUUID: string, entityUUIDs: string | string[]) => {
    isMutating = true;

    try {
      action(listUUID, entityUUIDs);

      const url = urls.key(listUUID);
      await sendResponse({
        url,
        token: groupsToken,
        method,
        body: JSON.stringify(savedLists[listUUID]),
      });
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      isMutating = false;
    }
  };

  return { triggerAction, isMutating };
}

function useUpdateEntityAction({
  urls,
  groupsToken,
  savedEntities,
  method,
  action,
}: SavedListsDataProps & {
  savedEntities: Record<string, SavedEntity>;
  method: 'PUT' | 'DELETE';
  action: (savedEntities: Record<string, SavedEntity>, entityUUIDs: string | Set<string>) => void;
}) {
  const { trigger, isMutating } = useSWRMutation(
    [urls.key('savedEntities'), groupsToken],
    async ([url, token]: string[], { arg: { entityUUIDs } }: { arg: { entityUUIDs: string | Set<string> } }) => {
      action(savedEntities, entityUUIDs);

      await sendResponse({
        url,
        token,
        method,
        body: JSON.stringify({
          title: 'Saved Entities',
          description: 'Entities saved by the user',
          dateSaved: Date.now(),
          dateModified: Date.now(),
          savedEntities,
        }),
      });
    },
  );

  return {
    triggerAction: (entityUUIDs: string | Set<string>) => trigger({ entityUUIDs }),
    isMutating,
  };
}

function useDeleteEntities({
  urls,
  groupsToken,
  savedEntities,
}: SavedListsDataProps & { savedEntities: Record<string, SavedEntity> }) {
  return useUpdateEntityAction({
    urls,
    groupsToken,
    savedEntities,
    method: 'PUT',
    action: (entities, entityUUIDs) => {
      const uuids = entityUUIDs instanceof Set ? Array.from(entityUUIDs) : [entityUUIDs];

      uuids.forEach((uuid) => {
        delete entities[uuid];
      });
    },
  });
}

function useDeleteEntity({
  urls,
  groupsToken,
  savedEntities,
}: SavedListsDataProps & { savedEntities: Record<string, SavedEntity> }) {
  return useDeleteEntities({
    urls,
    groupsToken,
    savedEntities,
  });
}

function useSaveEntity({
  urls,
  groupsToken,
  savedEntities,
}: SavedListsDataProps & { savedEntities: Record<string, SavedEntity> }) {
  return useUpdateEntityAction({
    urls,
    groupsToken,
    savedEntities,
    method: 'PUT',
    action: (entities, entityUUIDs) => {
      const uuids = entityUUIDs instanceof Set ? Array.from(entityUUIDs) : [entityUUIDs];

      uuids.forEach((uuid) => {
        entities[uuid] = {
          dateSaved: Date.now(),
          dateAddedToList: Date.now(),
        };
      });
    },
  });
}

function useAddEntitiesToList({
  urls,
  groupsToken,
  savedLists,
}: SavedListsDataProps & { savedLists: Record<string, SavedEntitiesList> }) {
  return useUpdateListAction({
    urls,
    groupsToken,
    savedLists,
    method: 'PUT',
    action: (listUUID, entityUUIDs) => {
      const uuids = entityUUIDs instanceof Set ? Array.from(entityUUIDs) : [entityUUIDs];

      uuids.forEach((uuid) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        savedLists[listUUID].savedEntities[uuid] = {
          dateAddedToList: Date.now(),
        };
      });
    },
  });
}

function createActionHandler<Args extends unknown[]>(
  triggerAction: (...args: Args) => Promise<void>,
  errorMessage: string,
): (...args: Args) => void {
  return (...args: Args) => {
    triggerAction(...args).catch((error) => {
      console.error(errorMessage, error);
    });
  };
}

export function useRemoteSavedEntities(): SavedEntitiesStore & { isLoading: boolean } {
  const urls = useUkvApiURLs();
  const { groupsToken } = useAppContext();
  const { savedLists, savedEntities, isLoading } = useFetchSavedEntitiesAndLists({ urls, groupsToken });
  const params = { urls, groupsToken, savedEntities };

  const { triggerAction: saveTrigger } = useSaveEntity(params);
  const saveEntity = createActionHandler(saveTrigger, 'Failed to save entity');

  const { triggerAction: deleteTrigger } = useDeleteEntity(params);
  const deleteEntity = createActionHandler(deleteTrigger, 'Failed to delete entity');

  const { triggerAction: deleteEntitiesTrigger } = useDeleteEntities(params);
  const deleteEntities = createActionHandler(deleteEntitiesTrigger, 'Failed to delete entities');

  const { triggerAction: createListTrigger } = useCreateList({
    urls,
    groupsToken,
  });
  const createList = createActionHandler(createListTrigger, 'Failed to create list');

  const { triggerAction: addEntitiesToListTrigger } = useAddEntitiesToList({ urls, groupsToken, savedLists });
  const addEntitiesToList = createActionHandler(addEntitiesToListTrigger, 'Failed to add entities to list');

  return {
    savedEntities,
    savedLists,
    listsToBeDeleted: [] as string[],
    saveEntity,
    deleteEntity,
    deleteEntities,
    createList,
    addEntitiesToList,
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    addEntityToList: (listUUID: string, entityUUID: string) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    removeEntityFromList: (listUUID: string, entityUUID: string) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    removeEntitiesFromList: (listUUID: string, entityUUIDs: string[]) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    queueListToBeDeleted: (listUUID: string) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deleteQueuedLists: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    deleteList: (listUUID: string) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    editList: (list: Pick<SavedEntitiesList, 'title' | 'description'> & { listUUID: string }) => {},
    isLoading,
  };
}
