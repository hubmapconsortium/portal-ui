import React from 'react';
import Button from '@material-ui/core/Button';

import { useStore } from 'js/shared-styles/tables/SelectableTableProvider/store';

function DeselectAllRowsButton({ ...rest }) {
  const { selectedRows, deselectHeaderAndRows } = useStore();
  return (
    <Button color="primary" onClick={deselectHeaderAndRows} {...rest}>
      Deselect All ({selectedRows.size})
    </Button>
  );
}

export default DeselectAllRowsButton;
