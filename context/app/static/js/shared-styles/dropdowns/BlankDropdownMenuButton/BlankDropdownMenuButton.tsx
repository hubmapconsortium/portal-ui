import React from 'react';
import IconButton from '@mui/material/IconButton';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';

interface DropdownMenuButtonProps {
  children: React.ReactNode;
  menuID: string;
}

function BlankDropdownMenuButton({ children, menuID, ...rest }: DropdownMenuButtonProps) {
  const { menuRef, menuIsOpen, openMenu } = useDropdownMenuStore();

  return (
    <IconButton
      onClick={openMenu}
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={menuRef as unknown as React.RefObject<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </IconButton>
  );
}

export default BlankDropdownMenuButton;
