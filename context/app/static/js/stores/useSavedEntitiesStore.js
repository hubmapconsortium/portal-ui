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
          // eslint-disable-next-line no-param-reassign
          state.savedEntities[entityUuid] = { dateSaved: Date.now() };
        }),
    })),
    {
      name: 'saved_entities',
    },
  ),
);

export default useSavedEntitiesStore;
