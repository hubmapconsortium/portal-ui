/* eslint-disable no-param-reassign */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

import immer from './immerMiddleware';

const useSavedEntitiesStore = create(
  persist(
    immer((set, get) => ({
      savedEntities: {},
      saveEntity: (entityUuid, entity_type, group_name, display_doi) =>
        !(entityUuid in get().savedEntities) &&
        set((state) => {
          state.savedEntities[entityUuid] = { dateSaved: Date.now(), entity_type, group_name, display_doi };
        }),
      deleteEntity: (entityUuid) =>
        set((state) => {
          delete state.savedEntities[entityUuid];
        }),
      deleteEntities: (entityUuids) => {
        entityUuids.forEach((uuid) => {
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
      addEntityToList: (listUuid, entityUuid) => {
        const { entity_type, group_name, display_doi } = get().savedEntities[entityUuid];
        set((state) => {
          state.savedLists[listUuid].savedEntities[entityUuid] = {
            dateAddedToList: Date.now(),
            entity_type,
            group_name,
            display_doi,
          };
          state.savedLists[listUuid].dateLastModified = Date.now();
        });
      },
      addEntitiesToList: (listUuid, entityUuids) => {
        const timestamp = Date.now();
        entityUuids.forEach((uuid) => {
          const { entity_type, group_name, display_doi } = get().savedEntities[uuid];
          set((state) => {
            state.savedLists[listUuid].savedEntities[uuid] = {
              dateAddedToList: timestamp,
              entity_type,
              group_name,
              display_doi,
            };
          });
        });
        set((state) => {
          state.savedLists[listUuid].dateLastModified = Date.now();
        });
      },
      removeEntityFromList: (listUuid, entityUuid) => {
        set((state) => {
          delete state.savedLists[listUuid].savedEntities[entityUuid];
        });
      },
      removeEntitiesFromList: (listUuid, entityUuids) => {
        entityUuids.forEach((uuid) => {
          set((state) => {
            delete state.savedLists[listUuid].savedEntities[uuid];
          });
        });
      },
      listsToBeDeleted: [],
      queueListToBeDeleted: (listUuid) => {
        if (!get().listsToBeDeleted.includes(listUuid)) {
          set((state) => {
            state.listsToBeDeleted.push(listUuid);
          });
        }
      },
      deleteQueuedLists: () => {
        get().listsToBeDeleted.forEach((listUuid) =>
          set((state) => {
            delete state.savedLists[listUuid];
          }),
        );
        set((state) => {
          state.listsToBeDeleted = [];
        });
      },
      deleteList: (listUuid) => {
        set((state) => {
          delete state.savedLists[listUuid];
        });
      },
      editList: ({ listUuid, title, description }) => {
        set((state) => {
          state.savedLists[listUuid].title = title;
          state.savedLists[listUuid].description = description;
        });
      },
    })),
    {
      name: 'saved_entities',
    },
  ),
);

export default useSavedEntitiesStore;
