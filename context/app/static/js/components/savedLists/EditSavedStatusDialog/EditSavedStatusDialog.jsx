import React from 'react';
import Button from '@material-ui/core/Button';

import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';
import useEntityStore, { editedAlertStatus } from 'js/stores/useEntityStore';

const useSavedEntitiesSelector = (state) => state.addEntityToList;
const entityStoreSelector = (state) => state.setShouldDisplaySavedOrEditedAlert;

function EditSavedStatusDialog({ dialogIsOpen, setDialogIsOpen, uuid }) {
  const [selectedLists, addToSelectedLists] = useStateSet([]);

  const addEntityToList = useSavedEntitiesStore(useSavedEntitiesSelector);
  const setShouldDisplaySavedOrEditedAlert = useEntityStore(entityStoreSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((list) => addEntityToList(list, uuid));
  }

  function handleSave() {
    addSavedEntitiesToList();
    setShouldDisplaySavedOrEditedAlert(editedAlertStatus);
    setDialogIsOpen(false);
  }

  return (
    <DialogModal
      title="Edit Saved Status"
      content={<AddToList selectedLists={selectedLists} addToSelectedLists={addToSelectedLists} />}
      actions={
        <>
          <Button onClick={() => setDialogIsOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSave()} color="primary">
            Save
          </Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  );
}

export default EditSavedStatusDialog;
