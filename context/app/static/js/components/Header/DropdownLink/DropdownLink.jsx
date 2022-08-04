import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';

import OutboundLink from 'js/shared-styles/Links/OutboundLink';
import { StyledMenuItem } from './style';

function DropdownLink(props) {
  const { isIndented, children, isOutboundLink, ...rest } = props;
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
