import { createStore } from 'zustand';
import { createStoreContext } from 'js/helpers/zustand/create-context-store';
import { Tutorial, TutorialCategory, TUTORIALS } from './types';

interface TutorialLandingPageState {
  search: string;
  filterCategory?: TutorialCategory;
  tutorials: Tutorial[];
}

interface TutorialLandingPageActions {
  setSearch: (search: string) => void;
  setFilterCategory: (filterCategory?: TutorialCategory) => void;
}

type TutorialLandingPageStore = TutorialLandingPageState & TutorialLandingPageActions;

function matchSearchAndFilter(tutorials: Tutorial[], search: string, filterCategory: TutorialCategory | undefined) {
  return tutorials.filter(({ title, description, tags, category }) => {
    const matchesSearch =
      search === '' ||
      [title, description, ...tags].some((field) => field.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategory ? category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });
}

function createTutorialLandingPageStore() {
  return createStore<TutorialLandingPageStore>((set) => ({
    search: '',
    filterCategory: undefined,
    tutorials: TUTORIALS,
    setSearch: (search: string) =>
      set((state) => ({
        search,
        tutorials: matchSearchAndFilter(TUTORIALS, search, state.filterCategory),
      })),
    setFilterCategory: (filterCategory?: TutorialCategory) =>
      set((state) => ({
        filterCategory,
        tutorials: matchSearchAndFilter(TUTORIALS, state.search, filterCategory),
      })),
  }));
}

const [TutorialLandingPageContextProvider, useTutorialLandingPageStore] = createStoreContext(
  createTutorialLandingPageStore,
  'TutorialLandingPageStore',
);

export { TutorialLandingPageContextProvider };

export const useTutorialLandingPageSearch = () => useTutorialLandingPageStore((state) => state.search);

export const useTutorialLandingPageFilterCategory = () => useTutorialLandingPageStore((state) => state.filterCategory);

export const useTutorialLandingPageTutorials = () => useTutorialLandingPageStore((state) => state.tutorials);

export const useSetTutorialLandingPageSearch = () => useTutorialLandingPageStore((state) => state.setSearch);

export const useSetTutorialLandingPageFilterCategory = () =>
  useTutorialLandingPageStore((state) => state.setFilterCategory);

export const useTutorialsByCategory = (category: TutorialCategory) => {
  const tutorials = useTutorialLandingPageStore((state) => state.tutorials);
  return tutorials.filter((tutorial) => tutorial.category === category);
};

export const useFeaturedTutorials = () => {
  const tutorials = useTutorialLandingPageStore((state) => state.tutorials);
  return tutorials.filter((tutorial) => tutorial.isFeatured);
};
