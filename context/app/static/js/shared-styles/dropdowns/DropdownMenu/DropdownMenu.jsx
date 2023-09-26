import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';

function DropdownMenu({ children, id, ...rest }) {
  const { menuRef, menuIsOpen, closeMenu } = useDropdownMenuStore();
  return (
    <Menu
      anchorEl={menuRef.current}
      open={menuIsOpen}
      onClose={closeMenu}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      id={id}
      {...rest}
    >
      {children}
    </Menu>
  );
}

DropdownMenu.propTypes = {
  id: PropTypes.string.isRequired,
};

export default DropdownMenu;
