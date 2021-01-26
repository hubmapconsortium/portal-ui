import React from 'react';
import Button from '@material-ui/core/Button';
import useStateSet from 'js/hooks/useStateSet';

import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import useSavedListsStore from 'js/stores/useSavedListsStore';

const usedSavedListsSelector = (state) => state.addEntityToList;

function AddToDialog({ dialogIsOpen, setDialogIsOpen, savedEntities, selectedRows }) {
  const [selectedLists, addToSelectedLists] = useStateSet([]);

  const addEntityToList = useSavedListsStore(usedSavedListsSelector);

  function addSavedEntitiesToList() {
    selectedLists.forEach((list) =>
      selectedRows.forEach((selectedRow) => {
        addEntityToList(list, selectedRow, savedEntities[selectedRow].entity_type);
      }),
    );
  }

  return (
    <DialogModal
      title="Add Items To"
      content={<AddToList selectedLists={selectedLists} addToSelectedLists={addToSelectedLists} />}
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

export default AddToDialog;
