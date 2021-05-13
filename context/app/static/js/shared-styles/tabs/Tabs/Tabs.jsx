import React from 'react';

import { StyledTabs } from './style';

function Tabs({ children, ...props }) {
  return (
    <StyledTabs variant="standard" TabIndicatorProps={{ style: { backgroundColor: '#9CB965' } }} {...props}>
      {children}
    </StyledTabs>
  );
}

export default Tabs;
