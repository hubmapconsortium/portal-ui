import React from 'react';
import Button from '@mui/material/Button';

import useStateSet from 'js/hooks/useStateSet';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedLists from 'js/components/savedLists/hooks';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import DialogModal from 'js/shared-styles/dialogs/DialogModal';

export function getSavedListsWhichContainEntity(
  savedLists: Record<string, SavedEntitiesList>,
  entityUUID: string,
): string[] {
  return Object.entries(savedLists).reduce<string[]>((acc, [id, obj]) => {
    return entityUUID in obj.savedEntities ? [...acc, id] : acc;
  }, []);
}

interface EditSavedStatusDialogProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
  uuid: string;
}
function EditSavedStatusDialog({ dialogIsOpen, setDialogIsOpen, uuid }: EditSavedStatusDialogProps) {
  const { savedLists, handleAddEntitiesToList, handleRemoveEntitiesFromList } = useSavedLists();
  const [selectedLists, addToSelectedLists, removeFromSelectedLists, setSelectedLists] = useStateSet(
    getSavedListsWhichContainEntity(savedLists, uuid),
  );

  function updateLists() {
    // Add entities to selected lists
    selectedLists.forEach((listUUID) => {
      handleAddEntitiesToList({ listUUID, entityUUIDs: new Set([uuid]) }).catch((error) => {
        console.error(error);
      });
    });

    // Remove entities from lists that are no longer selected
    const unselectedLists = Object.keys(savedLists).filter((listUUID) => !selectedLists.has(listUUID));
    unselectedLists.forEach((listUUID) => {
      handleRemoveEntitiesFromList({ listUUID, entityUUIDs: new Set([uuid]) }).catch((error) => {
        console.error(error);
      });
    });
  }

  function handleSave() {
    updateLists();
    setDialogIsOpen(false);
  }

  function handleClose() {
    setSelectedLists(new Set(getSavedListsWhichContainEntity(savedLists, uuid)));
    setDialogIsOpen(false);
  }

  const dialogContent = (
    <AddToList
      selectedLists={selectedLists}
      allLists={savedLists}
      addToSelectedLists={addToSelectedLists}
      removeFromSelectedLists={removeFromSelectedLists}
    />
  );

  const dialogActions = (
    <>
      <Button
        onClick={() => {
          handleClose();
        }}
        color="primary"
      >
        Cancel
      </Button>
      <Button
        onClick={() => {
          handleSave();
        }}
        color="primary"
      >
        Save
      </Button>
    </>
  );

  return (
    <DialogModal
      title="Edit Saved Status"
      content={dialogContent}
      actions={dialogActions}
      isOpen={dialogIsOpen}
      handleClose={() => {
        handleClose();
      }}
    />
  );
}

export default EditSavedStatusDialog;
