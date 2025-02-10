import { useCallback, useEffect, useMemo } from 'react';
import { KeyedMutator, useSWRConfig } from 'swr/_internal';
import { v4 as uuidv4 } from 'uuid';

import { SavedEntitiesList, SavedEntity, SavedListsEventCategories } from 'js/components/savedLists/types';
import {
  SAVED_ENTITIES_DEFAULT,
  SAVED_ENTITIES_KEY,
  SAVED_ENTITIES_LOCAL_STORAGE_KEY,
} from 'js/components/savedLists/constants';
import {
  useBuildUkvSWRKey,
  useDeleteList,
  useFetchSavedListsAndEntities,
  useUkvApiURLs,
  useUpdateSavedList,
} from 'js/components/savedLists/api';
import { SavedListsSuccessAlertType, useSavedListsAlertsStore } from 'js/stores/useSavedListsAlertsStore';
import { trackEvent } from 'js/helpers/trackers';
import { useEntitiesData } from 'js/hooks/useEntityData';
import { useFlaskDataContext } from 'js/components/Contexts';

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
  const globalMutateSavedList = useGlobalMutateSavedList();

  const handleUpdateSavedList = useCallback(
    async ({ body, listUUID }: { body: SavedEntitiesList; listUUID: string }) => {
      try {
        await updateSavedList({ body, listUUID });
        await globalMutateSavedList(listUUID);
      } catch (e) {
        console.error(e);
      }
    },
    [updateSavedList, globalMutateSavedList],
  );

  return { handleUpdateSavedList, isUpdating };
}

function useSetListsAndEntities() {
  const { handleUpdateSavedList } = useHandleUpdateSavedList();

  return useCallback(
    async ({
      savedLists,
      savedEntities,
    }: {
      savedLists: Record<string, SavedEntitiesList>;
      savedEntities: Record<string, SavedEntity>;
    }) => {
      // Update the saved entities list
      await handleUpdateSavedList({
        listUUID: SAVED_ENTITIES_KEY,
        body: {
          ...SAVED_ENTITIES_DEFAULT,
          savedEntities,
        },
      });

      // Update each saved list
      await Promise.all(
        Object.entries(savedLists).map(([listUUID, list]) =>
          handleUpdateSavedList({ body: list, listUUID }).catch((e) => console.error(e)),
        ),
      );
    },
    [handleUpdateSavedList],
  );
}

interface LocalSavedEntities {
  state: {
    savedLists: Record<string, SavedEntitiesList>;
    savedEntities: Record<string, SavedEntity>;
  };
}

function useCheckForLocalSavedEntities() {
  const setListsAndEntities = useSetListsAndEntities();
  const setTransferredToProfileAlert = useSavedListsAlertsStore((state) => state.setTransferredToProfileAlert);

  const updateList = useCallback(() => {
    const localEntities = localStorage.getItem(SAVED_ENTITIES_LOCAL_STORAGE_KEY);

    if (!localEntities) {
      return;
    }

    // If there are saved_entities in local storage, copy them over to the remote savedListsAndEntities, then
    // remove them from local storage.
    try {
      const parsedEntities: unknown = JSON.parse(localEntities);
      const { savedLists, savedEntities } = (parsedEntities as LocalSavedEntities).state;

      if (savedLists && savedEntities) {
        setListsAndEntities({ savedLists, savedEntities })
          .then(() => {
            setTransferredToProfileAlert(true);
            localStorage.removeItem(SAVED_ENTITIES_LOCAL_STORAGE_KEY);
            trackEvent({
              category: SavedListsEventCategories.LandingPage,
              action: 'Transfer Lists',
              label: {
                savedListsCount: Object.keys(savedLists).length,
                savedEntitiesCount: Object.keys(savedEntities).length,
              },
            });
          })
          .catch((e) => console.error(e));
      }
    } catch (error) {
      console.error('Failed to parse saved_entities from local storage:', error);
    }
  }, [setListsAndEntities, setTransferredToProfileAlert]);

  useEffect(() => {
    updateList();
  }, [updateList]);
}

function useListSavedListsAndEntities() {
  useCheckForLocalSavedEntities();
  const { savedListsAndEntities, isLoading, mutate } = useFetchSavedListsAndEntities();

  // Saved entities should always be first, then the rest should be sorted by date saved
  savedListsAndEntities.sort((a, b) => {
    if (a.key === 'savedEntities') return -1;
    if (b.key === 'savedEntities') return 1;
    return b.value.dateSaved - a.value.dateSaved;
  });

  // Convert savedListsAndEntities to a record
  const savedListsAndEntitiesRecord = useMemo(() => {
    return savedListsAndEntities.reduce<Record<string, SavedEntitiesList>>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  }, [savedListsAndEntities]);

  const savedEntities = !isLoading
    ? savedListsAndEntitiesRecord.savedEntities || { ...SAVED_ENTITIES_DEFAULT }
    : { ...SAVED_ENTITIES_DEFAULT };

  const savedLists = !isLoading
    ? Object.fromEntries(Object.entries(savedListsAndEntitiesRecord).filter(([key]) => key !== 'savedEntities'))
    : {};

  return { savedLists, savedEntities, savedListsAndEntities: savedListsAndEntitiesRecord, isLoading, mutate };
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

      trackEvent({
        category: SavedListsEventCategories.LandingPage,
        action: 'Create List',
        label: listUUID,
      });
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
          updatedEntities[uuid] = {
            dateAddedToList: Date.now(),
            dateSaved: Date.now(),
          };
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

function useMutateSavedListsAndEntities<T>(mutateSavedList?: KeyedMutator<T>) {
  const { mutate: mutateSavedLists } = useListSavedListsAndEntities();
  const mutate = useCallback(async () => {
    await Promise.all([mutateSavedLists(), mutateSavedList?.()]);
  }, [mutateSavedLists, mutateSavedList]);

  return mutate;
}

function useSavedListsActions({ savedListsAndEntities }: { savedListsAndEntities: Record<string, SavedEntitiesList> }) {
  const mutate = useMutateSavedListsAndEntities();
  const { createList, editList, modifyEntities, isUpdating } = useSavedListActions();
  const { deleteList, isDeleting } = useDeleteList();
  const setSuccessAlert = useSavedListsAlertsStore((state) => state.setSuccessAlert);

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
    trackEvent({
      category: SavedListsEventCategories.DetailPage,
      action: 'Edit List',
      label: listUUID,
    });
    await editList({ listUUID, list: savedListsAndEntities[listUUID], title, description });
    await mutate();
  }

  async function handleAddEntitiesToList({ listUUID, entityUUIDs }: { listUUID: string; entityUUIDs: Set<string> }) {
    await modifyEntities({ listUUID, list: savedListsAndEntities[listUUID], entityUUIDs, action: 'Add' });
    await mutate();
    setSuccessAlert(SavedListsSuccessAlertType.UpdatedLists);
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
    setSuccessAlert(SavedListsSuccessAlertType.UpdatedLists);
  }

  async function handleDeleteList({ listUUID }: { listUUID: string }) {
    trackEvent({
      category: SavedListsEventCategories.DetailPage,
      action: 'Delete List',
      label: listUUID,
    });
    await deleteList({ listUUID });
    await mutate();
    setSuccessAlert(SavedListsSuccessAlertType.DeletedList);
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
  const setSuccessAlert = useSavedListsAlertsStore((state) => state.setSuccessAlert);

  async function handleSaveEntities({ entityUUIDs }: { entityUUIDs: Set<string> }) {
    await modifyEntities({ listUUID: SAVED_ENTITIES_KEY, list: savedEntities, entityUUIDs, action: 'Add' });
    await mutate();
    setSuccessAlert(SavedListsSuccessAlertType.SavedEntity);
  }

  async function handleDeleteEntities({ entityUUIDs }: { entityUUIDs: Set<string> }) {
    await modifyEntities({ listUUID: SAVED_ENTITIES_KEY, list: savedEntities, entityUUIDs, action: 'Remove' });
    await mutate();
    setSuccessAlert(SavedListsSuccessAlertType.DeletedEntity);
  }

  function useHandleSaveEntity({ entityUUID }: { entityUUID: string }) {
    const {
      entity: { entity_type },
    } = useFlaskDataContext();
    const [entityData] = useEntitiesData([entityUUID], ['hubmap_id']);

    return useCallback(() => {
      handleSaveEntities({ entityUUIDs: new Set([entityUUID]) }).catch((error) => {
        console.error(error);
      });

      if (!entityData?.length) {
        return;
      }

      trackEvent({
        category: SavedListsEventCategories.EntityDetailPage(entity_type),
        action: 'Save Entity to Items',
        label: entityData[0].hubmap_id,
      });
    }, [entityUUID, entityData, entity_type]);
  }

  return {
    handleSaveEntities,
    handleDeleteEntities,
    useHandleSaveEntity,
    isUpdating,
  };
}

export default function useSavedLists() {
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
