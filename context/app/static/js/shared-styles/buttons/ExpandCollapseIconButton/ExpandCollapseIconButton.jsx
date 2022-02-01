import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';

import { UpIcon, DownIcon } from 'js/shared-styles/icons';

function ExpandCollapseIconButton({ isExpanded, onClick, disabled, ...rest }) {
  return (
    <IconButton onClick={onClick} disabled={disabled} {...rest}>
      {isExpanded ? <UpIcon data-testid="up-arrow-icon" /> : <DownIcon data-testid="down-arrow-icon" />}
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
