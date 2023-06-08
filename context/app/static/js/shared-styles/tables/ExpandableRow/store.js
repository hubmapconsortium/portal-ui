import { create } from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = (isExpandedToStart = false) =>
  create((set) => ({
    isExpanded: isExpandedToStart,
    toggleIsExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  }));

export { Provider, useStore, createStore };
