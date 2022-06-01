/* eslint-disable no-param-reassign */
import create from 'zustand';
import createContext from 'zustand/context';

import immer from 'js/stores/immerMiddleware';

const { Provider, useStore } = createContext();

const createStore = ({
  initialFields,
  initialFacets,
  fields,
  facets,
  defaultFilters,
  entityType,
  numericFacetsProps,
}) =>
  create(
    immer((set) => ({
      initialFields,
      initialFacets,
      defaultFilters,
      fields,
      facets,
      entityType,
      numericFacetsProps,
      setFields: (selectedFields) => set({ fields: selectedFields }),
      setFacets: (selectedFacets) => set({ facets: selectedFacets }),
      setNumericFacetsProps: (numericFacets) => set({ numericFacetsProps: numericFacets }),
      setFacetSize: ({ identifier, size }) =>
        set((state) => {
          state.facets[identifier].size = size;
        }),
    })),
  );

export { createStore, Provider, useStore };
