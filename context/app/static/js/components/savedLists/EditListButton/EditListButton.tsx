import React, { useState } from 'react';

import EditListDialog from 'js/components/savedLists/EditListDialog';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { EditIcon } from 'js/shared-styles/icons';
import { StyledEditButton } from './style';

interface EditListButtonProps {
  listDescription: string;
  listTitle: string;
  listUUID: string;
}

function EditListButton({ listDescription, listTitle, listUUID }: EditListButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <SecondaryBackgroundTooltip title="Edit List">
        <StyledEditButton onClick={() => setDialogIsOpen(true)}>
          <EditIcon color="primary" />
        </StyledEditButton>
      </SecondaryBackgroundTooltip>
      <EditListDialog
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        listTitle={listTitle}
        listDescription={listDescription}
        listUUID={listUUID}
      />
    </>
  );
}

export default EditListButton;
