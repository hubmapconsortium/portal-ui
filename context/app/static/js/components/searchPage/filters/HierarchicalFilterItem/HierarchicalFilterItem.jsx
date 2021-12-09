import React from 'react';

import { StyledFilterLabelAndCount } from './style';

function HierarchicalFilterItem(props) {
  const { label, count, active, onClick } = props;
  return <StyledFilterLabelAndCount label={label} count={count} onClick={onClick} active={active} />;
}

export default HierarchicalFilterItem;
