import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';

import OptDisabledButton from 'js/shared-styles/buttons/OptDisabledButton';
import useStateSet from 'js/hooks/useStateSet';
import DialogModal from 'js/shared-styles/DialogModal';
import AddToList from 'js/components/savedLists/AddToList';
import CreateListDialog from 'js/components/savedLists/CreateListDialog';
import useSavedEntitiesStore from 'js/stores/useSavedEntitiesStore';

const useSavedEntitiesSelector = (state) => ({
  addEntitiesToList: state.addEntitiesToList,
  savedLists: state.savedLists,
});

function SaveToListDialog({ title, dialogIsOpen, setDialogIsOpen, entitiesToAdd, onSaveCallback }) {
  const [selectedLists, addToSelectedLists, removeFromSelectedLists] = useStateSet([]);

  const { addEntitiesToList, savedLists } = useSavedEntitiesStore(useSavedEntitiesSelector);

  const addSavedEntitiesToList = useCallback(
    function addSavedEntitiesToList() {
      selectedLists.forEach((list) => addEntitiesToList(list, entitiesToAdd));
    },
    [addEntitiesToList, entitiesToAdd, selectedLists],
  );

  const handleSubmit = useCallback(
    function handleSubmit() {
      addSavedEntitiesToList();
      setDialogIsOpen(false);
      onSaveCallback();
    },
    [addSavedEntitiesToList, onSaveCallback, setDialogIsOpen],
  );

  return Object.keys(savedLists).length ? (
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
          <OptDisabledButton onClick={handleSubmit} color="primary" disabled={selectedLists.size === 0}>
            Save
          </OptDisabledButton>
        </>
      }
      isOpen={dialogIsOpen}
      handleClose={() => setDialogIsOpen(false)}
    />
  ) : (
    <CreateListDialog
      secondaryText="No lists created. Create a list before adding items."
      dialogIsOpen={dialogIsOpen}
      setDialogIsOpen={setDialogIsOpen}
    />
  );
}

export default SaveToListDialog;
