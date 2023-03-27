import React from 'react';

import { StyledListItem } from './style';

function BulletedListItem({ children, ...rest }) {
  return <StyledListItem {...rest}>{children}</StyledListItem>;
}

export default BulletedListItem;
