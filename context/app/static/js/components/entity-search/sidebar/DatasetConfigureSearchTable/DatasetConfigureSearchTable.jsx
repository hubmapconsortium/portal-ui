import React from 'react';

import ConfigureSearchTableWrapper from 'js/components/entity-search/sidebar/ConfigureSearchTableWrapper';
import DataTypesSelect from 'js/components/entity-search/sidebar/DataTypesSelect';
import { Flex } from './style';
import { useDatasetConfigureSearchTable } from './hooks';

function DatasetConfigureSearchTable(props) {
  const {
    dataTypesToFieldsMap,
    handleToggleDataType,
    groups,
    handleToggleGroup,
    availableFieldConfigs,
    selectedGroups,
    selectedDataTypes,
  } = useDatasetConfigureSearchTable();

  return (
    <Flex>
      <DataTypesSelect
        dataTypesToFieldsMap={dataTypesToFieldsMap}
        handleToggleDataType={handleToggleDataType}
        groups={groups}
        handleToggleGroup={handleToggleGroup}
        selectedGroups={selectedGroups}
        selectedDataTypes={selectedDataTypes}
      />
      <ConfigureSearchTableWrapper {...props} availableFields={availableFieldConfigs} />
    </Flex>
  );
}

export default DatasetConfigureSearchTable;
