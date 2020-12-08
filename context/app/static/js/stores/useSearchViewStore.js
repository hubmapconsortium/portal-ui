import create from 'zustand';

const useSearchViewStore = create((set) => ({
  searchView: new URLSearchParams(window.location.search).get('view') || 'table',
  setSearchView: (val) => set({ searchView: val }),
  toggleItem: null,
  setToggleItem: (val) => set({ toggleItem: val }),
}));

export default useSearchViewStore;
