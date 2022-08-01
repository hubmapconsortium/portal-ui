import React from 'react';
import PropTypes from 'prop-types';
import { StyledRow } from './style';

function ClickableRow({ onClick, disabled, children, label, ...rest }) {
  return (
    <StyledRow
      onClick={onClick}
      disabled={disabled}
      role="button"
      aria-label={label}
      aria-disabled={disabled}
      {...rest}
    >
      {children}
    </StyledRow>
  );
}

ClickableRow.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

ClickableRow.defaultProps = {
  disabled: false,
};

export default ClickableRow;
