import React from 'react';
import MultiList from 'js/components/test-search/filters/MultiList';

import { FILTER_TYPES } from './enums';

const filterComponents = {
  [FILTER_TYPES.multiList]: MultiList,
};

function Filter({ filterType, componentId, dataField, title, filtersComponentIds, ...rest }) {
  const FilterComponent = filterComponents[filterType];
  return (
    <FilterComponent
      {...rest}
      react={{ and: filtersComponentIds.filter((id) => componentId !== id) }}
      componentId={componentId}
      dataField={dataField}
      title={title}
    />
  );
}

export default Filter;
