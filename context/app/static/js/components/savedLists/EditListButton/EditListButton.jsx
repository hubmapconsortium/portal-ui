import React, { useState } from 'react';

import EditListDialog from 'js/components/savedLists/EditListDialog';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { EditIcon } from 'js/shared-styles/icons';

function EditListButton({ listDescription, listTitle, listUuid }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <SecondaryBackgroundTooltip title="Edit List">
        <WhiteBackgroundIconButton onClick={() => setDialogIsOpen(true)}>
          <EditIcon color="primary" />
        </WhiteBackgroundIconButton>
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
