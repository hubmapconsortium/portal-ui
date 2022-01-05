import React, { useState } from 'react';

import SaveToListDialog from 'js/components/savedLists/SaveToListDialog';
import { LeftMarginButton } from 'js/components/savedLists/SavedEntitiesTable/style';
import { StyledListsIcon } from './style';

function AddItemsToListDialog({ itemsToAddUUIDS, onSaveCallback }) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <LeftMarginButton color="primary" onClick={() => setDialogIsOpen(true)} variant="contained">
        <StyledListsIcon /> Add To List
      </LeftMarginButton>
      <SaveToListDialog
        title="Add Items To"
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        entitiesToAdd={itemsToAddUUIDS}
        onSaveCallback={onSaveCallback}
      />
    </>
  );
}

export default AddItemsToListDialog;
