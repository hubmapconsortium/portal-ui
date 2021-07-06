/* eslint-disable no-param-reassign */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import immer from './immerMiddleware';

const useSavedEntitiesStore = create(
  persist(
    immer((set, get) => ({
      savedEntities: {},
      saveEntity: (entityUUID, entity_type, group_name, hubmap_id) =>
        !(entityUUID in get().savedEntities) &&
        set((state) => {
          state.savedEntities[entityUUID] = { dateSaved: Date.now(), entity_type, group_name, hubmap_id };
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
        const { entity_type, group_name, hubmap_id } = get().savedEntities[entityUUID];
        set((state) => {
          state.savedLists[listUUID].savedEntities[entityUUID] = {
            dateAddedToList: Date.now(),
            entity_type,
            group_name,
            hubmap_id,
          };
          state.savedLists[listUUID].dateLastModified = Date.now();
        });
      },
      addEntitiesToList: (listUUID, entityUUIDs) => {
        const timestamp = Date.now();
        entityUUIDs.forEach((uuid) => {
          const { entity_type, group_name, hubmap_id } = get().savedEntities[uuid];
          set((state) => {
            state.savedLists[listUUID].savedEntities[uuid] = {
              dateAddedToList: timestamp,
              entity_type,
              group_name,
              hubmap_id,
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
    })),
    {
      name: 'saved_entities',
    },
  ),
);

export default useSavedEntitiesStore;
