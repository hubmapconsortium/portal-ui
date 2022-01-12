import { useRef } from 'react';
import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = (isOpenToStart) =>
  create((set) => ({
    menuRef: useRef(),
    menuIsOpen: isOpenToStart,
    openMenu: () => set({ menuIsOpen: true }),
    closeMenu: () => set({ menuIsOpen: false }),
    toggleMenu: () => set((state) => ({ menuIsOpen: !state.menuIsOpen })),
  }));

export { Provider, useStore, createStore };
