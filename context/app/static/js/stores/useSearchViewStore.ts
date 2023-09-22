import { create } from 'zustand';

type SearchView = 'table' | 'card';

interface SearchViewStoreState {
  searchView: SearchView;
  toggleItem: unknown;
  searchHitsCount: number;
  allResultsUUIDs: string[];
}

interface SearchViewStoreActions {
  setSearchView: (val: SearchView) => void;
  setToggleItem: (val: unknown) => void;
  setSearchHitsCount: (val: number) => void;
  setAllResultsUUIDs: (val: string[]) => void;
}

type SearchViewStore = SearchViewStoreState & SearchViewStoreActions;

const useSearchViewStore = create<SearchViewStore>((set) => ({
  searchView: (new URLSearchParams(window.location.search).get('view') as SearchView) ?? 'table',
  setSearchView: (val) => set({ searchView: val }),
  // toggleItem is provided by searchkit to toggle search view
  toggleItem: null,
  setToggleItem: (val) => set({ toggleItem: val }),
  searchHitsCount: 0,
  setSearchHitsCount: (val) => set({ searchHitsCount: val }),
  allResultsUUIDs: [],
  setAllResultsUUIDs: (val) => set({ allResultsUUIDs: val }),
}));

export default useSearchViewStore;
