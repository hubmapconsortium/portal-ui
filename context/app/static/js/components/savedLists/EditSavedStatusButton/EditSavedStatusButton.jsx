import React, { useState } from 'react';
import Button from '@mui/material/Button';

import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';

function EditSavedStatusButton({ uuid, entity_type, ...rest }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <Button
        color="primary"
        variant="contained"
        onClick={() => {
          setDialogIsOpen(true);
        }}
        {...rest}
      >
        Edit Saved Status
      </Button>
      <EditSavedStatusDialog
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        uuid={uuid}
        entity_type={entity_type}
      />
    </>
  );
}

export default EditSavedStatusButton;
