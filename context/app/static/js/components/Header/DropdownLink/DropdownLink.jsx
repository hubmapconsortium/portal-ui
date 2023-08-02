import React from 'react';
import PropTypes from 'prop-types';
import Link from '@mui/material/Link';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { StyledMenuItem } from './style';

function DropdownLink({ isIndented, children, isOutboundLink, ...rest }) {
  return (
    <StyledMenuItem $isIndented={isIndented} {...rest} component={isOutboundLink ? OutboundLink : Link}>
      {children}
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
