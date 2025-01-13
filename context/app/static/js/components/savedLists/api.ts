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

function useFetchSavedEntitiesAndLists({ urls, groupsToken }: SavedListsDataProps) {
  const { data, isLoading } = useSWR([urls.keys, groupsToken], ([url, token]: string[]) =>
    fetcher<{ key: string; value: SavedEntitiesList }[]>({
      url,
      requestInit: { headers: { Authorization: `Bearer ${token}` } },
    }),
  );

  const savedEntities: Record<string, SavedEntity> = {};
  let savedLists: Record<string, SavedEntitiesList> = {};

  if (data && !isLoading) {
    const savedEntitiesObject = data.find((item) => item.key === 'savedEntities');

    if (savedEntitiesObject) {
      savedEntities.savedEntities = savedEntitiesObject.value;
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
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...list,
          dateSaved: Date.now(),
          dateLastModified: Date.now(),
          savedEntities: {},
        }),
      });

      if (!response.ok) {
        console.error(`Failed to create list`, await response.text());
      }
    },
  );

  return {
    triggerAction: (list: Pick<SavedEntitiesList, 'title' | 'description'>) => trigger({ list }),
    isMutating,
  };
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

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Saved Entities',
          description: 'Entities saved by the user',
          dateSaved: Date.now(),
          dateModified: Date.now(),
          savedEntities,
        }),
      });

      if (!response.ok) {
        console.error(`Failed to update entities`, await response.text());
      }
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

function createActionHandler<T>(triggerAction: (arg: T) => Promise<void>, errorMessage: string): (arg: T) => void {
  return (arg: T) => {
    triggerAction(arg).catch((error) => {
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

  return {
    savedEntities,
    savedLists,
    listsToBeDeleted: [] as string[],
    saveEntity,
    deleteEntity,
    deleteEntities,
    createList,
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    addEntityToList: (listUUID: string, entityUUID: string) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    addEntitiesToList: (listUUID: string, entityUUIDs: string[]) => {},
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
