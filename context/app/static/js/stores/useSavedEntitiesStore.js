/* eslint-disable no-param-reassign */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import immer from './immerMiddleware';

const useSavedEntitiesStore = create(
  persist(
    immer((set, get) => ({
      savedEntities: {},
      saveEntity: (entityUuid, entity_type) =>
        !(entityUuid in get().savedEntities) &&
        set((state) => {
          state.savedEntities[entityUuid] = { dateSaved: Date.now(), entity_type };
        }),
      deleteEntity: (entityUuid) =>
        set((state) => {
          delete state.savedEntities[entityUuid];
        }),
      savedLists: {},
      createList: ({ title, description }) =>
        set((state) => {
          state.savedLists[title] = {
            Donor: {},
            Sample: {},
            Dataset: {},
            description,
            dateSaved: Date.now(),
            dateLastModified: Date.now(),
          };
        }),
      addEntityToList: (title, uuid, entity_type) =>
        set((state) => {
          state.savedLists[title][entity_type][uuid] = true;
          state.savedLists[title].dateLastModified = Date.now();
        }),
    })),
    {
      name: 'saved_entities',
    },
  ),
);

export default useSavedEntitiesStore;
