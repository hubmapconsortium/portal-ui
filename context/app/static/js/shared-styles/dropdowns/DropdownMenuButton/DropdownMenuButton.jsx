import React from 'react';
import Button from '@material-ui/core/Button';

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

export default DropdownMenuButton;
