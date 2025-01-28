import React from 'react';
import Button from '@mui/material/Button';

import {
  SavedListsAlertsState,
  SavedListsSuccessAlertType,
  useSavedListsAlertsStore,
} from 'js/stores/useSavedListsAlertsStore';
import useStateSet from 'js/hooks/useStateSet';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedLists from 'js/components/savedLists/hooks';
import { SavedEntitiesList } from 'js/components/savedLists/types';
import DialogModal from 'js/shared-styles/DialogModal';

function getSavedListsWhichContainEntity(savedLists: Record<string, SavedEntitiesList>, entityUUID: string): string[] {
  return Object.entries(savedLists).reduce<string[]>((acc, [title, obj]) => {
    return entityUUID in obj.savedEntities ? [...acc, title] : acc;
  }, []);
}

const savedListsAlertsSelector = (state: SavedListsAlertsState) => state.setSuccessAlert;

interface EditSavedStatusDialogProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
  uuid: string;
}
function EditSavedStatusDialog({ dialogIsOpen, setDialogIsOpen, uuid }: EditSavedStatusDialogProps) {
  const { savedListsAndEntities, handleAddEntitiesToList, handleRemoveEntitiesFromList } = useSavedLists();

  const [selectedLists, addToSelectedLists, removeFromSelectedLists, setSelectedLists] = useStateSet(
    getSavedListsWhichContainEntity(savedListsAndEntities, uuid),
  );

  const setSuccessAlert = useSavedListsAlertsStore(savedListsAlertsSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((listUUID) => {
      handleAddEntitiesToList({ listUUID, entityUUIDs: new Set([uuid]) }).catch((error) => {
        console.error(error);
      });
    });

    const unselectedLists = Object.keys(savedListsAndEntities).filter((listUUID) => !selectedLists.has(listUUID));
    unselectedLists.forEach((listUUID) => {
      handleRemoveEntitiesFromList({ listUUID, entityUUIDs: new Set([uuid]) }).catch((error) => {
        console.error(error);
      });
    });
  }

  function handleSave() {
    addSavedEntitiesToList();
    setSuccessAlert(SavedListsSuccessAlertType.UpdatedLists);
    setDialogIsOpen(false);
  }

  function handleClose() {
    setSelectedLists(new Set(getSavedListsWhichContainEntity(savedListsAndEntities, uuid)));
    setDialogIsOpen(false);
  }

  return (
    <DialogModal
      title="Edit Saved Status"
      content={
        <AddToList
          selectedLists={selectedLists}
          allLists={savedListsAndEntities}
          addToSelectedLists={addToSelectedLists}
          removeFromSelectedLists={removeFromSelectedLists}
        />
      }
      actions={
        <>
          <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSave()} color="primary">
            Save
          </Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => handleClose()}
    />
  );
}

export default EditSavedStatusDialog;
