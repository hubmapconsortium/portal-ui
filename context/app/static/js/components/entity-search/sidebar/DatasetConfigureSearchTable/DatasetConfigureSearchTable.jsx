import React from 'react';

import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
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
  } = useDatasetConfigureSearchTable();

  return (
    <Flex>
      <DataTypesSelect
        dataTypesToFieldsMap={dataTypesToFieldsMap}
        handleToggleDataType={handleToggleDataType}
        groups={groups}
        handleToggleGroup={handleToggleGroup}
      />
      <ConfigureSearchTable {...props} availableFields={availableFieldConfigs} />
    </Flex>
  );
}

export default DatasetConfigureSearchTable;
