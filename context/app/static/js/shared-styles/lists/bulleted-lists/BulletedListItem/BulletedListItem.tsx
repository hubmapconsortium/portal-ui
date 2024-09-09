import React from 'react';

import { ListItemProps } from '@mui/material/ListItem';
import { StyledListItem } from './style';

function BulletedListItem({ children, ...rest }: ListItemProps) {
  return <StyledListItem {...rest}>{children}</StyledListItem>;
}

export default BulletedListItem;
