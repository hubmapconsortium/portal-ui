import useSWR from 'swr';
import { fetcher } from 'js/helpers/swr';
import { SavedEntitiesList, SavedEntity } from 'js/stores/useSavedEntitiesStore';
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

export function useFetchSavedEntitiesAndLists() {
  const urls = useUkvApiURLs();
  const { groupsToken } = useAppContext();

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

export function useRemoteSavedEntities() {
  const { savedLists, savedEntities, isLoading } = useFetchSavedEntitiesAndLists();

  return {
    savedLists,
    savedEntities,
    isLoading,
    listsToBeDeleted: [] as string[],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    deleteQueuedLists: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    deleteEntities: (entityUUIDs: Set<string>) => {},
  };
}
