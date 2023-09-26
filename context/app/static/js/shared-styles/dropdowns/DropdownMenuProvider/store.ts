import { RefObject } from 'react';
import { createStore as createZustandStore } from 'zustand';

interface DropdownMenuStoreState {
  menuIsOpen: boolean;
  menuRef: RefObject<HTMLDivElement>;
}

interface DropdownMenuStoreActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

interface DropdownMenuStore extends DropdownMenuStoreState, DropdownMenuStoreActions {}

const createStore = (isOpenToStart: boolean, menuRef: RefObject<HTMLDivElement>) =>
  createZustandStore<DropdownMenuStore>((set) => ({
    menuRef,
    menuIsOpen: isOpenToStart,
    openMenu: () => set({ menuIsOpen: true }),
    closeMenu: () => set({ menuIsOpen: false }),
    toggleMenu: () => set((state) => ({ menuIsOpen: !state.menuIsOpen })),
  }));

export { createStore };
