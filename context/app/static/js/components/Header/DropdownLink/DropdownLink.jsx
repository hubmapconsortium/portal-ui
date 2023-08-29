import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';

import { StyledMenuItem } from './style';

function DropdownLink({ href, isIndented, children, ...rest }) {
  return (
    <StyledMenuItem $isIndented={isIndented} {...rest}>
      <Link href={href}>{children}</Link>
    </StyledMenuItem>
  );
}

DropdownLink.propTypes = {
  isIndented: PropTypes.bool,
};

DropdownLink.defaultProps = {
  isIndented: false,
};

export default DropdownLink;
