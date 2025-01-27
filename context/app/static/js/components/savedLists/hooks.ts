import { useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import { SAVED_ENTITIES_DEFAULT, SAVED_ENTITIES_KEY } from 'js/components/savedLists/constants';
import {
  useBuildUkvSWRKey,
  useDeleteList,
  useFetchSavedListsAndEntities,
  useUkvApiURLs,
  useUpdateSavedList,
} from 'js/components/savedLists/api';
import { KeyedMutator, useSWRConfig } from 'swr/_internal';

function useListSavedListsAndEntities() {
  const { savedListsAndEntities, isLoading, mutate } = useFetchSavedListsAndEntities();

  const savedListsAndEntitiesRecord = useMemo(() => {
    return savedListsAndEntities.reduce<Record<string, SavedEntitiesList>>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }, [savedListsAndEntities]);

  let savedEntities: SavedEntitiesList = { ...SAVED_ENTITIES_DEFAULT };
  let savedLists: Record<string, SavedEntitiesList> = {};

  if (!isLoading) {
    savedEntities = savedListsAndEntitiesRecord.savedEntities || { ...SAVED_ENTITIES_DEFAULT };

    savedLists = Object.fromEntries(
      Object.entries(savedListsAndEntitiesRecord).filter(([key]) => key !== 'savedEntities'),
    );
  }

  return { savedLists, savedEntities, savedListsAndEntities: savedListsAndEntitiesRecord, isLoading, mutate };
}

function useMutateSavedListsAndEntities<T>(mutateSavedList?: KeyedMutator<T>) {
  const { mutate: mutateSavedLists } = useListSavedListsAndEntities();
  const mutate = useCallback(async () => {
    await Promise.all([mutateSavedLists(), mutateSavedList?.()]);
  }, [mutateSavedLists, mutateSavedList]);

  return mutate;
}

function useGlobalMutateSavedList() {
  const { buildKey } = useBuildUkvSWRKey();
  const urls = useUkvApiURLs();
  const { mutate } = useSWRConfig();

  return useCallback(
    async (entityUUID: string) => {
      await mutate(buildKey({ url: urls.key(entityUUID) }));
    },
    [buildKey, urls, mutate],
  );
}

function useHandleUpdateSavedList() {
  const { updateSavedList, isUpdating } = useUpdateSavedList();
  const mutateSavedLists = useMutateSavedListsAndEntities();
  const globalMutateSavedList = useGlobalMutateSavedList();

  const handleUpdateSavedList = useCallback(
    async ({ body, listUUID }: { body: SavedEntitiesList; listUUID: string }) => {
      try {
        await updateSavedList({ body, listUUID });
        await mutateSavedLists();
        await globalMutateSavedList(listUUID);
      } catch (e) {
        console.error(e);
      }
    },
    [updateSavedList, mutateSavedLists, globalMutateSavedList],
  );

  return { handleUpdateSavedList, isUpdating };
}

function useSavedListActions() {
  const { handleUpdateSavedList, isUpdating } = useHandleUpdateSavedList();

  const updateList = useCallback(
    async ({
      listUUID,
      list,
      updates,
    }: {
      listUUID: string;
      list: SavedEntitiesList;
      updates?: Partial<SavedEntitiesList>;
    }) => {
      await handleUpdateSavedList({
        listUUID,
        body: {
          ...list,
          ...updates,
          dateLastModified: Date.now(),
        },
      });
    },
    [handleUpdateSavedList],
  );

  const createList = useCallback(
    async ({ title, description }: { title: string; description: string }) => {
      const listUUID = uuidv4();
      const list = { title, description, dateSaved: Date.now(), dateLastModified: Date.now(), savedEntities: {} };
      await updateList({ listUUID, list });
    },
    [updateList],
  );

  const editList = useCallback(
    async ({
      listUUID,
      list,
      title,
      description,
    }: {
      listUUID: string;
      list: SavedEntitiesList;
      title: string;
      description: string;
    }) => {
      await updateList({ listUUID, list, updates: { title, description } });
    },
    [updateList],
  );

  const modifyEntities = useCallback(
    async ({
      listUUID,
      list,
      entityUUIDs,
      action,
    }: {
      listUUID: string;
      list: SavedEntitiesList;
      entityUUIDs: Set<string>;
      action: 'Add' | 'Remove';
    }) => {
      const updatedEntities = { ...list.savedEntities };
      if (action === 'Add') {
        entityUUIDs.forEach((uuid) => {
          updatedEntities[uuid] = {};
        });
      } else {
        entityUUIDs.forEach((uuid) => delete updatedEntities[uuid]);
      }
      await updateList({ listUUID, list, updates: { savedEntities: updatedEntities } });
    },
    [updateList],
  );

  return { createList, editList, modifyEntities, isUpdating };
}

function useSavedListsActions({ savedListsAndEntities }: { savedListsAndEntities: Record<string, SavedEntitiesList> }) {
  const mutate = useMutateSavedListsAndEntities();
  const { createList, editList, modifyEntities, isUpdating } = useSavedListActions();
  const { deleteList, isDeleting } = useDeleteList();

  async function handleCreateList({ title, description }: { title: string; description: string }) {
    await createList({ title, description });
    await mutate();
  }

  async function handleEditList({
    listUUID,
    title,
    description,
  }: {
    listUUID: string;
    title: string;
    description: string;
  }) {
    await editList({ listUUID, list: savedListsAndEntities[listUUID], title, description });
    await mutate();
  }

  async function handleAddEntitiesToList({ listUUID, entityUUIDs }: { listUUID: string; entityUUIDs: Set<string> }) {
    await modifyEntities({ listUUID, list: savedListsAndEntities[listUUID], entityUUIDs, action: 'Add' });
    await mutate();
  }

  async function handleRemoveEntitiesFromList({
    listUUID,
    entityUUIDs,
  }: {
    listUUID: string;
    entityUUIDs: Set<string>;
  }) {
    await modifyEntities({ listUUID, list: savedListsAndEntities[listUUID], entityUUIDs, action: 'Remove' });
    await mutate();
  }

  async function handleDeleteList({ listUUID }: { listUUID: string }) {
    await deleteList({ listUUID });
    await mutate();
  }

  return {
    handleCreateList,
    handleEditList,
    handleAddEntitiesToList,
    handleRemoveEntitiesFromList,
    handleDeleteList,
    isUpdating,
    isDeleting,
  };
}

function useSavedEntitiesActions({ savedEntities }: { savedEntities: SavedEntitiesList }) {
  const mutate = useMutateSavedListsAndEntities();
  const { modifyEntities, isUpdating } = useSavedListActions();

  async function handleSaveEntities({ entityUUIDs }: { entityUUIDs: Set<string> }) {
    await modifyEntities({ listUUID: SAVED_ENTITIES_KEY, list: savedEntities, entityUUIDs, action: 'Add' });
    await mutate();
  }

  async function handleDeleteEntities({ entityUUIDs }: { entityUUIDs: Set<string> }) {
    await modifyEntities({ listUUID: SAVED_ENTITIES_KEY, list: savedEntities, entityUUIDs, action: 'Remove' });
    await mutate();
  }

  return {
    handleSaveEntities,
    handleDeleteEntities,
    isUpdating,
  };
}

function useSavedLists() {
  const { isLoading, savedLists, savedEntities, savedListsAndEntities } = useListSavedListsAndEntities();

  return {
    isLoading,
    savedLists,
    savedEntities,
    savedListsAndEntities,
    ...useSavedListsActions({ savedListsAndEntities }),
    ...useSavedEntitiesActions({ savedEntities }),
  };
}

// function useSavedLists() {
//   const urls = useUkvApiURLs();
//   const { groupsToken, isAuthenticated } = useAppContext();
//   const { setTransferredToProfileAlert } = useSavedListsAlertsStore();
//   const { savedEntities, savedLists, isFirstRemoteFetch, isLoading } = useFetchSavedEntitiesAndLists({
//     urls,
//     groupsToken,
//     isAuthenticated,
//   });

//   const response = useSavedListsTest();
//   console.log(response);

//   const wasLoadingRef = useRef(isLoading);

//   useEffect(() => {
//     if (!isAuthenticated || isLoading || !wasLoadingRef.current) {
//       return;
//     }

//     if (isFirstRemoteFetch) {
//       // If a user logs into their account for the first time since the My Lists update
//       // on a device that has saved entities and lists, we copy those to their remote store and show them an alert.
//       // This only happens once.
//       setTransferredToProfileAlert(true);
//       const { savedEntities: savedEntitiesLocal, savedLists: savedListsLocal } = useLocalSavedEntitiesStore.getState();

//       copySavedItemsToRemoteStore({ savedEntitiesLocal, savedListsLocal, urls, groupsToken });
//     }
//     wasLoadingRef.current = isLoading;
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated, isLoading]);

//   const params = { urls, groupsToken, savedEntities, savedLists };

//   // Sort saved lists with most recently saved first
//   const sortedSavedLists = useMemo(() => {
//     return Object.entries(savedLists)
//       .sort(([, a], [, b]) => b.dateSaved - a.dateSaved)
//       .reduce(
//         (acc, [key, value]) => {
//           acc[key] = value;
//           return acc;
//         },
//         {} as Record<string, SavedEntitiesList>,
//       );
//   }, [savedLists]);

//   return {
//     isLoading,
//     savedLists: sortedSavedLists,
//     savedEntities,
//     saveEntity: (entityUUID: string) =>
//       saveEntityRemote({ ...params, entityUUID }).catch((err) => console.error('Failed to save entity:', err)),
//   saveEntities: (entityUUIDs: Set<string>) => {
//     handleStoreOperation(
//       () => saveEntitiesRemote({ ...params, entityUUIDs }),
//       () => store.saveEntities(entityUUIDs),
//     ).catch((err) => console.error('Failed to save entities:', err));
//   },
//   deleteEntity: (entityUUID: string) => {
//     handleStoreOperation(
//       () => deleteEntityRemote({ ...params, entityUUID }),
//       () => store.deleteEntity(entityUUID),
//     ).catch((err) => console.error('Failed to delete entity:', err));
//   },
//   deleteEntities: (entityUUIDs: Set<string>) => {
//     handleStoreOperation(
//       () => deleteEntitiesRemote({ ...params, entityUUIDs }),
//       () => store.deleteEntities(entityUUIDs),
//     ).catch((err) => console.error('Failed to delete entities:', err));
//   },
//   createList: (list: Pick<SavedEntitiesList, 'title' | 'description'>) => {
//     const uuid = uuidv4();
//     handleStoreOperation(
//       () => createListRemote({ ...params, list, uuid }),
//       () => store.createList(list, uuid),
//     ).catch((err) => console.error('Failed to create list:', err));
//   },
//   addEntityToList: (listUUID: string, entityUUID: string) => {
//     handleStoreOperation(
//       () => addEntityToListRemote({ ...params, listUUID, entityUUID }),
//       () => store.addEntityToList(listUUID, entityUUID),
//     ).catch((err) => console.error('Failed to add entity to list:', err));
//   },
//   addEntitiesToList: (listUUID: string, entityUUIDs: string[]) => {
//     handleStoreOperation(
//       () => addEntitiesToListRemote({ ...params, listUUID, entityUUIDs }),
//       () => store.addEntitiesToList(listUUID, entityUUIDs),
//     ).catch((err) => console.error('Failed to add entities to list:', err));
//   },
//   removeEntityFromList: (listUUID: string, entityUUID: string) => {
//     handleStoreOperation(
//       () => removeEntityFromListRemote({ ...params, listUUID, entityUUID }),
//       () => store.removeEntityFromList(listUUID, entityUUID),
//     ).catch((err) => console.error('Failed to remove entity from list:', err));
//   },
//   removeEntitiesFromList: (listUUID: string, entityUUIDs: string[]) => {
//     handleStoreOperation(
//       () => removeEntitiesFromListRemote({ ...params, listUUID, entityUUIDs }),
//       () => store.removeEntitiesFromList(listUUID, entityUUIDs),
//     ).catch((err) => console.error('Failed to remove entities from list:', err));
//   },
//   queueListToBeDeleted: (listUUID: string) => {
//     handleStoreOperation(
//       () => deleteListRemote({ ...params, listUUID }),
//       () => store.queueListToBeDeleted(listUUID),
//     ).catch((err) => console.error('Failed to queue list for deletion:', err));
//   },
//   deleteQueuedLists: () => {
//     store.deleteQueuedLists();
//   },
//   editList: ({ title, description, listUUID }: { title: string; description: string; listUUID: string }) => {
//     handleStoreOperation(
//       () => editListRemote({ ...params, title, description, listUUID }),
//       () => store.editList({ title, description, listUUID }),
//     ).catch((err) => console.error('Failed to edit list:', err));
//   },
//   };
// }

export { useHandleUpdateSavedList, useSavedLists };
