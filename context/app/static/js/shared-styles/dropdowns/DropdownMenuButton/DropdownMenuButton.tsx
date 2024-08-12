import React from 'react';
import Button, { ButtonOwnProps } from '@mui/material/Button';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { StyledUpIcon, StyledDownIcon } from './style';

interface DropdownMenuButtonProps {
  children: React.ReactNode;
  menuID: string;
  variant?: ButtonOwnProps['variant'];
}

function DropdownMenuButton({ children, menuID, variant = 'outlined', ...rest }: DropdownMenuButtonProps) {
  const { menuRef, menuIsOpen, openMenu } = useDropdownMenuStore();

  return (
    <Button
      onClick={openMenu}
      variant={variant}
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={menuRef as React.RefObject<HTMLButtonElement>}
      {...rest}
    >
      {children}
      {menuIsOpen ? <StyledUpIcon /> : <StyledDownIcon />}
    </Button>
  );
}

export default DropdownMenuButton;
