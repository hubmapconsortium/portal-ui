import React from 'react';

import { StyledTab } from './style';

function Tab({ label, index }) {
  return <StyledTab label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />;
}

export default Tab;
