import React from 'react';
import Link from '@material-ui/core/Link';

import { StyledMenuItem } from './style';

function DropdownLink(props) {
  const { isIndented, children, ...rest } = props;
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <StyledMenuItem $isIndented={isIndented} {...rest} component={Link}>
      {children}
    </StyledMenuItem>
  );
}

export default DropdownLink;
