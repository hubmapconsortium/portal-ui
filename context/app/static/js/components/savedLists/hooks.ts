import { useEffect, useRef } from 'react';
import { useLocalSavedEntitiesStore, useRemoteSavedEntitiesStore } from 'js/stores/useSavedEntitiesStore';
import { useAppContext } from 'js/components/Contexts';
import { SavedEntitiesList, SavedEntitiesStore } from 'js/components/savedLists/types';
import { useSavedListsAlerts } from 'js/stores/useSavedListsAlertsStore';
import { SAVED_ENTITIES_DEFAULT } from 'js/components/savedLists/constants';
import {
  useUkvApiURLs,
  useFetchSavedEntitiesAndLists,
  saveEntityRemote,
  saveEntitiesRemote,
  deleteEntityRemote,
  deleteEntitiesRemote,
  createListRemote,
  addEntityToListRemote,
  addEntitiesToListRemote,
  removeEntityFromListRemote,
  removeEntitiesFromListRemote,
  deleteListRemote,
  editListRemote,
  CopySavedItemsToRemoteStore,
} from 'js/components/savedLists/api';

const savedEntitiesSelector = (state: SavedEntitiesStore) => ({
  savedLists: state.savedLists,
  savedEntities: state.savedEntities,
  listsToBeDeleted: state.listsToBeDeleted,
  setEntities: state.setEntities,
  setLists: state.setLists,
  saveEntity: state.saveEntity,
  saveEntities: state.saveEntities,
  deleteEntity: state.deleteEntity,
  deleteEntities: state.deleteEntities,
  createList: state.createList,
  addEntityToList: state.addEntityToList,
  addEntitiesToList: state.addEntitiesToList,
  removeEntityFromList: state.removeEntityFromList,
  removeEntitiesFromList: state.removeEntitiesFromList,
  queueListToBeDeleted: state.queueListToBeDeleted,
  deleteQueuedLists: state.deleteQueuedLists,
  deleteList: state.deleteList,
  editList: state.editList,
});

function useSavedLists() {
  const urls = useUkvApiURLs();
  const { groupsToken, isAuthenticated } = useAppContext();
  const { setTransferredToProfile } = useSavedListsAlerts();
  const { savedEntities, savedLists, isFirstRemoteFetch, isLoading } = useFetchSavedEntitiesAndLists({
    urls,
    groupsToken,
  });

  const localStore = useLocalSavedEntitiesStore(savedEntitiesSelector);
  const remoteStore = useRemoteSavedEntitiesStore(savedEntitiesSelector);
  const store = isAuthenticated ? remoteStore : localStore;

  const storeHasBeenSetRef = useRef(false);
  const wasLoadingRef = useRef(isLoading);

  useEffect(() => {
    if (!isAuthenticated || isLoading || !wasLoadingRef.current) {
      return;
    }

    if (isFirstRemoteFetch) {
      // If a user logs into their account for the first time since the My Lists update
      // on a device that has saved entities and lists, we copy those to their remote store and show them an alert.
      // This only happens once.
      setTransferredToProfile(true);
      const { savedEntities: savedEntitiesLocal, savedLists: savedListsLocal } = useLocalSavedEntitiesStore.getState();

      CopySavedItemsToRemoteStore({ savedEntitiesLocal, savedListsLocal, urls, groupsToken });
      store.setEntities(savedEntitiesLocal);
      store.setLists(savedListsLocal);
    } else {
      // If the user already has saved entities and lists in their remote store, we need to copy those over to the local store.
      store.setEntities(savedEntities);
      store.setLists(savedLists);
    }
    storeHasBeenSetRef.current = true;
    wasLoadingRef.current = isLoading;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  const params = { urls, groupsToken, savedEntities, savedLists };

  const handleStoreOperation = async <T>(remoteOperation: () => Promise<T>, localOperation: () => void) => {
    if (isAuthenticated) {
      await remoteOperation();
      localOperation();
    } else {
      localOperation();
    }
  };

  return {
    ...store,
    saveEntity: (entityUUID: string) => {
      handleStoreOperation(
        () => saveEntityRemote({ ...params, entityUUID }),
        () => store.saveEntity(entityUUID),
      ).catch((err) => console.error('Failed to save entity:', err));
    },
    saveEntities: (entityUUIDs: Set<string>) => {
      handleStoreOperation(
        () => saveEntitiesRemote({ ...params, entityUUIDs }),
        () => store.saveEntities(entityUUIDs),
      ).catch((err) => console.error('Failed to save entity:', err));
    },
    deleteEntity: (entityUUID: string) => {
      handleStoreOperation(
        () => deleteEntityRemote({ ...params, entityUUID }),
        () => store.deleteEntity(entityUUID),
      ).catch((err) => console.error('Failed to delete entity:', err));
    },
    deleteEntities: (entityUUIDs: Set<string>) => {
      handleStoreOperation(
        () => deleteEntitiesRemote({ ...params, entityUUIDs }),
        () => store.deleteEntities(entityUUIDs),
      ).catch((err) => console.error('Failed to delete entities:', err));
    },
    createList: (list: Pick<SavedEntitiesList, 'title' | 'description'>) => {
      handleStoreOperation(
        () => createListRemote({ ...params, list }),
        () => store.createList(list),
      ).catch((err) => console.error('Failed to create list:', err));
    },
    addEntityToList: (listUUID: string, entityUUID: string) => {
      handleStoreOperation(
        () => addEntityToListRemote({ ...params, listUUID, entityUUID }),
        () => store.addEntityToList(listUUID, entityUUID),
      ).catch((err) => console.error('Failed to add entity to list:', err));
    },
    addEntitiesToList: (listUUID: string, entityUUIDs: string[]) => {
      handleStoreOperation(
        () => addEntitiesToListRemote({ ...params, listUUID, entityUUIDs }),
        () => store.addEntitiesToList(listUUID, entityUUIDs),
      ).catch((err) => console.error('Failed to add entity to list:', err));
    },
    removeEntityFromList: (listUUID: string, entityUUID: string) => {
      handleStoreOperation(
        () => removeEntityFromListRemote({ ...params, listUUID, entityUUID }),
        () => store.removeEntityFromList(listUUID, entityUUID),
      ).catch((err) => console.error('Failed to remove entity from list:', err));
    },
    removeEntitiesFromList: (listUUID: string, entityUUIDs: string[]) => {
      handleStoreOperation(
        () => removeEntitiesFromListRemote({ ...params, listUUID, entityUUIDs }),
        () => store.removeEntitiesFromList(listUUID, entityUUIDs),
      ).catch((err) => console.error('Failed to remove entities from list:', err));
    },
    queueListToBeDeleted: (listUUID: string) => {
      handleStoreOperation(
        () => deleteListRemote({ ...params, listUUID }),
        () => store.queueListToBeDeleted(listUUID),
      ).catch((err) => console.error('Failed to queue list for deletion:', err));
    },
    deleteQueuedLists: () => {
      store.deleteQueuedLists();
    },
    editList: ({ title, description, listUUID }: { title: string; description: string; listUUID: string }) => {
      handleStoreOperation(
        () => editListRemote({ ...params, title, description, listUUID }),
        () => store.editList({ title, description, listUUID }),
      ).catch((err) => console.error('Failed to edit list:', err));
    },
  };
}

function useSavedListsAndEntities() {
  const { savedLists, savedEntities } = useSavedLists();

  const savedListsAndEntities: Record<string, SavedEntitiesList> = {
    savedEntities: {
      ...SAVED_ENTITIES_DEFAULT,
      savedEntities,
    },
    ...savedLists,
  };

  return {
    savedListsAndEntities,
  };
}

export { useSavedLists, useSavedListsAndEntities };
