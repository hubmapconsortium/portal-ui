import { createStore } from 'zustand';
import { createStoreContext } from 'js/helpers/zustand/create-context-store';
import { Tutorial, TutorialCategory, TUTORIALS } from './types';

interface TutorialLandingPageState {
  search: string;
  filterCategories: TutorialCategory[];
  tutorials: Tutorial[];
}

interface TutorialLandingPageActions {
  setSearch: (search: string) => void;
  setFilterCategories: (filterCategories: TutorialCategory[]) => void;
  toggleFilterCategory: (category: TutorialCategory) => void;
}

type TutorialLandingPageStore = TutorialLandingPageState & TutorialLandingPageActions;

function matchSearchAndFilter(tutorials: Tutorial[], search: string, filterCategories: TutorialCategory[]) {
  return tutorials.filter(({ title, description, tags, category }) => {
    const matchesSearch =
      search === '' ||
      [title, description, ...tags].some((field) => field.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = filterCategories.length === 0 || filterCategories.includes(category);
    return matchesSearch && matchesCategory;
  });
}

function createTutorialLandingPageStore() {
  return createStore<TutorialLandingPageStore>((set) => ({
    search: '',
    filterCategories: [],
    tutorials: TUTORIALS,
    setSearch: (search: string) =>
      set((state) => ({
        search,
        tutorials: matchSearchAndFilter(TUTORIALS, search, state.filterCategories),
      })),
    setFilterCategories: (filterCategories: TutorialCategory[]) =>
      set((state) => ({
        filterCategories,
        tutorials: matchSearchAndFilter(TUTORIALS, state.search, filterCategories),
      })),
    toggleFilterCategory: (category: TutorialCategory) =>
      set((state) => {
        const isSelected = state.filterCategories.includes(category);
        const newFilterCategories = isSelected
          ? state.filterCategories.filter((c) => c !== category)
          : [...state.filterCategories, category];
        return {
          filterCategories: newFilterCategories,
          tutorials: matchSearchAndFilter(TUTORIALS, state.search, newFilterCategories),
        };
      }),
  }));
}

const [TutorialLandingPageContextProvider, useTutorialLandingPageStore] = createStoreContext(
  createTutorialLandingPageStore,
  'TutorialLandingPageStore',
);

export { TutorialLandingPageContextProvider };

export const useTutorialLandingPageSearch = () => useTutorialLandingPageStore((state) => state.search);

export const useTutorialLandingPageFilterCategories = () =>
  useTutorialLandingPageStore((state) => state.filterCategories);

export const useTutorialLandingPageTutorials = () => useTutorialLandingPageStore((state) => state.tutorials);

export const useSetTutorialLandingPageSearch = () => useTutorialLandingPageStore((state) => state.setSearch);

export const useSetTutorialLandingPageFilterCategories = () =>
  useTutorialLandingPageStore((state) => state.setFilterCategories);

export const useToggleTutorialLandingPageFilterCategory = () =>
  useTutorialLandingPageStore((state) => state.toggleFilterCategory);

export const useTutorialsByCategory = (category: TutorialCategory) => {
  const tutorials = useTutorialLandingPageStore((state) => state.tutorials);
  return tutorials.filter((tutorial) => tutorial.category === category);
};

export const useFeaturedTutorials = () => {
  const tutorials = useTutorialLandingPageStore((state) => state.tutorials);
  return tutorials.filter((tutorial) => tutorial.isFeatured);
};
