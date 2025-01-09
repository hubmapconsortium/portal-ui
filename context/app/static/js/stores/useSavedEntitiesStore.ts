import { v4 as uuidv4 } from 'uuid';

import { createImmerPersist } from 'js/helpers/zustand';

export interface SavedEntity {
  dateSaved?: number;
  dateAddedToList?: number;
}

export interface SavedEntitiesList {
  title: string;
  description: string;
  dateSaved: number;
  dateLastModified: number;
  savedEntities: Record<string, SavedEntity>;
}

interface SavedEntitiesState {
  savedEntities: Record<string, SavedEntity>;
  savedLists: Record<string, SavedEntitiesList>;
  listsToBeDeleted: string[];
}

interface SavedEntitiesActions {
  saveEntity: (entityUUID: string) => void;
  deleteEntity: (entityUUID: string) => void;
  deleteEntities: (entityUUIDs: Set<string>) => void;
  createList: (list: Pick<SavedEntitiesList, 'title' | 'description'>) => void;
  addEntityToList: (listUUID: string, entityUUID: string) => void;
  addEntitiesToList: (listUUID: string, entityUUIDs: string[]) => void;
  removeEntityFromList: (listUUID: string, entityUUID: string) => void;
  removeEntitiesFromList: (listUUID: string, entityUUIDs: string[]) => void;
  queueListToBeDeleted: (listUUID: string) => void;
  deleteQueuedLists: () => void;
  deleteList: (listUUID: string) => void;
  editList: (list: Pick<SavedEntitiesList, 'title' | 'description'> & { listUUID: string }) => void;
}

export type SavedEntitiesStore = SavedEntitiesState & SavedEntitiesActions;

const useSavedEntitiesStore = createImmerPersist<SavedEntitiesStore>(
  (set, get) => ({
    savedEntities: {},
    saveEntity: (entityUUID) =>
      !(entityUUID in get().savedEntities) &&
      set((state) => {
        state.savedEntities[entityUUID] = { dateSaved: Date.now() };
      }),
    deleteEntity: (entityUUID) =>
      set((state) => {
        delete state.savedEntities[entityUUID];
      }),
    deleteEntities: (entityUUIDs) => {
      entityUUIDs.forEach((uuid) => {
        set((state) => {
          delete state.savedEntities[uuid];
        });
      });
    },
    savedLists: {},
    createList: ({ title, description }) => {
      const uuid = uuidv4();
      set((state) => {
        state.savedLists[uuid] = {
          // the Donor, Sample, and Datasets are objects to avoid duplicates. Normally they would be sets, but objects work better with local storage
          title,
          savedEntities: {},
          description,
          dateSaved: Date.now(),
          dateLastModified: Date.now(),
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
  }),
  {
    name: 'saved_entities',
  },
);

export default useSavedEntitiesStore;
