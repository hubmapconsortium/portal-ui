import React from 'react';

import { ListProps } from '@mui/material/List';
import { StyledList } from './style';

function BulletedList({ children, ...rest }: ListProps) {
  return (
    <StyledList disablePadding {...rest}>
      {children}
    </StyledList>
  );
}

export default BulletedList;
