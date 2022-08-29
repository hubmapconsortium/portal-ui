import React from 'react';

import { StyledFilterLabelAndCount } from './style';

function HierarchicalFilterItem({ label, count, active, onClick }) {
  return <StyledFilterLabelAndCount label={label} count={count} onClick={onClick} active={active} />;
}

export default HierarchicalFilterItem;
