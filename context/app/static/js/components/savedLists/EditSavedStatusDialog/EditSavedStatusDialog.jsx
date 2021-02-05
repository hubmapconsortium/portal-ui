import React from 'react';
import Button from '@material-ui/core/Button';

import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { editedAlertStatus } from 'js/stores/useEntityStore';

const useSavedEntitiesSelector = (state) => ({
  addEntityToList: state.addEntityToList,
  savedLists: state.savedLists,
  removeEntityFromList: state.removeEntityFromList,
});

function getSavedListsWhichContainEntity(savedLists, savedEntity) {
  return Object.entries(savedLists).reduce((acc, [title, obj]) => {
    return savedEntity in obj ? [...acc, title] : acc;
  }, []);
}

const entityStoreSelector = (state) => state.setShouldDisplaySavedOrEditedAlert;

function EditSavedStatusDialog({ dialogIsOpen, setDialogIsOpen, uuid }) {
  const { addEntityToList, savedLists, removeEntityFromList } = useSavedEntitiesStore(useSavedEntitiesSelector);
  const [selectedLists, addToSelectedLists, removeFromSelectedLists, setSelectedLists] = useStateSet(
    getSavedListsWhichContainEntity(savedLists, uuid),
  );

  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((list) => addEntityToList(list, uuid));
    const unselectedLists = Object.keys(savedLists).filter((list) => !selectedLists.has(list));
    unselectedLists.forEach((list) => removeEntityFromList(list, uuid));
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

  return (
    <DialogModal
      title="Edit Saved Status"
      content={
        <AddToList
          selectedLists={selectedLists}
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
