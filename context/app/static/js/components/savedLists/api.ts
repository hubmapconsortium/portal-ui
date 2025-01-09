import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher } from 'js/helpers/swr';
import { SavedEntitiesList, SavedEntity } from 'js/components/savedLists/types';
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

type EntitiesListValue = Record<string, SavedEntitiesList> | Record<string, SavedEntity>;

interface SavedListsDataProps {
  urls: ReturnType<typeof apiUrls>;
  groupsToken: string;
}

function useFetchSavedEntitiesAndLists({ urls, groupsToken }: SavedListsDataProps) {
  const { data, isLoading } = useSWR([urls.keys, groupsToken], ([url, token]: string[]) =>
    fetcher<
      {
        key: string;
        value: EntitiesListValue;
      }[]
    >({ url, requestInit: { headers: { Authorization: `Bearer ${token}` } } }),
  );

  let savedLists = {};
  let savedEntities = {};

  if (data && !isLoading) {
    savedEntities = data.find(({ key }: { key: string }) => key === 'savedEntities')?.value ?? {};
    savedLists = data
      .filter(({ key }: { key: string }) => key !== 'savedEntities')
      .reduce((acc: EntitiesListValue, { key, value }: { key: string; value: EntitiesListValue }) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  return { savedLists, savedEntities, isLoading };
}

function useEntityAction({
  urls,
  groupsToken,
  savedEntities,
  method,
  action,
}: SavedListsDataProps & {
  savedEntities: Record<string, SavedEntity>;
  method: 'PUT' | 'DELETE';
  action: (savedEntities: Record<string, SavedEntity>, entityUUID: string) => void;
}) {
  const { trigger, isMutating } = useSWRMutation(
    [urls.key('savedEntities'), groupsToken],
    async ([url, token]: string[], { arg: { entityUUID } }: { arg: { entityUUID: string } }) => {
      action(savedEntities, entityUUID);

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savedEntities),
      });

      if (!response.ok) {
        console.error(`Failed to update entity ${entityUUID}`, await response.text());
      }
    },
  );

  return {
    triggerAction: (entityUUID: string) => trigger({ entityUUID }),
    isMutating,
  };
}

function useDeleteEntity({
  urls,
  groupsToken,
  savedEntities,
}: SavedListsDataProps & { savedEntities: Record<string, SavedEntity> }) {
  return useEntityAction({
    urls,
    groupsToken,
    savedEntities,
    method: 'DELETE',
    action: (entities, entityUUID) => {
      delete entities[entityUUID];
    },
  });
}

function useSaveEntity({
  urls,
  groupsToken,
  savedEntities,
}: SavedListsDataProps & { savedEntities: Record<string, SavedEntity> }) {
  return useEntityAction({
    urls,
    groupsToken,
    savedEntities,
    method: 'PUT',
    action: (entities, entityUUID) => {
      entities[entityUUID] = {
        dateSaved: Date.now(),
        dateAddedToList: Date.now(),
      };
    },
  });
}

export function useRemoteSavedEntities() {
  const urls = useUkvApiURLs();
  const { groupsToken } = useAppContext();
  const { savedLists, savedEntities, isLoading } = useFetchSavedEntitiesAndLists({ urls, groupsToken });

  const { triggerAction: saveEntity } = useSaveEntity({
    urls,
    groupsToken,
    savedEntities,
  });
  const { triggerAction: deleteEntity } = useDeleteEntity({
    urls,
    groupsToken,
    savedEntities,
  });

  return {
    savedLists,
    savedEntities,
    isLoading,
    listsToBeDeleted: [] as string[],
    saveEntity,
    deleteEntity,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deleteQueuedLists: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    editList: (list: Pick<SavedEntitiesList, 'title' | 'description'> & { listUUID: string }) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    createList: (list: Pick<SavedEntitiesList, 'title' | 'description'>) => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    deleteEntities: (entityUUIDs: Set<string>) => {},
  };
}
