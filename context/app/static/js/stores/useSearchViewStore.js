import create from 'zustand';

const useSearchViewStore = create((set) => ({
  searchView: 'table',
  setSearchView: (val) => set({ searchView: val }),
}));

export default useSearchViewStore;
