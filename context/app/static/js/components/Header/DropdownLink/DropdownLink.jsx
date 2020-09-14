import React from 'react';
import PropTypes from 'prop-types';
import Link from '@material-ui/core/Link';

import { StyledMenuItem } from './style';

function DropdownLink(props) {
  const { isIndented, children, ...rest } = props;
  return (
    <StyledMenuItem $isIndented={isIndented} {...rest} component={Link}>
      {children}
    </StyledMenuItem>
  );
}

DropdownLink.propTypes = {
  isIndented: PropTypes.bool,
  children: PropTypes.string.isRequired,
};

DropdownLink.defaultProps = {
  isIndented: false,
};

export default DropdownLink;
