import React from 'react';
import Button from '@mui/material/Button';

import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useEntityStore, { EntityStore, editedAlertStatus } from 'js/stores/useEntityStore';
import { useSavedLists, useSavedListsAndEntities } from 'js/components/savedLists/hooks';
import { SavedEntitiesList } from 'js/components/savedLists/types';

function getSavedListsWhichContainEntity(savedLists: Record<string, SavedEntitiesList>, entityUUID: string): string[] {
  return Object.entries(savedLists).reduce<string[]>((acc, [title, obj]) => {
    return entityUUID in obj.savedEntities ? [...acc, title] : acc;
  }, []);
}

const entityStoreSelector = (state: EntityStore) => state.setShouldDisplaySavedOrEditedAlert;

interface EditSavedStatusDialogProps {
  dialogIsOpen: boolean;
  setDialogIsOpen: (isOpen: boolean) => void;
  uuid: string;
}
function EditSavedStatusDialog({ dialogIsOpen, setDialogIsOpen, uuid }: EditSavedStatusDialogProps) {
  const { addEntityToList, deleteEntity, saveEntity, removeEntityFromList } = useSavedLists();
  const { savedListsAndEntities } = useSavedListsAndEntities();

  const [selectedLists, addToSelectedLists, removeFromSelectedLists, setSelectedLists] = useStateSet(
    getSavedListsWhichContainEntity(savedListsAndEntities, uuid),
  );

  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((listUUID) => {
      if (listUUID === 'savedEntities') {
        saveEntity(uuid);
      } else {
        addEntityToList(listUUID, uuid);
      }
    });

    const unselectedLists = Object.keys(savedListsAndEntities).filter((listUUID) => !selectedLists.has(listUUID));
    unselectedLists.forEach((listUUID) => {
      if (listUUID === 'savedEntities') {
        deleteEntity(uuid);
      } else {
        removeEntityFromList(listUUID, uuid);
      }
    });
  }

  function handleSave() {
    addSavedEntitiesToList();
    setShouldDisplaySavedOrEditedAlert(editedAlertStatus);
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
