import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { editedAlertStatus } from 'js/stores/useEntityStore';
import { LightBlueLink } from 'js/shared-styles/Links';

const useSavedEntitiesSelector = (state) => ({
  addEntityToList: state.addEntityToList,
  savedLists: state.savedLists,
  removeEntityFromList: state.removeEntityFromList,
});

function getSavedListsWhichContainEntity(savedLists, savedEntity) {
  return Object.entries(savedLists).reduce((acc, [title, obj]) => {
    return savedEntity in obj.savedEntities ? [...acc, title] : acc;
  }, []);
}

const entityStoreSelector = (state) => state.setShouldDisplaySavedOrEditedAlert;

function EditSavedStatusDialog({ dialogIsOpen, setDialogIsOpen, uuid, entity_type }) {
  const { addEntityToList, savedLists, removeEntityFromList } = useSavedEntitiesStore(useSavedEntitiesSelector);
  const [selectedLists, addToSelectedLists, removeFromSelectedLists, setSelectedLists] = useStateSet(
    getSavedListsWhichContainEntity(savedLists, uuid),
  );

  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((listUUID) => addEntityToList(listUUID, uuid));
    const unselectedLists = Object.keys(savedLists).filter((listUUID) => !selectedLists.has(listUUID));
    unselectedLists.forEach((listUUID) => removeEntityFromList(listUUID, uuid));
  }

  function handleSave() {
    addSavedEntitiesToList();
    setShouldDisplaySavedOrEditedAlert(editedAlertStatus);
    setDialogIsOpen(false);
  }

  function handleClose() {
    setSelectedLists(new Set(getSavedListsWhichContainEntity(savedLists, uuid)));
    setDialogIsOpen(false);
  }

  const savedListsExist = Object.keys(savedLists).length > 0;

  return (
    <DialogModal
      title="Edit Saved Status"
      content={
        savedListsExist ? (
          <AddToList
            selectedLists={selectedLists}
            addToSelectedLists={addToSelectedLists}
            removeFromSelectedLists={removeFromSelectedLists}
          />
        ) : (
          <Typography>
            {`You don't have any lists. To assign this ${entity_type.toLowerCase()} to one or more lists, create a list in `}
            <LightBlueLink href="/my-lists">My Lists</LightBlueLink>.
          </Typography>
        )
      }
      actions={
        <>
          <Button onClick={() => handleClose()} color="primary">
            Cancel
          </Button>
          <OptDisabledButton onClick={() => handleSave()} color="primary" disabled={!savedListsExist}>
            Save
          </OptDisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => handleClose()}
    />
  );
}

export default EditSavedStatusDialog;
