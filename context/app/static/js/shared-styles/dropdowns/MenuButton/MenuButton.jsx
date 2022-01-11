import React from 'react';
import Button from '@material-ui/core/Button';

import { StyledUpIcon, StyledDownIcon } from './style';

function MenuButton({ children, onClick, menuIsOpen, menuID, menuRef, ...rest }) {
  return (
    <Button
      onClick={onClick}
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

export default MenuButton;
