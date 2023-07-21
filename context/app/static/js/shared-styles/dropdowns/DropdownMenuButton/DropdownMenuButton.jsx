import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

import { useStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';
import { StyledUpIcon, StyledDownIcon } from './style';

function DropdownMenuButton({ children, menuID, ...rest }) {
  const { menuRef, menuIsOpen, openMenu } = useStore();

  return (
    <Button
      onClick={openMenu}
      variant="outlined"
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={menuRef}
      {...rest}
    >
      {children}
      {menuIsOpen ? <StyledUpIcon /> : <StyledDownIcon />}
    </Button>
  );
}

DropdownMenuButton.propTypes = {
  menuID: PropTypes.string.isRequired,
};

export default DropdownMenuButton;
