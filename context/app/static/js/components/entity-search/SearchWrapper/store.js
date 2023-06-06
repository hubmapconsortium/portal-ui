/* eslint-disable no-param-reassign */
import create from 'zustand';
import createContext from 'zustand/context';
import { produce } from 'immer';

import immer from 'js/stores/immerMiddleware';
import metadataFieldtoEntityMap from 'metadata-field-entities';
import { createField } from 'js/components/entity-search/SearchWrapper/utils';
import relatedEntityTypesMap from 'js/components/entity-search/SearchWrapper/relatedEntityTypesMap';

const { Provider, useStore } = createContext();

const createStore = ({
  initialFields,
  initialFacets,
  tileFields,
  fields,
  facets,
  defaultFilters,
  entityType,
  numericFacetsProps,
  initialView,
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
      tileFields,
      view: initialView,
      setFields: (selectedFields) =>
        set((state) => {
          state.fields = selectedFields;
        }),
      setFacets: (selectedFacets) =>
        set((state) => {
          state.facets = selectedFacets;
        }),
      addFacets: (selectedFacets) =>
        set((state) => {
          state.facets = { ...state.facets, ...selectedFacets };
        }),
      setNumericFacetsProps: (numericFacets) =>
        set((state) => {
          state.numericFacetsProps = numericFacets;
        }),
      setFacetSize: ({ identifier, size }) =>
        set((state) => {
          state.facets[identifier].size = size;
        }),
      setView: (view) =>
        set((state) => {
          state.view = view;
        }),
      availableFields: Object.entries(metadataFieldtoEntityMap).reduce(
        (acc, [fieldName, fieldEntityType]) => {
          if (relatedEntityTypesMap[entityType].includes(fieldEntityType)) {
            return produce(acc, (draft) => {
              return {
                ...draft,
                ...createField({ fieldName, entityType }),
              };
            });
          }
          return acc;
        },
        { ...fields, ...facets },
      ),
    })),
  );

export { createStore, Provider, useStore };
