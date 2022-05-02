import { useSelectedItems } from 'js/components/entity-search/sidebar/ConfigureSearch/hooks';
import { createDatasetFacet } from 'js/components/entity-search/SearchWrapper/utils';
import fieldsToAssayMap from 'metadata-field-assays';
import { invertKeyToArrayMap as createDataTypesToFieldsMap } from './utils';

const dataTypesToFieldsMap = createDataTypesToFieldsMap(fieldsToAssayMap);

function selectedDataTypesReducer(state, { type, payload }) {
  const tempState = state;
  switch (type) {
    case 'selectItem':
      return { ...state, [payload]: dataTypesToFieldsMap[payload] };
    case 'deselectItem':
      delete tempState[payload];
      return { ...tempState };
    case 'setSelectedItems':
      return payload;
    default:
      return state;
  }
}

function buildFieldConfigs(fieldNames) {
  return fieldNames.reduce(
    (acc, fieldName) => ({
      ...acc,
      ...createDatasetFacet({ fieldName, entityType: 'dataset' }),
    }),
    {},
  );
}

function getDataTypesFields(selectedDataTypes) {
  return Object.values(selectedDataTypes).reduce((acc, dataTypesFieldNames) => {
    const dataTypeFieldConfigs = buildFieldConfigs(dataTypesFieldNames);
    return { ...acc, ...dataTypeFieldConfigs };
  }, {});
}

function useSelectedDataTypes() {
  const {
    selectedItems: selectedDataTypes,
    handleToggleItem: handleToggleDataType,
    // setSelectedItems: setSelectedDataTypes,
  } = useSelectedItems(selectedDataTypesReducer, {});

  const dataTypesFields = getDataTypesFields(selectedDataTypes);

  return { dataTypesToFieldsMap, selectedDataTypes, handleToggleDataType, dataTypesFields };
}

export { useSelectedDataTypes };
