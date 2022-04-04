/* eslint-disable no-param-reassign */
import create from 'zustand';

import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = ({ fields, facets, filters }) =>
  create(() => ({
    fields,
    facets,
    filters,
  }));

export { createStore, Provider, useStore };
