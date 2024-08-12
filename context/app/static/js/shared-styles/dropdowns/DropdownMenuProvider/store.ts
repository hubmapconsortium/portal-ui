import { RefObject } from 'react';
import { createStore as createZustandStore } from 'zustand';

interface DropdownMenuStoreState {
  menuIsOpen: boolean;
  menuRef: RefObject<HTMLElement>;
}

interface DropdownMenuStoreActions {
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export interface DropdownMenuStore extends DropdownMenuStoreState, DropdownMenuStoreActions {}

export interface CreateDropdownMenuStore {
  isOpenToStart: boolean;
}

const createStore = ({ isOpenToStart }: CreateDropdownMenuStore, menuRef: RefObject<HTMLElement>) =>
  createZustandStore<DropdownMenuStore>((set) => ({
    menuRef,
    menuIsOpen: isOpenToStart,
    openMenu: () => set({ menuIsOpen: true }),
    closeMenu: () => set({ menuIsOpen: false }),
    toggleMenu: () => set((state) => ({ menuIsOpen: !state.menuIsOpen })),
  }));

export { createStore };
