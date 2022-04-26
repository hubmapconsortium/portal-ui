/* eslint-disable no-param-reassign */
import create from 'zustand';

import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = ({ initialFields, initialFacets, fields, facets, filters, entityType }) =>
  create((set) => ({
    initialFields,
    initialFacets,
    fields,
    facets,
    filters,
    entityType,
    setFields: (selectedFields) => set({ fields: selectedFields }),
  }));

export { createStore, Provider, useStore };
