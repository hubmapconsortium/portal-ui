import React from 'react';
import MultiList from 'js/components/test-search/filters/MultiList';

import { FILTER_TYPES } from './enums';

const filterComponents = {
  [FILTER_TYPES.multiList]: MultiList,
};

function Filter({ filterType, ...rest }) {
  const FilterComponent = filterComponents[filterType];
  return <FilterComponent {...rest} />;
}

export default Filter;
