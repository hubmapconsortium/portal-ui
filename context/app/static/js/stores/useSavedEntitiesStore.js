/* eslint-disable no-param-reassign */
import create from 'zustand';
import { persist } from 'zustand/middleware';
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
      createList: ({ title, description }) =>
        set((state) => {
          state.savedLists[title] = {
            // the Donor, Sample, and Datasets are objects to avoid duplicates. Normally they would be sets, but objects work better with local storage
            savedEntities: {},
            description,
            dateSaved: Date.now(),
            dateLastModified: Date.now(),
          };
        }),
      addEntityToList: (title, uuid) => {
        const { entity_type, group_name, display_doi } = get().savedEntities[uuid];
        set((state) => {
          state.savedLists[title].savedEntities[uuid] = {
            dateAddedToList: Date.now(),
            entity_type,
            group_name,
            display_doi,
          };
          state.savedLists[title].dateLastModified = Date.now();
        });
      },
      addEntitiesToList: (title, uuids) => {
        const timestamp = Date.now();
        uuids.forEach((uuid) => {
          const { entity_type, group_name, display_doi } = get().savedEntities[uuid];
          set((state) => {
            state.savedLists[title].savedEntities[uuid] = {
              dateAddedToList: timestamp,
              entity_type,
              group_name,
              display_doi,
            };
          });
        });
        set((state) => {
          state.savedLists[title].dateLastModified = Date.now();
        });
      },
      removeEntityFromList: (title, uuid) => {
        set((state) => {
          delete state.savedLists[title].savedEntities[uuid];
        });
      },
      removeEntitiesFromList: (title, uuids) => {
        uuids.forEach((uuid) => {
          set((state) => {
            delete state.savedLists[title].savedEntities[uuid];
          });
        });
      },
      listsToBeDeleted: [],
      queueListToBeDeleted: (listTitle) => {
        if (!get().listsToBeDeleted.includes(listTitle)) {
          set((state) => {
            state.listsToBeDeleted.push(listTitle);
          });
        }
      },
      deleteQueuedLists: () => {
        get().listsToBeDeleted.forEach((listTitle) =>
          set((state) => {
            delete state.savedLists[listTitle];
          }),
        );
        set((state) => {
          state.listsToBeDeleted = [];
        });
      },
      deleteList: (listTitle) => {
        set((state) => {
          delete state.savedLists[listTitle];
        });
      },
    })),
    {
      name: 'saved_entities',
    },
  ),
);

export default useSavedEntitiesStore;
