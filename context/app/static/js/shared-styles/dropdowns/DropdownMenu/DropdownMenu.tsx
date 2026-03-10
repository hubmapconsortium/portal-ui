import React, { ComponentProps, PropsWithChildren } from 'react';
import Menu from '@mui/material/Menu';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';

interface DropdownMenuProps extends Omit<ComponentProps<typeof Menu>, 'open'> {
  id: string;
}

function DropdownMenu({ children, id, ...rest }: PropsWithChildren<DropdownMenuProps>) {
  const { menuRef, menuIsOpen, closeMenu } = useDropdownMenuStore();
  return (
    <Menu
      anchorEl={menuRef.current}
      open={menuIsOpen}
      onClose={closeMenu}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      id={id}
      {...rest}
    >
      {children}
    </Menu>
  );
}

export default DropdownMenu;
