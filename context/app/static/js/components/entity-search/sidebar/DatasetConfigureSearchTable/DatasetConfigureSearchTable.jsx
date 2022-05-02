import React from 'react';

import ConfigureSearchTable from 'js/components/entity-search/sidebar/ConfigureSearchTable';
import DataTypesSelect from 'js/components/entity-search/sidebar/DataTypesSelect';
import { Flex } from './style';
import { useSelectedDataTypes } from './hooks';

function DatasetConfigureSearchTable({ selectedFields, handleToggleField }) {
  const { dataTypesToFieldsMap, handleToggleDataType, dataTypesFields } = useSelectedDataTypes();

  return (
    <Flex>
      <DataTypesSelect dataTypesToFieldsMap={dataTypesToFieldsMap} handleToggleDataType={handleToggleDataType} />
      <ConfigureSearchTable
        selectedFields={selectedFields}
        handleToggleField={handleToggleField}
        availableFields={dataTypesFields}
      />
    </Flex>
  );
}

export default DatasetConfigureSearchTable;
