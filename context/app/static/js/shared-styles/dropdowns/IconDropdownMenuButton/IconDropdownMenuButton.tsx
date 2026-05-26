import React from 'react';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { TooltipIconButton } from 'js/shared-styles/buttons/TooltipButton';

interface IconDropdownMenuButtonProps {
  children: React.ReactNode;
  menuID: string;
  tooltip: string;
}

function IconDropdownMenuButton({ children, menuID, tooltip, ...rest }: IconDropdownMenuButtonProps) {
  const { setAnchorEl, menuIsOpen, openMenu } = useDropdownMenuStore();

  return (
    <TooltipIconButton
      tooltip={tooltip}
      onClick={openMenu}
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={setAnchorEl}
      {...rest}
    >
      {children}
    </TooltipIconButton>
  );
}

export default IconDropdownMenuButton;
