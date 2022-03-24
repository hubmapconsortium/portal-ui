import React, { useState } from 'react';
import { SecondaryBackgroundTooltip } from 'js/shared-styles/tooltips';
import { WhiteBackgroundIconButton } from 'js/shared-styles/buttons';
import EditSavedStatusDialog from 'js/components/savedLists/EditSavedStatusDialog';
import { EditIcon } from 'js/shared-styles/icons';

function EditSavedStatusButton({ uuid, entity_type, ...rest }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  return (
    <>
      <SecondaryBackgroundTooltip title="Edit Saved Status">
        <WhiteBackgroundIconButton
          onClick={() => {
            setDialogIsOpen(true);
          }}
          {...rest}
        >
          <EditIcon color="primary" />
        </WhiteBackgroundIconButton>
      </SecondaryBackgroundTooltip>
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
