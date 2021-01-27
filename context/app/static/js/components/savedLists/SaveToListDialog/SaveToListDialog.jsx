import React from 'react';
import Button from '@material-ui/core/Button';

import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const useSavedEntitiesSelector = (state) => ({
  savedEntities: state.savedEntities,
  addEntityToList: state.addEntityToList,
});

function SaveToListDialog({ title, dialogIsOpen, setDialogIsOpen, entitiesToAdd }) {
  const [selectedLists, addToSelectedLists, removeFromSelectedLists] = useStateSet([]);

  const { savedEntities, addEntityToList } = useSavedEntitiesStore(useSavedEntitiesSelector);

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
