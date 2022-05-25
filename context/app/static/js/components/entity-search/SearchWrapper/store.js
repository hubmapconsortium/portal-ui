/* eslint-disable no-param-reassign */
import create from 'zustand';

import createContext from 'zustand/context';

const { Provider, useStore } = createContext();

const createStore = ({ initialFields, initialFacets, fields, facets, filters, entityType, numericFacetsProps }) =>
  create((set) => ({
    initialFields,
    initialFacets,
    fields,
    facets,
    filters,
    entityType,
    numericFacetsProps,
    setFields: (selectedFields) => set({ fields: selectedFields }),
    setFacets: (selectedFacets) => set({ facets: selectedFacets }),
    setNumericFacetsProps: (numericFacets) => set({ numericFacetsProps: numericFacets }),
  }));

export { createStore, Provider, useStore };
