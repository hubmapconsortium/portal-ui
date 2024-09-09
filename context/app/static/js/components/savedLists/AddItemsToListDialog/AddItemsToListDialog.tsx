import React, { useState } from 'react';

import SaveToListDialog from 'js/components/savedLists/SaveToListDialog';
import { LeftMarginButton } from 'js/components/savedLists/SavedEntitiesTable/style';
import { StyledListsIcon } from './style';

const prompt = 'Add To List';

interface AddItemsToListDialogProps extends React.ComponentProps<typeof LeftMarginButton> {
  itemsToAddUUIDS: Set<string>;
  onSaveCallback: () => void;
}

function AddItemsToListDialog({ itemsToAddUUIDS, onSaveCallback, ...rest }: AddItemsToListDialogProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <LeftMarginButton color="primary" onClick={() => setDialogIsOpen(true)} variant="contained" {...rest}>
        <StyledListsIcon /> {prompt}
      </LeftMarginButton>
      <SaveToListDialog
        title={prompt}
        dialogIsOpen={dialogIsOpen}
        setDialogIsOpen={setDialogIsOpen}
        entitiesToAdd={itemsToAddUUIDS}
        onSaveCallback={onSaveCallback}
      />
    </>
  );
}

export default AddItemsToListDialog;
