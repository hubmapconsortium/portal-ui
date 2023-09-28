import React, { ComponentProps } from 'react';
import { produce } from 'immer';
import metadataFieldtoEntityMap from 'metadata-field-entities';

import { createStoreContext, createStoreImmer } from 'js/helpers/zustand';
import { createField } from 'js/components/entity-search/SearchWrapper/utils';
import relatedEntityTypesMap from 'js/components/entity-search/SearchWrapper/relatedEntityTypesMap';

interface Field {
  fieldName: string;
  label: string;
  type: string;
  facetGroup: string;
  configureGroup: string;
  entityType: 'donor' | 'sample' | 'dataset';
  ingestValidationToolsName: string;
  [key: string]: unknown;
}

interface Facet {
  identifier: string;
  entries: unknown[];
  size: number;
  [key: string]: unknown;
}

interface SearchStoreState {
  initialFields: Field[];
  initialFacets: unknown;
  tileFields: unknown;
  defaultFilters: unknown;
  fields: Field[];
  facets: Record<string, Facet>;
  entityType: 'donor' | 'sample' | 'dataset';
  numericFacetsProps: unknown;
  view: unknown;
}

interface SearchStoreActions {
  setFields: (selectedFields: Field[]) => void;
  setFacets: (selectedFacets: Record<string, Facet>) => void;
  addFacets: (selectedFacets: Record<string, Facet>) => void;
  setNumericFacetsProps: (numericFacets: unknown) => void;
  setFacetSize: ({ identifier, size }: Pick<Facet, 'identifier' | 'size'>) => void;
  setView: (view: unknown) => void;
}

type SearchStore = SearchStoreState &
  SearchStoreActions & {
    availableFields: Field[];
  };

type InitialSearchState = Omit<SearchStoreState, 'view'> & {
  initialView: unknown;
};

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
}: InitialSearchState) => {
  return createStoreImmer<SearchStore>((set) => ({
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
  }));
};

const [, SearchConfigProvider, useSearchConfigStore] = createStoreContext<SearchStore, InitialSearchState>(
  createStore,
  'SearchConfigStore',
);

export const withSearchConfigProvider = <T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  initialConfig: InitialSearchState,
) =>
  function ComponentWithSearchConfigProvider(props: ComponentProps<typeof Component>) {
    return (
      <SearchConfigProvider {...initialConfig}>
        <Component {...props} />
      </SearchConfigProvider>
    );
  };

export default SearchConfigProvider;

export { createStore, useSearchConfigStore };
