import React from 'react';

import { StyledList } from './style';

function BulletedList({ children, ...rest }) {
  return (
    <StyledList disablePadding {...rest}>
      {children}
    </StyledList>
  );
}

export default BulletedList;
