import { produce } from 'immer';

import { useSelectedItems } from 'js/components/entity-search/sidebar/ConfigureSearch/hooks';
import { createField } from 'js/components/entity-search/SearchWrapper/utils';
import fieldsToAssayMap from 'metadata-field-assays';
import { useSearchConfigStore } from 'js/components/entity-search/SearchWrapper/store';
import { invertKeyToArrayMap as createDataTypesToFieldsMap } from './utils';

const dataTypesToFieldsMap = createDataTypesToFieldsMap(fieldsToAssayMap);

function selectedItemsReducer(state, { type, payload }) {
  const tempState = state;
  switch (type) {
    case 'selectItem':
      return { ...state, [payload]: undefined }; // using an object as a set
    case 'deselectItem':
      delete tempState[payload];
      return { ...tempState };
    case 'setSelectedItems':
      return payload;
    default:
      return state;
  }
}

function useGroupedFieldConfigs() {
  const { availableFields } = useSearchConfigStore();

  const groupedFieldConfigs = Object.entries(availableFields).reduce(
    (acc, [metadataFieldName, metadataFieldConfig]) => {
      return produce(acc, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft[metadataFieldConfig.configureGroup] = {
          ...draft[metadataFieldConfig.configureGroup],
          [metadataFieldName]: metadataFieldConfig,
        };
        return draft;
      });
    },
    {},
  );
  // Return only sample and donor metadata
  const { 'Dataset Metadata': datasetMetadata, ...rest } = groupedFieldConfigs;
  return rest;
}

function getSelectedGroupsFieldConfigs(groups, selectedGroups) {
  return Object.keys(selectedGroups).reduce((acc, selectedGroup) => {
    return { ...acc, ...groups[selectedGroup] };
  }, {});
}

function useFieldGroups() {
  const groups = useGroupedFieldConfigs();
  const { selectedItems: selectedGroups, handleToggleItem: handleToggleGroup } = useSelectedItems(
    selectedItemsReducer,
    { General: undefined },
  );

  const selectedGroupFieldConfigs = getSelectedGroupsFieldConfigs(groups, selectedGroups);
  return { groups, selectedGroups, handleToggleGroup, selectedGroupFieldConfigs };
}

function buildFieldConfigs(fieldNames) {
  return fieldNames.reduce((acc, fieldName) => {
    // Version must be removed before creating field configs because it does not have a type defined in ingest-validation-tools docs.
    const excludedFieldNames = ['version'];
    if (excludedFieldNames.includes(fieldName)) {
      return acc;
    }
    return {
      ...acc,
      ...createField({ fieldName, entityType: 'dataset' }),
    };
  }, {});
}

function getDataTypesFields(selectedDataTypes) {
  return Object.keys(selectedDataTypes).reduce((acc, selectedDataType) => {
    const dataTypeFieldConfigs = buildFieldConfigs(dataTypesToFieldsMap[selectedDataType]);
    return { ...acc, ...dataTypeFieldConfigs };
  }, {});
}

function useSelectedDataTypes() {
  const { selectedItems: selectedDataTypes, handleToggleItem: handleToggleDataType } = useSelectedItems(
    selectedItemsReducer,
    {},
  );

  const dataTypesFields = getDataTypesFields(selectedDataTypes);

  return { selectedDataTypes, handleToggleDataType, dataTypesFields };
}

function useDatasetConfigureSearchTable() {
  const { handleToggleDataType, dataTypesFields, selectedDataTypes } = useSelectedDataTypes();
  const { groups, handleToggleGroup, selectedGroupFieldConfigs, selectedGroups } = useFieldGroups();

  const availableFieldConfigs = { ...selectedGroupFieldConfigs, ...dataTypesFields };
  return {
    dataTypesToFieldsMap,
    handleToggleDataType,
    groups,
    handleToggleGroup,
    availableFieldConfigs,
    selectedDataTypes,
    selectedGroups,
  };
}

export { useDatasetConfigureSearchTable };
