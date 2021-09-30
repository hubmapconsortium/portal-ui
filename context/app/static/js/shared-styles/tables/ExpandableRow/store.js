import create from 'zustand';
import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    isExpanded: false,
    toggleIsExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  }));

export { Provider, useStore, createStore };
