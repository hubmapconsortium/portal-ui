import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import { StyledCheckboxCell } from 'js/components/workspaces/Tables/WorkspaceItemsTable/style';

function ItemCheckbox({
  showCheckbox,
  checked,
  onChange,
}: {
  showCheckbox: boolean;
  checked?: boolean;
  onChange: () => void;
}) {
  if (!showCheckbox) {
    return null;
  }

  return (
    <StyledCheckboxCell>
      <Checkbox checked={checked} onChange={onChange} />
    </StyledCheckboxCell>
  );
}

export default ItemCheckbox;
