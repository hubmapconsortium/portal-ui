import React from 'react';
import Button from '@mui/material/Button';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import useSavedLists from 'js/components/savedLists/hooks';

interface SaveToListDialogProps {
  title: string;
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
  entitiesToAdd: Set<string>;
  onSaveCallback: () => void;
}

function SaveToListDialog({
  title,
  dialogIsOpen,
  setDialogIsOpen,
  entitiesToAdd,
  onSaveCallback,
}: SaveToListDialogProps) {
  const [selectedLists, addToSelectedLists, removeFromSelectedLists] = useStateSet<string>([]);

  const { savedLists, handleAddEntitiesToList } = useSavedLists();

  async function addSavedEntitiesToList() {
    await Promise.all(
      Array.from(selectedLists).map((list) => handleAddEntitiesToList({ listUUID: list, entityUUIDs: entitiesToAdd })),
    );
  }

  async function handleSubmit() {
    await addSavedEntitiesToList();
    setDialogIsOpen(false);
    onSaveCallback();
  }

  return Object.keys(savedLists).length ? (
    <DialogModal
      title={title}
      content={
        <AddToList
          allLists={savedLists}
          selectedLists={selectedLists}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      }
      actions={
        <>
          <Button onClick={() => setDialogIsOpen(false)} color="primary">
            Cancel
          </Button>
          <OptDisabledButton onClick={handleSubmit} color="primary" disabled={selectedLists.size === 0}>
            Save
          </OptDisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  ) : (
    <CreateListDialog
      secondaryText="No lists created. Create a list before adding items."
      dialogIsOpen={dialogIsOpen}
      setDialogIsOpen={setDialogIsOpen}
    />
  );
}

export default SaveToListDialog;
