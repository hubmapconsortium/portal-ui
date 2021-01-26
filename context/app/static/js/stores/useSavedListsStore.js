/* eslint-disable no-param-reassign */
import create from 'zustand';
import { persist } from 'zustand/middleware';
import immer from './immerMiddleware';

const [useSavedListsStore] = create(
  persist(
    immer((set) => ({
      savedLists: {},
      createList: ({ title, description }) =>
        set((state) => {
          state.savedLists[title] = { Donor: {}, Sample: {}, Dataset: {}, description };
        }),
      addEntityToList: (title, uuid, entity_type) =>
        set((state) => {
          state.savedLists[title][entity_type][uuid] = true;
        }),
    })),
    {
      name: 'saved_lists',
    },
  ),
);

export default useSavedListsStore;
