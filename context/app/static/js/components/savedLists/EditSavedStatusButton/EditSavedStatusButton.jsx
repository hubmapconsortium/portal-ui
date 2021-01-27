import React, { useState } from 'react';
import Button from '@material-ui/core/Button';

import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';

function EditSavedStatusButton({ uuid }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          setDialogIsOpen(true);
        }}
      >
        Edit Saved Status
      </Button>
      <EditSavedStatusDialog dialogIsOpen={dialogIsOpen} setDialogIsOpen={setDialogIsOpen} uuid={uuid} />
    </>
  );
}

export default EditSavedStatusButton;
