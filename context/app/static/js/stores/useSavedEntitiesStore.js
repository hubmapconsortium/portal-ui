/* eslint-disable no-param-reassign */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import immer from './immerMiddleware';

const useSavedEntitiesStore = create(
  persist(
    immer((set, get) => ({
      savedEntities: {},
      saveEntity: (entityUuid) =>
        !(entityUuid in get().savedEntities) &&
        set((state) => {
          state.savedEntities[entityUuid] = { dateSaved: Date.now() };
        }),
      deleteEntity: (entityUuid) =>
        set((state) => {
          delete state.savedEntities[entityUuid];
        }),
    })),
    {
      name: 'saved_entities',
    },
  ),
);

export default useSavedEntitiesStore;
