import create from 'zustand';
import { persist } from 'zustand/middleware';

const useSavedListsStore = create(
  persist(
    () => ({
      savedLists: {},
    }),
    {
      name: 'saved_lists',
    },
  ),
);

export default useSavedListsStore;
