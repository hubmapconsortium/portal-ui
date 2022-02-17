import React from 'react';
import MultiList from 'js/components/entitySearch/filters/MultiList';

import { FILTER_TYPES } from './enums';

const filterComponents = {
  [FILTER_TYPES.multiList]: MultiList,
};

function Filter({ filterType, componentId, dataField, title, ...rest }) {
  const FilterComponent = filterComponents[filterType];
  return <FilterComponent componentId={componentId} dataField={dataField} title={title} {...rest} />;
}

export default Filter;
