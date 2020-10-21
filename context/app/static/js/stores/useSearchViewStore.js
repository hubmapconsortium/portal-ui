import create from 'zustand';

const useSearchViewStore = create((set) => ({
  searchView:
    (window.location.pathname.startsWith('search') && new URLSearchParams(window.location.search).get('view')) ||
    'table',
  setSearchView: (val) => set({ searchView: val }),
}));

export default useSearchViewStore;
