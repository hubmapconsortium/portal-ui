import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';

import ExpandCollapseIcon from 'js/shared-styles/icons/ExpandCollapseIcon';

function ExpandCollapseIconButton({ isExpanded, onClick, disabled, ...rest }) {
  return (
    <IconButton onClick={onClick} disabled={disabled} {...rest} size="large">
      <ExpandCollapseIcon isExpanded={isExpanded} />
    </IconButton>
  );
}

ExpandCollapseIconButton.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ExpandCollapseIconButton.defaultProps = {
  disabled: false,
};

export default ExpandCollapseIconButton;
