import React from 'react';
import Menu from '@material-ui/core/Menu';

import { useStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider/store';

function DropdownMenu({ children, id, ...rest }) {
  const { menuRef, menuIsOpen, closeMenu } = useStore();
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

export default DropdownMenu;
