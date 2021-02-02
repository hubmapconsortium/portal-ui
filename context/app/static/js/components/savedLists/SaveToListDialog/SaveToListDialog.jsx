import React from 'react';
import Button from '@material-ui/core/Button';

import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const useSavedEntitiesSelector = (state) => state.addEntitiesToList;

function SaveToListDialog({ title, dialogIsOpen, setDialogIsOpen, entitiesToAdd }) {
  const [selectedLists, addToSelectedLists, removeFromSelectedLists] = useStateSet([]);

  const addEntitiesToList = useSavedEntitiesStore(useSavedEntitiesSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((list) => addEntitiesToList(list, entitiesToAdd));
  }

  function handleSubmit() {
    addSavedEntitiesToList();
    setDialogIsOpen(false);
  }

  return (
    <DialogModal
      title={title}
      content={
        <AddToList
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
          <Button onClick={() => handleSubmit()} color="primary">
            Save
          </Button>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  );
}

export default SaveToListDialog;
