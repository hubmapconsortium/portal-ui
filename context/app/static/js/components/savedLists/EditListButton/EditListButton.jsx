import React, { useState } from 'react';

import EditListDialog from 'js/components/savedLists/EditListDialog';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { EditIcon } from 'js/shared-styles/icons';
import { StyledEditButton } from './style';

function EditListButton({ listDescription, listTitle, listUuid }) {
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
        listUuid={listUuid}
      />
    </>
  );
}

export default EditListButton;
