import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';

function BlankDropdownMenuButton({ children, menuID, ...rest }) {
  const { menuRef, menuIsOpen, openMenu } = useDropdownMenuStore();

  return (
    <IconButton
      onClick={openMenu}
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={menuRef}
      {...rest}
    >
      {children}
    </IconButton>
  );
}

BlankDropdownMenuButton.propTypes = {
  menuID: PropTypes.string.isRequired,
};

export default BlankDropdownMenuButton;
