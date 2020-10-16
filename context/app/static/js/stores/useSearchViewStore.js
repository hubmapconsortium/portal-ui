import create from 'zustand';

const useSearchViewStore = create((set) => ({
  searchView: new URLSearchParams(window.location.search).get('view') || 'table',
  setSearchView: (val) => set({ searchView: val }),
}));

export default useSearchViewStore;
