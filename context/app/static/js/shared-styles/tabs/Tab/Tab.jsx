import React from 'react';

import { StyledTab } from './style';

// receives props from parent, needs ...props
function Tab({ label, index, ...props }) {
  return <StyledTab label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} {...props} />;
}

export default Tab;
