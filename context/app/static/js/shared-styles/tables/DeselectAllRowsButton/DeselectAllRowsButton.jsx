import React from 'react';
import Button from '@mui/material/Button';

import { useSelectableTableStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

function DeselectAllRowsButton({ ...rest }) {
  const { selectedRows, deselectHeaderAndRows } = useSelectableTableStore();
  return (
    <Button color="primary" onClick={deselectHeaderAndRows} {...rest}>
      Deselect All ({selectedRows.size})
    </Button>
  );
}

export default DeselectAllRowsButton;
