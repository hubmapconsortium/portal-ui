import create from 'zustand';
import createContext from 'zustand/context';

// Best practice: You can move the below createContext() and createStore to a separate file(store.js) and import the Provider, useStore here/wherever you need.

const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    isExpanded: false,
    toggleIsExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
  }));

export { Provider, useStore, createStore };
