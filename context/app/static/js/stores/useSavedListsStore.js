import create from 'zustand';
import { persist } from 'zustand/middleware';
import immer from './immerMiddleware';

const [useSavedListsStore] = create(
  persist(
    immer((set) => ({
      savedLists: {},
      createList: ({ title, description }) =>
        set((state) => {
          // eslint-disable-next-line no-param-reassign
          state.savedLists[title] = { donors: [], samples: [], datasets: [], description };
        }),
    })),
    {
      name: 'saved_lists',
    },
  ),
);

export default useSavedListsStore;
