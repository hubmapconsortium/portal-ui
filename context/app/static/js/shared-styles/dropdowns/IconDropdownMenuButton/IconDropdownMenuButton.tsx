import React from 'react';

import { useDropdownMenuStore } from 'js/shared-styles/dropdowns/DropdownMenuProvider';
import { WhiteBackgroundIconTooltipButton } from 'js/shared-styles/buttons';

interface IconDropdownMenuButtonProps {
  children: React.ReactNode;
  menuID: string;
  tooltip: string;
}

function IconDropdownMenuButton({ children, menuID, tooltip, ...rest }: IconDropdownMenuButtonProps) {
  const { menuRef, menuIsOpen, openMenu } = useDropdownMenuStore();

  return (
    <WhiteBackgroundIconTooltipButton
      tooltip={tooltip}
      onClick={openMenu}
      color="primary"
      aria-controls={menuIsOpen ? menuID : undefined}
      aria-haspopup="true"
      ref={menuRef as React.RefObject<HTMLButtonElement>}
      {...rest}
    >
      {children}
    </WhiteBackgroundIconTooltipButton>
  );
}

export default IconDropdownMenuButton;
