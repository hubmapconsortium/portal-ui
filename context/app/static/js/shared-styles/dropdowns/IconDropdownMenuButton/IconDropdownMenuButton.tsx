import React from 'react';
import IconButton from '@mui/material/IconButton';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';

interface IconDropdownMenuButtonProps {
  children: React.ReactNode;
  menuID: string;
}

function IconDropdownMenuButton({ children, menuID, ...rest }: IconDropdownMenuButtonProps) {
  const { menuRef, menuIsOpen, openMenu } = useDropdownMenuStore();

  return (
    <IconButton
      onClick={openMenu}
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={menuRef as React.RefObject<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </IconButton>
  );
}

export default IconDropdownMenuButton;
