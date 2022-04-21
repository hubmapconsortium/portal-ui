/* eslint-disable no-param-reassign */
import create from 'zustand';

import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = ({ fields, facets, filters, entityType }) =>
  create(() => ({
    fields,
    facets,
    filters,
    entityType,
  }));

export { createStore, Provider, useStore };
