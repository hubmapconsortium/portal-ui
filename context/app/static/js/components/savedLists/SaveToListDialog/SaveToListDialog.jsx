import React from 'react';
import Button from '@material-ui/core/Button';

import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedListsStore from 'js/stores/useSavedListsStore';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const usedSavedListsSelector = (state) => state.addEntityToList;
const useSavedEntitiesSelector = (state) => state.savedEntities;

function SaveToListDialog({ title, dialogIsOpen, setDialogIsOpen, entitiesToAdd }) {
  const [selectedLists, addToSelectedLists, removeFromSelectedLists] = useStateSet([]);

  const addEntityToList = useSavedListsStore(usedSavedListsSelector);
  const savedEntities = useSavedEntitiesStore(useSavedEntitiesSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((list) =>
      entitiesToAdd.forEach((selectedRow) => {
        addEntityToList(list, selectedRow, savedEntities[selectedRow].entity_type);
      }),
    );
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
          <Button onClick={() => addSavedEntitiesToList()} color="primary">
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
