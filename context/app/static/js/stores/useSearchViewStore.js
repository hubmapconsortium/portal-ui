import { create } from 'zustand';

const useSearchViewStore = create((set) => ({
  searchView: new URLSearchParams(window.location.search).get('view') || 'table',
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
