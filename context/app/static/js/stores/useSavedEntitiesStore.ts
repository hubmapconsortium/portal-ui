import { v4 as uuidv4 } from 'uuid';
import { SavedEntitiesStore } from 'js/components/savedLists/types';
import { createImmer, createImmerPersist } from 'js/helpers/zustand';

type StoreInitializer = (
  set: (
    nextStateOrUpdater: SavedEntitiesStore | Partial<SavedEntitiesStore> | ((state: SavedEntitiesStore) => void),
    shouldReplace?: boolean,
  ) => void,
  get: () => SavedEntitiesStore,
) => SavedEntitiesStore;

const savedEntitiesStoreInitializer: StoreInitializer = (set, get) => ({
  savedEntities: {},
  setEntities: (entities) =>
    set((state) => {
      state.savedEntities = entities;
    }),
  setLists: (lists) =>
    set((state) => {
      state.savedLists = lists;
    }),
  saveEntity: (entityUUID) =>
    !(entityUUID in get().savedEntities) &&
    set((state) => {
      state.savedEntities[entityUUID] = { dateSaved: Date.now() };
    }),
  saveEntities: (entityUUIDs: Set<string>) => {
    set((state) => {
      Array.from(entityUUIDs).forEach((uuid) => {
        state.savedEntities[uuid] = { dateSaved: Date.now() };
      });
    });
  },
  deleteEntity: (entityUUID) => {
    set((state) => {
      const updatedSavedEntities = { ...state.savedEntities };
      delete updatedSavedEntities[entityUUID];
      return { savedEntities: updatedSavedEntities };
    });
  },
  deleteEntities: (entityUUIDs) => {
    set((state) => {
      const updatedSavedEntities = { ...state.savedEntities };
      entityUUIDs.forEach((uuid) => {
        delete updatedSavedEntities[uuid];
      });
      return { savedEntities: updatedSavedEntities };
    });
  },
  savedLists: {},
  createList: ({ title, description }) => {
    const uuid = uuidv4();
    set((state) => {
      return {
        savedLists: {
          ...state.savedLists,
          [uuid]: {
            title,
            savedEntities: {},
            description,
            dateSaved: Date.now(),
            dateLastModified: Date.now(),
          },
        },
      };
    });
  },
  addEntityToList: (listUUID, entityUUID) => {
    set((state) => {
      state.savedLists[listUUID].savedEntities[entityUUID] = {
        dateAddedToList: Date.now(),
      };
      state.savedLists[listUUID].dateLastModified = Date.now();
    });
  },
  addEntitiesToList: (listUUID, entityUUIDs) => {
    const timestamp = Date.now();
    entityUUIDs.forEach((uuid) => {
      set((state) => {
        state.savedLists[listUUID].savedEntities[uuid] = {
          dateAddedToList: timestamp,
        };
      });
    });
    set((state) => {
      state.savedLists[listUUID].dateLastModified = Date.now();
    });
  },
  removeEntityFromList: (listUUID, entityUUID) => {
    set((state) => {
      delete state.savedLists[listUUID].savedEntities[entityUUID];
    });
  },
  removeEntitiesFromList: (listUUID, entityUUIDs) => {
    entityUUIDs.forEach((uuid) => {
      set((state) => {
        delete state.savedLists[listUUID].savedEntities[uuid];
      });
    });
  },
  listsToBeDeleted: [],
  queueListToBeDeleted: (listUUID) => {
    if (!get().listsToBeDeleted.includes(listUUID)) {
      set((state) => {
        state.listsToBeDeleted.push(listUUID);
      });
    }
  },
  deleteQueuedLists: () => {
    get().listsToBeDeleted.forEach((listUUID) =>
      set((state) => {
        delete state.savedLists[listUUID];
      }),
    );
    set((state) => {
      state.listsToBeDeleted = [];
    });
  },
  deleteList: (listUUID) => {
    set((state) => {
      delete state.savedLists[listUUID];
    });
  },
  editList: ({ listUUID, title, description }) => {
    set((state) => {
      state.savedLists[listUUID].title = title;
      state.savedLists[listUUID].description = description;
    });
  },
});

const useLocalSavedEntitiesStore = createImmerPersist<SavedEntitiesStore>(savedEntitiesStoreInitializer, {
  name: 'local_saved_entities',
});
const useRemoteSavedEntitiesStore = createImmer<SavedEntitiesStore>(savedEntitiesStoreInitializer);

export { useLocalSavedEntitiesStore, useRemoteSavedEntitiesStore };
