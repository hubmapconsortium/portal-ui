import create from 'zustand';
import { persist } from 'zustand/middleware';

const useSavedEntitiesStore = create(
  persist(
    (set, get) => ({
      savedEntities: [],
      saveEntity: (entityUuid) =>
        !get().savedEntities.includes(entityUuid) &&
        set({
          savedEntities: [...get().savedEntities, entityUuid],
        }),
    }),
    {
      name: 'saved-entities-list',
    },
  ),
);

export default useSavedEntitiesStore;
