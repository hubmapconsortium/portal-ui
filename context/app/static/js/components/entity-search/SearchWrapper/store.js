/* eslint-disable no-param-reassign */
import create from 'zustand';

import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = ({ fields, facets }) =>
  create(() => ({
    fields,
    facets,
  }));

export { createStore, Provider, useStore };
