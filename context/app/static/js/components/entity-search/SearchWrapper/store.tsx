import React, { ComponentProps } from 'react';
import { produce } from 'immer';
//@ts-ignore - TODO: We will need to declare this as a module
import metadataFieldtoEntityMap from 'metadata-field-entities';
import { useStore as useZustandStore } from 'zustand';

import { createImmer } from 'js/stores/middleware';
import { createField } from 'js/components/entity-search/SearchWrapper/utils';
import relatedEntityTypesMap from 'js/components/entity-search/SearchWrapper/relatedEntityTypesMap';
import { createContext, useContext } from 'js/helpers/context';
import { PropsWithChildren, useRef } from 'react';

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

type SearchStoreState = {
  initialFields: Field[];
  initialFacets: unknown;
  tileFields: unknown;
  defaultFilters: unknown;
  fields: Field[];
  facets: Record<string, Facet>;
  entityType: 'donor' | 'sample' | 'dataset';
  numericFacetsProps: unknown;
  view: unknown;
};

type SearchStoreActions = {
  setFields: (selectedFields: Field[]) => void;
  setFacets: (selectedFacets: Record<string, Facet>) => void;
  addFacets: (selectedFacets: Record<string, Facet>) => void;
  setNumericFacetsProps: (numericFacets: unknown) => void;
  setFacetSize: ({ identifier, size }: Pick<Facet, 'identifier' | 'size'>) => void;
  setView: (view: unknown) => void;
};

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
}: InitialSearchState) =>
  createImmer<SearchStore>((set) => ({
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
        if (relatedEntityTypesMap[entityType].includes(fieldEntityType as string)) {
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

type SearchConfigContextType = ReturnType<typeof createStore>;

const SearchConfigContext = createContext<SearchConfigContextType>('SearchConfigContext');

interface SearchConfigProviderProps extends PropsWithChildren {
  initialConfig: InitialSearchState;
}

function SearchConfigProvider({ children, initialConfig }: SearchConfigProviderProps) {
  const store = useRef(createStore(initialConfig)).current;
  return <SearchConfigContext.Provider value={store}>{children}</SearchConfigContext.Provider>;
}

export const withSearchConfigProvider = <T extends JSX.IntrinsicAttributes>(Component: React.ComponentType<T>, initialConfig: InitialSearchState) =>
  function ComponentWithSearchConfigProvider(props: ComponentProps<typeof Component>) {
    return (
      <SearchConfigProvider initialConfig={initialConfig}>
        <Component {...props} />
      </SearchConfigProvider>
    );
  };

export default SearchConfigProvider;

const useStore = (selector: (store: SearchStore) => unknown) => {
  const store = useContext(SearchConfigContext);
  return useZustandStore(store, selector);
} 

export { createStore, useStore }
