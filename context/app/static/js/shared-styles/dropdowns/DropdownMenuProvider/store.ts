import { createStore as createZustandStore } from 'zustand';

interface DropdownMenuStoreState {
  menuIsOpen: boolean;
  // Track the anchor element via state instead of a ref so MUI's Menu can
  // re-render with the correct position; react-hooks v7 forbids reading a
  // ref's `.current` during render.
  anchorEl: HTMLElement | null;
}

interface DropdownMenuStoreActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  setAnchorEl: (el: HTMLElement | null) => void;
}

export interface DropdownMenuStore extends DropdownMenuStoreState, DropdownMenuStoreActions {}

export interface CreateDropdownMenuStore {
  isOpenToStart: boolean;
}

const createStore = ({ isOpenToStart }: CreateDropdownMenuStore) =>
  createZustandStore<DropdownMenuStore>((set) => ({
    anchorEl: null,
    menuIsOpen: isOpenToStart,
    openMenu: () => {
      set({ menuIsOpen: true });
    },
    closeMenu: () => {
      set({ menuIsOpen: false });
    },
    toggleMenu: () => {
      set((state) => ({ menuIsOpen: !state.menuIsOpen }));
    },
    setAnchorEl: (el) => {
      set({ anchorEl: el });
    },
  }));

export { createStore };
