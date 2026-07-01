import React, { ComponentProps } from 'react';
import IconButton from '@mui/material/IconButton';

import ExpandCollapseIcon from 'js/shared-styles/icons/ExpandCollapseIcon';

interface ExpandCollapseIconButtonProps extends ComponentProps<typeof IconButton> {
  isExpanded: boolean;
}

function ExpandCollapseIconButton({ isExpanded, onClick, disabled = false, ...rest }: ExpandCollapseIconButtonProps) {
  return (
    <IconButton onClick={onClick} disabled={disabled} {...rest} size="large">
      <ExpandCollapseIcon isExpanded={isExpanded} />
    </IconButton>
  );
}

export default ExpandCollapseIconButton;
