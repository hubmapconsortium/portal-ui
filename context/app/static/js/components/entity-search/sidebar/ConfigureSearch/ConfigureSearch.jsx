import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import DialogModal from 'js/shared-styles/DialogModal';

function ConfigureSearch() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button variant="outlined" color="primary" onClick={() => setDialogIsOpen(true)} fullWidth>
        Configure Search
      </Button>
      <DialogModal
        title="Configure Search"
        secondaryText="Add additional terms as a filter or as a column in the search results table."
        isOpen={dialogIsOpen}
        handleClose={() => setDialogIsOpen(false)}
      />
    </>
  );
}

export default ConfigureSearch;
