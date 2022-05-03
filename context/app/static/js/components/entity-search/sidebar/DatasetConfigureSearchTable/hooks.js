import produce from 'immer';

import { useSelectedItems } from 'js/components/entity-search/sidebar/ConfigureSearch/hooks';
import { createDatasetFacet } from 'js/components/entity-search/SearchWrapper/utils';
import fieldsToAssayMap from 'metadata-field-assays';
import { useStore } from 'js/components/entity-search/SearchWrapper/store';
import { invertKeyToArrayMap as createDataTypesToFieldsMap } from './utils';
import { useMetadataFieldConfigs } from '../ConfigureSearchTable/hooks';

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

function useGroupedMetadataFieldConfigs() {
  const metadataFieldConfigs = useMetadataFieldConfigs();
  return Object.entries(metadataFieldConfigs).reduce((acc, [metadataFieldName, metadataFieldConfig]) => {
    return produce(acc, (draft) => {
      // eslint-disable-next-line no-param-reassign
      draft[metadataFieldConfig.facetGroup] = {
        ...draft[metadataFieldConfig.facetGroup],
        [metadataFieldName]: metadataFieldConfig,
      };
      return draft;
    });
  }, {});
}

function getSelectedGroupsFieldConfigs(groups, selectedGroups) {
  return Object.keys(selectedGroups).reduce((acc, selectedGroup) => {
    return { ...acc, ...groups[selectedGroup] };
  }, {});
}

function useFieldGroups() {
  const { initialFields, initialFacets } = useStore();
  const groupedMetadataFieldConfigs = useGroupedMetadataFieldConfigs();
  const groups = { General: { ...initialFields, ...initialFacets }, ...groupedMetadataFieldConfigs };
  const { selectedItems: selectedGroups, handleToggleItem: handleToggleGroup } = useSelectedItems(
    selectedItemsReducer,
    {},
  );

  const selectedGroupFieldConfigs = getSelectedGroupsFieldConfigs(groups, selectedGroups);
  return { groups, selectedGroups, handleToggleGroup, selectedGroupFieldConfigs };
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
  const { handleToggleDataType, dataTypesFields } = useSelectedDataTypes();
  const { groups, handleToggleGroup, selectedGroupFieldConfigs } = useFieldGroups();

  const availableFieldConfigs = { ...selectedGroupFieldConfigs, ...dataTypesFields };
  return { dataTypesToFieldsMap, handleToggleDataType, groups, handleToggleGroup, availableFieldConfigs };
}

export { useDatasetConfigureSearchTable };
