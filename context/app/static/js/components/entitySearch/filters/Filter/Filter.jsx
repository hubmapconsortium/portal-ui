import React from 'react';

import MultiList from 'js/components/entitySearch/filters/MultiList';
import RangeSlider from 'js/components/entitySearch/filters/RangeSlider';

import { FILTER_TYPES } from './enums';

const filterComponents = {
  [FILTER_TYPES.multiList]: MultiList,
  [FILTER_TYPES.rangeSlider]: RangeSlider,
};

function Filter({ type, componentId, dataField, title, ...rest }) {
  const FilterComponent = filterComponents[type];
  return <FilterComponent URLParams componentId={componentId} dataField={dataField} title={title} {...rest} />;
}

export default Filter;
